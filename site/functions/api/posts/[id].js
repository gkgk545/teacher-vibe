import { isAdmin, json, fail, bumpVersion } from '../../../lib/board.js';

// 글 지우기(관리 코드 필요). 딸린 댓글과 파일도 함께 지운다.
export async function onRequestDelete({ request, env, params }) {
  if (!isAdmin(request, env)) return fail('관리 코드가 맞지 않습니다.', 403);
  const post = await env.DB.prepare('SELECT board FROM posts WHERE id = ?').bind(params.id).first();
  if (!post) return fail('이미 지워진 글입니다.', 404);
  await env.DB.batch([
    env.DB.prepare('DELETE FROM files WHERE post_id = ?').bind(params.id),
    env.DB.prepare('DELETE FROM comments WHERE post_id = ?').bind(params.id),
    env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(params.id),
    bumpVersion(env, post.board),
  ]);
  return json({ ok: true });
}
