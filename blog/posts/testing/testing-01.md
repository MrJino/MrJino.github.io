# 테스트의 중요성

## 📚 왜 테스트를 작성해야 할까?

소프트웨어 테스트는 코드의 품질을 보장하고 버그를 조기에 발견하는 필수적인 개발 프로세스입니다.

### 테스트의 장점

- **버그 조기 발견**: 개발 단계에서 문제를 빠르게 찾아 수정
- **리팩토링 자신감**: 코드 변경 시 기존 기능이 깨지지 않는지 확인
- **문서화**: 테스트 코드가 사용 예시가 됨
- **개발 속도 향상**: 장기적으로 개발 및 유지보수 시간 단축

## 🎯 테스트의 종류

### 1. 단위 테스트 (Unit Test)

개별 함수나 메서드의 동작을 검증합니다.

```kotlin
// 테스트 대상 코드
class Calculator {
    fun add(a: Int, b: Int): Int = a + b
    fun subtract(a: Int, b: Int): Int = a - b
}

// 단위 테스트
@Test
fun `2와 3을 더하면 5가 나온다`() {
    val calculator = Calculator()
    val result = calculator.add(2, 3)
    assertEquals(5, result)
}
```

**특징:**
- 빠른 실행 속도
- 격리된 환경에서 테스트
- 의존성을 Mock 객체로 대체

### 2. 통합 테스트 (Integration Test)

여러 컴포넌트가 함께 동작하는지 검증합니다.

```kotlin
@Test
fun `데이터베이스에서 사용자 정보를 가져온다`() {
    val userRepository = UserRepository(database)
    val user = userRepository.getUserById(1)

    assertNotNull(user)
    assertEquals("홍길동", user.name)
}
```

**특징:**
- 실제 의존성 사용 (DB, API 등)
- 단위 테스트보다 느림
- 실제 환경에 가까운 테스트

### 3. UI 테스트 (E2E Test)

사용자 관점에서 전체 시스템을 검증합니다.

```kotlin
@Test
fun `로그인 후 홈 화면이 표시된다`() {
    // 로그인 화면에서
    onView(withId(R.id.emailInput))
        .perform(typeText("test@example.com"))

    onView(withId(R.id.passwordInput))
        .perform(typeText("password123"))

    onView(withId(R.id.loginButton))
        .perform(click())

    // 홈 화면 확인
    onView(withId(R.id.homeTitle))
        .check(matches(isDisplayed()))
}
```

**특징:**
- 가장 느림
- 실제 사용자 시나리오 검증
- 설정과 유지보수가 복잡

## 🏗️ 테스트 피라미드

```
        /\
       /  \      E2E Tests (적은 수)
      /----\
     /      \    Integration Tests (중간 수)
    /--------\
   /          \  Unit Tests (많은 수)
  /____________\
```

### 이상적인 테스트 비율

- **70%**: 단위 테스트 - 빠르고 많이
- **20%**: 통합 테스트 - 중요한 통합 지점
- **10%**: E2E 테스트 - 핵심 사용자 시나리오만

## ✅ 좋은 테스트의 특징

### 1. FIRST 원칙

- **Fast**: 빠르게 실행되어야 함
- **Independent**: 독립적이고 순서에 의존하지 않음
- **Repeatable**: 반복 가능하고 일관된 결과
- **Self-Validating**: 자동으로 성공/실패 판단
- **Timely**: 적시에 작성 (코드와 함께)

### 2. AAA 패턴

```kotlin
@Test
fun `사용자를 생성할 수 있다`() {
    // Arrange (준비)
    val userService = UserService()
    val userData = User("홍길동", "hong@example.com")

    // Act (실행)
    val result = userService.createUser(userData)

    // Assert (검증)
    assertNotNull(result.id)
    assertEquals("홍길동", result.name)
    assertEquals("hong@example.com", result.email)
}
```

### 3. 명확한 테스트 이름

```kotlin
// ❌ 나쁜 예
@Test
fun test1() { ... }

@Test
fun userTest() { ... }

// ✅ 좋은 예
@Test
fun `유효하지 않은 이메일로 회원가입하면 예외가 발생한다`() { ... }

@Test
fun `중복된 이메일로 회원가입하면 실패한다`() { ... }
```

## 🎨 테스트 작성 예제

### 간단한 비즈니스 로직 테스트

```kotlin
// 테스트 대상
class ShoppingCart {
    private val items = mutableListOf<Item>()

    fun addItem(item: Item) {
        items.add(item)
    }

    fun getTotalPrice(): Int {
        return items.sumOf { it.price * it.quantity }
    }

    fun getItemCount(): Int {
        return items.sumOf { it.quantity }
    }
}

// 테스트 코드
class ShoppingCartTest {
    private lateinit var cart: ShoppingCart

    @Before
    fun setup() {
        cart = ShoppingCart()
    }

    @Test
    fun `빈 장바구니의 총 가격은 0이다`() {
        assertEquals(0, cart.getTotalPrice())
    }

    @Test
    fun `상품을 추가하면 총 가격이 계산된다`() {
        cart.addItem(Item("사과", 1000, 2))
        cart.addItem(Item("바나나", 1500, 1))

        assertEquals(3500, cart.getTotalPrice())
    }

    @Test
    fun `상품 개수가 정확히 계산된다`() {
        cart.addItem(Item("사과", 1000, 2))
        cart.addItem(Item("바나나", 1500, 3))

        assertEquals(5, cart.getItemCount())
    }
}
```

## 🚫 테스트 안티 패턴

### 1. 테스트 간 의존성

```kotlin
// ❌ 나쁜 예
var userId: Int? = null

@Test
fun test1_createUser() {
    userId = createUser("홍길동")
}

@Test
fun test2_getUser() {
    val user = getUser(userId!!)  // test1에 의존
}
```

### 2. 너무 많은 것을 테스트

```kotlin
// ❌ 나쁜 예
@Test
fun `사용자 생성과 조회와 수정과 삭제 테스트`() {
    // 한 테스트에서 너무 많은 것을 검증
}

// ✅ 좋은 예: 각각 분리
@Test
fun `사용자를 생성할 수 있다`() { ... }

@Test
fun `사용자를 조회할 수 있다`() { ... }

@Test
fun `사용자를 수정할 수 있다`() { ... }
```

### 3. 실제 외부 의존성 사용

```kotlin
// ❌ 나쁜 예: 실제 API 호출
@Test
fun test() {
    val response = realApiCall()  // 느리고 불안정
}

// ✅ 좋은 예: Mock 사용
@Test
fun test() {
    val mockApi = mock<Api>()
    whenever(mockApi.getData()).thenReturn(testData)
}
```

## 📊 테스트 커버리지

### 코드 커버리지란?

테스트가 코드의 몇 퍼센트를 실행하는지를 나타내는 지표입니다.

```kotlin
// build.gradle
jacoco {
    toolVersion = "0.8.8"
}

tasks.jacocoTestReport {
    reports {
        xml.required.set(true)
        html.required.set(true)
    }
}
```

**중요한 점:**
- 100% 커버리지가 목표가 아님
- 중요한 비즈니스 로직에 집중
- 커버리지보다 테스트의 품질이 중요

## 💡 테스트 작성 팁

### 1. 경계값 테스트

```kotlin
@Test
fun `나이 검증 - 경계값 테스트`() {
    assertFalse(isAdult(-1))   // 음수
    assertFalse(isAdult(0))    // 최소값
    assertFalse(isAdult(17))   // 경계 아래
    assertTrue(isAdult(18))    // 경계
    assertTrue(isAdult(19))    // 경계 위
    assertTrue(isAdult(100))   // 큰 값
}
```

### 2. 예외 상황 테스트

```kotlin
@Test(expected = IllegalArgumentException::class)
fun `null 이메일로 회원가입하면 예외가 발생한다`() {
    userService.register(null, "password")
}

// 또는 JUnit 5
@Test
fun `null 이메일로 회원가입하면 예외가 발생한다`() {
    assertThrows<IllegalArgumentException> {
        userService.register(null, "password")
    }
}
```

### 3. 테스트 데이터 분리

```kotlin
// TestData.kt
object TestData {
    val validUser = User("홍길동", "hong@example.com")
    val invalidEmail = User("홍길동", "invalid-email")

    fun createUser(
        name: String = "테스트",
        email: String = "test@example.com"
    ) = User(name, email)
}
```

## 📚 다음 학습

다음 포스트에서는 JUnit을 사용한 실제 단위 테스트 작성 방법을 배웁니다.

---

**학습 완료!** 테스트의 중요성과 기본 개념을 이해했습니다.
