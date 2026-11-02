// 게시판 API가 함께 쓰는 도구. functions/ 밖에 두어 경로로 잡히지 않게 한다.

export const BOARDS = {
  middle: { label: '중학교', codeVar: 'ENTRY_CODE_MIDDLE' },
  high: { label: '고등학교', codeVar: 'ENTRY_CODE_HIGH' },
};

export const MAX_FILE_BYTES = 1024 * 1024;

export const LIMITS = {
  name: 20,
  app_name: 40,
  subject: 30,
  intro: 200,
  link: 500,
  body: 300,
};

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}

export function fail(message, status = 400) {
  return json({ error: message }, status);
}

export function isAdmin(request, env) {
  const code = request.headers.get('x-admin-code') || '';
  return Boolean(env.ADMIN_CODE) && code === env.ADMIN_CODE;
}

// 입장 코드가 맞는지 본다. 관리 코드는 모든 보드에 들어갈 수 있다.
export function canEnter(request, env, board) {
  if (!BOARDS[board]) return false;
  if (isAdmin(request, env)) return true;
  const expected = env[BOARDS[board].codeVar];
  const code = (request.headers.get('x-entry-code') || '').trim();
  return Boolean(expected) && code === expected;
}

// READ_ONLY 값이 있으면 글쓰기·댓글을 막는다(관리 코드는 그대로 쓸 수 있다). 연수가 끝난 뒤 게시판을 닫을 때 쓴다.
export function isReadOnly(env) {
  return Boolean(env.READ_ONLY);
}

export function newId(length = 10) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('');
}

// 앞뒤 공백을 지우고 길이를 확인한다. 비었거나 길면 오류 문장을 돌려준다.
export function clean(value, field, label, { required = true } = {}) {
  const text = String(value ?? '').trim();
  if (!text) return required ? { error: `${label}을(를) 적어 주세요.` } : { value: '' };
  if (text.length > LIMITS[field]) return { error: `${label}은(는) ${LIMITS[field]}자까지 적을 수 있습니다.` };
  return { value: text };
}

export function bumpVersion(env, board) {
  return env.DB.prepare('UPDATE board_meta SET version = version + 1 WHERE board = ?').bind(board);
}

export function fileUrl(env, fileId) {
  const origin = (env.FILES_ORIGIN || '').replace(/\/$/, '');
  return `${origin}/f/${fileId}`;
}
