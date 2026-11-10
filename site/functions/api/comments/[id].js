import { isAdmin, json, fail, bumpVersion, checkPassword } from '../../../lib/board.js';

// 댓글 지우기. 본문: { password }(댓글을 달 때 넣은 비밀번호). 관리 코드가 있으면 비밀번호 없이 지운다.
export async function onRequestDelete({ request, env, params }) {
  const comment = await env.DB.prepare('SELECT board, pw_hash FROM comments WHERE id = ?').bind(params.id).first();
  if (!comment) return fail('이미 지워진 댓글입니다.', 404);
  if (!isAdmin(request, env)) {
    const input = await request.json().catch(() => ({}));
    if (!(await checkPassword(input.password, comment.pw_hash))) return fail('비밀번호가 맞지 않습니다.', 403);
  }
  await env.DB.batch([
    env.DB.prepare('DELETE FROM comments WHERE id = ?').bind(params.id),
    bumpVersion(env, comment.board),
  ]);
  return json({ ok: true });
}
