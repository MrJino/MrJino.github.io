관계형 데이터베이스는 데이터를 **행(row)과 열(column)로 이루어진 표(table)** 형태로 나누어 저장하고, 기본 키와 외래 키로 표 사이의 관계를 표현합니다. SQL은 이 데이터를 조회하고 추가·수정·삭제하는 언어입니다.

이 글은 고객(`customers`)과 주문(`orders`) 테이블을 예로 들어 SQL의 기본 흐름을 설명합니다. PostgreSQL, MySQL, SQL Server도 핵심 개념은 같지만 일부 함수와 행 제한 문법 등은 다르므로 마지막의 **DB별 차이**도 함께 확인하세요.

> 실무 데이터베이스를 처음 만질 때는 운영 DB가 아닌 연습용 DB에서 시작하세요. 특히 `UPDATE`와 `DELETE`는 실행 전에 같은 조건의 `SELECT`로 대상 행을 확인하는 습관이 중요합니다.

## 1. SELECT와 FROM: 필요한 열 조회하기

가장 기본적인 조회문은 `SELECT 열 FROM 테이블`입니다.

```sql
SELECT name, email
FROM customers;
```

`SELECT *`는 모든 열을 가져오므로 탐색할 때 편리하지만, 서비스 코드에서는 필요한 열만 적는 편이 좋습니다. 응답 크기가 줄고, 테이블에 열이 추가되어도 결과 형식이 뜻밖에 바뀌지 않기 때문입니다.

열 이름을 읽기 쉽게 바꾸고 싶다면 별칭 `AS`를 사용합니다.

```sql
SELECT
  name AS customer_name,
  city AS customer_city
FROM customers;
```

## 2. WHERE: 원하는 행만 필터링하기

`WHERE`는 각 행에 조건을 적용합니다. 문자열은 작은따옴표로 감싸고, 여러 조건은 `AND`·`OR`로 연결합니다.

```sql
SELECT id, name, city
FROM customers
WHERE city = '서울';
```

```sql
SELECT id, customer_id, total_amount
FROM orders
WHERE status = 'paid'
  AND total_amount >= 30000;
```

자주 쓰는 조건 연산자는 다음과 같습니다.

| 표현 | 의미 | 예 |
| --- | --- | --- |
| `=`, `<>` | 같음, 같지 않음 | `status <> 'cancelled'` |
| `>`, `>=`, `<`, `<=` | 크기 비교 | `total_amount >= 30000` |
| `BETWEEN` | 양 끝을 포함한 범위 | `total_amount BETWEEN 10000 AND 30000` |
| `IN` | 목록 중 하나와 일치 | `city IN ('서울', '부산')` |
| `LIKE` | 문자열 패턴 검색 | `email LIKE '%@example.com'` |

`AND`가 `OR`보다 먼저 계산됩니다. 의도를 분명히 하려면 괄호를 사용하세요.

```sql
SELECT id, name, city
FROM customers
WHERE (city = '서울' OR city = '부산')
  AND name LIKE '김%';
```

## 3. ORDER BY와 LIMIT: 정렬하고 일부만 보기

`ORDER BY`가 없으면 결과 행의 순서는 보장되지 않습니다. 최신 주문처럼 순서가 중요한 조회는 정렬 기준을 명시해야 합니다.

```sql
SELECT id, customer_id, total_amount, ordered_at
FROM orders
ORDER BY ordered_at DESC, id DESC
LIMIT 3;
```

`ASC`는 오름차순, `DESC`는 내림차순입니다. 첫 번째 정렬 값이 같은 경우 다음 표현식인 `id DESC`가 순서를 결정합니다. `LIMIT`만 쓰고 `ORDER BY`를 생략하면 어떤 3개 행이 선택될지 기대하기 어렵습니다.

페이지를 넘길 때는 다음처럼 건너뛸 행 수를 지정할 수 있습니다.

```sql
SELECT id, ordered_at
FROM orders
ORDER BY ordered_at DESC, id DESC
LIMIT 2 OFFSET 2;
```

데이터가 큰 서비스에서는 높은 `OFFSET`이 느려질 수 있습니다. 마지막으로 본 `(ordered_at, id)` 이후를 조회하는 키셋 페이지네이션도 검토하세요.

## 4. INSERT: 새 행 추가하기

`INSERT`는 테이블에 행을 추가합니다. 열 목록을 생략할 수도 있지만, 테이블 구조가 바뀌었을 때 오류를 줄이려면 열을 명시하는 편이 안전합니다.

```sql
INSERT INTO customers (id, name, email, city)
VALUES (5, '정가을', 'gaeul@example.com', '대전');
```

여러 행도 한 번에 넣을 수 있습니다.

```sql
INSERT INTO orders (id, customer_id, status, total_amount, ordered_at) VALUES
  (106, 5, 'pending', 21000, '2026-10-06'),
  (107, 2, 'paid',    39000, '2026-10-06');
```

애플리케이션에서 사용자 입력을 SQL 문자열에 이어 붙이면 SQL 삽입 공격에 노출됩니다. 실제 코드에서는 드라이버가 제공하는 **매개변수 바인딩**을 사용하세요. 플레이스홀더 모양은 드라이버마다 다릅니다.

```js
// Node.js의 예시: 값은 SQL 문자열과 분리해서 전달한다.
const statement = database.prepare(
  'SELECT id, name FROM customers WHERE email = ?',
);
const customer = statement.get(userInputEmail);
```

## 5. UPDATE: 기존 행 수정하기

`UPDATE`는 조건에 맞는 행의 값을 바꿉니다. 먼저 `SELECT`로 대상을 확인한 뒤 같은 `WHERE` 조건을 사용합니다.

```sql
SELECT id, status
FROM orders
WHERE id = 102;

UPDATE orders
SET status = 'paid'
WHERE id = 102;
```

`WHERE`를 빠뜨리면 모든 행이 바뀝니다. 수정 후에는 다시 조회해 결과를 확인합니다.

```sql
SELECT id, status
FROM orders
WHERE id = 102;
```

여러 값을 함께 바꿀 때는 쉼표로 구분합니다.

```sql
UPDATE customers
SET name = '이푸른', city = '인천'
WHERE id = 2;
```

## 6. DELETE: 행 삭제하기

`DELETE`도 `WHERE`가 없으면 테이블의 모든 행을 삭제합니다. 아래 예시는 확인과 삭제를 하나의 트랜잭션으로 묶고, 마지막에 되돌립니다.

```sql
BEGIN;

SELECT id, status
FROM orders
WHERE id = 104 AND status = 'cancelled';

DELETE FROM orders
WHERE id = 104 AND status = 'cancelled';

SELECT changes() AS deleted_row_count;

ROLLBACK;
```

SQLite의 `changes()`는 가장 최근 `INSERT`, `UPDATE`, `DELETE`가 바꾼 행 수를 알려 줍니다. PostgreSQL·MySQL·SQL Server에서는 영향을 받은 행 수를 확인하는 API나 문법이 다릅니다.

## 7. JOIN: 관계가 있는 표 합치기

주문에는 고객 이름 대신 `customer_id`가 저장되어 있습니다. `JOIN`은 이 키를 기준으로 두 테이블의 열을 한 결과에 모읍니다.

```sql
SELECT
  o.id AS order_id,
  c.name AS customer_name,
  o.status,
  o.total_amount
FROM orders AS o
INNER JOIN customers AS c
  ON c.id = o.customer_id
ORDER BY o.id;
```

`INNER JOIN`은 양쪽에 일치하는 행만 반환합니다. 주문이 없는 고객까지 보고 싶다면 `LEFT JOIN`을 사용합니다.

```sql
SELECT
  c.id,
  c.name,
  COUNT(o.id) AS order_count
FROM customers AS c
LEFT JOIN orders AS o
  ON o.customer_id = c.id
GROUP BY c.id, c.name
ORDER BY c.id;
```

`LEFT JOIN` 뒤 오른쪽 테이블의 조건을 `WHERE`에 쓰면 일치하지 않는 행이 제거되어 사실상 `INNER JOIN`처럼 될 수 있습니다. 주문이 없는 고객도 유지하면서 결제 완료 주문만 연결하려면 조건을 `ON`에 둡니다.

```sql
SELECT c.name, o.id AS paid_order_id
FROM customers AS c
LEFT JOIN orders AS o
  ON o.customer_id = c.id
 AND o.status = 'paid'
ORDER BY c.id, o.id;
```

## 8. GROUP BY와 HAVING: 묶어서 집계하기

`COUNT`, `SUM`, `AVG`, `MIN`, `MAX` 같은 집계 함수는 여러 행을 요약합니다. `GROUP BY`는 같은 값을 가진 행끼리 묶습니다.

```sql
SELECT
  customer_id,
  COUNT(*) AS paid_order_count,
  SUM(total_amount) AS paid_total
FROM orders
WHERE status = 'paid'
GROUP BY customer_id
ORDER BY paid_total DESC;
```

처리 흐름을 단순화하면 다음과 같습니다.

1. `FROM`과 `JOIN`으로 입력 행을 만듭니다.
2. `WHERE`로 개별 행을 거릅니다.
3. `GROUP BY`로 행을 그룹화합니다.
4. `HAVING`으로 집계된 그룹을 거릅니다.
5. `SELECT` 결과를 만들고 `ORDER BY`, `LIMIT`을 적용합니다.

`WHERE`에는 아직 계산되지 않은 집계 결과를 쓸 수 없습니다. 합계가 30000원 이상인 고객 그룹만 보려면 `HAVING`을 사용합니다.

```sql
SELECT
  c.id,
  c.name,
  SUM(o.total_amount) AS paid_total
FROM customers AS c
JOIN orders AS o
  ON o.customer_id = c.id
WHERE o.status = 'paid'
GROUP BY c.id, c.name
HAVING SUM(o.total_amount) >= 30000
ORDER BY paid_total DESC;
```

일부 DB가 느슨한 쿼리를 받아 주더라도, 집계하지 않은 `SELECT` 열은 원칙적으로 `GROUP BY`에 명시하는 습관이 이식성과 예측 가능성을 높입니다.

## 9. NULL은 값이 아니라 ‘알 수 없음’

`NULL`은 0이나 빈 문자열이 아니라 값이 없거나 알려지지 않았다는 표시입니다. 따라서 `city = NULL`은 원하는 결과를 만들지 않습니다. `IS NULL` 또는 `IS NOT NULL`을 사용합니다.

```sql
SELECT id, name
FROM customers
WHERE city IS NULL;
```

표시할 때 대체값이 필요하면 `COALESCE`를 사용할 수 있습니다. 왼쪽부터 살펴보고 처음 만난 NULL이 아닌 값을 반환합니다.

```sql
SELECT
  name,
  COALESCE(city, '지역 미등록') AS city
FROM customers
ORDER BY id;
```

NULL이 섞인 비교의 결과는 보통 `TRUE`나 `FALSE`가 아니라 `UNKNOWN`입니다. `WHERE`는 참인 행만 남기므로 UNKNOWN인 행은 제외됩니다. 또 `COUNT(*)`는 행 수를 세지만 `COUNT(city)`는 NULL이 아닌 `city`만 셉니다.

```sql
SELECT
  COUNT(*) AS all_customers,
  COUNT(city) AS customers_with_city
FROM customers;
```

## 10. ALTER TABLE: 테이블 구조 변경하기

`ALTER TABLE`은 이미 만들어진 테이블의 구조를 바꾸는 DDL(Data Definition Language)입니다. 열 추가·이름 변경·삭제뿐 아니라 데이터 타입, 기본값, `NOT NULL` 같은 제약 조건을 변경할 때 사용합니다. 지원 문법과 잠금 방식은 DB 제품과 버전에 따라 다르므로, 운영 환경에서는 백업과 복구 방법을 확인하고 마이그레이션으로 기록한 뒤 테스트 환경에서 먼저 실행하세요.

```sql
-- 열 추가
ALTER TABLE customers ADD COLUMN phone VARCHAR(30);

-- 열 이름 변경
ALTER TABLE customers RENAME COLUMN phone TO phone_number;

-- 열 삭제
ALTER TABLE customers DROP COLUMN phone_number;
```

### nullable이란 무엇인가

열이 **nullable**하다는 것은 그 열에 `NULL`을 저장할 수 있다는 뜻입니다. `NOT NULL` 열은 모든 행에 값이 있어야 하고, nullable 열은 아직 값이 없거나 알 수 없는 상태를 허용합니다. `NOT NULL`을 제거하면 기존 데이터가 즉시 바뀌지는 않지만 앞으로 `NULL`이 들어올 수 있으므로, 변경 전에 다음 영향을 확인해야 합니다.

- 애플리케이션 코드가 해당 값을 항상 존재한다고 가정하는지
- 조회, 정렬, 집계, `JOIN`, 인덱스와 제약 조건이 `NULL`을 올바르게 처리하는지
- API 응답 형식과 화면에 대체값 또는 별도 상태 처리가 필요한지
- 큰 테이블에서 잠금이나 테이블 재작성으로 서비스가 지연될 가능성이 있는지

`customers.city`를 `NOT NULL`에서 NULL 허용으로 바꾸는 문법은 DB마다 다릅니다.

```sql
-- PostgreSQL: 타입을 다시 적지 않는다.
ALTER TABLE customers
  ALTER COLUMN city DROP NOT NULL;

-- MySQL: 현재 타입과 유지할 속성을 모두 다시 적는다.
ALTER TABLE customers
  MODIFY COLUMN city VARCHAR(100) NULL;

-- SQL Server: 현재 타입·길이를 다시 적는다.
ALTER TABLE customers
  ALTER COLUMN city NVARCHAR(100) NULL;
```

MySQL의 `MODIFY COLUMN`은 생략한 기존 속성을 자동으로 유지하지 않습니다. 타입뿐 아니라 유지해야 할 `DEFAULT`, 문자 집합, 정렬 규칙, 주석 등의 전체 정의를 먼저 확인해 그대로 적어야 합니다. SQL Server도 nullability를 바꿀 때 현재 데이터 타입과 길이·정밀도·스케일을 함께 명시해야 합니다.

### SQLite는 버전을 먼저 확인한다

SQLite 3.53.0(2026년 4월 9일)부터 `ALTER ... DROP NOT NULL`과 `SET NOT NULL`을 직접 지원합니다. 배포 환경의 내장 SQLite가 더 오래된 경우가 많으므로 먼저 실제 버전을 확인하세요.

```sql
SELECT sqlite_version();

-- SQLite 3.53.0 이상
ALTER TABLE customers ALTER city DROP NOT NULL;
```

SQLite 3.52.x 이하에서는 `ALTER COLUMN`으로 nullability를 직접 변경할 수 없습니다. 이때는 공식 문서의 안전한 테이블 재구성 절차를 따릅니다.

1. 외래 키가 켜져 있다면 트랜잭션 시작 **전**에 `PRAGMA foreign_keys=OFF`로 끕니다.
2. 트랜잭션을 시작하고 기존 인덱스·트리거·뷰의 SQL을 `sqlite_schema`에서 보관합니다.
3. 원하는 nullable 정의로 새 테이블을 만들고, 열을 명시한 `INSERT INTO new_customers (...) SELECT ... FROM customers`로 데이터를 복사합니다.
4. 기존 테이블을 삭제한 뒤 새 테이블을 원래 이름으로 바꿉니다. 기존 테이블부터 임시 이름으로 바꾸는 순서는 참조를 잘못 변경할 수 있으므로 피합니다.
5. 보관한 인덱스·트리거·뷰를 새 구조에 맞춰 다시 만들고 `PRAGMA foreign_key_check` 결과가 비어 있는지 확인합니다.
6. 검증이 끝나면 커밋하고, 원래 켜져 있던 외래 키 검사를 다시 켭니다.

`PRAGMA writable_schema=ON`으로 `sqlite_schema` 텍스트를 직접 고치는 방법도 문서에 나오지만, 작은 오타만으로 DB를 읽을 수 없게 만들 수 있습니다. 일반적인 마이그레이션에서는 이 방법을 사용하지 말고 위 재구성 절차를 권장합니다.

### NULL 허용 열을 NOT NULL로 바꿀 때

반대 방향은 기존 `NULL` 행이 하나라도 있으면 실패합니다. 먼저 대상과 건수를 조회하고, 업무 규칙에 따라 올바른 값으로 보완하거나 불필요한 행을 삭제한 뒤 다시 검증하세요. 의미를 모르는 데이터를 임의의 빈 문자열이나 0으로 채워서는 안 됩니다.

```sql
SELECT id, name
FROM customers
WHERE city IS NULL;

SELECT COUNT(*) AS null_count
FROM customers
WHERE city IS NULL;
```

`null_count`가 0임을 확인한 다음 제약을 추가합니다.

```sql
-- PostgreSQL
ALTER TABLE customers
  ALTER COLUMN city SET NOT NULL;

-- MySQL: 유지할 전체 열 정의를 다시 적는다.
ALTER TABLE customers
  MODIFY COLUMN city VARCHAR(100) NOT NULL;

-- SQL Server: 현재 타입·길이를 다시 적는다.
ALTER TABLE customers
  ALTER COLUMN city NVARCHAR(100) NOT NULL;

-- SQLite 3.53.0 이상
ALTER TABLE customers ALTER city SET NOT NULL;
```

조회와 실제 변경 사이에 다른 트랜잭션이 `NULL`을 추가할 수 있으므로, 운영 마이그레이션에서는 DB에 맞는 잠금·트랜잭션 전략으로 검증과 제약 추가를 하나의 안전한 절차로 묶으세요. SQLite 3.52.x 이하에서 `NOT NULL`을 추가할 때도 앞서 설명한 테이블 재구성 절차가 필요합니다.

## 11. 트랜잭션: 여러 변경을 하나의 작업으로 묶기

트랜잭션은 여러 SQL 변경을 전부 성공시키거나 전부 되돌리는 작업 단위입니다. 계좌 이체, 주문과 재고 차감처럼 중간 상태가 남으면 안 되는 작업에 필요합니다.

```sql
BEGIN;

INSERT INTO orders (id, customer_id, status, total_amount, ordered_at)
VALUES (108, 4, 'paid', 15000, '2026-10-07');

UPDATE customers
SET city = '광주'
WHERE id = 4;

COMMIT;
```

검증에 실패하거나 오류가 생기면 `COMMIT` 대신 `ROLLBACK`합니다.

```sql
BEGIN;

UPDATE orders
SET status = 'cancelled'
WHERE id = 103;

-- 결과가 의도와 다르다면 변경 전체를 취소한다.
ROLLBACK;
```

트랜잭션을 오래 열어 두면 잠금 경합이 커질 수 있습니다. 네트워크 호출이나 사용자 입력을 기다리는 작업은 가능하면 트랜잭션 밖에서 처리하고, DB 작업은 짧게 묶으세요. SQLite의 `BEGIN` 트랜잭션은 중첩되지 않으므로 부분 단위가 필요하면 `SAVEPOINT`를 사용합니다.

## 12. 기본 문법을 연결한 복합 조회

다음 쿼리는 **서울 고객별 결제 완료 주문 수와 총액**을 구하고, 총액이 30000원 이상인 고객을 큰 금액순으로 최대 10명 보여 줍니다. `JOIN`, `WHERE`, `GROUP BY`, `HAVING`, `ORDER BY`, `LIMIT`을 한 번에 연결한 예입니다.

```sql
SELECT
  c.id AS customer_id,
  c.name,
  COUNT(o.id) AS paid_order_count,
  SUM(o.total_amount) AS paid_total
FROM customers AS c
JOIN orders AS o
  ON o.customer_id = c.id
WHERE c.city = '서울'
  AND o.status = 'paid'
GROUP BY c.id, c.name
HAVING SUM(o.total_amount) >= 30000
ORDER BY paid_total DESC, c.id ASC
LIMIT 10;
```

실제 결과는 각 테이블에 저장된 고객과 주문 데이터에 따라 달라집니다.

## 13. DB 제품별로 달라지는 부분

SQL의 중심 문법은 비슷하지만 제품별 방언(dialect)이 있습니다. 예제를 다른 DB로 옮길 때 다음을 확인하세요.

| 항목 | SQLite | PostgreSQL | MySQL | SQL Server |
| --- | --- | --- | --- | --- |
| 행 수 제한 | `LIMIT 10` | `LIMIT 10` 또는 표준형 `FETCH FIRST` | `LIMIT 10` | `TOP (10)` 또는 `OFFSET … FETCH` |
| 자동 증가 키 | `INTEGER PRIMARY KEY` | `GENERATED … AS IDENTITY` | `AUTO_INCREMENT` | `IDENTITY` |
| 불리언 | 보통 0과 1로 저장 | `boolean` | `BOOLEAN`은 `TINYINT(1)`의 동의어 | `bit` |
| 문자열 연결 | <code>\|\|</code> | <code>\|\|</code> | 보통 `CONCAT()` | `+` 또는 `CONCAT()` |
| 현재 시각 | `CURRENT_TIMESTAMP` | `CURRENT_TIMESTAMP` | `CURRENT_TIMESTAMP` | `CURRENT_TIMESTAMP` |

날짜 계산, 대소문자 구분, NULL 정렬 기본값, `RETURNING`, UPSERT, JSON 함수도 차이가 큽니다. 운영 DB의 버전에 맞는 공식 문서를 확인하고, “한 DB에서 실행됐다”를 표준 SQL이라고 단정하지 않는 것이 좋습니다.

## 14. 실무에서 지킬 안전 수칙

- 운영 DB에 쓰기 전에 백업과 복구 절차를 확인합니다.
- `UPDATE`·`DELETE` 전에는 같은 `WHERE`의 `SELECT`로 대상과 건수를 검토합니다.
- 여러 변경은 트랜잭션으로 묶고 실패 시 `ROLLBACK`합니다.
- 사용자 입력은 문자열 연결 대신 매개변수로 바인딩합니다.
- 앱 계정에는 필요한 테이블과 작업만 허용하는 최소 권한을 부여합니다.
- 기본 키, 외래 키, `NOT NULL`, `UNIQUE`, `CHECK`로 잘못된 데이터를 DB에서도 막습니다.
- 중요한 쿼리는 실행 계획을 확인하고, 측정 없이 무작정 인덱스를 추가하지 않습니다.
- 개인정보나 인증정보가 포함된 SQL과 결과를 로그에 그대로 남기지 않습니다.
- 스키마 변경은 버전 관리되는 마이그레이션으로 기록하고 되돌리기 방법을 준비합니다.

## 마무리

기본 SQL은 `SELECT`로 시작하지만, 실무에서는 **관계를 정확히 연결하고 안전하게 변경하는 능력**까지 함께 필요합니다. `FROM`과 `JOIN`으로 데이터를 만들고, `WHERE`로 행을 거르고, `GROUP BY`와 `HAVING`으로 요약하며, `ORDER BY`와 `LIMIT`으로 결과를 정리하는 흐름을 익혀 두세요.

쓰기 쿼리에서는 한 가지 규칙을 먼저 습관으로 만들면 좋습니다. **조회로 대상을 확인하고, 트랜잭션 안에서 변경하고, 영향받은 행을 다시 확인한다.** 이 절차만 지켜도 초보 단계에서 발생하는 큰 실수를 상당수 예방할 수 있습니다.

## 공식 문서

- [SQLite SELECT 문서](https://www.sqlite.org/lang_select.html)
- [SQLite INSERT 문서](https://www.sqlite.org/lang_insert.html)
- [SQLite UPDATE 문서](https://www.sqlite.org/lang_update.html)
- [SQLite DELETE 문서](https://www.sqlite.org/lang_delete.html)
- [SQLite 트랜잭션 문서](https://www.sqlite.org/lang_transaction.html)
- [SQLite 외래 키 문서](https://www.sqlite.org/foreignkeys.html)
- [SQLite ALTER TABLE 문서](https://www.sqlite.org/lang_altertable.html)
- [PostgreSQL SELECT 문서](https://www.postgresql.org/docs/current/sql-select.html)
- [PostgreSQL 테이블 식과 JOIN 문서](https://www.postgresql.org/docs/current/queries-table-expressions.html)
- [PostgreSQL 데이터 정의 문서](https://www.postgresql.org/docs/current/ddl.html)
- [PostgreSQL ALTER TABLE 문서](https://www.postgresql.org/docs/current/sql-altertable.html)
- [MySQL SELECT 문서](https://dev.mysql.com/doc/refman/8.4/en/select.html)
- [MySQL CREATE TABLE 문서](https://dev.mysql.com/doc/refman/8.4/en/create-table.html)
- [MySQL ALTER TABLE 문서](https://dev.mysql.com/doc/refman/8.4/en/alter-table.html)
- [SQL Server SELECT 문서](https://learn.microsoft.com/sql/t-sql/queries/select-transact-sql)
- [SQL Server TOP 문서](https://learn.microsoft.com/sql/t-sql/queries/top-transact-sql)
- [SQL Server ALTER TABLE 문서](https://learn.microsoft.com/sql/t-sql/statements/alter-table-transact-sql)
