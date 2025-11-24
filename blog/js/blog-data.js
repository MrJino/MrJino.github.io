// 블로그 포스트 데이터
const blogPosts = [
  {
    id: 1,
    title: 'Ultra VNC를 이용한 원격제어 시스템 구축',
    category: 'DevOps',
    tags: ['VNC', 'Remote', 'Docker', 'noVNC'],
    date: '2024-11-25',
    thumbnail: 'https://via.placeholder.com/400x250/0ea5e9/ffffff?text=VNC',
    excerpt: '오픈소스 원격 데스크톱 솔루션 Ultra VNC의 설치부터 Repeater, noVNC를 활용한 웹 기반 원격제어까지 완벽 가이드.',
    file: 'vnc-remote-control.md',
    readTime: '12분'
  }
];

// 카테고리 목록 추출
const categories = ['전체', ...new Set(blogPosts.map(post => post.category))];

// 카테고리별 포스트 수 계산
function getCategoryCount(category) {
  if (category === '전체') return blogPosts.length;
  return blogPosts.filter(post => post.category === category).length;
}
