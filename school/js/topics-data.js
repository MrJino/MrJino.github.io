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
  },
  {
    id: 'nodejs-backend',
    title: 'Node.js & Express',
    description: 'JavaScript 기반 백엔드 개발',
    icon: '🚀',
    color: 'from-green-600 to-teal-500',
    totalPosts: 5,
    completedPosts: 0,
    posts: [
      {
        id: 1,
        title: 'Node.js 시작하기',
        completed: false,
        file: 'nodejs-backend-01.md',
        description: 'Node.js 설치와 npm 패키지 관리'
      },
      {
        id: 2,
        title: 'Express 서버 구축',
        completed: false,
        file: 'nodejs-backend-02.md',
        description: 'Express 프레임워크로 REST API 만들기'
      },
      {
        id: 3,
        title: 'Middleware 이해하기',
        completed: false,
        file: 'nodejs-backend-03.md',
        description: '요청 처리 파이프라인과 미들웨어'
      },
      {
        id: 4,
        title: 'MongoDB 연동',
        completed: false,
        file: 'nodejs-backend-04.md',
        description: 'Mongoose를 활용한 데이터베이스 연동'
      },
      {
        id: 5,
        title: '인증과 보안',
        completed: false,
        file: 'nodejs-backend-05.md',
        description: 'JWT 기반 인증과 보안 설정'
      }
    ]
  },
  {
    id: 'database-sql',
    title: 'Database & SQL',
    description: '데이터베이스 설계와 SQL 쿼리',
    icon: '💾',
    color: 'from-blue-600 to-indigo-600',
    totalPosts: 5,
    completedPosts: 0,
    posts: [
      {
        id: 1,
        title: 'SQL 기본 문법',
        completed: false,
        file: 'database-sql-01.md',
        description: 'SELECT, INSERT, UPDATE, DELETE 마스터'
      },
      {
        id: 2,
        title: 'JOIN과 관계',
        completed: false,
        file: 'database-sql-02.md',
        description: '테이블 간 관계와 JOIN 연산'
      },
      {
        id: 3,
        title: '인덱스와 성능 최적화',
        completed: false,
        file: 'database-sql-03.md',
        description: '쿼리 성능을 향상시키는 인덱스'
      },
      {
        id: 4,
        title: '트랜잭션과 ACID',
        completed: false,
        file: 'database-sql-04.md',
        description: '데이터 무결성을 위한 트랜잭션'
      },
      {
        id: 5,
        title: '정규화와 DB 설계',
        completed: false,
        file: 'database-sql-05.md',
        description: '효율적인 데이터베이스 스키마 설계'
      }
    ]
  },
  {
    id: 'docker-kubernetes',
    title: 'Docker & Kubernetes',
    description: '컨테이너 기반 개발과 배포',
    icon: '🐳',
    color: 'from-cyan-500 to-blue-600',
    totalPosts: 5,
    completedPosts: 0,
    posts: [
      {
        id: 1,
        title: 'Docker 기초',
        completed: false,
        file: 'docker-kubernetes-01.md',
        description: 'Docker 이미지와 컨테이너 개념'
      },
      {
        id: 2,
        title: 'Dockerfile 작성',
        completed: false,
        file: 'docker-kubernetes-02.md',
        description: '커스텀 이미지 빌드와 최적화'
      },
      {
        id: 3,
        title: 'Docker Compose',
        completed: false,
        file: 'docker-kubernetes-03.md',
        description: '멀티 컨테이너 애플리케이션 관리'
      },
      {
        id: 4,
        title: 'Kubernetes 기본',
        completed: false,
        file: 'docker-kubernetes-04.md',
        description: 'Pod, Service, Deployment 이해하기'
      },
      {
        id: 5,
        title: 'K8s 배포 전략',
        completed: false,
        file: 'docker-kubernetes-05.md',
        description: '무중단 배포와 스케일링'
      }
    ]
  },
  {
    id: 'python-basics',
    title: 'Python 프로그래밍',
    description: 'Python 기초부터 실전까지',
    icon: '🐍',
    color: 'from-yellow-600 to-green-600',
    totalPosts: 5,
    completedPosts: 0,
    posts: [
      {
        id: 1,
        title: 'Python 기본 문법',
        completed: false,
        file: 'python-basics-01.md',
        description: '변수, 자료형, 제어문 마스터'
      },
      {
        id: 2,
        title: '함수와 모듈',
        completed: false,
        file: 'python-basics-02.md',
        description: '함수 정의와 모듈 시스템'
      },
      {
        id: 3,
        title: '클래스와 객체',
        completed: false,
        file: 'python-basics-03.md',
        description: '객체 지향 프로그래밍 기초'
      },
      {
        id: 4,
        title: '파일 처리와 예외',
        completed: false,
        file: 'python-basics-04.md',
        description: '파일 입출력과 예외 처리'
      },
      {
        id: 5,
        title: '라이브러리 활용',
        completed: false,
        file: 'python-basics-05.md',
        description: 'NumPy, Pandas 등 주요 라이브러리'
      }
    ]
  },
  {
    id: 'testing',
    title: '테스트 자동화',
    description: '단위 테스트부터 E2E 테스트까지',
    icon: '✅',
    color: 'from-emerald-500 to-green-600',
    totalPosts: 5,
    completedPosts: 0,
    posts: [
      {
        id: 1,
        title: '테스트의 중요성',
        completed: false,
        file: 'testing-01.md',
        description: '왜 테스트를 작성해야 하는가'
      },
      {
        id: 2,
        title: 'JUnit 단위 테스트',
        completed: false,
        file: 'testing-02.md',
        description: 'Android JUnit을 활용한 단위 테스트'
      },
      {
        id: 3,
        title: 'Mockito로 Mocking',
        completed: false,
        file: 'testing-03.md',
        description: '의존성을 모킹하여 테스트하기'
      },
      {
        id: 4,
        title: 'UI 테스트',
        completed: false,
        file: 'testing-04.md',
        description: 'Espresso를 활용한 UI 테스트'
      },
      {
        id: 5,
        title: 'TDD 실전',
        completed: false,
        file: 'testing-05.md',
        description: '테스트 주도 개발 방법론'
      }
    ]
  },
  {
    id: 'algorithms',
    title: '알고리즘 & 자료구조',
    description: '코딩 테스트 대비 필수 알고리즘',
    icon: '🧮',
    color: 'from-pink-500 to-rose-600',
    totalPosts: 5,
    completedPosts: 0,
    posts: [
      {
        id: 1,
        title: '시간 복잡도와 Big-O',
        completed: false,
        file: 'algorithms-01.md',
        description: '알고리즘 효율성 분석하기'
      },
      {
        id: 2,
        title: '배열과 리스트',
        completed: false,
        file: 'algorithms-02.md',
        description: '기본 자료구조와 활용법'
      },
      {
        id: 3,
        title: '스택과 큐',
        completed: false,
        file: 'algorithms-03.md',
        description: 'LIFO와 FIFO 자료구조'
      },
      {
        id: 4,
        title: '정렬 알고리즘',
        completed: false,
        file: 'algorithms-04.md',
        description: '버블, 퀵, 병합 정렬 이해하기'
      },
      {
        id: 5,
        title: '트리와 그래프',
        completed: false,
        file: 'algorithms-05.md',
        description: '비선형 자료구조와 탐색 알고리즘'
      }
    ]
  }
];
