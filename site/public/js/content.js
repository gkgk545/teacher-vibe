// 사이트 글 내용(학교급, 연수 흐름, 내려받기). {{...}} 는 정해지면 채울 자리 표시다.
//   꼭지 이름: 공통정보.md 3장, 슬라이드/구성안.md
window.CONTENT = {
  title: '교사가 설계하고 AI가 만드는 수업 앱',
  subtitle: '수업·평가 도구를 기획부터 배포까지',
  instructor: '곡수초등학교 교사 이진혁',

  // 날짜순(고등학교 먼저). 학교급 탭도 이 순서로 보인다.
  levels: {
    high: {
      label: '고등학교',
      date: '2026년 11월 11일(수) 15:50–17:50',
      school: '효양고등학교',
      day: '2026-11-11',
      demo: "통합사회2 '인권보장과 헌법' 개념도 앱",
      demoUrl: '{{시연앱주소_고}}',
    },
    middle: {
      label: '중학교',
      date: '2026년 11월 16일(월) 15:30–17:30',
      school: '안산성호중학교',
      day: '2026-11-16',
      demo: "과학 '물질의 상태 변화' 개념도 앱",
      demoUrl: '{{시연앱주소_중}}',
    },
  },

  // 연수 흐름(PRD 3장)
  flow: [
    { no: '①', id: 'intro', name: '도입', time: '0:00–0:10', what: '학생 입장에서 시연 앱 써 보기' },
    { no: '②', id: 'terms', name: '용어', time: '0:10–0:25', what: '네 가지 용어 묶음' },
    { no: '③', id: 'setup', name: '준비', time: '0:25–0:35', what: '도구 설치, 작업 폴더, 스킬 설치' },
    { no: '④', id: 'plan', name: '기획', time: '0:35–0:55', what: 'grill-me로 기획서 만들기' },
    { no: '', id: 'break', name: '쉬는 시간', time: '0:55–1:05', what: 'GitHub·Cloudflare 가입', isBreak: true },
    { no: '⑤', id: 'build', name: '제작', time: '1:05–1:35', what: '만들고, 시험하고, 고치고, 커밋' },
    { no: '⑥', id: 'deploy', name: '배포', time: '1:35–1:50', what: 'GitHub 저장소 연결, Cloudflare 배포' },
    { no: '⑦', id: 'share', name: '공유·마무리', time: '1:50–2:00', what: '게시판에 올리고 댓글, 집에서 이어 하기' },
  ],

  // 프롬프트·용어·막힐 때는 실습자료 정본에서 만든 js/source.js(window.SOURCE)에 있다.
  downloads: [
    { file: '/downloads/skills_agents.zip', label: 'skills_agents.zip', who: 'Antigravity, Codex 앱' },
    { file: '/downloads/skills_claude.zip', label: 'skills_claude.zip', who: 'Claude 앱 Code 탭' },
  ],
};
