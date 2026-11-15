// 사이트에 보이는 이름표. 복사 문장은 실습자료 정본에서 만든 js/source.js(window.SOURCE)에 있다.
window.CONTENT = {
  // 게시판: 중학교만 쓴다(2026-11-16 고등학교 게시판 내림). 메뉴 이름은 '게시판'
  boards: { middle: '중학교' },

  // 자료 모음 페이지(/downloads). 1부 실습 zip과 예비 스킬 zip 아래에 바로가기 링크를 둔다.
  downloads: [
    { file: '/downloads/agent-practice.zip', label: '1부_실습.zip', who: '1부 실습 폴더' },
    { file: '/downloads/agent-answers.zip', label: '막혔을때_완성본.zip', who: '1부 완성 스킬' },
    { file: '/downloads/skills_agents.zip', label: 'skills_agents.zip', who: 'Antigravity, Codex 앱' },
    { file: '/downloads/skills_claude.zip', label: 'skills_claude.zip', who: 'Claude 앱 Code 탭' },
  ],
  links: [
    { title: '스킬 저장소', items: [
      { label: 'multica-ai/andrej-karpathy-skills', href: 'https://github.com/multica-ai/andrej-karpathy-skills' },
      { label: 'mattpocock/skills', href: 'https://github.com/mattpocock/skills' },
    ] },
    { title: 'PPT 자료', items: [{ label: 'Canva에서 보기', href: 'https://canva.link/1116sh' }] },
    { title: 'Antigravity 설치', items: [{ label: 'antigravity.google/download', href: 'https://antigravity.google/download' }] },
    { title: 'Cloudflare', items: [{ label: 'dash.cloudflare.com', href: 'https://dash.cloudflare.com' }] },
    { title: 'GitHub', items: [{ label: 'github.com', href: 'https://github.com' }] },
  ],

  // READ_ONLY로 닫은 게시판에 보이는 문장
  boardClosedNotice: '글쓰기와 댓글이 닫힌 게시판입니다.',
};
