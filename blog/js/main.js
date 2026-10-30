const PAGE_SIZE = 12;

let selectedCategory = '전체';
let currentPage = 1;
let filteredPosts = [...blogPosts];

function getCategoryFromUrl() {
  const category = new URLSearchParams(window.location.search).get('category');
  return categories.includes(category) ? category : '전체';
}

function getPageFromUrl() {
  const page = Number.parseInt(new URLSearchParams(window.location.search).get('page') || '1', 10);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function updateListParameters({ replace = false } = {}) {
  const url = new URL(window.location.href);
  const searchTerm = document.getElementById('searchInput').value.trim();

  url.searchParams.delete('id');
  if (selectedCategory === '전체') url.searchParams.delete('category');
  else url.searchParams.set('category', selectedCategory);
  if (searchTerm) url.searchParams.set('q', searchTerm);
  else url.searchParams.delete('q');
  if (currentPage > 1) url.searchParams.set('page', String(currentPage));
  else url.searchParams.delete('page');

  if (url.href === window.location.href) return;
  window.history[replace ? 'replaceState' : 'pushState']({}, '', url);
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const linkedPost = blogPosts.find((post) => post.id === Number(params.get('id')));
  if (linkedPost) {
    window.location.replace(`articles/${linkedPost.file.replace(/\.md$/, '.html')}`);
    return;
  }

  const searchInput = document.getElementById('searchInput');
  searchInput.value = params.get('q') || '';
  selectedCategory = getCategoryFromUrl();
  currentPage = getPageFromUrl();

  document.getElementById('categoryNav').addEventListener('click', handleCategoryClick);
  document.getElementById('pagination').addEventListener('click', handlePaginationClick);
  document.querySelector('.blog-search').addEventListener('submit', (event) => {
    event.preventDefault();
    searchPosts();
  });
  renderCategories();

  const canKeepStaticFirstPage = selectedCategory === '전체' && searchInput.value === '' && currentPage === 1;
  filterPosts({ preserveGrid: canKeepStaticFirstPage });
});

window.addEventListener('popstate', () => {
  const params = new URLSearchParams(window.location.search);
  selectedCategory = getCategoryFromUrl();
  currentPage = getPageFromUrl();
  document.getElementById('searchInput').value = params.get('q') || '';
  renderCategories();
  filterPosts();
});

// 글 카드에서 본문으로 이동할 때만 짧은 전환을 적용한다.
document.addEventListener('click', (event) => {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const link = event.target instanceof Element ? event.target.closest('.blog-card__link') : null;
  if (!link || !document.getElementById('blogGrid')?.contains(link)) return;
  if (link.hasAttribute('download') || (link.target && link.target !== '_self')) return;

  const destination = new URL(link.href);
  if (destination.origin !== window.location.origin) return;
  if (document.body.classList.contains('is-navigating-to-article')) {
    event.preventDefault();
    return;
  }

  event.preventDefault();
  document.body.classList.add('is-navigating-to-article');
  window.setTimeout(() => window.location.assign(destination.href), 180);
});

// 뒤로 가기로 목록이 복원될 때 사라진 상태가 남지 않도록 한다.
window.addEventListener('pageshow', (event) => {
  document.body.classList.remove('is-navigating-to-article');
  if (event.persisted) {
    const grid = document.getElementById('blogGrid');
    grid.style.animation = 'none';
    void grid.offsetWidth;
    grid.style.animation = '';
  }
});

function renderCategories() {
  window.MrJinoBlogCategoryNav.render(document.getElementById('categoryNav'), selectedCategory);
}

function handleCategoryClick(event) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target instanceof Element ? event.target.closest('[data-category]') : null;
  if (!link || !document.getElementById('categoryNav').contains(link)) return;
  event.preventDefault();
  selectCategory(link.dataset.category);
}

function handlePaginationClick(event) {
  if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target instanceof Element ? event.target.closest('[data-page]') : null;
  if (!link || !document.getElementById('pagination').contains(link)) return;
  event.preventDefault();

  const page = Number.parseInt(link.dataset.page, 10);
  const totalPages = Math.ceil(filteredPosts.length / PAGE_SIZE);
  if (!Number.isInteger(page) || page < 1 || page > totalPages || page === currentPage) return;

  currentPage = page;
  updateListParameters();
  renderBlogGrid();
  document.getElementById('blogList').scrollIntoView({
    behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
    block: 'start',
  });
}

function selectCategory(category, updateUrl = true) {
  selectedCategory = category;
  currentPage = 1;
  filterPosts();
  renderCategories();
  if (updateUrl) updateListParameters();
}

function filterPosts({ preserveGrid = false } = {}) {
  const searchTerm = document.getElementById('searchInput').value.trim().toLowerCase();
  const requestedPage = currentPage;

  filteredPosts = blogPosts.filter(post => {
    const categoryMatch = selectedCategory === '전체' || post.category === selectedCategory;
    const searchMatch = searchTerm === '' ||
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm));

    return categoryMatch && searchMatch;
  });

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  currentPage = Math.min(currentPage, totalPages);
  if (currentPage !== requestedPage) updateListParameters({ replace: true });

  if (preserveGrid) {
    updateCategoryTitle();
    renderPagination();
    return;
  }
  renderBlogGrid();
}

function searchPosts() {
  currentPage = 1;
  filterPosts();
  updateListParameters({ replace: true });
}

function updateCategoryTitle() {
  const categoryTitle = document.getElementById('categoryTitle');
  const categoryCount = document.getElementById('categoryCount');

  categoryTitle.textContent = selectedCategory === '전체' ? '전체 글' : selectedCategory;
  categoryCount.textContent = `${filteredPosts.length}개의 글`;
}

function renderBlogGrid() {
  const blogGrid = document.getElementById('blogGrid');
  const emptyState = document.getElementById('emptyState');
  updateCategoryTitle();

  if (filteredPosts.length === 0) {
    blogGrid.classList.add('hidden');
    emptyState.classList.remove('hidden');
    renderPagination();
    return;
  }

  blogGrid.classList.remove('hidden');
  emptyState.classList.add('hidden');

  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pagePosts = filteredPosts.slice(pageStart, pageStart + PAGE_SIZE);
  blogGrid.innerHTML = pagePosts.map((post, index) => renderBlogCard(post, index)).join('');
  renderPagination();
}

function renderBlogCard(post, index) {
  const imageLoading = index === 0 ? 'eager' : 'lazy';
  const imagePriority = index === 0 ? ' fetchpriority="high"' : '';

  return `
    <article class="blog-card bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <a href="articles/${post.file.replace(/\.md$/, '.html')}" class="blog-card__link block h-full">
      <div class="aspect-video ${post.thumbnail ? '' : 'bg-gradient-to-br ' + getGradient(post.category)} relative overflow-hidden">
        ${post.thumbnail ? `
          <img src="${post.thumbnail}" alt="" width="640" height="360" loading="${imageLoading}" decoding="async"${imagePriority} class="w-full h-full object-cover" />
        ` : `
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-white text-2xl font-bold">${post.category}</span>
          </div>
        `}
      </div>
      <div class="p-5">
        <div class="flex items-center justify-between mb-3">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            ${post.category}
          </span>
          <time datetime="${post.date}" class="text-sm text-gray-500">${formatDate(post.date)}</time>
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
          ${post.title}
        </h3>
        <p class="text-gray-600 text-sm mb-4 line-clamp-2">
          ${post.excerpt}
        </p>
        <div class="flex items-center justify-between">
          <div class="flex gap-2 flex-wrap">
            ${post.tags.slice(0, 2).map(tag => `
              <span class="tag bg-gray-100 text-gray-600 hover:bg-gray-200">#${tag}</span>
            `).join('')}
          </div>
          <span class="text-xs text-gray-500">${post.readTime}</span>
        </div>
      </div>
      </a>
    </article>
  `;
}

function getPaginationItems(totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, index) => index + 1);

  const visiblePages = new Set([1, totalPages, currentPage - 1, currentPage, currentPage + 1]);
  const pages = [...visiblePages].filter(page => page >= 1 && page <= totalPages).sort((a, b) => a - b);
  const items = [];

  pages.forEach((page, index) => {
    if (index > 0 && page - pages[index - 1] > 1) items.push(null);
    items.push(page);
  });
  return items;
}

function pageUrl(page) {
  const url = new URL(window.location.href);
  const searchTerm = document.getElementById('searchInput').value.trim();

  url.searchParams.delete('id');
  if (selectedCategory === '전체') url.searchParams.delete('category');
  else url.searchParams.set('category', selectedCategory);
  if (searchTerm) url.searchParams.set('q', searchTerm);
  else url.searchParams.delete('q');
  if (page > 1) url.searchParams.set('page', String(page));
  else url.searchParams.delete('page');
  return `${url.pathname}${url.search}${url.hash}`;
}

function renderPagination() {
  const pagination = document.getElementById('pagination');
  const totalPages = Math.ceil(filteredPosts.length / PAGE_SIZE);
  pagination.hidden = totalPages <= 1;
  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }

  const previous = currentPage > 1
    ? `<a href="${pageUrl(currentPage - 1)}" data-page="${currentPage - 1}" class="blog-pagination__control">이전</a>`
    : '<span class="blog-pagination__control is-disabled" aria-disabled="true">이전</span>';
  const next = currentPage < totalPages
    ? `<a href="${pageUrl(currentPage + 1)}" data-page="${currentPage + 1}" class="blog-pagination__control">다음</a>`
    : '<span class="blog-pagination__control is-disabled" aria-disabled="true">다음</span>';
  const pages = getPaginationItems(totalPages).map((page, index) => page === null
    ? `<span class="blog-pagination__ellipsis" aria-hidden="true" data-gap="${index}">…</span>`
    : `<a href="${pageUrl(page)}" data-page="${page}" class="blog-pagination__page${page === currentPage ? ' is-active' : ''}"${page === currentPage ? ' aria-current="page"' : ''}>${page}</a>`
  ).join('');

  pagination.innerHTML = `${previous}<span class="blog-pagination__pages">${pages}</span>${next}`;
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

function getGradient(category) {
  const gradients = {
    'JavaScript': 'from-yellow-400 to-orange-500',
    'React': 'from-blue-400 to-cyan-500',
    'Node.js': 'from-green-400 to-emerald-500',
    'TypeScript': 'from-blue-500 to-purple-600',
    'CSS': 'from-pink-400 to-rose-500',
    'DevOps': 'from-sky-400 to-blue-500',
    'Backend': 'from-orange-400 to-amber-500',
    'Git': 'from-red-500 to-pink-500',
    'Database': 'from-emerald-400 to-green-500',
    'AWS': 'from-orange-500 to-red-500',
    'Build Tools': 'from-cyan-400 to-teal-500',
    'Performance': 'from-purple-400 to-violet-500',
    '과학': 'from-purple-400 to-violet-500',
    '심리': 'from-emerald-400 to-teal-500',
    'Ubuntu': 'from-orange-400 to-red-500',
  };

  return gradients[category] || 'from-gray-400 to-gray-600';
}
