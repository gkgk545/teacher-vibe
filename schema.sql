-- 공유 게시판 D1 스키마. 본 사이트(site)와 파일 주소(apps)가 같은 데이터베이스를 쓴다.

CREATE TABLE IF NOT EXISTS board_meta (
  board   TEXT PRIMARY KEY,          -- middle | high
  version INTEGER NOT NULL DEFAULT 0 -- 글·댓글이 바뀔 때마다 1씩 올라간다(새로고침 판단용)
);
INSERT OR IGNORE INTO board_meta (board, version) VALUES ('middle', 0), ('high', 0);

CREATE TABLE IF NOT EXISTS posts (
  id         TEXT PRIMARY KEY,
  board      TEXT NOT NULL,
  name       TEXT NOT NULL,
  app_name   TEXT NOT NULL,
  subject    TEXT NOT NULL,
  intro      TEXT NOT NULL,
  link       TEXT,                   -- 배포 주소(https://...)
  file_id    TEXT,                   -- files.id, HTML 파일을 올렸을 때
  file_name  TEXT,
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS posts_board_created ON posts (board, created_at);

CREATE TABLE IF NOT EXISTS comments (
  id         TEXT PRIMARY KEY,
  post_id    TEXT NOT NULL,
  board      TEXT NOT NULL,
  name       TEXT NOT NULL,
  body       TEXT NOT NULL,
  pw_hash    TEXT,                   -- 댓글을 지울 때 쓰는 비밀번호(소금:SHA-256). 2026-11-10 전 댓글은 비어 있다
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS comments_board_created ON comments (board, created_at);
CREATE INDEX IF NOT EXISTS comments_post ON comments (post_id);

CREATE TABLE IF NOT EXISTS files (
  id         TEXT PRIMARY KEY,
  post_id    TEXT NOT NULL,
  size       INTEGER NOT NULL,
  content    TEXT NOT NULL,          -- HTML 원문(1MB 이하)
  created_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS files_post ON files (post_id);
