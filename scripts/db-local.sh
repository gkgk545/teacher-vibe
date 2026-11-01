#!/bin/sh
# 로컬 개발용 D1(miniflare sqlite)에 schema.sql을 적용한다. npm run dev:site 를 한 번 띄워 파일이 생긴 뒤 실행한다.
# (한글 경로에서는 wrangler d1 execute --local 이 dev 서버와 다른 파일을 만들어서 sqlite3로 직접 넣는다.)
set -e
ROOT=$(cd "$(dirname "$0")/.." && pwd)
for db in "$ROOT"/.wrangler/state/v3/d1/miniflare-D1DatabaseObject/*.sqlite; do
  case "$db" in *metadata.sqlite) continue ;; esac
  sqlite3 "$db" < "$ROOT/schema.sql" && echo "적용: $(basename "$db")"
done
