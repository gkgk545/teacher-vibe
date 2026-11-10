import {
  isAdmin, isReadOnly, json, fail, newId, clean, bumpVersion, hashPassword, MIN_PASSWORD,
} from '../../../lib/board.js';

// 댓글 달기. 본문: { post_id, name, body, password }. 비밀번호는 그 댓글을 지울 때 쓴다.
export async function onRequestPost({ request, env }) {
  if (isReadOnly(env) && !isAdmin(request, env)) return fail('게시판 댓글을 마쳤습니다.', 403);
  const input = await request.json().catch(() => null);
  if (!input) return fail('보낸 내용을 읽지 못했습니다.');
  const post = await env.DB.prepare('SELECT board FROM posts WHERE id = ?').bind(String(input.post_id || '')).first();
  if (!post) return fail('지워진 글입니다.', 404);

  const name = clean(input.name, 'name', '이름');
  if (name.error) return fail(name.error);
  const body = clean(input.body, 'body', '댓글');
  if (body.error) return fail(body.error);
  if (!String(input.password ?? '').trim()) return fail('비밀번호를 적어 주세요.');
  const password = clean(input.password, 'password', '비밀번호');
  if (password.error) return fail(password.error);
  if (password.value.length < MIN_PASSWORD) return fail(`비밀번호는 ${MIN_PASSWORD}자 이상 적어 주세요.`);

  const id = newId();
  await env.DB.batch([
    env.DB.prepare('INSERT INTO comments (id, post_id, board, name, body, pw_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .bind(id, input.post_id, post.board, name.value, body.value, await hashPassword(password.value), Date.now()),
    bumpVersion(env, post.board),
  ]);
  return json({ ok: true, id }, 201);
}
