# Python 기본 문법

## 📚 Python이란?

Python은 읽기 쉽고 배우기 쉬운 고급 프로그래밍 언어입니다. 웹 개발, 데이터 분석, 인공지능, 자동화 등 다양한 분야에서 사용됩니다.

### Python의 특징

- **간결한 문법**: 읽기 쉽고 작성하기 쉬움
- **동적 타입**: 변수 타입을 명시하지 않아도 됨
- **풍부한 라이브러리**: 다양한 표준 라이브러리와 서드파티 패키지
- **크로스 플랫폼**: Windows, macOS, Linux에서 모두 실행 가능

## 🎯 기본 문법

### 1. 변수와 자료형

```python
# 정수형 (int)
age = 25
count = 100

# 실수형 (float)
height = 175.5
pi = 3.14159

# 문자열 (str)
name = "홍길동"
message = '안녕하세요'

# 불리언 (bool)
is_student = True
is_working = False

# 타입 확인
print(type(age))      # <class 'int'>
print(type(height))   # <class 'float'>
print(type(name))     # <class 'str'>
```

### 2. 문자열

```python
# 문자열 연결
first_name = "길동"
last_name = "홍"
full_name = last_name + first_name
print(full_name)  # 홍길동

# 문자열 반복
print("=" * 20)   # ====================

# f-string (Python 3.6+)
age = 25
print(f"나이: {age}세")
print(f"10년 후: {age + 10}세")

# 문자열 메서드
text = "Hello, Python!"
print(text.lower())      # hello, python!
print(text.upper())      # HELLO, PYTHON!
print(text.replace("Python", "World"))  # Hello, World!
print(text.split(","))   # ['Hello', ' Python!']
```

### 3. 리스트 (List)

```python
# 리스트 생성
fruits = ["사과", "바나나", "체리"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", 3.14, True]

# 인덱싱
print(fruits[0])   # 사과
print(fruits[-1])  # 체리 (마지막 요소)

# 슬라이싱
print(numbers[1:4])    # [2, 3, 4]
print(numbers[:3])     # [1, 2, 3]
print(numbers[2:])     # [3, 4, 5]

# 리스트 메서드
fruits.append("오렌지")        # 끝에 추가
fruits.insert(1, "포도")       # 특정 위치에 삽입
fruits.remove("바나나")        # 값으로 삭제
popped = fruits.pop()         # 마지막 요소 제거 및 반환

# 리스트 정렬
numbers.sort()                # 오름차순 정렬
numbers.sort(reverse=True)    # 내림차순 정렬
```

### 4. 딕셔너리 (Dictionary)

```python
# 딕셔너리 생성
person = {
    "name": "홍길동",
    "age": 25,
    "city": "서울"
}

# 값 가져오기
print(person["name"])         # 홍길동
print(person.get("age"))      # 25
print(person.get("phone", "없음"))  # 없음 (기본값)

# 값 추가/수정
person["email"] = "hong@example.com"
person["age"] = 26

# 값 삭제
del person["city"]

# 딕셔너리 메서드
print(person.keys())          # 모든 키
print(person.values())        # 모든 값
print(person.items())         # (키, 값) 쌍
```

### 5. 튜플 (Tuple)

```python
# 튜플 생성 (변경 불가능)
coordinates = (10, 20)
rgb = (255, 0, 0)

# 값 접근
x, y = coordinates
print(x, y)  # 10 20

# 튜플은 변경 불가
# coordinates[0] = 30  # 에러!
```

### 6. 집합 (Set)

```python
# 집합 생성 (중복 불가, 순서 없음)
numbers = {1, 2, 3, 3, 4, 5}
print(numbers)  # {1, 2, 3, 4, 5}

# 집합 연산
a = {1, 2, 3}
b = {3, 4, 5}

print(a | b)   # 합집합: {1, 2, 3, 4, 5}
print(a & b)   # 교집합: {3}
print(a - b)   # 차집합: {1, 2}
```

## 🔄 제어문

### 1. if 조건문

```python
age = 20

if age >= 18:
    print("성인입니다")
elif age >= 13:
    print("청소년입니다")
else:
    print("어린이입니다")

# 삼항 연산자
status = "성인" if age >= 18 else "미성년자"
```

### 2. for 반복문

```python
# 리스트 순회
fruits = ["사과", "바나나", "체리"]
for fruit in fruits:
    print(fruit)

# range 사용
for i in range(5):        # 0, 1, 2, 3, 4
    print(i)

for i in range(1, 6):     # 1, 2, 3, 4, 5
    print(i)

for i in range(0, 10, 2): # 0, 2, 4, 6, 8
    print(i)

# enumerate 사용
for idx, fruit in enumerate(fruits):
    print(f"{idx}: {fruit}")
```

### 3. while 반복문

```python
count = 0
while count < 5:
    print(count)
    count += 1

# 무한 루프 (조심!)
while True:
    user_input = input("종료하려면 'quit' 입력: ")
    if user_input == 'quit':
        break
```

### 4. break, continue

```python
# break: 루프 종료
for i in range(10):
    if i == 5:
        break
    print(i)  # 0, 1, 2, 3, 4

# continue: 다음 반복으로
for i in range(5):
    if i == 2:
        continue
    print(i)  # 0, 1, 3, 4
```

## 💻 입출력

### 입력

```python
# 사용자 입력
name = input("이름을 입력하세요: ")
print(f"안녕하세요, {name}님!")

# 숫자 입력
age = int(input("나이를 입력하세요: "))
height = float(input("키를 입력하세요: "))
```

### 출력

```python
# 기본 출력
print("Hello, World!")

# 여러 값 출력
print("이름:", name, "나이:", age)

# 포맷팅
print("이름: {}, 나이: {}".format(name, age))
print(f"이름: {name}, 나이: {age}")

# 구분자 변경
print("a", "b", "c", sep="-")  # a-b-c

# 줄바꿈 없이
print("Hello", end=" ")
print("World")  # Hello World
```

## 🎓 실습 예제

### 1. 계산기

```python
num1 = float(input("첫 번째 숫자: "))
num2 = float(input("두 번째 숫자: "))

print(f"더하기: {num1 + num2}")
print(f"빼기: {num1 - num2}")
print(f"곱하기: {num1 * num2}")
print(f"나누기: {num1 / num2}")
```

### 2. 구구단

```python
dan = int(input("단을 입력하세요: "))

for i in range(1, 10):
    print(f"{dan} x {i} = {dan * i}")
```

### 3. 최대값 찾기

```python
numbers = [45, 23, 78, 12, 90, 34]

max_num = numbers[0]
for num in numbers:
    if num > max_num:
        max_num = num

print(f"최대값: {max_num}")

# 또는 내장 함수 사용
print(f"최대값: {max(numbers)}")
```

## 💡 실습 과제

1. 사용자에게 이름과 나이를 입력받아 인사하는 프로그램 작성
2. 1부터 100까지의 합을 계산하는 프로그램
3. 리스트에서 짝수만 출력하는 프로그램
4. 간단한 투두 리스트 프로그램 (추가, 삭제, 조회)

## 📚 다음 학습

다음 포스트에서는 함수를 정의하고 모듈을 사용하는 방법을 배웁니다.

---

**학습 완료!** Python의 기본 문법을 마스터했습니다.
