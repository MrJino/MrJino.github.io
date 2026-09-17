# 블로그 글 게시

1. `posts/`에 Markdown 글을 만들고 `js/blog-data.js`에 제목, 요약, 날짜, 파일명을 등록합니다.
2. 저장소 루트에서 `npm run build`를 실행합니다.
3. 변경된 `blog/index.html`, `blog/articles/*.html`, `sitemap.xml`, `assets/css/tailwind.css`를 글 원본과 함께 게시합니다.

빌드 스크립트는 파일명으로 고유 글 주소를 만듭니다. 예를 들어 `posts/android-adb-commands.md`의 주소는 `/blog/articles/android-adb-commands.html`입니다. 기존 `/blog/post.html?id=13` 링크는 새 주소로 이동합니다. 파일명을 바꾸면 글 주소도 바뀌므로 게시한 글의 파일명은 유지하세요.

사이트 게시 후 Google Search Console과 네이버 서치어드바이저에서 `https://mrjino.github.io/sitemap.xml`을 제출하고, 대표 글 주소의 색인 상태를 확인합니다. 소유권 확인에 필요한 코드는 각 서비스에서 발급받아야 합니다.
