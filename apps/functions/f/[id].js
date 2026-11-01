// 게시판에 올린 HTML 파일을 연다. 이 프로젝트는 게시판과 다른 주소(출처)라서,
// 올린 파일의 스크립트가 게시판의 저장 공간이나 화면을 건드릴 수 없다.
export async function onRequestGet({ env, params }) {
  const file = await env.DB.prepare('SELECT content FROM files WHERE id = ?').bind(params.id).first();
  if (!file) {
    return new Response(notFound, { status: 404, headers: { 'content-type': 'text/html; charset=utf-8' } });
  }
  return new Response(file.content, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'x-content-type-options': 'nosniff',
      'x-robots-tag': 'noindex, nofollow',
      'referrer-policy': 'no-referrer',
      'cache-control': 'public, max-age=60',
    },
  });
}

const notFound = `<!doctype html><html lang="ko"><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>파일 없음</title>
<body style="font-family:system-ui,sans-serif;padding:2rem;line-height:1.6">
<h1 style="font-size:1.3rem">파일을 찾을 수 없습니다</h1>
<p>게시판에서 지워졌거나 주소가 잘못되었습니다.</p></body></html>`;
