import { isAdmin, json, fail, bumpVersion } from '../../../lib/board.js';

// 댓글 지우기(관리 코드 필요)
export async function onRequestDelete({ request, env, params }) {
  if (!isAdmin(request, env)) return fail('관리 코드가 맞지 않습니다.', 403);
  const comment = await env.DB.prepare('SELECT board FROM comments WHERE id = ?').bind(params.id).first();
  if (!comment) return fail('이미 지워진 댓글입니다.', 404);
  await env.DB.batch([
    env.DB.prepare('DELETE FROM comments WHERE id = ?').bind(params.id),
    bumpVersion(env, comment.board),
  ]);
  return json({ ok: true });
}
