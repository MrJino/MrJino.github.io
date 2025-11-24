# 시간 복잡도와 Big-O

## 📚 알고리즘의 효율성

같은 문제를 해결하더라도 알고리즘에 따라 실행 시간과 메모리 사용량이 크게 달라집니다. 효율적인 알고리즘을 선택하는 것이 중요합니다.

## 🎯 시간 복잡도란?

시간 복잡도는 입력 크기(n)에 따라 알고리즘의 실행 시간이 어떻게 증가하는지를 나타냅니다.

### Big-O 표기법

최악의 경우를 기준으로 알고리즘의 성능을 표현합니다.

```
O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)
빠름 ←―――――――――――――――――――――――――――――――――――――――――→ 느림
```

## 📊 Big-O 종류와 예제

### 1. O(1) - 상수 시간

입력 크기와 관계없이 항상 일정한 시간이 걸립니다.

```python
def get_first_element(arr):
    return arr[0]  # 항상 1번의 연산

# n이 10이든 1000이든 실행 시간 동일
```

**예시:**
- 배열 인덱스 접근
- 해시맵에서 값 가져오기
- 스택 push/pop

### 2. O(log n) - 로그 시간

입력이 절반씩 줄어듭니다.

```python
def binary_search(arr, target):
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = (left + right) // 2

        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1

# 1000개 → 500개 → 250개 → 125개 → ...
# 약 10번의 비교로 찾을 수 있음
```

**예시:**
- 이진 탐색
- 균형 이진 트리 탐색

### 3. O(n) - 선형 시간

입력 크기에 비례하여 시간이 증가합니다.

```python
def find_max(arr):
    max_val = arr[0]
    for num in arr:  # n번 반복
        if num > max_val:
            max_val = num
    return max_val

# 10개면 10번, 1000개면 1000번 확인
```

**예시:**
- 배열 순회
- 선형 탐색
- 단일 for 루프

### 4. O(n log n) - 선형 로그 시간

효율적인 정렬 알고리즘의 시간 복잡도입니다.

```python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])    # log n 번 분할
    right = merge_sort(arr[mid:])

    return merge(left, right)       # n 번 병합

# 분할(log n) × 병합(n) = O(n log n)
```

**예시:**
- 병합 정렬 (Merge Sort)
- 퀵 정렬 (Quick Sort) - 평균
- 힙 정렬 (Heap Sort)

### 5. O(n²) - 이차 시간

중첩 반복문을 사용할 때 나타납니다.

```python
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):           # n번
        for j in range(n - 1):   # n번
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]

# 10개면 100번, 1000개면 1,000,000번!
```

**예시:**
- 버블 정렬
- 선택 정렬
- 삽입 정렬
- 이중 for 루프

### 6. O(2ⁿ) - 지수 시간

입력이 1 증가할 때마다 실행 시간이 2배씩 증가합니다.

```python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# fibonacci(5) =
#   fibonacci(4) + fibonacci(3)
#     fibonacci(3) + fibonacci(2) + fibonacci(2) + fibonacci(1)
#       ... (중복 계산 많음)
```

**예시:**
- 재귀적 피보나치
- 부분집합 생성
- 하노이 탑

## 📈 시간 복잡도 비교

입력 크기 n = 1000일 때의 연산 횟수:

| Big-O | 연산 횟수 | 설명 |
|-------|----------|------|
| O(1) | 1 | 매우 빠름 |
| O(log n) | ~10 | 빠름 |
| O(n) | 1,000 | 보통 |
| O(n log n) | ~10,000 | 괜찮음 |
| O(n²) | 1,000,000 | 느림 |
| O(2ⁿ) | 10³⁰⁰ | 매우 느림 |

## 🔍 시간 복잡도 분석 연습

### 예제 1: 단일 반복문

```python
def print_items(arr):
    for item in arr:      # O(n)
        print(item)
# 시간 복잡도: O(n)
```

### 예제 2: 이중 반복문

```python
def print_pairs(arr):
    for i in arr:         # O(n)
        for j in arr:     # O(n)
            print(i, j)
# 시간 복잡도: O(n²)
```

### 예제 3: 연속된 반복문

```python
def two_loops(arr):
    for i in arr:         # O(n)
        print(i)

    for j in arr:         # O(n)
        print(j)

# O(n) + O(n) = O(2n) → O(n)
# 상수는 무시됨
```

### 예제 4: 다른 크기의 입력

```python
def compare_arrays(arr1, arr2):
    for i in arr1:        # O(n)
        for j in arr2:    # O(m)
            if i == j:
                print(i)

# 시간 복잡도: O(n × m)
```

### 예제 5: 조건문

```python
def example(n):
    if n < 100:
        return n * 2      # O(1)
    else:
        for i in range(n):  # O(n)
            print(i)

# 최악의 경우: O(n)
```

## 💡 시간 복잡도 개선하기

### 예제: 배열에서 중복 찾기

```python
# ❌ O(n²) - 느림
def has_duplicate_slow(arr):
    for i in range(len(arr)):
        for j in range(i + 1, len(arr)):
            if arr[i] == arr[j]:
                return True
    return False

# ✅ O(n) - 빠름
def has_duplicate_fast(arr):
    seen = set()
    for num in arr:
        if num in seen:
            return True
        seen.add(num)
    return False
```

### 예제: 두 수의 합 찾기

```python
# ❌ O(n²)
def two_sum_slow(arr, target):
    for i in range(len(arr)):
        for j in range(i + 1, len(arr)):
            if arr[i] + arr[j] == target:
                return [i, j]
    return []

# ✅ O(n)
def two_sum_fast(arr, target):
    seen = {}
    for i, num in enumerate(arr):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
```

## 🎓 공간 복잡도

메모리 사용량도 중요합니다.

```python
# 공간 복잡도: O(1)
def sum_array(arr):
    total = 0
    for num in arr:
        total += num
    return total

# 공간 복잡도: O(n)
def create_copy(arr):
    new_arr = []
    for num in arr:
        new_arr.append(num)
    return new_arr
```

## 📝 실전 팁

### 1. 입력 크기 고려

- n ≤ 10: O(n!) 가능
- n ≤ 100: O(n³) 가능
- n ≤ 1,000: O(n²) 가능
- n ≤ 100,000: O(n log n) 필요
- n ≤ 1,000,000: O(n) 필요

### 2. 최적화 우선순위

1. 올바른 알고리즘 선택 (가장 중요!)
2. 불필요한 연산 제거
3. 효율적인 자료구조 사용
4. 세부 최적화

### 3. 실무에서

- 작은 데이터: 가독성 우선
- 큰 데이터: 효율성 우선
- 항상 측정하고 검증

## 💡 연습 문제

1. 배열에서 최소값과 최대값을 동시에 찾기 (O(n)으로 해결)
2. 정렬된 배열에서 특정 값 찾기 (O(log n)으로 해결)
3. 배열에서 가장 많이 등장하는 숫자 찾기 (O(n)으로 해결)

## 📚 다음 학습

다음 포스트에서는 배열과 리스트 자료구조에 대해 자세히 배웁니다.

---

**학습 완료!** 알고리즘 효율성 분석의 기초를 마스터했습니다.
