import { canEnter, json, fail, newId, clean, bumpVersion } from '../../../lib/board.js';

// 댓글 달기. 본문: { post_id, name, body }
export async function onRequestPost({ request, env }) {
  const input = await request.json().catch(() => null);
  if (!input) return fail('보낸 내용을 읽지 못했습니다.');
  const post = await env.DB.prepare('SELECT board FROM posts WHERE id = ?').bind(String(input.post_id || '')).first();
  if (!post) return fail('지워진 글입니다.', 404);
  if (!canEnter(request, env, post.board)) return fail('입장 코드가 맞지 않습니다.', 403);

  const name = clean(input.name, 'name', '이름');
  if (name.error) return fail(name.error);
  const body = clean(input.body, 'body', '댓글');
  if (body.error) return fail(body.error);

  const id = newId();
  await env.DB.batch([
    env.DB.prepare('INSERT INTO comments (id, post_id, board, name, body, created_at) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(id, input.post_id, post.board, name.value, body.value, Date.now()),
    bumpVersion(env, post.board),
  ]);
  return json({ ok: true, id }, 201);
}
