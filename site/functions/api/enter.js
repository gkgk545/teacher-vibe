import { BOARDS, canEnter, isAdmin, json, fail } from '../../lib/board.js';

// 입장 코드 확인. 본문: { board }, 머리글: x-entry-code 또는 x-admin-code
export async function onRequestPost({ request, env }) {
  const { board } = await request.json().catch(() => ({}));
  if (!BOARDS[board]) return fail('없는 게시판입니다.', 404);
  if (!canEnter(request, env, board)) return fail('입장 코드가 맞지 않습니다.', 403);
  return json({ ok: true, board, label: BOARDS[board].label, admin: isAdmin(request, env) });
}
