// 사이트에 보이는 이름표. 복사 문장은 실습자료 정본에서 만든 js/source.js(window.SOURCE)에 있다.
window.CONTENT = {
  // 게시판(메뉴 순서: 연수 날짜순)
  boards: { high: '고등학교', middle: '중학교' },

  // 자료 모음 페이지(/downloads). 예비 스킬 zip 아래에 바로가기 링크를 둔다.
  downloads: [
    { file: '/downloads/skills_agents.zip', label: 'skills_agents.zip', who: 'Antigravity, Codex 앱' },
    { file: '/downloads/skills_claude.zip', label: 'skills_claude.zip', who: 'Claude 앱 Code 탭' },
  ],
  links: [
    { title: '스킬 저장소', items: [
      { label: 'multica-ai/andrej-karpathy-skills', href: 'https://github.com/multica-ai/andrej-karpathy-skills' },
      { label: 'mattpocock/skills', href: 'https://github.com/mattpocock/skills' },
    ] },
    { title: 'PPT 자료', items: [{ label: 'Canva에서 보기', href: 'https://canva.link/hy1111' }] },
    { title: 'Antigravity 설치', items: [{ label: 'antigravity.google/download', href: 'https://antigravity.google/download' }] },
    { title: 'Cloudflare', items: [{ label: 'dash.cloudflare.com', href: 'https://dash.cloudflare.com' }] },
    { title: 'GitHub', items: [{ label: 'github.com', href: 'https://github.com' }] },
  ],

  // READ_ONLY로 닫은 게시판에 보이는 문장
  boardClosedNotice: '글쓰기와 댓글이 닫힌 게시판입니다.',
};
