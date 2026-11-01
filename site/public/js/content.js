// 사이트 글 내용. {{...}} 는 정본이 나오면 채울 자리 표시다.
//   프롬프트 P1~P8: 실습자료/프롬프트.md (글자 그대로)
//   용어: 실습자료/용어정리.md, 막힐 때: 실습자료/막힐때.md
//   꼭지 이름: 공통정보.md 3장, 슬라이드/구성안.md
window.CONTENT = {
  title: '교사가 설계하고 AI가 만드는 수업 앱',
  subtitle: '기획부터 배포까지, 바이브코딩 첫 경험',
  instructor: '곡수초등학교 교사 이진혁',

  levels: {
    middle: {
      label: '중학교',
      date: '2026년 11월 11일(수)',
      demo: "과학 '물질의 상태 변화' 개념도 앱",
      demoUrl: '{{시연앱주소_중}}',
    },
    high: {
      label: '고등학교',
      date: '2026년 11월 16일(월)',
      demo: "통합사회2 '인권보장과 헌법' 개념도 앱",
      demoUrl: '{{시연앱주소_고}}',
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

  // 복사할 프롬프트(정본: 실습자료/프롬프트.md). text는 글자 그대로 옮긴다.
  prompts: [
    { id: 'P1', name: '스킬 설치 요청', step: 'setup', text: '{{P1}}' },
    { id: 'P2', name: 'grill-me 시작', step: 'plan', text: '{{P2}}' },
    { id: 'P3', name: '기획서 파일로 남기기', step: 'plan', text: '{{P3}}' },
    { id: 'P4', name: '제작 요청 틀', step: 'build', text: '{{P4}}' },
    { id: 'P5', name: '수정 요청 틀', step: 'build', text: '{{P5}}' },
    { id: 'P6', name: '커밋·되돌리기 요청', step: 'build', text: '{{P6}}' },
    { id: 'P7', name: 'GitHub 저장소 연결·Cloudflare 배포 요청', step: 'deploy', text: '{{P7}}' },
    { id: 'P8', name: '집에서 이어 하기', step: 'share', text: '{{P8}}' },
  ],

  // 용어 정리 네 묶음(정본: 실습자료/용어정리.md)
  terms: [
    { group: '대화 단위', items: [{ term: '세션', desc: '{{용어}}' }, { term: '컨텍스트', desc: '{{용어}}' }, { term: '토큰', desc: '{{용어}}' }, { term: '한도', desc: '{{용어}}' }] },
    { group: '지침 단위', items: [{ term: '작업 폴더', desc: '{{용어}}' }, { term: '지침 파일', desc: '{{용어}}' }, { term: '스킬', desc: '{{용어}}' }] },
    { group: '저장·배포', items: [{ term: 'git', desc: '{{용어}}' }, { term: '커밋', desc: '{{용어}}' }, { term: '저장소', desc: '{{용어}}' }, { term: '배포', desc: '{{용어}}' }] },
    { group: '안전', items: [{ term: '권한 승인', desc: '{{용어}}' }, { term: '모델 선택', desc: '{{용어}}' }, { term: '개인정보', desc: '{{용어}}' }] },
  ],

  // 막힐 때 대처(정본: 실습자료/막힐때.md). step은 그 상황이 주로 생기는 꼭지.
  stuck: [
    { step: 'setup', when: '{{막힐때}}', fix: '{{막힐때}}' },
  ],

  downloads: {
    skillsZip: '{{예비스킬zip}}',
  },
};
