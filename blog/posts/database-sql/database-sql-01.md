# SQL 기본 문법

## 📚 SQL이란?

SQL(Structured Query Language)은 관계형 데이터베이스에서 데이터를 관리하고 조작하기 위한 표준 언어입니다.

### SQL의 종류

- **DDL** (Data Definition Language): 데이터 정의어 - CREATE, ALTER, DROP
- **DML** (Data Manipulation Language): 데이터 조작어 - SELECT, INSERT, UPDATE, DELETE
- **DCL** (Data Control Language): 데이터 제어어 - GRANT, REVOKE
- **TCL** (Transaction Control Language): 트랜잭션 제어어 - COMMIT, ROLLBACK

## 🎯 SELECT - 데이터 조회

### 기본 SELECT

```sql
-- 모든 컬럼 조회
SELECT * FROM users;

-- 특정 컬럼 조회
SELECT name, email FROM users;

-- 별칭(alias) 사용
SELECT name AS 이름, email AS 이메일 FROM users;
```

### WHERE 조건절

```sql
-- 단일 조건
SELECT * FROM users WHERE age >= 20;

-- 여러 조건 (AND)
SELECT * FROM users WHERE age >= 20 AND city = 'Seoul';

-- 여러 조건 (OR)
SELECT * FROM users WHERE city = 'Seoul' OR city = 'Busan';

-- IN 연산자
SELECT * FROM users WHERE city IN ('Seoul', 'Busan', 'Incheon');

-- LIKE 패턴 매칭
SELECT * FROM users WHERE name LIKE '김%';  -- 김으로 시작
SELECT * FROM users WHERE email LIKE '%@gmail.com';  -- @gmail.com으로 끝남
```

### ORDER BY - 정렬

```sql
-- 오름차순 (기본값)
SELECT * FROM users ORDER BY age;
SELECT * FROM users ORDER BY age ASC;

-- 내림차순
SELECT * FROM users ORDER BY age DESC;

-- 다중 정렬
SELECT * FROM users ORDER BY city ASC, age DESC;
```

### LIMIT - 결과 제한

```sql
-- 상위 10개
SELECT * FROM users LIMIT 10;

-- 5번째부터 10개 (OFFSET 사용)
SELECT * FROM users LIMIT 10 OFFSET 5;
```

## ➕ INSERT - 데이터 삽입

### 단일 행 삽입

```sql
INSERT INTO users (name, email, age, city)
VALUES ('홍길동', 'hong@example.com', 25, 'Seoul');
```

### 여러 행 삽입

```sql
INSERT INTO users (name, email, age, city)
VALUES
  ('김철수', 'kim@example.com', 30, 'Busan'),
  ('이영희', 'lee@example.com', 28, 'Incheon'),
  ('박민수', 'park@example.com', 32, 'Seoul');
```

### 특정 컬럼만 삽입

```sql
INSERT INTO users (name, email)
VALUES ('최수진', 'choi@example.com');
-- age와 city는 NULL 또는 DEFAULT 값
```

## 🔄 UPDATE - 데이터 수정

### 단일 행 수정

```sql
UPDATE users
SET age = 26
WHERE name = '홍길동';
```

### 여러 컬럼 수정

```sql
UPDATE users
SET age = 31, city = 'Seoul'
WHERE name = '김철수';
```

### 조건에 맞는 여러 행 수정

```sql
UPDATE users
SET city = 'Seoul'
WHERE age >= 30;
```

> ⚠️ **주의**: WHERE 절을 생략하면 모든 행이 수정됩니다!

## ❌ DELETE - 데이터 삭제

### 조건에 맞는 행 삭제

```sql
DELETE FROM users
WHERE age < 20;
```

### 모든 데이터 삭제

```sql
DELETE FROM users;  -- 모든 행 삭제 (주의!)

TRUNCATE TABLE users;  -- 더 빠른 전체 삭제
```

> ⚠️ **주의**: DELETE는 복구가 어려우므로 항상 WHERE 조건을 확인하세요!

## 📊 집계 함수

### COUNT - 개수 세기

```sql
SELECT COUNT(*) FROM users;  -- 전체 행 개수
SELECT COUNT(DISTINCT city) FROM users;  -- 중복 제거 후 개수
```

### SUM, AVG - 합계와 평균

```sql
SELECT SUM(age) FROM users;  -- 나이 합계
SELECT AVG(age) FROM users;  -- 나이 평균
```

### MIN, MAX - 최소값과 최대값

```sql
SELECT MIN(age), MAX(age) FROM users;
```

## 📑 GROUP BY - 그룹화

```sql
-- 도시별 사용자 수
SELECT city, COUNT(*) as user_count
FROM users
GROUP BY city;

-- 도시별 평균 나이
SELECT city, AVG(age) as avg_age
FROM users
GROUP BY city;

-- HAVING: 그룹화 후 조건
SELECT city, COUNT(*) as user_count
FROM users
GROUP BY city
HAVING COUNT(*) >= 10;  -- 10명 이상인 도시만
```

## 🎓 실습 예제

### 테이블 생성

```sql
CREATE TABLE products (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  price INT NOT NULL,
  category VARCHAR(50),
  stock INT DEFAULT 0
);
```

### 데이터 삽입

```sql
INSERT INTO products (name, price, category, stock)
VALUES
  ('노트북', 1200000, '전자제품', 10),
  ('마우스', 30000, '전자제품', 50),
  ('키보드', 80000, '전자제품', 30),
  ('책상', 150000, '가구', 5),
  ('의자', 200000, '가구', 8);
```

### 조회 연습

```sql
-- 1. 전자제품 카테고리만 조회
SELECT * FROM products WHERE category = '전자제품';

-- 2. 가격이 10만원 이상인 제품
SELECT * FROM products WHERE price >= 100000;

-- 3. 카테고리별 제품 수와 평균 가격
SELECT category, COUNT(*) as count, AVG(price) as avg_price
FROM products
GROUP BY category;

-- 4. 재고가 적은 순으로 상위 3개
SELECT * FROM products ORDER BY stock ASC LIMIT 3;
```

## 💡 실습 과제

1. 자신만의 테이블을 만들어보세요 (예: books, movies 등)
2. INSERT로 최소 5개의 데이터를 삽입하세요
3. 다양한 WHERE 조건으로 데이터를 조회하세요
4. UPDATE와 DELETE를 안전하게 연습하세요

## 📚 다음 학습

다음 포스트에서는 여러 테이블을 연결하는 JOIN에 대해 배웁니다.

---

**학습 완료!** SQL의 기본 CRUD 작업을 마스터했습니다.
