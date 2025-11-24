# Node.js로 REST API 구축하기

Node.js와 Express를 사용하여 REST API를 구축하는 방법을 알아보겠습니다. 실전에서 바로 사용할 수 있는 패턴들을 중심으로 설명합니다.

## 프로젝트 설정

먼저 필요한 패키지를 설치합니다.

```bash
npm init -y
npm install express dotenv cors helmet morgan
npm install --save-dev nodemon
```

### 기본 서버 구조

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(helmet()); // 보안 헤더
app.use(cors()); // CORS 활성화
app.use(morgan('dev')); // 로깅
app.use(express.json()); // JSON 파싱
app.use(express.urlencoded({ extended: true }));

// 라우트
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to REST API' });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## REST API 설계

### 1. 사용자 관리 API

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();

// 임시 데이터베이스 (실제로는 MongoDB, PostgreSQL 등 사용)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// GET /api/users - 모든 사용자 조회
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: users
  });
});

// GET /api/users/:id - 특정 사용자 조회
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    data: user
  });
});

// POST /api/users - 새 사용자 생성
router.post('/', (req, res) => {
  const { name, email } = req.body;

  // 유효성 검사
  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: 'Name and email are required'
    });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email
  };

  users.push(newUser);

  res.status(201).json({
    success: true,
    data: newUser
  });
});

// PUT /api/users/:id - 사용자 정보 수정
router.put('/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const { name, email } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;

  res.json({
    success: true,
    data: user
  });
});

// DELETE /api/users/:id - 사용자 삭제
router.delete('/:id', (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  users.splice(index, 1);

  res.json({
    success: true,
    message: 'User deleted successfully'
  });
});

module.exports = router;
```

### 2. 미들웨어 활용

```javascript
// middleware/auth.js
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access token required'
    });
  }

  // 토큰 검증 로직 (JWT 등)
  // ...

  next();
};

// middleware/validate.js
const validateUser = (req, res, next) => {
  const { name, email } = req.body;

  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }

  if (!email || !email.includes('@')) {
    errors.push('Valid email is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors
    });
  }

  next();
};

module.exports = { authenticateToken, validateUser };
```

### 3. 에러 핸들링

```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// 커스텀 에러 클래스
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = { errorHandler, ApiError };
```

### 4. 라우트 통합

```javascript
// server.js (업데이트)
const userRoutes = require('./routes/users');
const { errorHandler } = require('./middleware/errorHandler');

// 라우트 등록
app.use('/api/users', userRoutes);

// 404 핸들러
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// 에러 핸들러
app.use(errorHandler);
```

## 데이터베이스 연동 (MongoDB)

```javascript
// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;

// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: 2
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
```

## 비동기 에러 처리

```javascript
// utils/asyncHandler.js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 사용 예
router.get('/', asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json({
    success: true,
    data: users
  });
}));
```

## 페이지네이션

```javascript
router.get('/', asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const users = await User.find()
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments();

  res.json({
    success: true,
    data: users,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
}));
```

## 환경 변수 설정

```.env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/myapp
NODE_ENV=development
JWT_SECRET=your-secret-key
```

## 정리

이 가이드에서 다룬 내용:

- Express 서버 기본 설정
- RESTful API 라우팅
- 미들웨어 활용
- 에러 핸들링
- 데이터베이스 연동
- 페이지네이션

이러한 패턴들을 활용하면 확장 가능하고 유지보수가 쉬운 REST API를 구축할 수 있습니다.
