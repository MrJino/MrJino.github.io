// 블로그 포스트 데이터
const blogPosts = [
  {
    id: 1,
    title: 'JavaScript ES6+ 핵심 문법 정리',
    category: 'JavaScript',
    tags: ['JavaScript', 'ES6', 'Frontend'],
    date: '2024-11-20',
    thumbnail: 'https://via.placeholder.com/400x250/3b82f6/ffffff?text=JavaScript',
    excerpt: 'let, const, 화살표 함수, 구조 분해 할당 등 최신 JavaScript 문법을 한눈에 정리했습니다.',
    file: 'javascript-es6.md',
    readTime: '5분'
  },
  {
    id: 2,
    title: 'React Hooks 완벽 가이드',
    category: 'React',
    tags: ['React', 'Hooks', 'Frontend'],
    date: '2024-11-18',
    thumbnail: 'https://via.placeholder.com/400x250/06b6d4/ffffff?text=React',
    excerpt: 'useState, useEffect, useContext 등 React Hooks의 모든 것을 설명합니다.',
    file: 'react-hooks-guide.md',
    readTime: '8분'
  },
  {
    id: 3,
    title: 'Node.js 비동기 프로그래밍',
    category: 'Node.js',
    tags: ['Node.js', 'Backend', 'Async'],
    date: '2024-11-15',
    thumbnail: 'https://via.placeholder.com/400x250/10b981/ffffff?text=Node.js',
    excerpt: 'Callback, Promise, async/await을 활용한 비동기 처리 방법을 알아봅니다.',
    file: 'nodejs-async.md',
    readTime: '7분'
  },
  {
    id: 4,
    title: 'Docker 기초부터 실전까지',
    category: 'DevOps',
    tags: ['Docker', 'DevOps', 'Container'],
    date: '2024-11-12',
    thumbnail: 'https://via.placeholder.com/400x250/0ea5e9/ffffff?text=Docker',
    excerpt: 'Docker 이미지 만들기부터 Docker Compose까지 실전 활용법을 다룹니다.',
    file: 'docker-basics.md',
    readTime: '10분'
  },
  {
    id: 5,
    title: 'TypeScript 타입 시스템 이해하기',
    category: 'TypeScript',
    tags: ['TypeScript', 'JavaScript', 'Type'],
    date: '2024-11-10',
    thumbnail: 'https://via.placeholder.com/400x250/8b5cf6/ffffff?text=TypeScript',
    excerpt: 'TypeScript의 강력한 타입 시스템을 활용하여 안전한 코드를 작성하는 방법입니다.',
    file: 'typescript-types.md',
    readTime: '6분'
  },
  {
    id: 6,
    title: 'RESTful API 설계 원칙',
    category: 'Backend',
    tags: ['API', 'REST', 'Backend'],
    date: '2024-11-08',
    thumbnail: 'https://via.placeholder.com/400x250/f59e0b/ffffff?text=REST+API',
    excerpt: '좋은 RESTful API를 설계하기 위한 핵심 원칙과 베스트 프랙티스를 소개합니다.',
    file: 'restful-api.md',
    readTime: '9분'
  },
  {
    id: 7,
    title: 'Git 브랜치 전략과 협업',
    category: 'Git',
    tags: ['Git', 'GitHub', 'Collaboration'],
    date: '2024-11-05',
    thumbnail: 'https://via.placeholder.com/400x250/ef4444/ffffff?text=Git',
    excerpt: 'Git Flow, GitHub Flow 등 효과적인 브랜치 전략과 팀 협업 방법을 알아봅니다.',
    file: 'git-branching.md',
    readTime: '7분'
  },
  {
    id: 8,
    title: 'CSS Flexbox 완전 정복',
    category: 'CSS',
    tags: ['CSS', 'Flexbox', 'Layout'],
    date: '2024-11-03',
    thumbnail: 'https://via.placeholder.com/400x250/ec4899/ffffff?text=CSS+Flexbox',
    excerpt: 'Flexbox의 모든 속성을 이해하고 실전에서 활용하는 방법을 배웁니다.',
    file: 'css-flexbox.md',
    readTime: '8분'
  },
  {
    id: 9,
    title: 'MongoDB 기초와 CRUD 연산',
    category: 'Database',
    tags: ['MongoDB', 'NoSQL', 'Database'],
    date: '2024-11-01',
    thumbnail: 'https://via.placeholder.com/400x250/22c55e/ffffff?text=MongoDB',
    excerpt: 'MongoDB의 기본 개념과 데이터 생성, 조회, 수정, 삭제 방법을 다룹니다.',
    file: 'mongodb-basics.md',
    readTime: '6분'
  },
  {
    id: 10,
    title: 'AWS EC2 인스턴스 배포하기',
    category: 'AWS',
    tags: ['AWS', 'EC2', 'Cloud'],
    date: '2024-10-28',
    thumbnail: 'https://via.placeholder.com/400x250/f97316/ffffff?text=AWS+EC2',
    excerpt: 'AWS EC2 인스턴스를 생성하고 웹 애플리케이션을 배포하는 전체 과정을 설명합니다.',
    file: 'aws-ec2-deployment.md',
    readTime: '12분'
  },
  {
    id: 11,
    title: 'Webpack 설정 가이드',
    category: 'Build Tools',
    tags: ['Webpack', 'Build', 'Frontend'],
    date: '2024-10-25',
    thumbnail: 'https://via.placeholder.com/400x250/06b6d4/ffffff?text=Webpack',
    excerpt: '프로젝트에 맞는 Webpack 설정 방법과 최적화 팁을 공유합니다.',
    file: 'webpack-config.md',
    readTime: '10분'
  },
  {
    id: 12,
    title: '웹 성능 최적화 기법',
    category: 'Performance',
    tags: ['Performance', 'Optimization', 'Web'],
    date: '2024-10-22',
    thumbnail: 'https://via.placeholder.com/400x250/a855f7/ffffff?text=Performance',
    excerpt: '웹 사이트의 로딩 속도를 개선하는 다양한 성능 최적화 기법을 소개합니다.',
    file: 'web-performance.md',
    readTime: '11분'
  }
];

// 카테고리 목록 추출
const categories = ['전체', ...new Set(blogPosts.map(post => post.category))];

// 카테고리별 포스트 수 계산
function getCategoryCount(category) {
  if (category === '전체') return blogPosts.length;
  return blogPosts.filter(post => post.category === category).length;
}
