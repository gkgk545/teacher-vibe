import { BOARDS, isAdmin, json, fail } from '../../lib/board.js';

// 관리 코드 확인. 본문: { board }, 머리글: x-admin-code
export async function onRequestPost({ request, env }) {
  const { board } = await request.json().catch(() => ({}));
  if (!BOARDS[board]) return fail('없는 게시판입니다.', 404);
  return json({ ok: true, board, label: BOARDS[board].label, admin: isAdmin(request, env) });
}
