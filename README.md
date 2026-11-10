# 바이브코딩 연수 사이트

중·고등 교원 바이브코딩 연수(2026-11-11 고등학교, 11-16 중학교)의 복사할 프롬프트·예비 자료 페이지와 공유 게시판.

| 폴더 | Cloudflare Pages 프로젝트 | 하는 일 |
| --- | --- | --- |
| `site/` | 본 사이트 | 페이지(`public/`: 참고용 프롬프트 예시, 용어 정리, 예비 자료, 게시판), 게시판 API(`functions/api/`). 예전 주소 `/`, `/guide`는 `public/_redirects`로 `/prompts`에 보낸다 |
| `apps/` | 파일 주소 | 게시판에 올린 HTML을 `/f/<id>`로 연다. 게시판과 출처가 달라서 올린 스크립트가 게시판을 건드리지 못한다 |

두 프로젝트가 D1 데이터베이스 `vibe-board` 하나를 함께 쓴다(`schema.sql`). 글·댓글·HTML 파일(1MB 이하, `.html`만)이 모두 D1에 들어간다.

## 글 내용 고치기

- 게시판 이름, 내려받기 목록: `site/public/js/content.js`
- 복사 문장(프롬프트 P1~P8, 막힐때.md의 zip 풀기·오류 보고·올리기 전 점검), 용어(용어정리.md), 예비 스킬 zip: `../실습자료`의 정본에서 만든다. 정본이 바뀌면 `npm run sync`로 `site/public/js/source.js`와 `site/public/downloads/*.zip`을 다시 만들고 커밋한다(코드 블록 안 글자 그대로 옮긴다)

## 게시판 쓰는 법

- 주소: `/board?b=middle`(중학교), `/board?b=high`(고등학교)
- 입장 코드 없이 누구나 보고 쓴다(2026-11-10부터)
- 관리 모드: 주소 끝에 `&admin`을 붙이고 관리 코드(`ADMIN_CODE`)를 넣으면 글·댓글 삭제와 게시판 비우기 버튼이 나온다
- 연수 뒤 닫기: `site/wrangler.toml`의 `READ_ONLY`를 `"1"`로 바꿔 push하면 보기만 되고 글쓰기·댓글이 막힌다(관리 코드는 그대로)

## 로컬 실행

```sh
npm install
printf 'ADMIN_CODE=admin-local\nFILES_ORIGIN=http://localhost:8789\n' > site/.dev.vars
npm run dev:apps   # 다른 창에서 npm run dev:site
npm run db:local   # dev 서버를 한 번 띄운 뒤 표 만들기
```

## 배포

GitHub 저장소 `gkgk545/teacher-vibe`의 `main`에 push하면 Cloudflare Pages가 두 프로젝트를 자동으로 배포한다.

| Pages 프로젝트 | 주소 | 루트 폴더 | 빌드 명령 | 출력 폴더 |
| --- | --- | --- | --- | --- |
| teacher-vibe | https://teacher-vibe.pages.dev | `site` | 없음 | `public` |
| teacher-vibe-apps | https://teacher-vibe-apps.pages.dev | `apps` | 없음 | `public` |

D1 연결은 각 폴더의 `wrangler.toml`이 정한다(대시보드에서 따로 넣지 않는다). 관리 코드는 비밀 값으로 넣는다.

이 폴더 경로에 한글이 있으면 wrangler가 `wrangler.toml`을 찾지 못한다. 그래서 로컬에서 원격 작업을 할 때는 `scripts/wr.sh`가 영문 임시 경로로 복사한 뒤 실행한다.

```sh
npm run db:remote    # 원격 D1에 표 만들기(처음 한 번)
sh scripts/wr.sh site pages secret put ADMIN_CODE --project-name teacher-vibe
```

비밀 값을 바꾼 뒤에는 다시 배포해야 반영된다(대시보드의 배포 다시 시도, 또는 새 커밋 push).
