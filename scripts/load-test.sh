#!/bin/sh
# 40명 동시 게시 시험. 글 40개(절반은 300KB HTML 파일, 절반은 링크)를 한꺼번에 올리고,
# 각 글에 댓글을 한꺼번에 단 뒤, 40명이 동시에 목록을 불러온다. 끝나면 관리 코드로 게시판을 비운다.
#   사용: sh scripts/load-test.sh <게시판 middle|high> <관리 코드> [사이트 주소]
set -e
BOARD=$1; ADMIN=$2; SITE=${3:-https://teacher-vibe.pages.dev}
N=40
TMP=$(mktemp -d)
python3 -c "print('<!doctype html><title>load</title>' + 'a'*300000)" > "$TMP/app.html"

post() {
  if [ $(($1 % 2)) -eq 0 ]; then extra="file=@$TMP/app.html"; else extra="link=https://example.com"; fi
  curl -s -o /dev/null -w "%{http_code} %{time_total}\n" -X POST "$SITE/api/posts" \
    -F board="$BOARD" -F name="시험$1" -F app_name="동시 시험 $1" -F subject=시험 -F intro=동시게시 -F "$extra"
}
summary() { printf '%s: ' "$1"; awk '{c[$1]++; if ($2>m) m=$2} END {for (k in c) printf "%s x%d  ", k, c[k]; printf "max %.2fs\n", m}' "$2"; }

i=1; while [ $i -le $N ]; do post $i >> "$TMP/posts.txt" & i=$((i+1)); done; wait
summary '글 올리기' "$TMP/posts.txt"

IDS=$(curl -s "$SITE/api/posts?board=$BOARD" | python3 -c 'import json,sys; print(" ".join(p["id"] for p in json.load(sys.stdin)["posts"]))')
for id in $IDS; do
  curl -s -o /dev/null -w "%{http_code} %{time_total}\n" -X POST "$SITE/api/comments" \
    -d "{\"post_id\":\"$id\",\"name\":\"시험\",\"body\":\"동시 댓글\"}" >> "$TMP/comments.txt" &
done; wait
summary '댓글 달기' "$TMP/comments.txt"

i=1; while [ $i -le $N ]; do curl -s -o /dev/null -w "%{http_code} %{time_total}\n" "$SITE/api/posts?board=$BOARD" >> "$TMP/list.txt" & i=$((i+1)); done; wait
summary '목록 불러오기' "$TMP/list.txt"

curl -s "$SITE/api/posts?board=$BOARD" | python3 -c 'import json,sys; d=json.load(sys.stdin); ps=d["posts"]; print("저장된 글", len(ps), "/ 댓글", sum(len(p["comments"]) for p in ps), "/ 파일", sum(1 for p in ps if p["file_url"]))'
curl -s -X DELETE "$SITE/api/posts?board=$BOARD&confirm=$BOARD" -H "x-admin-code: $ADMIN" > /dev/null && echo "게시판을 비웠습니다"
rm -rf "$TMP"
