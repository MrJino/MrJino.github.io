// 현재 포스트 ID
let currentPostId = null;
let currentPost = null;

// 초기화
document.addEventListener('DOMContentLoaded', async () => {
  // URL에서 포스트 ID 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  currentPostId = parseInt(urlParams.get('id'));

  if (!currentPostId) {
    alert('포스트를 찾을 수 없습니다.');
    goBack();
    return;
  }

  // 포스트 데이터 찾기
  currentPost = blogPosts.find((post) => post.id === currentPostId);

  if (!currentPost) {
    alert('포스트를 찾을 수 없습니다.');
    goBack();
    return;
  }

  // 포스트 렌더링
  renderPost();
  await loadMarkdownContent();
  updateNavigation();
});

// 포스트 렌더링
function renderPost() {
  // 제목 설정
  document.title = `${currentPost.title} | Tech Blog`;

  // 카테고리
  const categoryEl = document.getElementById('postCategory');
  categoryEl.textContent = currentPost.category;

  // 날짜
  const dateEl = document.getElementById('postDate');
  dateEl.textContent = formatDate(currentPost.date);

  // 읽기 시간
  const readTimeEl = document.getElementById('postReadTime');
  readTimeEl.innerHTML = `
    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
    ${currentPost.readTime}
  `;

  // 제목
  const titleEl = document.getElementById('postTitle');
  titleEl.textContent = currentPost.title;

  // 태그
  const tagsEl = document.getElementById('postTags');
  tagsEl.innerHTML = currentPost.tags
    .map(
      (tag) => `
    <span class="tag bg-gray-100 text-gray-600 hover:bg-gray-200">
      #${tag}
    </span>
  `
    )
    .join('');

  // 썸네일
  const thumbnailEl = document.getElementById('postThumbnail');
  if (currentPost.thumbnail) {
    thumbnailEl.className = 'w-full aspect-video overflow-hidden';
    thumbnailEl.innerHTML = `
      <img src="${currentPost.thumbnail}" alt="${currentPost.title}" class="w-full h-full object-cover" />
    `;
  } else {
    thumbnailEl.className = `w-full aspect-video bg-gradient-to-br ${getGradient(currentPost.category)} flex items-center justify-center`;
    thumbnailEl.innerHTML = `
      <span class="text-white text-3xl font-bold">${currentPost.category}</span>
    `;
  }
}

// 마크다운 콘텐츠 로드
async function loadMarkdownContent() {
  const contentEl = document.getElementById('postContent');

  try {
    const response = await fetch(`posts/${currentPost.file}`);
    if (!response.ok) {
      throw new Error('Failed to load content');
    }

    const markdown = await response.text();
    contentEl.innerHTML = marked.parse(markdown);
  } catch (error) {
    console.error('Error loading markdown:', error);
    contentEl.innerHTML = `
      <div class="text-center py-12">
        <p class="text-gray-500">콘텐츠를 불러올 수 없습니다.</p>
      </div>
    `;
  }
}

// 네비게이션 업데이트
function updateNavigation() {
  const currentIndex = blogPosts.findIndex((post) => post.id === currentPostId);
  const prevButton = document.getElementById('prevPost');
  const nextButton = document.getElementById('nextPost');

  // 이전 글
  if (currentIndex > 0) {
    prevButton.disabled = false;
    prevButton.onclick = () => navigatePost('prev');
  } else {
    prevButton.disabled = true;
  }

  // 다음 글
  if (currentIndex < blogPosts.length - 1) {
    nextButton.disabled = false;
    nextButton.onclick = () => navigatePost('next');
  } else {
    nextButton.disabled = true;
  }
}

// 포스트 네비게이션
function navigatePost(direction) {
  const currentIndex = blogPosts.findIndex((post) => post.id === currentPostId);
  let newIndex;

  if (direction === 'prev') {
    newIndex = currentIndex - 1;
  } else {
    newIndex = currentIndex + 1;
  }

  if (newIndex >= 0 && newIndex < blogPosts.length) {
    const newPostId = blogPosts[newIndex].id;
    window.location.href = `post.html?id=${newPostId}`;
  }
}

// 목록으로 돌아가기
function goBack() {
  window.location.href = 'index.html';
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
    JavaScript: 'from-yellow-400 to-orange-500',
    React: 'from-blue-400 to-cyan-500',
    'Node.js': 'from-green-400 to-emerald-500',
    TypeScript: 'from-blue-500 to-purple-600',
    CSS: 'from-pink-400 to-rose-500',
    DevOps: 'from-sky-400 to-blue-500',
    Backend: 'from-orange-400 to-amber-500',
    Git: 'from-red-500 to-pink-500',
    Database: 'from-emerald-400 to-green-500',
    AWS: 'from-orange-500 to-red-500',
    'Build Tools': 'from-cyan-400 to-teal-500',
    Performance: 'from-purple-400 to-violet-500',
  };

  return gradients[category] || 'from-gray-400 to-gray-600';
}

// 카테고리 개수 가져오기
function getCategoryCount(category) {
  if (category === '전체') {
    return blogPosts.length;
  }
  return blogPosts.filter((post) => post.category === category).length;
}
