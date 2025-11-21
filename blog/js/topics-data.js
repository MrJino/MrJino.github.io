// 블로그 토픽 데이터
const topics = [
  {
    id: 'android-basics',
    title: 'Android 기초',
    description: 'Android 앱 개발의 기본 개념부터 실전까지',
    icon: '📱',
    color: 'from-green-500 to-emerald-500',
    totalPosts: 5,
    completedPosts: 0,
    posts: [
      {
        id: 1,
        title: 'Android 개발 환경 설정',
        completed: false,
        file: 'android-basics-01.md',
        description: 'Android Studio 설치부터 첫 프로젝트 생성까지'
      },
      {
        id: 2,
        title: 'Activity 생명주기 이해하기',
        completed: false,
        file: 'android-basics-02.md',
        description: 'Activity의 생명주기와 상태 관리 방법'
      },
      {
        id: 3,
        title: 'View와 ViewGroup',
        completed: false,
        file: 'android-basics-03.md',
        description: 'Android UI의 기본 구성 요소 이해하기'
      },
      {
        id: 4,
        title: 'Intent와 데이터 전달',
        completed: false,
        file: 'android-basics-04.md',
        description: 'Activity 간 데이터 전달과 Intent 활용법'
      },
      {
        id: 5,
        title: 'RecyclerView 활용하기',
        completed: false,
        file: 'android-basics-05.md',
        description: '효율적인 리스트 구현을 위한 RecyclerView'
      }
    ]
  },
  {
    id: 'kotlin-basics',
    title: 'Kotlin 프로그래밍',
    description: 'Kotlin 언어의 핵심 문법과 고급 기능',
    icon: '🎯',
    color: 'from-purple-500 to-pink-500',
    totalPosts: 5,
    completedPosts: 0,
    posts: [
      {
        id: 1,
        title: 'Kotlin 기본 문법',
        completed: false,
        file: 'kotlin-basics-01.md',
        description: '변수, 함수, 클래스 등 Kotlin의 기본 문법'
      },
      {
        id: 2,
        title: 'null 안정성',
        completed: false,
        file: 'kotlin-basics-02.md',
        description: 'Nullable 타입과 안전한 null 처리'
      },
      {
        id: 3,
        title: '람다와 고차 함수',
        completed: false,
        file: 'kotlin-basics-03.md',
        description: '함수형 프로그래밍의 핵심 개념'
      },
      {
        id: 4,
        title: 'Coroutine 기초',
        completed: false,
        file: 'kotlin-basics-04.md',
        description: '비동기 프로그래밍을 위한 Coroutine'
      },
      {
        id: 5,
        title: 'Flow와 비동기 처리',
        completed: false,
        file: 'kotlin-basics-05.md',
        description: 'Flow를 활용한 비동기 데이터 스트림'
      }
    ]
  },
  {
    id: 'jetpack-compose',
    title: 'Jetpack Compose',
    description: '선언형 UI 프레임워크 완전 정복',
    icon: '🎨',
    color: 'from-blue-500 to-cyan-500',
    totalPosts: 5,
    completedPosts: 0,
    posts: [
      {
        id: 1,
        title: 'Compose 시작하기',
        completed: false,
        file: 'jetpack-compose-01.md',
        description: 'Jetpack Compose의 기본 개념과 첫 화면 만들기'
      },
      {
        id: 2,
        title: 'State와 Recomposition',
        completed: false,
        file: 'jetpack-compose-02.md',
        description: 'State 관리와 UI 업데이트 메커니즘'
      },
      {
        id: 3,
        title: 'Layout 구성하기',
        completed: false,
        file: 'jetpack-compose-03.md',
        description: 'Row, Column, Box를 활용한 레이아웃'
      },
      {
        id: 4,
        title: 'Navigation 구현',
        completed: false,
        file: 'jetpack-compose-04.md',
        description: 'Navigation Component로 화면 전환하기'
      },
      {
        id: 5,
        title: '애니메이션과 제스처',
        completed: false,
        file: 'jetpack-compose-05.md',
        description: '부드러운 애니메이션과 터치 제스처 구현'
      }
    ]
  },
  {
    id: 'web-frontend',
    title: 'Web Frontend',
    description: 'HTML, CSS, JavaScript부터 React까지',
    icon: '🌐',
    color: 'from-yellow-500 to-orange-500',
    totalPosts: 5,
    completedPosts: 0,
    posts: [
      {
        id: 1,
        title: 'HTML5 기본',
        completed: false,
        file: 'web-frontend-01.md',
        description: 'HTML5의 시맨틱 태그와 구조'
      },
      {
        id: 2,
        title: 'CSS Flexbox와 Grid',
        completed: false,
        file: 'web-frontend-02.md',
        description: '현대적인 레이아웃 시스템 마스터하기'
      },
      {
        id: 3,
        title: 'JavaScript ES6+',
        completed: false,
        file: 'web-frontend-03.md',
        description: '최신 JavaScript 문법과 기능'
      },
      {
        id: 4,
        title: 'React 시작하기',
        completed: false,
        file: 'web-frontend-04.md',
        description: 'React의 기본 개념과 컴포넌트'
      },
      {
        id: 5,
        title: 'React Hooks',
        completed: false,
        file: 'web-frontend-05.md',
        description: 'useState, useEffect 등 핵심 Hooks'
      }
    ]
  },
  {
    id: 'git-github',
    title: 'Git & GitHub',
    description: '버전 관리와 협업의 기초',
    icon: '🔧',
    color: 'from-red-500 to-pink-500',
    totalPosts: 5,
    completedPosts: 0,
    posts: [
      {
        id: 1,
        title: 'Git 기본 명령어',
        completed: false,
        file: 'git-github-01.md',
        description: 'add, commit, push 등 필수 명령어'
      },
      {
        id: 2,
        title: '브랜치 전략',
        completed: false,
        file: 'git-github-02.md',
        description: 'Git Flow와 브랜치 관리 방법'
      },
      {
        id: 3,
        title: 'Pull Request 워크플로우',
        completed: false,
        file: 'git-github-03.md',
        description: '효과적인 코드 리뷰와 협업'
      },
      {
        id: 4,
        title: 'Conflict 해결하기',
        completed: false,
        file: 'git-github-04.md',
        description: '충돌 상황 이해하고 해결하기'
      },
      {
        id: 5,
        title: 'GitHub Actions',
        completed: false,
        file: 'git-github-05.md',
        description: 'CI/CD 자동화를 위한 GitHub Actions'
      }
    ]
  },
  {
    id: 'clean-architecture',
    title: 'Clean Architecture',
    description: '확장 가능한 앱 구조 설계',
    icon: '🏗️',
    color: 'from-indigo-500 to-purple-500',
    totalPosts: 5,
    completedPosts: 0,
    posts: [
      {
        id: 1,
        title: 'SOLID 원칙',
        completed: false,
        file: 'clean-architecture-01.md',
        description: '객체 지향 설계의 5가지 원칙'
      },
      {
        id: 2,
        title: 'Layer 분리하기',
        completed: false,
        file: 'clean-architecture-02.md',
        description: 'Presentation, Domain, Data 레이어'
      },
      {
        id: 3,
        title: 'Dependency Injection',
        completed: false,
        file: 'clean-architecture-03.md',
        description: 'Hilt를 활용한 의존성 주입'
      },
      {
        id: 4,
        title: 'Repository 패턴',
        completed: false,
        file: 'clean-architecture-04.md',
        description: '데이터 소스 추상화와 Repository'
      },
      {
        id: 5,
        title: 'Use Case 설계',
        completed: false,
        file: 'clean-architecture-05.md',
        description: '비즈니스 로직을 캡슐화하는 Use Case'
      }
    ]
  }
];
