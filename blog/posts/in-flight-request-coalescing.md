검색 자동완성, 상세 정보 조회, 토큰 갱신처럼 여러 화면이나 이벤트가 같은 비동기 작업을 거의 동시에 요구할 때가 있습니다. 각 호출이 독립적으로 `fetch()`를 실행하면 응답 내용은 같아도 네트워크 요청과 서버 연산은 여러 번 발생합니다.

**in-flight 중복 방지**는 이미 실행 중인 같은 작업이 있으면 새 작업을 시작하지 않고 그 Promise를 함께 기다리는 패턴입니다. request coalescing, single-flight, Promise deduplication이라고도 부릅니다. 핵심은 결과를 오래 저장하는 것이 아니라 **진행 중인 작업만 잠시 공유**하는 데 있습니다.

## 중복 요청은 왜 생길까

버튼을 빠르게 두 번 누르는 경우만 생각하기 쉽지만 실제 원인은 더 다양합니다.

- 서로 다른 컴포넌트가 마운트되며 같은 데이터를 요청합니다.
- 렌더링과 상태 갱신 사이에서 같은 로더가 연달아 호출됩니다.
- 여러 API 호출이 동시에 만료된 인증 토큰의 갱신을 시도합니다.
- 재연결, 폴링, 포커스 복귀 이벤트가 같은 시점에 겹칩니다.
- 사용자가 같은 경로로 빠르게 이동하거나 뒤로 가기를 반복합니다.

예를 들어 두 컴포넌트가 같은 사용자 정보를 동시에 요구하면 아래 함수는 호출 횟수만큼 요청을 만듭니다.

```js
async function getUser(userId) {
  const response = await fetch(`/api/users/${userId}`);
  if (!response.ok) throw new Error(`사용자 조회 실패: ${response.status}`);
  return response.json();
}

await Promise.all([getUser(42), getUser(42)]); // 요청 2개
```

읽기 요청이라도 비용과 부하가 늘고, 쓰기 요청이라면 중복 결제나 중복 등록처럼 훨씬 심각한 문제가 될 수 있습니다.

## debounce·throttle과 무엇이 다른가

세 방법은 중복을 줄이지만 제어하는 대상이 다릅니다.

| 방법 | 기준 | 호출을 받았을 때의 동작 | 잘 맞는 사례 |
| --- | --- | --- | --- |
| debounce | 일정 시간 동안 새 입력이 없는지 | 이전 예약을 취소하고 마지막 호출만 실행 | 검색어 입력, 자동 저장 |
| throttle | 일정 시간 간격 | 구간마다 일부 호출만 실행 | 스크롤, 리사이즈, 진행률 갱신 |
| in-flight 공유 | 같은 작업이 현재 실행 중인지 | 기존 Promise를 반환해 모든 호출자가 같은 결과를 기다림 | 데이터 조회, 토큰 갱신, 초기화 |

debounce와 throttle은 **시간을 기준으로 호출 빈도**를 조절합니다. 반면 in-flight 공유는 두 호출 사이가 몇 밀리초인지보다 **같은 의미의 작업이 아직 끝나지 않았는지**를 봅니다. 사용 목적이 다르므로 검색 입력은 debounce로 줄이고, 실제 검색 요청은 in-flight Map으로 합치는 식으로 함께 사용할 수도 있습니다.

## Map&lt;key, Promise&gt; 기본 패턴

작업을 식별하는 키와 실행 중인 Promise를 `Map`에 저장합니다.

```js
const inFlight = new Map();

function runOnceWhilePending(key, task) {
  const existing = inFlight.get(key);
  if (existing) return existing;

  const promise = Promise.resolve()
    .then(task)
    .finally(() => {
      if (inFlight.get(key) === promise) {
        inFlight.delete(key);
      }
    });

  inFlight.set(key, promise);
  return promise;
}
```

사용할 때는 같은 작업이 같은 키를 만들도록 합니다.

```js
function getUser(userId) {
  return runOnceWhilePending(`user:${userId}`, async () => {
    const response = await fetch(`/api/users/${encodeURIComponent(userId)}`);
    if (!response.ok) throw new Error(`사용자 조회 실패: ${response.status}`);
    return response.json();
  });
}

const [first, second] = await Promise.all([getUser(42), getUser(42)]);
// 네트워크 요청은 1번, 두 호출자는 같은 결과를 받는다.
```

`Promise.resolve().then(task)`로 감싼 이유는 `task`가 Promise를 반환하기 전에 동기적으로 예외를 던지는 경우도 거절된 Promise로 통일하기 위해서입니다. `finally()`는 Promise가 fulfilled 또는 rejected 중 어느 상태로 끝나더라도 실행되므로 정리 코드에 알맞습니다. 자세한 동작은 [MDN Promise.prototype.finally() 문서](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/finally)에서 확인할 수 있습니다.

정리할 때 현재 Map 값이 자신과 같은지도 확인합니다. 나중에 타임아웃이나 강제 교체 기능을 추가해 같은 키에 새 Promise가 들어갔을 때, 먼저 시작한 작업의 `finally()`가 새 항목까지 지우는 경쟁 상태를 피할 수 있습니다.

## 완료 후 반드시 제거해야 하는 이유

in-flight Map은 캐시가 아닙니다. 성공한 Promise를 계속 남겨 두면 이후 호출도 과거 결과만 받아 최신 데이터를 가져오지 못합니다. 거절된 Promise를 남기면 모든 재시도도 즉시 같은 오류로 끝납니다. 키가 계속 늘어나는 서비스라면 메모리도 회수되지 않습니다.

따라서 성공과 실패 모두 `finally()`에서 제거하는 것이 기본입니다. 결과를 일정 시간 재사용하려면 in-flight 처리와 별도로 TTL 캐시를 설계해야 합니다.

```js
const resultCache = new Map(); // 완료된 결과와 만료 시각
const inFlight = new Map();    // 아직 끝나지 않은 Promise
```

둘을 분리하면 “동시 요청 한 번만 실행”과 “완료된 결과 재사용”의 정책을 각각 명확하게 바꿀 수 있습니다.

## 오류와 재시도 설계

공유한 작업이 실패하면 그 Promise를 기다리던 호출자는 모두 같은 실패를 전달받습니다. 이것은 중복 실행을 막기 위한 자연스러운 결과입니다.

- 실패 항목은 `finally()`에서 제거해 다음 호출이 새로 시도할 수 있게 합니다.
- 재시도는 Map 바깥의 각 호출자가 제각각 수행하지 말고, 공유 작업 안에서 한 번만 수행합니다.
- 모든 오류를 재시도하지 않습니다. 네트워크 단절, 429, 일부 5xx처럼 일시적일 가능성이 있는 오류만 정책에 포함합니다.
- 지수 백오프와 jitter를 사용하고 최대 횟수를 제한합니다.
- 오류 객체에 작업 키, 시도 횟수, 상태 코드를 기록하되 토큰이나 개인정보는 남기지 않습니다.

```js
function getProduct(productId) {
  const key = `product:${productId}`;

  return runOnceWhilePending(key, () =>
    retryTransientErrors(
      () => fetchProduct(productId),
      { maxAttempts: 3 },
    ),
  );
}
```

`retryTransientErrors()`를 `runOnceWhilePending()` 안에 두었으므로 동시 호출자 열 명이 있어도 재시도 시퀀스는 하나입니다. 반대로 각 호출자가 반환된 Promise를 받아 독립적으로 다시 `getProduct()`를 호출하면 실패 직후 여러 재시도가 한꺼번에 시작되는 retry storm이 생길 수 있습니다.

## 좋은 키를 만드는 방법

키가 너무 넓으면 서로 다른 작업이 잘못 합쳐지고, 너무 좁으면 합쳐야 할 요청이 따로 실행됩니다. 키에는 **응답이나 부수 효과를 바꾸는 모든 값**이 들어가야 합니다.

```js
function userSearchKey({ tenantId, query, page, locale }) {
  return JSON.stringify([
    'user-search',
    tenantId,
    query.trim(),
    page,
    locale,
  ]);
}
```

다음 항목을 확인합니다.

- URL 경로와 정규화된 쿼리 파라미터
- HTTP 메서드와 요청 본문
- 테넌트, 사용자, 권한 범위처럼 결과를 바꾸는 인증 문맥
- 언어, 통화, 페이지, 정렬 순서
- API 버전이나 기능 플래그

객체를 그대로 문자열화할 때는 속성 순서 때문에 의미가 같은 입력이 다른 키가 될 수 있습니다. 배열처럼 순서가 고정된 구조를 쓰거나 안정적인 직렬화 함수를 사용하세요. 인증 토큰 원문, 비밀번호, 개인정보는 Map 키나 로그에 넣지 말고 필요한 경우 안전한 내부 식별자로 바꿉니다.

## AbortSignal과 취소에서 생기는 함정

`AbortController`는 `signal`을 통해 fetch 같은 비동기 작업을 중단할 수 있습니다. 공식 동작은 [MDN AbortController 문서](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)와 [MDN AbortSignal 문서](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal)에서 확인할 수 있습니다.

하지만 공유 Promise에 첫 번째 호출자의 `signal`을 그대로 연결하면 그 호출자가 화면을 떠나는 순간 **다른 호출자가 아직 필요로 하는 공용 요청까지 취소**됩니다.

```js
// 주의: 첫 호출자의 취소가 모든 대기자에게 영향을 준다.
function getUser(userId, signal) {
  return runOnceWhilePending(`user:${userId}`, () =>
    fetch(`/api/users/${userId}`, { signal }).then(parseResponse),
  );
}
```

취소 정책은 다음 중 하나로 명시해야 합니다.

1. 공유 작업은 호출자 개별 signal과 분리하고, 개별 호출자는 결과 기다리기만 중단합니다.
2. 대기자 수를 추적해 마지막 대기자가 취소했을 때만 내부 `AbortController`를 중단합니다.
3. 작업 전체를 함께 취소해야 하는 동일한 그룹만 하나의 signal을 공유합니다.

개별 대기만 중단하는 간단한 래퍼는 다음과 같습니다. 이 코드는 호출자의 Promise만 거절하며 바탕의 공용 작업 자체는 계속 진행합니다.

```js
function waitWithSignal(sharedPromise, signal) {
  if (!signal) return sharedPromise;
  signal.throwIfAborted();

  let onAbort;
  const aborted = new Promise((_, reject) => {
    onAbort = () => reject(signal.reason);
    signal.addEventListener('abort', onAbort, { once: true });
  });

  return Promise.race([
    sharedPromise,
    aborted,
  ]).finally(() => {
    signal.removeEventListener('abort', onAbort);
  });
}
```

경쟁이 끝나면 이벤트 리스너도 제거합니다. 다만 Promise를 기다리지 않는 것과 실제 네트워크 전송을 취소하는 것은 서로 다른 동작임을 구분해야 합니다.

## 서버 멱등성·캐시·락과의 경계

in-flight Map 하나로 모든 중복 문제를 해결할 수는 없습니다.

- **in-flight 공유**: 한 JavaScript 런타임 안에서 동시에 진행 중인 같은 작업을 합칩니다.
- **클라이언트 캐시**: 이미 완료된 읽기 결과를 TTL이나 무효화 정책에 따라 다시 씁니다.
- **HTTP·CDN 캐시**: 네트워크 계층에서 캐시 가능한 응답을 재사용합니다.
- **서버 멱등성**: 같은 쓰기 요청이 다시 도착해도 최종 효과가 한 번만 적용되도록 보장합니다.
- **분산 락·데이터베이스 제약**: 여러 서버 인스턴스와 프로세스가 동시에 같은 자원을 갱신하는 경쟁을 제어합니다.

브라우저 탭이 다르거나 서버 프로세스가 여러 개면 각 런타임은 서로의 Map을 볼 수 없습니다. 네트워크 재전송이나 앱 재시작 뒤의 중복도 막지 못합니다. 특히 결제·주문 같은 쓰기 작업에는 서버의 idempotency key, 고유 제약, 트랜잭션 같은 별도 보장이 필요합니다. HTTP에서 말하는 멱등성의 의미와 메서드별 성질은 [MDN HTTP 멱등성 설명](https://developer.mozilla.org/en-US/docs/Glossary/Idempotent)을 참고할 수 있습니다.

## 실전 체크리스트

- [ ] 합쳐도 되는 작업과 독립 실행해야 하는 작업을 구분했는가?
- [ ] 결과를 바꾸는 모든 입력과 사용자 문맥이 키에 포함되는가?
- [ ] 성공과 실패 모두 Map에서 제거되는가?
- [ ] 오래 걸리거나 영원히 끝나지 않는 작업의 타임아웃 정책이 있는가?
- [ ] 재시도가 공유 작업 내부에서 한 번만 실행되는가?
- [ ] 한 호출자의 취소가 다른 호출자에게 미치는 영향을 정했는가?
- [ ] 완료 결과 캐시와 in-flight 레지스트리를 분리했는가?
- [ ] 쓰기 작업은 서버에서도 중복 실행을 방어하는가?
- [ ] 키와 로그에 비밀값이나 개인정보가 들어가지 않는가?
- [ ] Map 크기, 공유 횟수, 실패율, 실행 시간을 관측할 수 있는가?

## 어떤 테스트가 필요한가

가장 중요한 테스트는 함수가 같은 값을 반환하는지만 확인하는 것이 아니라 **실제 작업 실행 횟수와 정리 시점**을 검증하는 것입니다.

```js
it('같은 키의 동시 호출은 task를 한 번만 실행한다', async () => {
  let resolveTask;
  const task = vi.fn(() => new Promise((resolve) => {
    resolveTask = resolve;
  }));

  const first = runOnceWhilePending('user:42', task);
  const second = runOnceWhilePending('user:42', task);

  expect(first).toBe(second);
  await Promise.resolve(); // Promise.resolve().then(task)가 실행되도록 한 턴 진행
  expect(task).toHaveBeenCalledTimes(1);

  resolveTask({ id: 42 });
  await Promise.all([first, second]);
});
```

추가로 다음 경우를 테스트합니다.

- 서로 다른 키는 동시에 각각 실행되는지
- 성공 후 같은 키를 호출하면 새 작업이 시작되는지
- 실패 후에도 Map이 비워지고 재시도할 수 있는지
- task가 동기 예외를 던져도 정리되는지
- 먼저 끝난 오래된 Promise가 교체된 새 항목을 지우지 않는지
- 한 대기자의 취소가 정해 둔 정책대로 동작하는지
- 타임아웃과 재시도 중에도 중복 실행 수가 늘지 않는지

테스트에서 지연 시간을 실제 타이머에 의존하면 불안정해질 수 있습니다. 위 예제처럼 resolve·reject 시점을 직접 제어하는 deferred Promise를 쓰면 “작업이 아직 진행 중인 구간”을 정확하게 만들 수 있습니다.

## 마무리

in-flight 중복 방지의 본질은 간단합니다. **같은 키의 작업이 진행 중이면 그 Promise를 반환하고, 끝나면 반드시 지웁니다.** 이 작은 패턴만으로도 같은 화면에서 겹치는 조회나 토큰 갱신 요청을 효과적으로 줄일 수 있습니다.

다만 Map은 현재 런타임 안의 짧은 동시성만 다룹니다. 결과 재사용은 캐시로, 쓰기 중복은 서버 멱등성으로, 여러 프로세스의 경쟁은 데이터베이스 제약이나 분산 조정으로 해결해야 합니다. 이 경계를 분명히 해 두면 단순한 Promise 공유가 예측 가능한 운영 코드로 발전합니다.
