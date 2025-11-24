# Docker 기초와 실전 활용법

Docker는 애플리케이션을 컨테이너로 패키징하여 어디서나 동일하게 실행할 수 있게 해주는 플랫폼입니다. 개발 환경부터 프로덕션까지 일관된 환경을 제공합니다.

## Docker를 사용하는 이유

1. **환경 일관성**: "내 컴퓨터에서는 되는데?" 문제 해결
2. **격리성**: 각 애플리케이션이 독립적인 환경에서 실행
3. **이식성**: 어떤 환경에서도 동일하게 작동
4. **효율성**: 가상머신보다 가볍고 빠름

## 핵심 개념

### 1. 이미지 (Image)
- 애플리케이션을 실행하기 위한 템플릿
- 읽기 전용 스냅샷
- 레이어 구조로 저장

### 2. 컨테이너 (Container)
- 이미지의 실행 인스턴스
- 격리된 프로세스
- 여러 컨테이너가 같은 이미지를 공유 가능

### 3. Dockerfile
- 이미지를 만들기 위한 설정 파일
- 명령어들의 집합

## 기본 명령어

### 이미지 관련

```bash
# 이미지 다운로드
docker pull nginx:latest

# 이미지 목록 확인
docker images

# 이미지 삭제
docker rmi nginx:latest

# 이미지 빌드
docker build -t myapp:1.0 .

# 사용하지 않는 이미지 정리
docker image prune
```

### 컨테이너 관련

```bash
# 컨테이너 실행
docker run nginx

# 백그라운드 실행
docker run -d nginx

# 포트 매핑
docker run -d -p 8080:80 nginx

# 이름 지정
docker run -d --name my-nginx nginx

# 볼륨 마운트
docker run -d -v $(pwd):/app nginx

# 환경 변수 설정
docker run -d -e NODE_ENV=production myapp

# 실행 중인 컨테이너 확인
docker ps

# 모든 컨테이너 확인
docker ps -a

# 컨테이너 중지
docker stop my-nginx

# 컨테이너 시작
docker start my-nginx

# 컨테이너 재시작
docker restart my-nginx

# 컨테이너 삭제
docker rm my-nginx

# 실행 중인 컨테이너 접속
docker exec -it my-nginx bash

# 로그 확인
docker logs my-nginx

# 실시간 로그
docker logs -f my-nginx
```

## Dockerfile 작성

### Node.js 애플리케이션 예제

```dockerfile
# 베이스 이미지
FROM node:18-alpine

# 작업 디렉토리 설정
WORKDIR /app

# package.json 복사 (레이어 캐싱 활용)
COPY package*.json ./

# 의존성 설치
RUN npm ci --only=production

# 소스 코드 복사
COPY . .

# 환경 변수 설정
ENV NODE_ENV=production
ENV PORT=3000

# 포트 노출
EXPOSE 3000

# 헬스체크
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node healthcheck.js

# 컨테이너 시작 명령
CMD ["node", "server.js"]
```

### Python 애플리케이션 예제

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# 의존성 복사 및 설치
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 애플리케이션 복사
COPY . .

# 비루트 유저 생성
RUN useradd -m myuser
USER myuser

EXPOSE 8000

CMD ["python", "app.py"]
```

### 멀티 스테이지 빌드

```dockerfile
# 빌드 스테이지
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 프로덕션 스테이지
FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

EXPOSE 3000
CMD ["node", "dist/server.js"]
```

## Docker Compose

여러 컨테이너를 한 번에 관리하기 위한 도구입니다.

### docker-compose.yml 예제

```yaml
version: '3.8'

services:
  # Node.js 애플리케이션
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DB_HOST=postgres
      - REDIS_HOST=redis
    depends_on:
      - postgres
      - redis
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped

  # PostgreSQL 데이터베이스
  postgres:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=myuser
      - POSTGRES_PASSWORD=mypassword
      - POSTGRES_DB=mydb
    volumes:
      - postgres-data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  # Redis 캐시
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis-data:/data

  # Nginx 리버스 프록시
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app

volumes:
  postgres-data:
  redis-data:
```

### Docker Compose 명령어

```bash
# 서비스 시작
docker-compose up

# 백그라운드 시작
docker-compose up -d

# 서비스 중지
docker-compose down

# 볼륨까지 삭제
docker-compose down -v

# 로그 확인
docker-compose logs

# 특정 서비스 로그
docker-compose logs app

# 서비스 재시작
docker-compose restart

# 빌드 및 시작
docker-compose up --build
```

## 볼륨과 네트워크

### 볼륨 (Volume)

```bash
# 볼륨 생성
docker volume create mydata

# 볼륨 목록
docker volume ls

# 볼륨 사용
docker run -v mydata:/app/data myapp

# 바인드 마운트 (호스트 디렉토리)
docker run -v $(pwd)/data:/app/data myapp

# 볼륨 삭제
docker volume rm mydata
```

### 네트워크

```bash
# 네트워크 생성
docker network create mynetwork

# 네트워크 목록
docker network ls

# 컨테이너를 네트워크에 연결
docker run --network mynetwork myapp

# 네트워크 정보 확인
docker network inspect mynetwork
```

## 실전 팁

### 1. .dockerignore 파일

```
node_modules
npm-debug.log
.git
.env
*.md
.DS_Store
dist
coverage
```

### 2. 이미지 크기 최적화

```dockerfile
# Alpine 이미지 사용
FROM node:18-alpine

# 멀티 스테이지 빌드
FROM builder AS final

# 불필요한 파일 제거
RUN rm -rf /tmp/* /var/cache/apk/*

# .dockerignore 활용
```

### 3. 보안 베스트 프랙티스

```dockerfile
# 비루트 사용자로 실행
RUN addgroup -g 1001 appgroup && \
    adduser -D -u 1001 -G appgroup appuser
USER appuser

# 최소 권한 원칙
COPY --chown=appuser:appgroup . .

# 민감 정보는 환경 변수로
ENV DB_PASSWORD=${DB_PASSWORD}
```

### 4. 헬스체크

```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1
```

### 5. 로그 관리

```bash
# JSON 로그 드라이버
docker run --log-driver json-file \
  --log-opt max-size=10m \
  --log-opt max-file=3 \
  myapp
```

## 개발 환경 설정 예제

```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - .:/app
      - /app/node_modules
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    command: npm run dev

  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_PASSWORD: dev_password
    ports:
      - "5432:5432"
    volumes:
      - postgres-dev:/var/lib/postgresql/data

volumes:
  postgres-dev:
```

```bash
# 개발 환경 실행
docker-compose -f docker-compose.dev.yml up
```

## 정리

Docker는 현대 소프트웨어 개발의 필수 도구입니다. 컨테이너화를 통해:

- 개발 환경 표준화
- 배포 프로세스 간소화
- 인프라 관리 효율화
- 마이크로서비스 아키텍처 구현

을 쉽게 달성할 수 있습니다. 기본 개념을 이해하고 실전에서 자주 사용하다 보면 자연스럽게 익숙해질 것입니다.
