---
name: mrjino-workspace
description: Workspace guidance for the static MrJino site at /Users/gurunun-jino/Project/gurunun/mrjino-web. Use when editing its blog posts, course materials, portfolio, profile, history, navigation, or Tailwind styles.
---

# MrJino Workspace

## 프로젝트 범위

- 작업 루트는 `/Users/gurunun-jino/Project/gurunun/mrjino-web`이며 독립된 Git 저장소입니다.
- 시작할 때 프로젝트의 `AGENTS.md`와 Git 변경 상태를 확인합니다. 아래 안내보다 현재 소스와 사용자의 요청을 우선합니다.
- 정적 HTML, 일반 JavaScript, Markdown으로 구성됩니다. `package.json`의 이름은 `mrjino-github-pages`이며, npm 스크립트는 Tailwind CSS 생성용입니다. 다른 형제 프로젝트의 API나 배포 방식을 이 프로젝트에 적용하지 않습니다.
- 사용자에게는 한국어로 설명합니다. 글의 작성 언어는 요청과 기존 콘텐츠를 따릅니다.

## 작업 위치

프로젝트 루트 기준 경로입니다.

| 작업 | 우선 확인할 파일 |
| --- | --- |
| 홈 화면 | `index.html` |
| 사이트 탐색 메뉴 | `assets/components/navigation-dropdown.js` 및 각 페이지의 사용 부분 |
| 블로그 목록·검색 | `blog/index.html`, `blog/js/main.js`, `blog/js/blog-data.js` |
| 블로그 본문 표시 | `blog/post.html`, `blog/js/post.js`, `blog/css/style.css` |
| 블로그 글 | `blog/posts/*.md`, 이미지 등은 `blog/images/`, 참고 자료는 `blog/assets/` |
| 강의 목록·상세·본문 | `course/index.html`, `course/topic.html`, `course/post.html`, `course/js/topics-data.js` |
| 강의 내용 | `course/posts/<topic-id>/<file>.md` |
| 포트폴리오 | `about/index.html`, `about/portfolio.css`, `about/portfolio.js` |
| 프로필·연혁 | `profile/`, `history/` |
| 이전 사이트 | `legacy/` — 이 영역을 수정하는 요청일 때 확인 |

포트폴리오는 `about/index.html`의 단일 문서이며 일반 세로 스크롤을 사용합니다. 전용 디자인은 `about/portfolio.css`, 필터·상세 팝업·활성 탐색 표시는 `about/portfolio.js`에서 관리합니다. 프로젝트 카드의 `data-project`와 같은 문서의 `<template id="<project-id>-content">`를 함께 수정합니다. 상세 팝업은 공용 `<dialog>`를 사용합니다.

## 블로그 글 추가·수정

- 본문은 `blog/posts/`에 작성하고 `blog/js/blog-data.js`의 `blogPosts`에도 등록합니다. Markdown 파일만 추가하면 목록에 나타나지 않습니다.
- 목록 항목의 필드는 `id`, `title`, `category`, `tags`, `date`, `thumbnail`, `excerpt`, `file`, `readTime`입니다. 기존 항목 형식을 참고하고 새 `id`는 중복되지 않게 정합니다.
- 글 주소는 `blog/post.html?id=<숫자 ID>`입니다. 기존 글을 수정할 때 ID를 유지합니다.
- `file`은 `blog/posts/` 아래의 파일명입니다. `post.js`가 `fetch()`로 본문을 읽고 `marked.parse()`로 표시합니다. 현재 글에는 YAML frontmatter를 파싱하는 흐름이 없으므로 메타정보는 JS 목록에 둡니다.
- HTML에 삽입된 Markdown의 상대 이미지·링크는 Markdown 파일 위치가 아니라 `blog/post.html` 기준으로 해석됩니다. 기존 `images/...` 경로 관례와 실제 파일을 확인합니다.
- 참고 자료와 게시용 본문을 구분합니다. 기술 글의 명령어나 제품 동작을 새로 작성·수정할 때 해당 부분을 공식 문서와 대조합니다.
- 블로그 글의 Markdown 목록 기호가 보이도록 `blog/css/style.css`의 `.markdown-content ul`과 `ol`에 각각 `list-style-type: disc`와 `decimal`을 유지합니다. Tailwind 기본 스타일은 목록 기호를 제거하므로, 글이나 스타일을 수정할 때 생성된 HTML의 `<ul>`·`<ol>`·`<li>` 구조와 이 CSS 규칙을 함께 확인합니다.
- 블로그 표를 만들거나 수정할 때 `blog/posts/korea-housing-policy-by-government.md`의 정부별 비교표와 `blog/css/style.css`의 `.markdown-content .table-scroll`·표 스타일을 디자인 기준으로 참고합니다. 짙은 헤더, 옅은 교차 행, 구분하기 쉬운 첫 열, 긴 설명의 줄바꿈과 모바일 가로 스크롤을 유지하고, 열 너비는 내용에 맞춰 조정합니다.
- 글 페이지의 `scripts/build-blog.mjs`는 본문 표를 접근 가능한 `.table-scroll` 영역으로 감쌉니다. 표 수정 후 `npm run build:blog`를 실행하고 생성된 `blog/articles/*.html`의 `<table>` 구조, 헤더·본문 셀, 링크와 가로 스크롤 래퍼를 확인합니다.
- 블로그 본문의 외부 웹 URL 링크는 새 탭에서 열고 `rel="noopener noreferrer"`를 설정합니다. 사이트 내부 링크는 현재 탭을 유지합니다. `scripts/build-blog.mjs`에서 Markdown 링크와 본문에 직접 작성한 HTML 링크 모두 처리하므로 글을 수정한 뒤 빌드 결과의 링크 속성을 확인합니다.

## 강의 자료

- `course/js/topics-data.js`의 `topics`와 `course/posts/<topic-id>/`의 Markdown을 함께 확인합니다. 목록에 있는 파일이 모두 구현돼 있다고 가정하지 말고, 작업 대상의 파일 존재 여부를 확인합니다.
- 토픽 항목의 `id`, `posts`, `totalPosts`를 일관되게 유지합니다. 각 강의의 `file`은 해당 토픽 디렉터리 아래 파일명입니다.
- 강의 주소는 `course/post.html?topic=<topic-id>&post=<0부터 시작하는 배열 인덱스>`입니다. `posts` 항목의 `id`와 URL의 `post` 값은 서로 다릅니다.
- 학습 완료 상태는 브라우저의 `localStorage['blogProgress']`에 토픽 ID와 강의 배열 인덱스로 저장됩니다. 기존 토픽 ID를 바꾸거나 강의를 재정렬할 때는 기존 링크와 학습 기록에 미치는 영향을 고려합니다.

## 스타일·아이콘

- 공통 Tailwind 입력은 `assets/css/tailwind.input.css`, 설정은 `tailwind.config.js`, 생성 결과는 `assets/css/tailwind.css`입니다. 생성 CSS를 직접 수정하지 않습니다.
- 유틸리티 클래스나 Tailwind 설정을 바꿨다면 루트에서 `npm run build:css`를 실행하고 생성 결과도 확인합니다. 반복 작업 시 `npm run watch:css`를 사용할 수 있습니다.
- 새로운 경로나 파일 형식을 추가하면 `tailwind.config.js`의 `content` 범위에 포함되는지 확인합니다. 동적으로 조합한 클래스는 스캔에서 누락될 수 있습니다.
- `AGENTS.md`에 따라 새 SVG는 `assets/icons/`의 별도 파일로 만들고 HTML에서 `<img>`로 참조합니다. 기존 아이콘을 먼저 재사용하고, 새 파일명은 의미 있는 kebab-case로 작성합니다. 장식 아이콘에는 `alt="" aria-hidden="true"`, 정보 전달용 아이콘에는 의미 있는 한국어 대체 텍스트를 사용합니다.
- 기존 인라인 SVG가 있더라도 이를 새 아이콘 작성 방식의 근거로 삼지 않습니다. 관련 없는 기존 아이콘까지 일괄 변경할 필요는 없습니다.

## 확인 방법

- 변경한 JavaScript는 `node --check <파일>`로 확인합니다. HTML 인라인 스크립트를 수정했다면 해당 스크립트도 별도로 문법을 확인합니다.
- 글·강의 작업은 변경된 목록 항목의 파일 및 이미지 경로, ID 중복, 상세 페이지 주소를 확인합니다. 관계없는 기존 자료의 누락까지 자동으로 수정 범위를 넓히지 않습니다.
- 실제 브라우저를 통한 화면·동작 확인(브라우저 자동화 및 스크린샷 포함)은 사용자가 명시적으로 요청한 경우에만 진행합니다. 기본 검증은 코드 검토, 문법 검사, 관련 빌드로 수행하며, 브라우저 확인을 위해 별도로 요청을 유도하지 않습니다.
- 사용자가 브라우저 확인을 요청하면 루트에서 `python3 -m http.server 8000`으로 제공할 수 있습니다. Markdown을 `fetch()`하므로 `file://`로 여는 방식은 적절하지 않습니다.
- `git diff --check`와 최종 diff로 생성 CSS 및 의도한 콘텐츠 변경을 검토합니다. 이 프로젝트에 없는 빌드·테스트 스크립트를 가정하지 않습니다.
- 로컬 검증과 게시를 구분합니다. 배포 설정과 사용자 요청을 확인하기 전에는 커밋·푸시가 게시를 유발하지 않는다고 가정하지 않습니다.
