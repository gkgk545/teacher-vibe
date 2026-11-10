-- 댓글 비밀번호 칸을 더한다. 한 번만 실행한다(이미 있으면 duplicate column 오류가 난다).
--   원격: sh scripts/wr.sh site d1 execute vibe-board --remote --file migrations/2026-11-10_comment_password.sql
ALTER TABLE comments ADD COLUMN pw_hash TEXT;
