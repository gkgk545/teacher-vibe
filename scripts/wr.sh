#!/bin/sh
# 이 저장소 경로에 한글 폴더 이름이 있으면 wrangler가 wrangler.toml을 찾지 못한다(2026-11 확인, wrangler 4.156).
# 그래서 site/ 또는 apps/를 영문 임시 경로로 복사한 뒤 그곳에서 wrangler를 실행한다.
#   사용: sh scripts/wr.sh site pages deploy
#         sh scripts/wr.sh site d1 execute vibe-board --remote --file schema.sql
set -e
ROOT=$(cd "$(dirname "$0")/.." && pwd)
PROJECT=$1
shift
WORK="${TMPDIR:-/tmp}/vibe-yeonsu-$PROJECT"
mkdir -p "$WORK"
rsync -a --delete --exclude .wrangler --exclude .dev.vars "$ROOT/$PROJECT/" "$WORK/"
cp "$ROOT/schema.sql" "$WORK/schema.sql"
cd "$WORK"
exec "$ROOT/node_modules/.bin/wrangler" "$@"
