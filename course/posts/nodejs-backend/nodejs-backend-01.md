# Node.js 시작하기

## 📚 Node.js란?

Node.js는 Chrome V8 JavaScript 엔진으로 빌드된 JavaScript 런타임입니다. 브라우저 밖에서 JavaScript를 실행할 수 있게 해주는 환경으로, 서버 사이드 애플리케이션 개발에 널리 사용됩니다.

### 주요 특징

- **비동기 I/O**: 이벤트 기반 논블로킹 I/O 모델
- **빠른 실행 속도**: V8 엔진의 성능
- **단일 스레드**: 이벤트 루프 기반
- **NPM**: 세계 최대 오픈소스 라이브러리 생태계

## 🔧 Node.js 설치

### 1. 공식 웹사이트에서 설치

[https://nodejs.org](https://nodejs.org)에서 LTS 버전을 다운로드합니다.

### 2. 설치 확인

```bash
node --version
npm --version
```

## 📦 NPM (Node Package Manager)

NPM은 Node.js의 패키지 관리자입니다.

### package.json 생성

```bash
npm init -y
```

### 패키지 설치

```bash
# 로컬 설치
npm install express

# 개발 의존성
npm install --save-dev nodemon

# 전역 설치
npm install -g typescript
```

## 👨‍💻 첫 번째 Node.js 프로그램

### hello.js 생성

```javascript
// hello.js
console.log('Hello, Node.js!');

// 현재 실행 환경 정보
console.log('Node.js 버전:', process.version);
console.log('운영체제:', process.platform);
```

### 실행

```bash
node hello.js
```

## 🌐 간단한 HTTP 서버

### server.js 생성

```javascript
const http = require('http');

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.end('안녕하세요, Node.js 서버입니다!');
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행중입니다.`);
});
```

### 서버 실행

```bash
node server.js
```

브라우저에서 `http://localhost:3000`으로 접속하여 확인합니다.

## 📁 모듈 시스템

### 모듈 내보내기 (exports)

```javascript
// math.js
exports.add = (a, b) => a + b;
exports.subtract = (a, b) => a - b;

// 또는
module.exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};
```

### 모듈 가져오기 (require)

```javascript
// app.js
const math = require('./math');

console.log(math.add(5, 3));      // 8
console.log(math.subtract(5, 3)); // 2
```

## 🎯 핵심 개념

### 1. 이벤트 루프

Node.js는 단일 스레드 이벤트 루프를 사용하여 비동기 작업을 처리합니다.

```javascript
console.log('1번');

setTimeout(() => {
  console.log('2번');
}, 0);

console.log('3번');

// 출력: 1번 -> 3번 -> 2번
```

### 2. 콜백 함수

```javascript
const fs = require('fs');

// 비동기 파일 읽기
fs.readFile('file.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('에러:', err);
    return;
  }
  console.log('파일 내용:', data);
});
```

### 3. Promise와 async/await

```javascript
const fs = require('fs').promises;

// Promise 사용
fs.readFile('file.txt', 'utf8')
  .then(data => console.log(data))
  .catch(err => console.error(err));

// async/await 사용
async function readFileAsync() {
  try {
    const data = await fs.readFile('file.txt', 'utf8');
    console.log(data);
  } catch (err) {
    console.error(err);
  }
}
```

## 💡 실습 과제

1. 현재 시간을 반환하는 HTTP 서버 만들기
2. 간단한 계산기 모듈 작성하기
3. 파일을 읽어서 내용을 출력하는 프로그램 작성하기

## 📚 다음 학습

다음 포스트에서는 Express 프레임워크를 사용하여 더 강력한 웹 서버를 구축하는 방법을 배웁니다.

---

**학습 완료!** 다음 포스트로 계속 진행하세요.
