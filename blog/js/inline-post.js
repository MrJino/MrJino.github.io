let inlineRequest = null;
let inlinePostId = null;
const blogListTitle = document.title;

function blogViewUrl(postId) {
  const url = new URL(window.location.href);
  url.searchParams.delete('id');
  if (postId) url.searchParams.set('id', postId);
  const query = document.getElementById('searchInput').value;
  if (query) url.searchParams.set('q', query); else url.searchParams.delete('q');
  if (selectedCategory !== '전체') url.searchParams.set('category', selectedCategory); else url.searchParams.delete('category');
  return url;
}

function showBlogList({ replace = false, updateHistory = true } = {}) {
  inlineRequest?.abort();
  inlinePostId = null;
  document.getElementById('inlinePost').hidden = true;
  document.getElementById('blogList').hidden = false;
  document.title = blogListTitle;
  if (updateHistory) {
    const url = blogViewUrl(null);
    if (url.href !== window.location.href) history[replace ? 'replaceState' : 'pushState'](null, '', url);
  }
}

async function openInlinePost(postId, { updateHistory = true, focus = true } = {}) {
  const post = blogPosts.find((item) => item.id === Number(postId));
  if (!post) { showBlogList({ replace: true }); return; }
  inlineRequest?.abort();
  const request = new AbortController();
  inlineRequest = request;
  if (updateHistory) {
    // Save the current filters on the list entry before adding a detail entry.
    history.replaceState(null, '', blogViewUrl(inlinePostId));
    history.pushState(null, '', blogViewUrl(post.id));
  }
  inlinePostId = post.id;
  document.getElementById('blogList').hidden = true;
  const detail = document.getElementById('inlinePost');
  detail.hidden = false;
  document.title = `${post.title} | Blog`;
  document.getElementById('postCategory').textContent = post.category;
  document.getElementById('postDate').textContent = formatDate(post.date);
  document.getElementById('postReadTime').textContent = post.readTime;
  const title = document.getElementById('postTitle');
  title.textContent = post.title;
  title.tabIndex = -1;
  document.getElementById('postTags').replaceChildren(...post.tags.map((tag) => {
    const span = document.createElement('span');
    span.className = 'tag bg-gray-100 text-gray-600';
    span.textContent = `#${tag}`;
    return span;
  }));
  const thumbnail = document.getElementById('postThumbnail');
  thumbnail.replaceChildren();
  thumbnail.className = 'w-full aspect-video overflow-hidden';
  if (post.thumbnail) {
    const image = document.createElement('img');
    image.src = post.thumbnail;
    image.alt = post.title;
    image.className = 'w-full h-full object-cover';
    thumbnail.append(image);
  } else {
    thumbnail.className += ` bg-gradient-to-br ${getGradient(post.category)} flex items-center justify-center`;
    const label = document.createElement('span');
    label.className = 'text-white text-3xl font-bold';
    label.textContent = post.category;
    thumbnail.append(label);
  }
  const index = blogPosts.indexOf(post);
  document.getElementById('prevPost').disabled = index === 0;
  document.getElementById('nextPost').disabled = index === blogPosts.length - 1;
  const content = document.getElementById('postContent');
  content.setAttribute('aria-busy', 'true');
  content.textContent = '내용을 불러오고 있습니다…';
  if (focus) {
    detail.scrollIntoView({ block: 'start', behavior: 'instant' });
    title.focus({ preventScroll: true });
  }
  try {
    const response = await fetch(`posts/${post.file}`, { signal: request.signal });
    if (!response.ok) throw new Error('Content unavailable');
    const markdown = await response.text();
    if (request.signal.aborted) return;
    content.innerHTML = marked.parse(markdown);
    content.querySelectorAll('table').forEach((table) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'table-scroll';
      wrapper.tabIndex = 0;
      wrapper.setAttribute('role', 'region');
      wrapper.setAttribute('aria-label', '표 — 가로 스크롤 가능');
      table.before(wrapper);
      wrapper.append(table);
    });
    enhanceCodeBlocks(content);
  } catch (error) {
    if (request.signal.aborted) return;
    content.textContent = '콘텐츠를 불러올 수 없습니다. ';
    const retry = document.createElement('button');
    retry.type = 'button';
    retry.textContent = '다시 시도';
    retry.addEventListener('click', () => openInlinePost(post.id, { updateHistory: false, focus: false }));
    content.append(retry);
  } finally {
    if (!request.signal.aborted) content.setAttribute('aria-busy', 'false');
  }
}

function navigateInlinePost(direction) {
  const index = blogPosts.findIndex((post) => post.id === inlinePostId);
  const next = blogPosts[index + (direction === 'prev' ? -1 : 1)];
  if (next) openInlinePost(next.id);
}

function restoreBlogView() {
  const params = new URLSearchParams(window.location.search);
  selectedCategory = categories.includes(params.get('category')) ? params.get('category') : '전체';
  document.getElementById('searchInput').value = params.get('q') || '';
  renderCategories();
  filterPosts();
  if (params.has('id')) openInlinePost(params.get('id'), { updateHistory: false, focus: false });
  else showBlogList({ updateHistory: false });
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('backToBlogList').addEventListener('click', () => {
    const previousId = inlinePostId;
    showBlogList();
    document.querySelector(`[data-post-id="${previousId}"]`)?.focus({ preventScroll: true });
    document.getElementById('blogList').scrollIntoView({ block: 'start', behavior: 'instant' });
  });
  document.querySelector('.blog-search').addEventListener('submit', (event) => {
    event.preventDefault();
    searchPosts();
  });
  restoreBlogView();
});
window.addEventListener('popstate', restoreBlogView);
