// 자동 생성: scripts/sync-content.mjs 가 ../실습자료 정본에서 만든다. 직접 고치지 않는다.
window.SOURCE = {
 "syncedAt": "2026-11-01",
 "prompts": [
  {
   "id": "P1",
   "name": "스킬 설치 요청",
   "step": "setup",
   "blocks": [
    {
     "label": "",
     "text": "이 작업 폴더에 스킬 세 개를 설치해 줘.\n\n1. grill-me: github.com/mattpocock/skills 저장소의 skills/productivity/grill-me 폴더\n2. grilling: 같은 저장소의 skills/productivity/grilling 폴더 (grill-me는 grilling을 불러 쓰므로 둘 다 있어야 해)\n3. karpathy-guidelines: github.com/multica-ai/andrej-karpathy-skills 저장소의 skills/karpathy-guidelines 폴더\n\n- 넣을 곳: 이 폴더의 .agents/skills/ 아래. 지금 이 대화가 Claude 앱 Code 탭이라면 .claude/skills/ 아래.\n- 폴더 이름은 grill-me, grilling, karpathy-guidelines 그대로 두고, 각 폴더 안의 파일을 빠짐없이 옮겨 줘.\n- 컴퓨터에 git이 없으면 git을 설치하지 말고 GitHub에서 파일을 직접 내려받아 줘.\n- 내려받으며 생긴 임시 파일은 작업 폴더에 남기지 마.\n- 끝나면 설치한 스킬 이름과 한 줄 설명을 목록으로 보여 줘."
    }
   ],
   "when": "Antigravity를 설치하고 빈 작업 폴더(예: 바탕화면의 <code>내앱</code>)를 연 직후, 첫 메시지로. AI가 명령 실행이나 파일 내려받기 허락을 물으면 무엇을 하려는지 읽고 승인한다.",
   "details": "<p><b>도구별 차이</b></p>\n<div class=\"table-wrap\"><table><thead><tr><th>Antigravity</th><th>Claude 앱 Code 탭</th><th>Codex 앱</th></tr></thead><tbody><tr><td><code>.agents/skills/</code>에 설치. 그대로 붙여 넣는다</td><td>같은 문장. AI가 <code>.claude/skills/</code>에 넣는다</td><td>같은 문장. <code>.agents/skills/</code>에 설치</td></tr></tbody></table></div>\n<p>실패하면: 연수 사이트 예비 자료(<a href=\"https://teacher-vibe.pages.dev/downloads.html\" target=\"_blank\" rel=\"noopener\">https://teacher-vibe.pages.dev/downloads.html</a>)의 예비 스킬 묶음(zip)을 내려받아 작업 폴더에 푼다(<code>막힐때.md</code>).</p>"
  },
  {
   "id": "P2",
   "name": "grill-me 시작",
   "step": "plan",
   "blocks": [
    {
     "label": "",
     "text": "/grill-me\n\n수업에서 쓸 웹앱을 기획하고 싶어. 아직 만들지 말고 질문으로 빈틈을 채워 줘.\n\n- 누가 쓰나: (예: 중학교 2학년 학생 / 나 혼자 쓰는 업무 도구)\n- 언제 쓰나: (예: 수업 도입 5분 복습)\n- 하고 싶은 일: (한두 문장)\n\n지킬 조건:\n- 서버 없이 HTML 파일로 열리는 앱. 앱 안에 AI 기능은 넣지 않는다.\n- 학생 이름, 성적 같은 개인정보는 입력받지 않는다.\n- 오늘 연수 시간 안에 첫 화면이 돌아갈 만큼 작게 시작한다.\n\ngrilling 스킬 방식대로, 질문마다 추천 답을 함께 주고 한 번에 세 개까지만 물어봐 줘. 모두 한국어로."
    }
   ],
   "when": "P1로 스킬 설치를 마친 뒤, 기획을 시작할 때. <code>/grill-me</code>는 <b>메시지 맨 앞</b>에 있어야 스킬이 불린다. 추천 답이 마음에 들면 &quot;추천대로&quot;라고만 답해도 된다. 질문이 더 나오지 않으면 P3로 넘어간다.",
   "details": "<p><b>도구별 차이</b></p>\n<div class=\"table-wrap\"><table><thead><tr><th>Antigravity</th><th>Claude 앱 Code 탭</th><th>Codex 앱</th></tr></thead><tbody><tr><td>그대로 붙여 넣는다</td><td>그대로 붙여 넣는다</td><td>첫 줄 <code>/grill-me</code>를 <code>$grill-me</code>로 바꾼다</td></tr></tbody></table></div>\n<p>grill-me가 불리지 않아도 마지막 줄의 &quot;grilling 스킬 방식대로&quot;로 같은 방식의 질문이 이어진다.</p>"
  },
  {
   "id": "P3",
   "name": "기획서 파일로 남기기",
   "step": "plan",
   "blocks": [
    {
     "label": "",
     "text": "지금까지 정한 내용을 이 폴더에 PRD.md 파일로 저장해 줘. 아직 코드는 만들지 마.\n\nPRD.md에 들어갈 것:\n- 앱 이름, 누가 언제 쓰는지\n- 화면 구성\n- 기능 목록: 먼저 만들 것과 나중에 만들 것을 나눠서\n- 시험해 볼 경우: 잘 되는 입력, 틀린 입력, 애매한 입력 하나씩\n- 지킬 조건: HTML 파일로 열림, 개인정보 받지 않음\n\n그리고 이 폴더에 지침 파일을 만들어 아래 두 줄을 적어 줘. Antigravity나 Codex 앱이면 AGENTS.md, Claude 앱 Code 탭이면 CLAUDE.md.\n- 작업을 시작하기 전에 PRD.md를 먼저 읽는다.\n- 코드를 쓸 때는 karpathy-guidelines 스킬의 원칙을 따른다."
    }
   ],
   "when": "grill-me 질문이 끝났을 때. 저장된 PRD.md를 열어 읽어 보고, 틀린 곳은 말로 고치게 한다. 지침 파일이 생기면 다음 세션부터 AI가 PRD.md와 원칙을 스스로 먼저 읽는다.",
   "details": "<p><b>도구별 차이</b></p>\n<div class=\"table-wrap\"><table><thead><tr><th>Antigravity</th><th>Claude 앱 Code 탭</th><th>Codex 앱</th></tr></thead><tbody><tr><td>AGENTS.md 생성</td><td>CLAUDE.md 생성</td><td>AGENTS.md 생성</td></tr></tbody></table></div>"
  },
  {
   "id": "P4",
   "name": "제작 요청 틀",
   "step": "build",
   "blocks": [
    {
     "label": "",
     "text": "PRD.md를 읽고 karpathy-guidelines 스킬의 원칙대로 앱의 첫 버전을 만들어 줘.\n\n- 이번에 만들 기능: (PRD.md의 '먼저 만들 것'에서 한두 개)\n- index.html 파일 하나로, 파일을 두 번 눌러 브라우저에서 바로 열리게.\n- 모르는 점이나 내가 정하지 않은 것이 있으면 만들기 전에 물어봐 줘.\n- 다 만들면 내가 직접 시험해 볼 순서를 세 줄 안으로 알려 줘."
    }
   ],
   "when": "P3 다음, 첫 버전을 만들 때. 기능을 하나 더할 때도 첫 줄의 &quot;첫 버전&quot;을 &quot;다음 기능&quot;으로, 기능 칸을 바꿔 다시 쓴다. 다 만들면 PRD.md의 시험해 볼 경우(잘 되는 입력, 틀린 입력, 애매한 입력)로 직접 눌러 본다.",
   "details": "<p><b>도구별 차이</b></p>\n<div class=\"table-wrap\"><table><thead><tr><th>Antigravity</th><th>Claude 앱 Code 탭</th><th>Codex 앱</th></tr></thead><tbody><tr><td>그대로. 파일을 만들 때 승인을 물을 수 있다</td><td>그대로. 파일 수정 승인을 물으면 확인 후 승인</td><td>그대로</td></tr></tbody></table></div>"
  },
  {
   "id": "P5",
   "name": "수정 요청 틀",
   "step": "build",
   "blocks": [
    {
     "label": "",
     "text": "앱을 시험하다가 어긋난 곳을 찾았어. 이것 하나만 고치고 다른 곳은 건드리지 마.\n\n- 실패한 입력: (예: 답 칸을 비운 채 확인을 눌렀다)\n- 기대한 반응: (예: \"답을 적어 주세요\"라는 안내가 뜬다)\n- 고칠 규칙 한 줄: (예: 빈 답은 채점하지 않는다)\n\n고친 뒤 같은 입력으로 다시 시험하는 방법을 알려 줘."
    }
   ],
   "when": "시험해 보다가 예상과 다르게 움직일 때마다 한 번에 하나씩. 고쳐진 것을 확인하면 P6으로 커밋한다.",
   "details": "<p><b>도구별 차이</b>: 세 도구 모두 그대로 쓴다.</p>"
  },
  {
   "id": "P6",
   "name": "커밋",
   "step": "build",
   "blocks": [
    {
     "label": "커밋할 때",
     "text": "지금 상태를 커밋해 줘.\n\n- 이 폴더가 아직 git 저장소가 아니면 먼저 만들어 줘.\n- git에 이름과 이메일 설정이 없으면, 이 폴더에만 쓸 이름과 이메일을 나에게 물어봐 줘.\n- 커밋 메시지는 방금 한 일을 한국어 한 줄로.\n- 끝나면 지금까지의 커밋 목록을 짧게 보여 줘."
    },
    {
     "label": "되돌릴 때",
     "text": "앱이 잘 되던 때로 되돌리고 싶어.\n\n- 먼저 커밋 목록을 보여 주고, 어느 커밋으로 돌아갈지 나에게 물어봐 줘.\n- 되돌리면 무엇이 사라지는지 말해 주고 내가 확인한 뒤에 진행해 줘.\n- 커밋 기록은 지우지 말고, 되돌린 결과를 새 커밋으로 남겨 줘."
    }
   ],
   "when": "커밋은 기능 하나가 돌아갈 때마다(세이브 포인트). 되돌리기는 수정하다 앱이 더 망가졌을 때.",
   "details": "<p><b>도구별 차이</b></p>\n<div class=\"table-wrap\"><table><thead><tr><th>Antigravity</th><th>Claude 앱 Code 탭</th><th>Codex 앱</th></tr></thead><tbody><tr><td>그대로. git이 없으면 <code>막힐때.md</code>의 git 항목</td><td>그대로</td><td>그대로. 앱 화면의 커밋 버튼을 써도 된다</td></tr></tbody></table></div>"
  },
  {
   "id": "P7",
   "name": "GitHub 저장소 연결",
   "step": "deploy",
   "blocks": [
    {
     "label": "",
     "text": "이 앱을 인터넷 주소로 열 수 있게 올리고 싶어. 아래 순서로 한 단계씩 안내해 줘.\n로그인이나 버튼 누르기처럼 내가 할 일은 어디서 무엇을 누르는지 알려 주고, 내가 \"다 했어\"라고 할 때까지 기다려 줘.\n\n1. 올리기 전에 이 폴더에 학생 개인정보나 비밀번호·API 키가 들어 있지 않은지 확인한다.\n2. GitHub에 이 앱의 비공개 저장소를 새로 만들고, 지금까지의 커밋을 올린다. 저장소 이름은 앱 이름을 영어 소문자와 - 로.\n3. Cloudflare에서 그 저장소를 연결해 배포하고, 누구나 열 수 있는 주소를 받는다.\n4. 받은 주소를 열어 앱이 뜨는지 확인한다.\n\n비밀번호나 토큰을 이 대화에 붙여 넣으라고 하지 마. 로그인은 내가 브라우저에서 직접 한다."
    }
   ],
   "when": "쉬는 시간에 GitHub와 Cloudflare 가입·로그인을 마쳤고, 커밋이 하나 이상 있을 때. 시간이 부족하면 이 단계를 건너뛰고 index.html 파일을 연수 게시판(중 <a href=\"https://teacher-vibe.pages.dev/board.html?b=middle\" target=\"_blank\" rel=\"noopener\">https://teacher-vibe.pages.dev/board.html?b=middle</a>, 고 <a href=\"https://teacher-vibe.pages.dev/board.html?b=high\" target=\"_blank\" rel=\"noopener\">https://teacher-vibe.pages.dev/board.html?b=high</a>)에 올린다.",
   "details": "<p><b>도구별 차이</b>: 세 도구 모두 그대로 쓴다. 단계 2에서 GitHub 로그인 창이 브라우저로 뜨는 방식은 도구와 운영체제마다 다를 수 있다.</p>"
  },
  {
   "id": "P8",
   "name": "집에서 이어 하기",
   "step": "share",
   "blocks": [
    {
     "label": "",
     "text": "이 폴더의 앱을 이어서 만들려고 해.\nPRD.md, 지침 파일(AGENTS.md 또는 CLAUDE.md), 최근 커밋 기록을 읽고, 지금까지 된 것과 남은 것을 다섯 줄 안으로 정리해 줘.\n정리만 하고, 내가 다음에 할 일을 말할 때까지 기다려 줘."
    }
   ],
   "when": "집에서 같은 작업 폴더를 다시 열고 <b>새 세션</b>(새 대화)을 시작한 첫 메시지로. 연수 중에도 대화가 길어져 AI가 앞 내용을 놓치거나 한도 안내가 뜨면 새 세션을 열고 이 문장으로 이어 간다.",
   "details": "<p><b>도구별 차이</b></p>\n<div class=\"table-wrap\"><table><thead><tr><th>Antigravity</th><th>Claude 앱 Code 탭</th><th>Codex 앱</th></tr></thead><tbody><tr><td>폴더 열기 후 새 대화</td><td>같은 폴더를 골라 새 세션</td><td>같은 폴더(프로젝트)에서 새 대화</td></tr></tbody></table></div>"
  }
 ],
 "terms": [
  {
   "group": "대화 단위",
   "items": [
    {
     "term": "세션",
     "desc": "AI와 나누는 대화 한 묶음입니다. 새 세션을 열면 AI는 앞 대화를 기억하지 못한 채 새로 시작합니다.",
     "analogy": "수업 한 차시. 다음 차시에 들어가면 칠판은 지워져 있습니다."
    },
    {
     "term": "컨텍스트",
     "desc": "지금 세션에서 AI가 한꺼번에 보고 있는 글 전체입니다. 내 요청, AI의 답, AI가 읽은 파일이 모두 들어갑니다.",
     "analogy": "지금 칠판에 적혀 있는 내용. 칠판이 차면 앞부분부터 지우거나 줄여 적습니다."
    },
    {
     "term": "토큰",
     "desc": "AI가 글을 읽고 쓰는 단위로, 낱말을 잘게 나눈 조각입니다. 읽는 글과 쓰는 글 모두 토큰을 씁니다.",
     "analogy": "원고지 칸. 긴 글일수록 칸을 많이 씁니다."
    },
    {
     "term": "한도",
     "desc": "한 세션에 담을 수 있는 양과, 몇 시간 또는 한 주 동안 쓸 수 있는 양의 상한입니다. 무료 계정은 한도가 작습니다.",
     "analogy": "복사실의 한 달 복사 매수. 다 쓰면 다음 달까지 기다립니다."
    }
   ],
   "notes": "<p>기억할 것: 대화가 길어져 AI가 앞 내용을 놓치기 시작하면, 같은 폴더에서 새 세션을 열고 이어 갑니다.</p>"
  },
  {
   "group": "지침 단위",
   "items": [
    {
     "term": "작업 폴더",
     "desc": "AI가 읽고 고칠 수 있는 범위인 폴더입니다. 앱 하나에 폴더 하나를 씁니다.",
     "analogy": "모둠 책상. 이 책상 위에 있는 것만 만지게 합니다."
    },
    {
     "term": "지침 파일",
     "desc": "작업 폴더에 두는 안내문으로, AI가 세션을 시작할 때마다 먼저 읽습니다. Antigravity와 Codex 앱은 AGENTS.md, Claude 앱 Code 탭은 CLAUDE.md를 읽습니다.",
     "analogy": "교실 앞에 붙여 둔 학급 규칙. 누가 들어와도 먼저 보게 됩니다."
    },
    {
     "term": "스킬",
     "desc": "어떤 일을 하는 방법을 적어 둔 설명서 폴더입니다. AI가 필요할 때 꺼내 읽거나, 내가 이름을 불러 시킵니다.",
     "analogy": "교과 연구실 서랍의 활동지 묶음. 필요한 수업 때만 꺼냅니다."
    }
   ],
   "notes": "<p>오늘 쓰는 스킬: <b>grill-me</b>(기획 질문, grilling 함께 설치), <b>카파시 스킬</b>(제작 원칙, 폴더 이름 karpathy-guidelines). 소개만: grill-with-docs.</p>"
  },
  {
   "group": "저장·배포",
   "items": [
    {
     "term": "git",
     "desc": "폴더 안 파일이 어떻게 바뀌어 왔는지 기록해 두는 프로그램입니다.",
     "analogy": "게임의 저장 기능 그 자체."
    },
    {
     "term": "커밋",
     "desc": "지금 상태에 이름을 붙여 저장한 지점입니다. 앱이 망가져도 이 지점으로 되돌아갈 수 있습니다.",
     "analogy": "게임의 세이브 포인트. 보스 앞에서 한 번 저장해 둡니다."
    },
    {
     "term": "저장소",
     "desc": "커밋 기록까지 함께 담긴 폴더입니다. GitHub에 올리면 다른 컴퓨터에서도 받아 이어 할 수 있습니다.",
     "analogy": "학년 공유 드라이브의 앨범. 날짜별 사진이 순서대로 쌓입니다."
    },
    {
     "term": "배포",
     "desc": "내 컴퓨터 안의 앱을 인터넷 주소 하나로 누구나 열 수 있게 올리는 일입니다. 오늘은 Cloudflare를 씁니다.",
     "analogy": "학급 신문을 복도 게시판에 붙이는 일. 주소만 알면 누구나 봅니다."
    }
   ],
   "notes": "<p>기억할 것: 기능 하나가 돌아가면 커밋합니다. 배포는 커밋한 것만 올라갑니다.</p>"
  },
  {
   "group": "안전",
   "items": [
    {
     "term": "권한 승인",
     "desc": "AI가 파일을 고치거나 명령을 실행하기 전에 허락을 묻는 단계입니다. 무엇을 하려는지 읽고 나서 누릅니다.",
     "analogy": "현장체험학습 동의서. 내용을 읽고 서명합니다."
    },
    {
     "term": "모델 선택",
     "desc": "같은 앱 안에서 어느 AI 두뇌를 쓸지 고르는 일입니다. 큰 모델은 어려운 일을 잘하지만 한도를 빨리 씁니다.",
     "analogy": "어려운 질문은 교과 전문가에게, 간단한 정리는 도우미 학생에게 맡기는 일."
    },
    {
     "term": "개인정보",
     "desc": "AI에 넣은 글은 회사 서버로 갑니다. 학생 이름, 성적, 생활기록부 원문은 넣지 않고 가짜 이름이나 예시 자료를 씁니다.",
     "analogy": "출석부는 교실 밖으로 들고 나가지 않습니다."
    }
   ],
   "notes": "<p>기억할 것: 학생 개인정보는 AI에도, 앱에도 넣지 않습니다.</p>"
  }
 ],
 "stuck": {
  "setup": "<div class=\"table-wrap\"><table><thead><tr><th>상황</th><th>대처 순서</th></tr></thead><tbody><tr><td>Antigravity가 설치되지 않음(관리자 권한 요구, 학교 관리 노트북)</td><td>1. 설치 파일을 다시 내려받아 실행<br>2. 관리자 권한이 없으면 Google AI Studio Build로 진행</td></tr><tr><td>로그인하니 만 18세 미만이라고 나옴</td><td>1. 화면의 Google 연령 확인 절차 진행<br>2. 안 되면 Google AI Studio Build</td></tr><tr><td>로그인이 막힘(학교·교육청 계정)</td><td>1. 개인 Gmail로 다시 로그인. 학교·업무용 Google 계정은 관리자가 허용해야 쓸 수 있다<br>2. 개인 Gmail이 없으면 Google AI Studio Build</td></tr><tr><td>&quot;이 국가에서는 쓸 수 없음&quot; 안내</td><td>1. Google 계정의 서비스 국가 확인<br>2. Google AI Studio Build</td></tr><tr><td>학교 와이파이에서 내려받기·로그인이 멈춤</td><td>1. 휴대폰 핫스팟으로 바꿔 다시 시도<br>2. 옆 사람 화면을 함께 보며 진행</td></tr><tr><td>P1 스킬 설치가 오류로 끝남(내려받기 실패, git 없음)</td><td>1. &quot;git을 설치하지 말고 파일을 직접 내려받아 다시 해 줘&quot;라고 입력<br>2. 연수 사이트 예비 자료(teacher-vibe.pages.dev/downloads.html)에서 스킬 묶음(zip)을 내려받아 작업 폴더에 푼다(아래 &quot;예비 스킬 묶음 쓰는 법&quot;)</td></tr><tr><td>설치는 됐다는데 스킬 목록이 이상함</td><td>1. &quot;설치된 스킬 폴더와 SKILL.md 파일 위치를 보여 줘&quot;<br>2. 폴더가 <code>.agents/skills/grill-me/SKILL.md</code> 모양인지 확인(Claude 앱 Code 탭은 <code>.claude/skills/</code>)<br>3. 예비 묶음으로 덮어쓰기</td></tr></tbody></table></div>",
  "plan": "<div class=\"table-wrap\"><table><thead><tr><th>상황</th><th>대처 순서</th></tr></thead><tbody><tr><td><code>/grill-me</code>를 붙여도 질문이 시작되지 않음</td><td>1. <code>/grill-me</code>가 메시지 맨 앞에 있는지 확인(Codex 앱은 <code>$grill-me</code>)<br>2. 새 대화를 열고 다시 붙여 넣기(스킬은 대화를 시작할 때 읽는 경우가 많다)<br>3. grilling 폴더가 함께 설치됐는지 확인<br>4. 첫 줄을 지우고 &quot;grilling 스킬 방식대로 질문해 줘&quot;로 시작</td></tr><tr><td>질문이 끝나지 않음, 시간이 모자람</td><td>&quot;남은 질문은 네 추천대로 정하고 마무리해 줘&quot; 입력 후 P3</td></tr><tr><td>AI가 기획 중에 코드를 만들기 시작함</td><td>1. 멈춤 버튼<br>2. &quot;아직 만들지 마. 질문만 해 줘&quot;</td></tr><tr><td>만들 앱이 떠오르지 않음</td><td>슬라이드의 사례 갤러리에서 하나를 골라 내 교과로 바꿔 P2의 &quot;하고 싶은 일&quot;에 적는다</td></tr></tbody></table></div>",
  "build": "<div class=\"table-wrap\"><table><thead><tr><th>상황</th><th>대처 순서</th></tr></thead><tbody><tr><td>대화가 길어져 AI가 앞에서 정한 것을 잊음</td><td>같은 폴더에서 새 세션(새 대화)을 열고 P8</td></tr><tr><td>사용량 한도 안내가 뜸(무료 계정은 한 주 단위로 다시 채워짐)</td><td>1. 모델 선택에서 더 가벼운 모델로 바꿔 보기<br>2. 옆 사람과 한 화면으로 함께 만들기<br>3. Google AI Studio Build로 옮기기(아래)</td></tr><tr><td>앱 화면이 하얗게 비어 있거나 버튼이 반응하지 않음</td><td>P5에 &quot;실패한 입력: 파일을 열었다 / 기대한 반응: 첫 화면이 보인다&quot;로 적어 보낸다</td></tr><tr><td>AI가 부탁하지 않은 곳까지 고쳐서 더 망가짐</td><td>1. P6 되돌리기<br>2. 다시 고칠 때 P5의 &quot;이것 하나만 고치고 다른 곳은 건드리지 마&quot;를 꼭 넣기</td></tr><tr><td>권한 승인 창의 내용을 모르겠음</td><td>승인하기 전에 &quot;방금 실행하려는 명령이 무엇을 하는지 쉽게 설명해 줘&quot;</td></tr><tr><td>git이 없다고 나옴</td><td>1. 맥: 화면에 뜨는 &quot;개발자 도구 설치&quot; 창에서 설치(몇 분 걸림). 윈도우: AI에게 &quot;git 설치 방법을 알려 줘&quot;<br>2. 설치가 오래 걸리면 오늘은 커밋을 건너뛰고 파일만 저장</td></tr><tr><td>커밋할 때 이름·이메일을 물음</td><td>이름은 영어 이름, 이메일은 GitHub에 가입한 이메일. 이 폴더에만 설정된다</td></tr><tr><td>빨간 오류 문구가 뜸</td><td>아래 &quot;오류가 나면 문구를 그대로 보여 줍니다&quot;</td></tr></tbody></table></div>",
  "deploy": "<div class=\"table-wrap\"><table><thead><tr><th>상황</th><th>대처 순서</th></tr></thead><tbody><tr><td>GitHub·Cloudflare 가입 인증 메일이 오지 않음</td><td>1. 스팸함 확인<br>2. 기다리는 동안 제작 계속<br>3. 배포는 건너뛰고 index.html을 연수 게시판(맨 위 주소 표)에 올리기</td></tr><tr><td>GitHub에 올리기(P7 2단계)에서 로그인이 계속 실패함</td><td>1. AI에게 &quot;브라우저 로그인 방식으로 다시 안내해 줘&quot;<br>2. GitHub 웹에서 저장소를 직접 만들고 &quot;Add file&quot;의 &quot;Upload files&quot;로 index.html을 올린 뒤 3단계로<br>3. 배포 건너뛰고 게시판에 HTML 올리기</td></tr><tr><td>Cloudflare에서 저장소가 목록에 안 보임</td><td>Cloudflare 화면의 GitHub 연결 단계에서 그 저장소 접근을 허용했는지 확인(Install &amp; Authorize)</td></tr><tr><td>배포 주소가 열리지 않음</td><td>1. 1~2분 뒤 새로고침<br>2. 저장소 맨 위에 index.html이 있는지 확인<br>3. Cloudflare 설정에서 빌드 명령(Build command)이 비어 있는지 확인</td></tr><tr><td>시간이 부족함</td><td>배포는 생략 가능. index.html 파일을 연수 게시판(중 teacher-vibe.pages.dev/board.html?b=middle, 고 teacher-vibe.pages.dev/board.html?b=high)에 올린다</td></tr></tbody></table></div>",
  "share": "<div class=\"table-wrap\"><table><thead><tr><th>상황</th><th>대처 순서</th></tr></thead><tbody><tr><td>게시판에 HTML 파일이 올라가지 않음</td><td>1. 파일 이름이 <code>.html</code>로 끝나는지 확인<br>2. 1MB를 넘으면 AI에게 &quot;그림 파일을 빼고 index.html 하나로 줄여 줘&quot;<br>3. 배포 주소가 있으면 링크로 올리기</td></tr><tr><td>집에서 폴더를 못 찾음</td><td>연수 끝나기 전에 작업 폴더 위치를 메모해 둔다. GitHub에 올렸다면 저장소에서 다시 받을 수 있다</td></tr><tr><td>만든 앱을 실제 수업에서 학생에게 쓰게 하고 싶음</td><td>쓰기 전에 학교 담당자와 학운위 심의가 필요한지 확인한다. 학생 개인정보를 받는 앱은 교사가 만든 것도 심의 대상이다(<code>학운위심의.md</code>)</td></tr></tbody></table></div>"
 },
 "subs": {
  "예비 스킬 묶음 쓰는 법": "<ol><li>연수 사이트 예비 자료(teacher-vibe.pages.dev/downloads.html)에서 내 도구에 맞는 zip을 내려받아 <b>작업 폴더 안으로</b> 옮긴다: Antigravity·Codex 앱은 <code>skills_agents.zip</code>, Claude 앱 Code 탭은 <code>skills_claude.zip</code></li><li>AI에게 붙여 넣는다: <code>이 폴더에 있는 zip 파일을 이 폴더에 그대로 풀고, zip 파일은 지운 다음 설치된 스킬 목록을 보여 줘.</code> <button type=\"button\" class=\"btn small copy-btn\" data-copy-text=\"이 폴더에 있는 zip 파일을 이 폴더에 그대로 풀고, zip 파일은 지운 다음 설치된 스킬 목록을 보여 줘.\">복사</button></li><li>AI가 못 풀면 직접 푼다. 윈도우는 &quot;압축 풀기&quot;의 위치를 작업 폴더로 지정한다. 맥은 작업 폴더 안에서 zip을 두 번 누른다. 풀고 나면 작업 폴더 안에 <code>.agents/skills/grill-me</code> 같은 폴더가 생긴다</li><li>점(.)으로 시작하는 폴더는 숨겨져 보인다. 맥은 Finder에서 Command + Shift + 마침표, 윈도우는 탐색기 보기 메뉴의 &quot;숨긴 항목&quot;을 켠다</li><li>AI 대화를 새로 열고 &quot;설치된 스킬 목록 보여 줘&quot;로 확인한다</li></ol>",
  "오류가 나면 문구를 그대로 보여 줍니다": "<p>&quot;안 돼요&quot;보다 오류 문구 원문이 훨씬 빨리 고쳐진다. 네 가지를 함께 보낸다.</p>\n<ol><li><b>오류 문구</b>: 글자를 그대로 복사해 붙인다. 복사가 안 되면 화면을 캡처해 대화 창에 붙여 넣는다</li><li><b>무엇을 눌렀는지</b>: 오류가 나기 직전에 한 일</li><li><b>기대한 반응</b>: 원래 어떻게 되어야 했는지</li><li><b>&quot;오류를 숨기지 말고 원인을 고쳐 줘&quot;</b>: 이 말이 없으면 AI가 오류 메시지만 안 보이게 감추는 경우가 있다</li></ol>\n<div class=\"prompt\"><div class=\"prompt-head\"><span class=\"title\">복사해서 붙여 넣기</span><button type=\"button\" class=\"btn small copy-btn\" data-copy>복사</button></div><pre>앱에서 오류가 났어. 오류를 숨기지 말고 원인을 찾아 고쳐 줘. 다른 곳은 건드리지 마.\n\n- 오류 문구: (그대로 붙여 넣기)\n- 무엇을 눌렀나: (예: 확인 버튼을 눌렀다)\n- 기대한 반응: (예: 점수가 화면에 나온다)\n\n고친 뒤 같은 순서로 다시 시험하는 방법을 알려 줘.</pre></div>\n<p>오류 문구가 화면에 안 보일 때(화면이 하얗거나 버튼만 반응하지 않을 때):</p>\n<ul><li>크롬·엣지에서 앱을 연 채 F12(맥은 Command + Option + J)를 눌러 개발자 도구를 열고, Console 탭의 빨간 글자를 복사한다</li><li>그래도 없으면 P5에 &quot;실패한 입력: 파일을 열었다 / 기대한 반응: 첫 화면이 보인다&quot;로 적어 보낸다</li></ul>\n<p>고친 뒤 더 망가지면 P6 되돌리기. 대화가 길어져 AI가 앞에서 정한 것을 잊으면 새 세션과 P8(대화 길이 문제일 때만. 사용량 한도는 위 표의 한도 항목).</p>",
  "올리기 전에 세 가지를 확인합니다": "<p>GitHub에 올리거나 게시판에 HTML을 올리기 전에 확인한다. P7 첫 단계와 같은 점검이다.</p>\n<div class=\"table-wrap\"><table><thead><tr><th>확인할 것</th><th>왜</th><th>어떻게</th></tr></thead><tbody><tr><td>학생 정보가 들어 있지 않은가</td><td>올린 파일은 다른 사람이 열어 볼 수 있다. 예시 자료도 실제 학생 이름이 아닌 가짜 이름이어야 한다</td><td>아래 점검 문장</td></tr><tr><td>비밀번호·열쇠 문자열(API 키)이 코드에 없는가</td><td>키가 새면 남이 내 계정으로 쓰고 요금이 내게 청구된다. 오늘 앱은 AI 기능이 없어 키가 없어야 정상이다</td><td>아래 점검 문장</td></tr><tr><td>코드는 내 GitHub 저장소에 있는가</td><td>무료 플랫폼은 약관·한도가 바뀌거나 서비스가 끝나기도 한다. 코드가 내 저장소에 있으면 언제든 옮길 수 있다</td><td>P7로 올렸는지 확인. 배포를 건너뛰었다면 커밋해 두고 작업 폴더 위치를 메모</td></tr></tbody></table></div>\n<div class=\"prompt\"><div class=\"prompt-head\"><span class=\"title\">복사해서 붙여 넣기</span><button type=\"button\" class=\"btn small copy-btn\" data-copy>복사</button></div><pre>올리기 전에 이 폴더의 파일을 점검해 줘.\n1. 사람 이름, 학번, 전화번호, 이메일 같은 개인정보가 들어 있는지\n2. 비밀번호, API 키, 토큰처럼 보이는 문자열이 들어 있는지\n찾은 것이 있으면 파일 이름과 위치를 보여 주고, 고치기 전에 나에게 물어봐 줘.</pre></div>\n<p>앱 안에 AI 기능을 넣고 싶어지면 키를 화면 코드(HTML·자바스크립트)에 넣지 않는다. 키를 숨기려면 서버가 필요하므로 오늘 범위 밖이다.</p>"
 },
 "studio": "<p>브라우저만으로 쓰는 예비 도구다. 설치는 없지만 만 18세 이상 개인 Google 계정이 필요하다.</p>\n<ol><li>aistudio.google.com 에서 Build로 들어간다</li><li>작업 폴더에 PRD.md가 있으면 그 내용을 붙여 넣고 &quot;이 기획서대로 첫 화면을 만들어 줘&quot;. 없으면 P2의 앱 설명 부분만 붙여 넣는다</li><li>공유 링크로 연 사람은 앱의 코드도 볼 수 있다. 개인정보를 넣지 않는다</li><li>결과는 공유 링크로 게시판에 올린다</li></ol>",
 "committee": {
  "points": "<ul><li>2026년 3월부터 수업에 쓰는 학습지원 소프트웨어는 학교운영위원회 심의를 거칩니다</li><li>학생 개인정보를 받는 앱은 교사가 직접 만든 것도 심의 대상입니다</li><li>학생 정보를 받지 않게 만들면 부담이 크게 줄어듭니다</li><li>수업에 쓰기 전에 학교 담당자와 확인합니다. 사후 심의는 안 됩니다</li></ul>",
  "body": "<p><b>무엇이 바뀌었나.</b> 초·중등교육법 제29조의2가 새로 생겨, 학교장이 학습지원 소프트웨어를 교육 자료로 고를 때 교육부 기준을 따르고 학교운영위원회 심의를 거쳐야 합니다. 이 조항은 2026년 3월 1일부터 시행됐습니다.</p>\n<p><b>무엇이 심의 대상인가.</b> 교육부 가이드는 학교 교육과정 운영에 쓰면서 아래 둘 중 하나라도 해당하면 대상으로 봅니다.</p>\n<ol><li>학생 개인정보를 수집·이용·제공하는 소프트웨어</li><li>교과 성취기준과 관련된 학습콘텐츠를 담고, 콘텐츠 제공 기관이 교육과정 운영 지원을 목적으로 개발·보급한 소프트웨어(가이드 예시: 옛 AI 디지털교과서, AI 코스웨어)</li></ol>\n<p><b>대상이 아닌 것.</b> 학생 개인정보 없이 교사가 수업 준비나 행정 업무에만 혼자 쓰는 도구(예: 학생 정보를 받지 않는 알림장·캘린더), 방과후·돌봄처럼 정규 교과 밖에서 쓰는 소프트웨어, 정규 교과에 쓰지 않는 학교 홈페이지.</p>\n<p><b>교사가 만든 앱은.</b> 가이드는 &quot;교사가 개발한 자료라 해도 심의 대상 범위에 속한다면&quot; 심의를 받아야 한다고 적고, 개인정보를 수집·처리하는 교사 제작 소프트웨어는 대상이라고 답합니다(Q22). 이때 교사가 개발자로서 개인정보 필수기준 체크리스트와 증빙을 직접 작성하며, 증빙은 개인정보 처리방침이나 서술 답변으로 대신할 수 있습니다. <b>개인정보를 받지 않는 교사 제작 앱이 대상인지는 원문에 명시가 없어 학교가 판단합니다</b>(2026-11-02 확인).</p>\n<p><b>오늘 연수와의 관계.</b> 오늘 만드는 앱은 학생 정보를 받지 않는 HTML 앱이고, 연수 안에서 시험해 보는 것까지입니다. 실제 수업에 쓰려면 먼저 학교 담당자에게 확인합니다. 심의는 쓰기 전에 받아야 하며 사후 심의는 안 되지만, 급할 때는 서면 심의가 가능합니다(Q21). 이름·학번 입력 칸을 빼면 1번 기준에서는 벗어나지만, 2번 기준에 해당하는지는 학교가 판단합니다.</p>\n<p><b>면제·간소화.</b> 지금 법에는 면제 조항이 없습니다. 2026년 3월 5일 김민전 의원 등 10인이 &quot;교육부령 기준에 맞는 소프트웨어는 심의를 면제할 수 있다&quot;는 개정안을 발의했고, 경기·서울·인천 교육감도 공공 플랫폼 심의 예외·간소화를 담은 법 개정을 교육감협의회 안건으로 올렸습니다. 지금 쓸 수 있는 간소화는 가이드 안의 방법(자주 쓰는 소프트웨어 일괄 상정, 서면 심의, 간소화 양식)입니다.</p>"
 }
};
