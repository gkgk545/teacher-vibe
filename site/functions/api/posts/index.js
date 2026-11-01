import {
  BOARDS, MAX_FILE_BYTES, canEnter, isAdmin, json, fail, newId, clean, bumpVersion, fileUrl,
} from '../../../lib/board.js';

// 글 목록. ?board=middle&v=3 처럼 지난 버전을 보내면, 바뀐 것이 없을 때 목록 없이 버전만 돌려준다.
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const board = url.searchParams.get('board');
  if (!BOARDS[board]) return fail('없는 게시판입니다.', 404);
  if (!canEnter(request, env, board)) return fail('입장 코드가 맞지 않습니다.', 403);

  const meta = await env.DB.prepare('SELECT version FROM board_meta WHERE board = ?').bind(board).first();
  const version = meta ? meta.version : 0;
  if (url.searchParams.get('v') === String(version)) return json({ version, unchanged: true });

  const [posts, comments] = await env.DB.batch([
    env.DB.prepare(
      'SELECT id, name, app_name, subject, intro, link, file_id, file_name, created_at FROM posts WHERE board = ? ORDER BY created_at DESC',
    ).bind(board),
    env.DB.prepare(
      'SELECT id, post_id, name, body, created_at FROM comments WHERE board = ? ORDER BY created_at ASC',
    ).bind(board),
  ]);

  const byPost = {};
  for (const c of comments.results) (byPost[c.post_id] ||= []).push(c);
  const list = posts.results.map((p) => ({
    ...p,
    file_url: p.file_id ? fileUrl(env, p.file_id) : null,
    comments: byPost[p.id] || [],
  }));
  return json({ version, posts: list });
}

// 글 올리기(multipart/form-data): board, name, app_name, subject, intro, link 또는 file(.html, 1MB 이하)
export async function onRequestPost({ request, env }) {
  const length = Number(request.headers.get('content-length') || 0);
  if (length > MAX_FILE_BYTES + 64 * 1024) return fail('파일은 1MB까지 올릴 수 있습니다.', 413);

  const form = await request.formData().catch(() => null);
  if (!form) return fail('보낸 내용을 읽지 못했습니다.');
  const board = form.get('board');
  if (!BOARDS[board]) return fail('없는 게시판입니다.', 404);
  if (!canEnter(request, env, board)) return fail('입장 코드가 맞지 않습니다.', 403);

  const fields = {};
  for (const [field, label, required] of [
    ['name', '이름', true],
    ['app_name', '앱 이름', true],
    ['subject', '교과·학년', true],
    ['intro', '한 줄 소개', true],
    ['link', '링크', false],
  ]) {
    const checked = clean(form.get(field), field, label, { required });
    if (checked.error) return fail(checked.error);
    fields[field] = checked.value;
  }

  if (fields.link) {
    let parsed;
    try { parsed = new URL(fields.link); } catch { parsed = null; }
    if (!parsed || !['https:', 'http:'].includes(parsed.protocol)) {
      return fail('링크는 https:// 로 시작하는 주소를 적어 주세요.');
    }
    fields.link = parsed.href;
  }

  const file = form.get('file');
  const hasFile = file && typeof file === 'object' && file.size > 0;
  if (!fields.link && !hasFile) return fail('링크를 적거나 HTML 파일을 올려 주세요.');

  let content = null;
  let fileName = null;
  if (hasFile) {
    fileName = String(file.name || '').slice(0, 100);
    if (!/\.html$/i.test(fileName)) return fail('.html 파일만 올릴 수 있습니다.');
    if (file.size > MAX_FILE_BYTES) return fail('파일은 1MB까지 올릴 수 있습니다.', 413);
    content = await file.text();
    if (content.includes('\u0000')) return fail('HTML 문서가 아닌 파일입니다.');
  }

  const id = newId();
  const fileId = hasFile ? newId(16) : null;
  const now = Date.now();
  const statements = [
    env.DB.prepare(
      'INSERT INTO posts (id, board, name, app_name, subject, intro, link, file_id, file_name, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    ).bind(id, board, fields.name, fields.app_name, fields.subject, fields.intro, fields.link || null, fileId, fileName, now),
  ];
  if (hasFile) {
    statements.push(
      env.DB.prepare('INSERT INTO files (id, post_id, size, content, created_at) VALUES (?, ?, ?, ?, ?)')
        .bind(fileId, id, file.size, content, now),
    );
  }
  statements.push(bumpVersion(env, board));
  await env.DB.batch(statements);

  return json({ ok: true, id, file_url: fileId ? fileUrl(env, fileId) : null }, 201);
}

// 보드 비우기(관리 코드 필요). 연수 전 시험 글을 한꺼번에 지울 때 쓴다. ?board=middle&confirm=middle
export async function onRequestDelete({ request, env }) {
  if (!isAdmin(request, env)) return fail('관리 코드가 맞지 않습니다.', 403);
  const url = new URL(request.url);
  const board = url.searchParams.get('board');
  if (!BOARDS[board] || url.searchParams.get('confirm') !== board) return fail('지울 게시판을 확인해 주세요.');
  await env.DB.batch([
    env.DB.prepare('DELETE FROM files WHERE post_id IN (SELECT id FROM posts WHERE board = ?)').bind(board),
    env.DB.prepare('DELETE FROM comments WHERE board = ?').bind(board),
    env.DB.prepare('DELETE FROM posts WHERE board = ?').bind(board),
    bumpVersion(env, board),
  ]);
  return json({ ok: true });
}
