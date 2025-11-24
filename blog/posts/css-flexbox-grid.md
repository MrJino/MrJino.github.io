# CSS Flexbox와 Grid 완벽 정복

현대 웹 레이아웃의 핵심인 Flexbox와 Grid를 마스터해봅시다. 이 두 가지 레이아웃 시스템을 이해하면 복잡한 레이아웃도 쉽게 구현할 수 있습니다.

## Flexbox - 1차원 레이아웃

Flexbox는 행(row) 또는 열(column) 한 방향으로 아이템을 배치하는 1차원 레이아웃 시스템입니다.

### 기본 개념

```css
.container {
  display: flex;
  /* 또는 display: inline-flex; */
}
```

### 주요 속성들

#### 1. flex-direction - 방향 설정

```css
.container {
  display: flex;
  flex-direction: row; /* 기본값: 왼쪽에서 오른쪽 */
  /* flex-direction: row-reverse; 오른쪽에서 왼쪽 */
  /* flex-direction: column; 위에서 아래 */
  /* flex-direction: column-reverse; 아래에서 위 */
}
```

#### 2. justify-content - 주축 정렬

```css
.container {
  display: flex;
  justify-content: flex-start; /* 기본값 */
  /* justify-content: flex-end; 끝에 정렬 */
  /* justify-content: center; 중앙 정렬 */
  /* justify-content: space-between; 양 끝 정렬 */
  /* justify-content: space-around; 균등 분배 */
  /* justify-content: space-evenly; 완전 균등 분배 */
}
```

#### 3. align-items - 교차축 정렬

```css
.container {
  display: flex;
  align-items: stretch; /* 기본값 */
  /* align-items: flex-start; 시작점 정렬 */
  /* align-items: flex-end; 끝점 정렬 */
  /* align-items: center; 중앙 정렬 */
  /* align-items: baseline; 텍스트 기준선 정렬 */
}
```

#### 4. flex-wrap - 줄 바꿈

```css
.container {
  display: flex;
  flex-wrap: nowrap; /* 기본값: 줄 바꿈 없음 */
  /* flex-wrap: wrap; 줄 바꿈 */
  /* flex-wrap: wrap-reverse; 역순 줄 바꿈 */
}
```

### Flex 아이템 속성

```css
.item {
  /* flex-grow: 남은 공간 차지 비율 */
  flex-grow: 1;

  /* flex-shrink: 공간이 부족할 때 축소 비율 */
  flex-shrink: 1;

  /* flex-basis: 기본 크기 */
  flex-basis: 200px;

  /* 축약형 */
  flex: 1 1 200px; /* grow shrink basis */

  /* 개별 아이템 정렬 */
  align-self: center;

  /* 순서 변경 */
  order: 2;
}
```

### 실전 예제

#### 1. 수평 네비게이션

```html
<nav class="navbar">
  <div class="logo">Logo</div>
  <ul class="nav-menu">
    <li><a href="#">Home</a></li>
    <li><a href="#">About</a></li>
    <li><a href="#">Contact</a></li>
  </ul>
</nav>
```

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #333;
  color: white;
}

.nav-menu {
  display: flex;
  gap: 2rem;
  list-style: none;
}
```

#### 2. 카드 그리드

```css
.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.card {
  flex: 1 1 300px; /* 최소 300px, 남은 공간 균등 분배 */
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

#### 3. 중앙 정렬

```css
.center-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
```

## Grid - 2차원 레이아웃

Grid는 행과 열을 동시에 다루는 2차원 레이아웃 시스템입니다.

### 기본 개념

```css
.container {
  display: grid;
  /* 또는 display: inline-grid; */
}
```

### 그리드 정의하기

#### 1. 열(Columns) 정의

```css
.container {
  display: grid;

  /* 고정 크기 */
  grid-template-columns: 200px 200px 200px;

  /* 비율 (fr 단위) */
  grid-template-columns: 1fr 2fr 1fr;

  /* repeat 함수 */
  grid-template-columns: repeat(3, 1fr);

  /* auto-fit: 가능한 많은 열 */
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

  /* auto-fill: 빈 공간 포함 */
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
}
```

#### 2. 행(Rows) 정의

```css
.container {
  display: grid;
  grid-template-rows: 100px 200px auto;

  /* 자동 행 크기 */
  grid-auto-rows: minmax(100px, auto);
}
```

#### 3. 간격(Gap)

```css
.container {
  display: grid;
  gap: 1rem; /* row와 column 모두 */
  /* 또는 */
  row-gap: 1rem;
  column-gap: 2rem;
}
```

### 아이템 배치

```css
.item {
  /* 열 위치 */
  grid-column: 1 / 3; /* 1번 선에서 3번 선까지 */
  grid-column: 1 / span 2; /* 1번 선부터 2칸 */

  /* 행 위치 */
  grid-row: 1 / 3;

  /* 축약형 */
  grid-area: 1 / 1 / 3 / 3; /* row-start / col-start / row-end / col-end */
}
```

### 그리드 템플릿 영역

```css
.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar content content"
    "footer footer footer";
  grid-template-columns: 200px 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  gap: 1rem;
}

.header {
  grid-area: header;
}

.sidebar {
  grid-area: sidebar;
}

.content {
  grid-area: content;
}

.footer {
  grid-area: footer;
}
```

### 정렬

```css
.container {
  display: grid;

  /* 아이템을 셀 내에서 정렬 */
  justify-items: center; /* 가로 */
  align-items: center; /* 세로 */
  place-items: center; /* 축약형 */

  /* 그리드 전체를 컨테이너 내에서 정렬 */
  justify-content: center;
  align-content: center;
  place-content: center;
}

.item {
  /* 개별 아이템 정렬 */
  justify-self: center;
  align-self: center;
  place-self: center;
}
```

### 실전 예제

#### 1. 반응형 카드 그리드

```css
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
```

#### 2. 대시보드 레이아웃

```html
<div class="dashboard">
  <header class="header">Header</header>
  <aside class="sidebar">Sidebar</aside>
  <main class="main">Main Content</main>
  <aside class="widgets">Widgets</aside>
  <footer class="footer">Footer</footer>
</div>
```

```css
.dashboard {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main widgets"
    "footer footer footer";
  grid-template-columns: 250px 1fr 300px;
  grid-template-rows: 60px 1fr 50px;
  gap: 1rem;
  height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { grid-area: main; }
.widgets { grid-area: widgets; }
.footer { grid-area: footer; }

/* 반응형 */
@media (max-width: 768px) {
  .dashboard {
    grid-template-areas:
      "header"
      "main"
      "sidebar"
      "widgets"
      "footer";
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }
}
```

#### 3. 이미지 갤러리

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: 200px;
  gap: 1rem;
}

.gallery-item {
  position: relative;
  overflow: hidden;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* 특정 아이템 크게 */
.gallery-item.large {
  grid-column: span 2;
  grid-row: span 2;
}
```

## Flexbox vs Grid - 언제 사용할까?

### Flexbox를 사용하는 경우
- 1차원 레이아웃 (행 또는 열)
- 네비게이션 바
- 버튼 그룹
- 카드 내부 요소 배치
- 작은 컴포넌트 레이아웃

### Grid를 사용하는 경우
- 2차원 레이아웃 (행과 열)
- 페이지 전체 레이아웃
- 복잡한 대시보드
- 갤러리, 카드 그리드
- 정교한 정렬이 필요한 경우

### 함께 사용하기

```css
/* Grid로 전체 레이아웃, Flexbox로 내부 요소 */
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

## 정리

Flexbox와 Grid는 서로 보완적인 관계입니다. 상황에 맞게 적절히 선택하고 조합하면 어떤 레이아웃도 쉽게 구현할 수 있습니다.

**핵심 정리:**
- **Flexbox**: 1차원 레이아웃, 컨텐츠 중심
- **Grid**: 2차원 레이아웃, 레이아웃 중심
- 둘을 조합하여 사용하면 최고의 결과
