// 블로그 포스트 데이터
const blogPosts = [
  {
    id: 1,
    title: 'Ultra VNC를 이용한 원격제어 시스템 구축',
    category: 'DevOps',
    tags: ['VNC', 'Remote', 'Docker', 'noVNC'],
    date: '2024-11-25',
    thumbnail: 'images/vnc/UltraVNC.webp',
    excerpt: '오픈소스 원격 데스크톱 솔루션 Ultra VNC의 설치부터 Repeater, noVNC를 활용한 웹 기반 원격제어까지 완벽 가이드.',
    file: 'vnc-remote-control.md',
    readTime: '12분',
  },
  {
    id: 2,
    title: 'Google Fit API 완벽 가이드',
    category: 'Android',
    tags: ['Google Fit', 'Android', 'API', 'OAuth'],
    date: '2024-11-25',
    thumbnail: 'images/google-fit/logo.jpg',
    excerpt: 'Google Fit API의 구조와 활용법을 알아봅니다. Recording, Sensors, History API를 이용한 피트니스 데이터 수집 방법을 상세히 설명합니다.',
    file: 'google-fit.md',
    readTime: '8분',
  },
  {
    id: 3,
    title: '클린 아키텍처 검토 - Android 리팩토링',
    category: 'Android',
    tags: ['Clean Architecture', 'Refactoring', 'Kotlin', 'Compose'],
    date: '2024-11-25',
    thumbnail: 'images/clean-architecture/logo.jpeg',
    excerpt: '증가하는 사용자 요구사항에 유연하게 대처하기 위한 Legacy 소스의 Clean Architecture 기반 리팩토링 작업을 검토합니다.',
    file: 'clean-architecture.md',
    readTime: '10분',
  },
  {
    id: 4,
    title: 'WPF Application Data 파일',
    category: 'Windows',
    tags: ['WPF', 'C#', '.NET', 'XAML'],
    date: '2023-09-19',
    thumbnail: 'https://miro.medium.com/v2/resize:fit:1272/1*JoXc43sxqIa4oYIfwbFX7w.png',
    excerpt: 'WPF 애플리케이션에서 사용하는 Resource Files, Content Files, Site of Origin Files의 차이점과 활용 방법을 알아봅니다.',
    file: 'wpf-application-data-files.md',
    readTime: '5분',
  },
  {
    id: 5,
    title: '.NET 기반 WPF앱에서 Winform 사용하기',
    category: 'Windows',
    tags: ['WPF', 'WinForms', 'C#', '.NET'],
    date: '2023-10-26',
    thumbnail: 'https://miro.medium.com/v2/resize:fit:1400/1*08xD4YeCXecnwUf-aq8HIA.png',
    excerpt: 'WPF 프로젝트에서 Windows Forms를 함께 사용하는 방법을 알아봅니다. UseWindowsForms 설정만 추가하면 간단하게 해결됩니다.',
    file: 'wpf-winform-integration.md',
    readTime: '3분',
  },
  {
    id: 6,
    title: 'WPF 하이브리드앱 만들기',
    category: 'Windows',
    tags: ['WPF', 'CefSharp', 'Hybrid', '.NET'],
    date: '2023-10-11',
    thumbnail: 'https://miro.medium.com/v2/resize:fit:1272/1*712Z8jstt_PJW90M7_151w.png',
    excerpt: 'WPF 애플리케이션에 CefSharp을 활용하여 웹 브라우징 기능을 추가하는 방법을 알아봅니다. Nuget을 통한 설치부터 구현까지 상세히 설명합니다.',
    file: 'wpf-hybrid-app.md',
    readTime: '4분',
  },
  {
    id: 7,
    title: '갤럭시워치3 (Tizen) CLI 사용법',
    category: 'Tizen',
    tags: ['Tizen', 'Galaxy Watch', 'CLI', 'Samsung'],
    date: '2022-04-24',
    thumbnail: 'https://miro.medium.com/v2/resize:fit:1400/1*SoubQ3pQdm4jTIq8N0-eGg.png',
    excerpt: 'Tizen Studio CLI를 활용하여 갤럭시워치3 앱을 빌드, 패키징, 설치하는 전체 과정을 명령어 기반으로 상세히 설명합니다.',
    file: 'galaxy-watch-tizen-cli.md',
    readTime: '3분',
  },
];

// 카테고리 목록 추출
const categories = ['전체', ...new Set(blogPosts.map((post) => post.category))];

// 카테고리별 포스트 수 계산
function getCategoryCount(category) {
  if (category === '전체') return blogPosts.length;
  return blogPosts.filter((post) => post.category === category).length;
}
