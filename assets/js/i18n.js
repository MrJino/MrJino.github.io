(() => {
  const STORAGE_KEY = 'mrjino-language';
  const savedLanguage = localStorage.getItem(STORAGE_KEY);
  const browserLocales = navigator.languages?.length ? navigator.languages : [navigator.language];
  const isKoreanRegion = browserLocales.some((locale) => /^ko(?:-|$)/i.test(locale) || /-KR$/i.test(locale)) || Intl.DateTimeFormat().resolvedOptions().timeZone === 'Asia/Seoul';
  const language = savedLanguage === 'ko' || savedLanguage === 'en' ? savedLanguage : isKoreanRegion ? 'ko' : 'en';
  localStorage.setItem(STORAGE_KEY, language);
  document.documentElement.lang = language;

  const homeEnglish = [
    'Skip to menu', 'Where would you like to go?', 'Portfolio', 'Development notes', 'My journey', 'Playground · Opens in a new tab',
  ];

  const historyEnglish = [
    'Skip to history', 'Time accumulates', 'and becomes a life.', 'What I learned at work, moments with family,', 'and memories shared with friends, all recorded here.',
    'A record of time gone by', 'This archive is growing slowly.', 'Choose the story you would like to see.', 'Work', 'Family', 'Friends',
    'Learning and growing', 'through the work I have built', '3 months ago', 'A New Beginning', 'Hello.', 'Precious because we are together', 'Our time',
    '5 years ago', 'Family story', 'Laughter shared together', 'Fragments of memory', '1 month ago', 'Friends story', 'Back to top ↑',
  ];

  const portfolioEnglish = [
    'Noh Jinil · MrJino Portfolio', 'Skip to content',
    'Beyond technology,', 'I create experiences', 'that reach people.',
    'I am a developer who has enjoyed learning and building software for 21 years.',
    'I continuously learn and apply new technologies to improve code quality and build reliable services. I am never ashamed of what I do not know and always learn from others. Before development begins, I review requirements and technologies and document the design. I actively use Jira for sprint planning, Confluence for project documentation, and Git for source history.',
    'Explore projects', 'Start a conversation', 'Noh Jinil', 'Qualifications', 'Information Systems Auditor', 'Engineer Information Processing',
    'Experience across diverse platforms', 'Projects that shaped my experience', 'From small everyday conveniences to launching new services.', 'These are the products and experiences I helped create.',
    'All', 'Company projects', 'Personal projects', '15 projects',
    'Caddie Fee Payment', 'A simple credit-card payment service for golf caddie fees', 'Golf Cart Black Box', 'A tablet-camera black box service for golf carts',
    'Halfway House Table Order', 'A self-service ordering solution for golf course halfway houses', 'Golf Course ERP Mobile', 'A hybrid mobile app for a golf course ERP solution',
    'SwiftUI · Hybrid Web App · iOS', 'Kiosk Device Management', 'A kiosk device and advertising management solution', 'Read the VNC remote-control blog post',
    'Voice Caddie Mobile App', 'A major upgrade to the mobile app connected to golf watches', 'Hyundai Motor Watch App', 'A smartwatch app connected to vehicle remote control',
    'FLO Music Streaming App', 'Launch of a personalized, taste-chart-centered music streaming service', 'High-resolution music streaming and local playback',
    'SKY Mobile Software', 'Applications built into SKY feature phones and smartphones', 'Video Streaming', 'An RTSP-based video streaming playback solution',
    'WIPI Platform Porting', 'Porting the WIPI platform to SKY feature phones', 'A family photo organization and finance management service',
    'A music spectrum you can enjoy visually (Anytime Visualizer)', 'A web playground for games, quizzes, and music',
    'A steadily accumulated', 'career in development', 'Platforms and products may change,', 'but the goal remains a better user experience.',
    'Jan 2023 – Dec 2026 (3 years)', 'Smartscore', 'Principal Research Engineer, Native Team', 'Developed new features for Android golf-course tablet apps',
    'Developed hybrid iOS/Android apps for golfers', 'Developed a Windows kiosk device-management application',
    'Jul 2019 – Dec 2022 (3 years 6 months)', 'Poliot', 'Principal Research Engineer / Team Lead', 'Founding member of the company (1 CEO, 2 developers)',
    'Led the Hyundai Motor smartwatch SI project', 'Led the Voice Caddie watch-connected mobile app SI project',
    'Feb 2017 – Jun 2019 (2 years 4 months)', 'Dreamus Company (iriver)', 'Principal Research Engineer, Software Team', 'Participated in the launch of SKT FLO',
    'Developed the Android FLO music streaming app', 'Developed music streaming apps for Astell&Kern devices',
    'Jan 2006 – Jun 2016 (10 years 6 months)', 'Pantech', 'Senior Research Engineer, Software Team', 'Developed built-in software for SKY mobile phones',
    'Improved and maintained the Android music player', 'Ported SKT value-added services and resolved defects',
    'Jan 2003 – Dec 2005 (3 years)', 'SK Teletech', 'Research Engineer, Software Team', 'Developed an RTSP/RTP video streaming solution (H.263)',
    'Ported the WIPI platform to government specifications', 'Konkuk University (Seoul)', 'B.S. in Computer Engineering',
    'Information Systems Auditor (Jul 2016)', 'Engineer Information Processing (Sep 2002)',
    'Good code is built together', 'I communicate clearly, think structurally,', 'and never stop learning.',
    'A language everyone understands', 'Within development teams, I communicate through sequence diagrams and architecture drawings. With planners and designers, I use clear nontechnical language. I first seek to understand operations and customers.',
    'Collaboration through documentation', 'I review requirements and technologies and document designs. Jira timelines and sprints, Git code reviews, and Confluence documentation keep the team moving in the same direction.',
    'A developer who keeps learning', 'I pursue Clean Architecture and clear UML design appropriate to each project. I continue learning from colleagues and new technologies to improve quality and reliability.',
    'Shall we start', 'the next story together?', 'I would love to talk about projects, technology, and ways of working.', 'Back to top ↑', 'Close',
    'Caddie Fee Payment — New Development', 'Jan 2025 – Apr 2025 (4 months)', '1 tablet developer, 1 backend developer',
    'A service that lets golfers pay caddie fees easily by credit card. It connects to a Smartro payment terminal over BLE and implements user interactions for each step of the payment process.',
    'Android mobile app development and release', 'Compose-based UI', 'Integrated the Smartro payment module over BLE', 'Sent payment data to the server with Retrofit', 'Handled changing data such as payment status with Coroutine Flow',
    'Golf Cart Black Box — New Development', 'Nov 2024 – Dec 2024 (2 months)',
    'Developed an Android tablet black box app for golf carts. It selectively uses the front and rear cameras to record incidents during operation and runs reliably in the background with a foreground service.',
    'Android tablet app development and release', 'Jetpack Compose-based UI', 'Video recording with Jetpack Camera2', 'Background recording with a foreground service', 'Managed storage for local black box recordings',
    'Halfway House Table Order — New Development', 'Jun 2024 – Oct 2024 (5 months)', '1 halfway-house tablet developer, 1 golf-cart tablet developer, 3 backend developers',
    'Developed a self-service ordering system for golf course halfway houses. Customers order directly on a tablet, and order data is delivered to the kitchen in real time over sockets. Clean Architecture makes the system easier to maintain.',
    'Handled changing menu and settings data with Coroutine Flow', 'Connected to the company live-server solution over sockets', 'Integrated menu APIs with Retrofit',
    'Golf Course ERP Mobile — New Development', 'Mar 2024 – May 2024 (3 months)', '1 iOS, 1 Android, 3 web frontend, 1 backend developer',
    'Developed iOS and Android apps that bring essential golf-course ERP functions to mobile. SwiftUI and a hybrid web view enabled a fast development cycle, and I led the initial App Store registration and release.',
    'Led iOS and Android app development and release', 'SwiftUI-based UI', 'Connected the mobile ERP web app through a web view', 'Initial App Store registration and release', 'Hybrid web app', 'App Store',
    'Golf Course Kiosk Management and Advertising Solution', 'Aug 2023 – Feb 2024 (7 months)', '2 Windows, 4 backend, 1 MQTT broker developer',
    'A Windows desktop app for remotely managing kiosks deployed at golf courses nationwide and playing advertising videos. It provides UltraVNC remote control, VLC-based ad playback, and native functions through a bridge interface with the web app.',
    'Windows desktop app development (WPF)', 'XAML-based UI', 'Kiosk screen sharing and remote control using open-source VNC', 'Advertising video playback with VLC', 'Implemented a bridge interface and native features required by the web app',
    'Voice Caddie Mobile App Upgrade — SI Project Lead', 'Feb 2020 – Aug 2020 (7 months)', '1 iOS and 1 Android developer',
    'Led a major upgrade of the Voice Caddie mobile app. The app synchronizes golf-round data with golf watches over Bluetooth and visualizes personal golf statistics.',
    'Upgraded the Android and iOS mobile apps', 'Bluetooth integration with golf watches', 'Provided personal golf data and statistics',
    'Hyundai Motor Watch App — SI Project Lead', 'Oct 2019 – Jan 2020 (4 months)', '1 Tizen/WearOS and 1 watchOS developer',
    'Developed smartwatch apps connected to Hyundai BlueLink across Samsung Galaxy Watch (Tizen), Apple Watch (watchOS), and LG Watch (WearOS), including remote start and door lock controls.',
    'Developed three platforms simultaneously for Galaxy Watch, Apple Watch, and LG Watch', 'Vehicle remote controls such as start and unlock', 'Displayed vehicle status including climate, doors, and ignition', 'Communication protocol between the smartphone app and watches',
    'FLO Music Streaming App Launch', 'Jan 2019 – Jun 2019 (6 months)', '7 Android, 5 iOS, 20+ backend, and 2 DBA members',
    'Participated in the launch of SK Telecom music streaming service FLO and owned the main Browse tab on Android. The team worked in two-week Agile sprints and introduced pull-request code reviews with Git forks.',
    'Developed the main screen of the Android Browse tab', 'Used Agile delivery to launch a new service within six months', 'Developed in two-week sprints', 'Peer source review through pull requests',
    'Astell&Kern Music Streaming App Upgrade', 'Feb 2017 – Jun 2017 (5 months)', '1 Android, 1 web frontend, and 2 backend developers',
    'Worked on the high-resolution streaming app for Astell&Kern. Improved Hi-Fi playback optimization, playback controls, and playlist management to deliver a high-quality listening experience.',
    'Improved the Android high-resolution streaming app', 'Added and improved playback controls and playlists', 'Optimized high-resolution music streaming',
    'SKY Feature Phone and Smartphone Application Development', 'Feature improvements and maintenance',
    'Developed music players and other applications built into SKY feature phones and early Android smartphones. Built on the company UI platform and optimized performance for constrained hardware.',
    'Developed applications on the in-house UI platform', 'Developed the Android music player UI', 'Performance optimization for constrained hardware', 'Integrated SKT value-added services and handled QA issues',
    'In-house Real-time Streaming Playback Solution', 'Jan 2005 – Jun 2005 (6 months)', '10+ members (in-house solution project)',
    'Built an RTSP playback solution for video streaming in the feature-phone era. Implemented RTSP communication with SKT streaming servers and processed H.263 codec data for stable playback on limited networks.',
    'Developed an RTSP streaming app for SKY feature phones', 'Exchanged data with media servers using RTSP', 'Processed H.263 codec data from SKT streaming servers',
    'WIPI Platform Porting for SKY Phones', 'Oct 2004 – Dec 2004 (3 months)', '10+ members (task force)',
    'Participated in the first SKY device project to ship with WIPI 1.2 under Korean government specifications. Implemented media and font HALs and ported the SKVM and GVM platforms.',
    'First device project to adopt WIPI 1.2 government specifications', 'Implemented media and font HAL layers', 'Ported the SKVM and GVM platforms',
    'Family Photo Management Service (Personal Project)', 'May 2025 – Oct 2025 (6 months)', '1 person (personal project)',
    'Built a private cloud service for safely storing and managing family photos. Developed the full stack with Next.js and Spring Boot and deployed it to a home server with Docker, using FFmpeg metadata extraction, Firebase Authentication, and an Nginx reverse proxy.',
    'Developed a Next.js web application', 'Built an API server with Spring Boot', 'Configured a reverse proxy with Nginx', 'Created domain certificates with OpenSSL', 'Stored and managed photos on a home server', 'User authentication with Firebase Authentication', 'Extracted and encoded photo metadata with FFmpeg', 'Managed photo metadata with MySQL', 'Deployed and hosted with Docker', 'Managed Docker images with a Nexus repository',
    'Anytime Visualizer (Personal Project)', 'Jan 2013 – Dec 2013 (12 months)',
    'An Android app that renders real-time music spectrum effects. It analyzes audio with FFT data and renders responsive visual effects through the Canvas API. The app has reached 500,000 downloads on Google Play.',
    'Android application (500,000 Google Play downloads)', 'Real-time visual effects synchronized with music playback', 'Custom color and theme settings', 'Spectrum rendering using FFT values', 'High-performance graphics rendering with the Canvas API',
    'Gurunun (Personal Project)', '2026 – Present',
    'A web playground that brings favorite tournaments, typing practice, general-knowledge quizzes, music, and personality tests together. Each service offers an independent experience while sharing a common design, multilingual environment, authentication, and content-management structure.',
    'Combined game, quiz, learning, and music services in one website', 'Built a multilingual experience across 11 languages with shared UI components', 'Designed REST APIs and D1 data models on Cloudflare Workers', 'Implemented Firebase Authentication and group-based content management', 'Built responsive, PWA-ready, search-friendly public pages',
  ];

  const attributeEnglish = new Map([
    ['MrJino의 포트폴리오, 블로그, 히스토리와 플레이그라운드로 연결되는 공간입니다.', 'A gateway to MrJino’s portfolio, blog, history, and playground.'],
    ['페이지 바로가기', 'Page destinations'], ['언어 선택', 'Language selection'],
    ['노진일의 개발 포트폴리오. Android를 중심으로 모바일, 웨어러블, 미디어 서비스를 만들어 온 경험과 프로젝트를 소개합니다.', 'Noh Jinil’s development portfolio, featuring Android, mobile, wearable, and media products.'],
    ['MrJino 홈', 'MrJino home'], ['포트폴리오 탐색', 'Portfolio navigation'], ['개발자 프로필', 'Developer profile'], ['노진일 프로필', 'Portrait of Noh Jinil'],
    ['주요 기술', 'Core technologies'], ['프로젝트 분류', 'Project categories'], ['상세정보 닫기', 'Close project details'],
    ['일과 가족, 친구와 함께한 시간을 기록하는 MrJino의 히스토리입니다.', 'MrJino’s history, recording moments from work, family, and friends.'],
    ['히스토리 분류', 'History categories'],
  ]);
  const projectNameEnglish = new Map([
    ['캐디피결제', 'Caddie Fee Payment'], ['전동카트 블랙박스', 'Golf Cart Black Box'], ['그늘집 테이블오더', 'Halfway House Table Order'],
    ['골프장 ERP 모바일', 'Golf Course ERP Mobile'], ['키오스크 기기관리', 'Kiosk Device Management'], ['보이스캐디 모바일앱', 'Voice Caddie Mobile App'],
    ['현대자동차 워치앱', 'Hyundai Motor Watch App'], ['FLO 뮤직스트리밍앱', 'FLO Music Streaming App'], ['Astell&Kern DAP', 'Astell&Kern DAP'],
    ['SKY 핸드폰 S/W', 'SKY Mobile Software'], ['동영상 스트리밍', 'Video Streaming'], ['WIPI 플랫폼 포팅', 'WIPI Platform Porting'],
    ['Assistant', 'Assistant'], ['Visualizer', 'Visualizer'], ['Gurunun', 'Gurunun'],
  ]);

  function koreanTextNodes(root) {
    const nodes = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!['SCRIPT', 'STYLE'].includes(node.parentElement?.tagName) && !node.parentElement?.closest('[data-language]') && /[가-힣]/.test(node.textContent)) nodes.push(node);
    }
    return nodes;
  }

  function translateTextByOrder(translations) {
    const nodes = koreanTextNodes(document);
    document.querySelectorAll('template').forEach((template) => nodes.push(...koreanTextNodes(template.content)));
    const unique = [...new Set(nodes.map((node) => node.textContent.trim()))];
    const dictionary = new Map(unique.map((text, index) => [text, translations[index]]));
    nodes.forEach((node) => {
      const source = node.textContent.trim();
      const translated = dictionary.get(source);
      if (translated) node.textContent = node.textContent.replace(source, translated);
    });
  }

  function translateAttributes() {
    document.querySelectorAll('[content], [aria-label], [alt], [title]').forEach((element) => {
      ['content', 'aria-label', 'alt', 'title'].forEach((name) => {
        const source = element.getAttribute(name);
        if (!source) return;
        const direct = attributeEnglish.get(source);
        const detail = source.match(/^(.+) 상세정보 보기$/);
        element.setAttribute(name, direct || (detail ? `View ${projectNameEnglish.get(detail[1]) || detail[1]} details` : source));
      });
    });
  }

  if (language === 'en') {
    const translations = document.body.classList.contains('portfolio') ? portfolioEnglish : document.body.classList.contains('history-page') ? historyEnglish : homeEnglish;
    translateTextByOrder(translations);
    translateAttributes();
  }

  document.querySelectorAll('[data-language]').forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.language === language));
    button.addEventListener('click', () => {
      const next = button.dataset.language;
      localStorage.setItem(STORAGE_KEY, next);
      window.location.reload();
    });
  });
})();
