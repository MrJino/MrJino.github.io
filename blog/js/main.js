// 현재 선택된 카테고리
let selectedCategory = '전체';
let filteredPosts = [...blogPosts];

// 초기화
document.addEventListener('DOMContentLoaded', () => {
  renderCategories();
  renderBlogGrid();
});

// 카테고리 렌더링
function renderCategories() {
  const categoryNav = document.getElementById('categoryNav');

  categoryNav.innerHTML = categories.map(category => {
    const count = getCategoryCount(category);
    const isActive = category === selectedCategory;

    return `
      <button
        onclick="selectCategory('${category}')"
        class="category-item ${isActive ? 'active' : ''} w-full text-left px-4 py-3 rounded-lg flex items-center justify-between"
      >
        <span class="text-gray-700">${category}</span>
        <span class="text-sm text-gray-500">${count}</span>
      </button>
    `;
  }).join('');
}

// 카테고리 선택
function selectCategory(category) {
  selectedCategory = category;
  filterPosts();
  renderCategories();
  updateCategoryTitle();
}

// 포스트 필터링
function filterPosts() {
  const searchTerm = document.getElementById('searchInput').value.toLowerCase();

  filteredPosts = blogPosts.filter(post => {
    // 카테고리 필터
    const categoryMatch = selectedCategory === '전체' || post.category === selectedCategory;

    // 검색어 필터
    const searchMatch = searchTerm === '' ||
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm));

    return categoryMatch && searchMatch;
  });

  renderBlogGrid();
}

// 검색
function searchPosts(query) {
  filterPosts();
}

// 카테고리 제목 업데이트
function updateCategoryTitle() {
  const categoryTitle = document.getElementById('categoryTitle');
  const categoryCount = document.getElementById('categoryCount');

  categoryTitle.textContent = selectedCategory === '전체' ? '전체 글' : selectedCategory;
  categoryCount.textContent = `${filteredPosts.length}개의 글`;
}

// 블로그 그리드 렌더링
function renderBlogGrid() {
  const blogGrid = document.getElementById('blogGrid');
  const emptyState = document.getElementById('emptyState');

  if (filteredPosts.length === 0) {
    blogGrid.classList.add('hidden');
    emptyState.classList.remove('hidden');
    return;
  }

  blogGrid.classList.remove('hidden');
  emptyState.classList.add('hidden');

  blogGrid.innerHTML = filteredPosts.map(post => `
    <article class="blog-card bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden cursor-pointer"
             onclick="goToPost(${post.id})">
      <!-- Thumbnail -->
      <div class="aspect-video ${post.thumbnail ? '' : 'bg-gradient-to-br ' + getGradient(post.category)} relative overflow-hidden">
        ${post.thumbnail ? `
          <img src="${post.thumbnail}" alt="${post.title}" class="w-full h-full object-cover" />
        ` : `
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-white text-2xl font-bold">${post.category}</span>
          </div>
        `}
      </div>

      <!-- Content -->
      <div class="p-5">
        <!-- Category & Date -->
        <div class="flex items-center justify-between mb-3">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
            ${post.category}
          </span>
          <span class="text-sm text-gray-500">${formatDate(post.date)}</span>
        </div>

        <!-- Title -->
        <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
          ${post.title}
        </h3>

        <!-- Excerpt -->
        <p class="text-gray-600 text-sm mb-4 line-clamp-2">
          ${post.excerpt}
        </p>

        <!-- Tags & Read Time -->
        <div class="flex items-center justify-between">
          <div class="flex gap-2 flex-wrap">
            ${post.tags.slice(0, 2).map(tag => `
              <span class="tag bg-gray-100 text-gray-600 hover:bg-gray-200">
                #${tag}
              </span>
            `).join('')}
          </div>
          <span class="text-xs text-gray-500 flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            ${post.readTime}
          </span>
        </div>
      </div>
    </article>
  `).join('');

  updateCategoryTitle();
}

// 포스트 상세 페이지로 이동
function goToPost(postId) {
  window.location.href = `post.html?id=${postId}`;
}

// 날짜 포맷
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
}

// 카테고리별 그라디언트 색상
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
    'Performance': 'from-purple-400 to-violet-500'
  };

  return gradients[category] || 'from-gray-400 to-gray-600';
}
