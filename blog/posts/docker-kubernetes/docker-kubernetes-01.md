# Docker 기초

## 📚 Docker란?

Docker는 애플리케이션을 컨테이너라는 단위로 패키징하여 어디서나 동일하게 실행할 수 있게 해주는 플랫폼입니다.

### 왜 Docker를 사용할까?

- **환경 일관성**: "내 컴퓨터에서는 잘 되는데..." 문제 해결
- **빠른 배포**: 몇 초 만에 애플리케이션 시작
- **격리성**: 각 컨테이너는 독립적으로 실행
- **이식성**: 어떤 환경에서도 동일하게 동작

## 🎯 핵심 개념

### 1. 이미지 (Image)

애플리케이션 실행에 필요한 모든 것을 포함하는 읽기 전용 템플릿입니다.

```bash
# 이미지 검색
docker search nginx

# 이미지 다운로드
docker pull nginx:latest

# 이미지 목록 확인
docker images

# 이미지 삭제
docker rmi nginx:latest
```

### 2. 컨테이너 (Container)

이미지를 실행한 인스턴스입니다.

```bash
# 컨테이너 실행
docker run nginx

# 백그라운드 실행
docker run -d nginx

# 포트 매핑
docker run -d -p 8080:80 nginx

# 이름 지정
docker run -d --name my-nginx -p 8080:80 nginx
```

### 3. 컨테이너 관리

```bash
# 실행 중인 컨테이너 확인
docker ps

# 모든 컨테이너 확인 (중지된 것 포함)
docker ps -a

# 컨테이너 중지
docker stop my-nginx

# 컨테이너 시작
docker start my-nginx

# 컨테이너 재시작
docker restart my-nginx

# 컨테이너 삭제
docker rm my-nginx

# 컨테이너 로그 확인
docker logs my-nginx

# 실시간 로그
docker logs -f my-nginx
```

## 🚀 실습: 웹 서버 실행하기

### Nginx 웹 서버 실행

```bash
# Nginx 컨테이너 실행
docker run -d --name web-server -p 80:80 nginx

# 브라우저에서 http://localhost 접속하여 확인
```

### Node.js 애플리케이션 실행

```bash
# Node.js 컨테이너에서 명령 실행
docker run -it node:18 bash

# 내부에서 Node.js 실행
node -v
npm -v
```

## 📁 볼륨 (Volume)

컨테이너의 데이터를 영구적으로 저장하는 방법입니다.

### 볼륨 마운트

```bash
# 호스트 디렉토리 마운트
docker run -d -p 80:80 \
  -v /Users/myname/html:/usr/share/nginx/html \
  nginx

# 볼륨 생성 및 사용
docker volume create my-volume
docker run -d -v my-volume:/data nginx
```

### 볼륨 관리

```bash
# 볼륨 목록
docker volume ls

# 볼륨 상세 정보
docker volume inspect my-volume

# 볼륨 삭제
docker volume rm my-volume
```

## 🌐 네트워크

컨테이너 간 통신을 위한 네트워크 설정입니다.

```bash
# 네트워크 생성
docker network create my-network

# 네트워크에 컨테이너 연결
docker run -d --name db --network my-network mysql
docker run -d --name app --network my-network node-app

# 네트워크 목록
docker network ls

# 네트워크 삭제
docker network rm my-network
```

## 💻 컨테이너 내부 접근

```bash
# 실행 중인 컨테이너에 접속
docker exec -it my-nginx bash

# 파일 복사 (호스트 → 컨테이너)
docker cp ./index.html my-nginx:/usr/share/nginx/html/

# 파일 복사 (컨테이너 → 호스트)
docker cp my-nginx:/etc/nginx/nginx.conf ./
```

## 🎓 실습 예제

### MySQL 데이터베이스 실행

```bash
# MySQL 컨테이너 실행
docker run -d \
  --name my-mysql \
  -e MYSQL_ROOT_PASSWORD=my-secret-pw \
  -e MYSQL_DATABASE=mydb \
  -p 3306:3306 \
  mysql:8

# MySQL 접속
docker exec -it my-mysql mysql -uroot -pmy-secret-pw

# 데이터베이스 확인
SHOW DATABASES;
USE mydb;
```

### Redis 캐시 서버 실행

```bash
# Redis 컨테이너 실행
docker run -d --name my-redis -p 6379:6379 redis

# Redis CLI 접속
docker exec -it my-redis redis-cli

# 명령 테스트
SET name "Docker"
GET name
```

## 🧹 정리 명령어

```bash
# 중지된 모든 컨테이너 삭제
docker container prune

# 사용하지 않는 이미지 삭제
docker image prune

# 사용하지 않는 볼륨 삭제
docker volume prune

# 모든 것 정리
docker system prune -a
```

## 💡 유용한 팁

### 1. 컨테이너 리소스 제한

```bash
# 메모리 제한
docker run -d --memory="512m" nginx

# CPU 제한
docker run -d --cpus="1.5" nginx
```

### 2. 환경 변수 전달

```bash
# 환경 변수 설정
docker run -d \
  -e NODE_ENV=production \
  -e PORT=3000 \
  node-app
```

### 3. 컨테이너 상태 모니터링

```bash
# 리소스 사용량 확인
docker stats

# 특정 컨테이너만
docker stats my-nginx
```

## 📚 다음 학습

다음 포스트에서는 Dockerfile을 작성하여 자신만의 커스텀 이미지를 만드는 방법을 배웁니다.

---

**학습 완료!** Docker의 기본 개념과 명령어를 마스터했습니다.
