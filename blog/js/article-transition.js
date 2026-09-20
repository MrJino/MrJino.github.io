// 본문에서 목록으로 돌아갈 때 글 영역을 접고 이동한다.
document.addEventListener('click', (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const link = event.target instanceof Element ? event.target.closest('.blog-back-link') : null;
  if (!link || !document.body.classList.contains('blog-post-page')) return;
  if (link.hasAttribute('download') || (link.target && link.target !== '_self')) return;

  const destination = new URL(link.href);
  if (destination.origin !== window.location.origin) return;
  if (document.body.classList.contains('is-navigating-to-list')) {
    event.preventDefault();
    return;
  }

  event.preventDefault();
  document.body.classList.add('is-navigating-to-list');
  window.setTimeout(() => window.location.assign(destination.href), 180);
});

window.addEventListener('pageshow', () => {
  document.body.classList.remove('is-navigating-to-list');
});
