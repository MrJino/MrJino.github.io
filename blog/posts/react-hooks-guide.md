# React Hooks 완벽 가이드

React Hooks는 함수형 컴포넌트에서 상태 관리와 생명주기 기능을 사용할 수 있게 해주는 강력한 기능입니다. 이 글에서는 주요 Hooks들을 상세히 알아보겠습니다.

## 1. useState - 상태 관리

가장 기본적인 Hook으로, 컴포넌트에 상태를 추가할 수 있습니다.

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### 여러 상태 관리하기

```jsx
function UserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);

  // 또는 객체로 관리
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: 0
  });

  const updateUser = (field, value) => {
    setUser(prev => ({
      ...prev,
      [field]: value
    }));
  };
}
```

## 2. useEffect - 사이드 이펙트 처리

컴포넌트의 생명주기와 관련된 작업을 수행합니다.

```jsx
import { useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  // 컴포넌트 마운트 시 한 번만 실행
  useEffect(() => {
    console.log('Component mounted');
  }, []);

  // userId가 변경될 때마다 실행
  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  // 클린업 함수
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Tick');
    }, 1000);

    return () => clearInterval(timer);
  }, []);
}
```

## 3. useContext - Context 사용

전역 상태를 쉽게 사용할 수 있습니다.

```jsx
import { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Current theme: {theme}
    </button>
  );
}
```

## 4. useReducer - 복잡한 상태 관리

useState보다 복잡한 상태 로직을 관리할 때 유용합니다.

```jsx
import { useReducer } from 'react';

const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return initialState;
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
    </div>
  );
}
```

## 5. useMemo - 메모이제이션

비용이 큰 계산 결과를 캐싱합니다.

```jsx
import { useMemo } from 'react';

function ExpensiveComponent({ data }) {
  const processedData = useMemo(() => {
    // 복잡한 계산
    return data.map(item => {
      // 무거운 처리
      return processItem(item);
    });
  }, [data]);

  return <div>{processedData}</div>;
}
```

## 6. useCallback - 함수 메모이제이션

함수를 메모이제이션하여 불필요한 리렌더링을 방지합니다.

```jsx
import { useCallback } from 'react';

function ParentComponent() {
  const [count, setCount] = useState(0);

  // count가 변경될 때만 함수 재생성
  const increment = useCallback(() => {
    setCount(c => c + 1);
  }, []);

  return <ChildComponent onIncrement={increment} />;
}
```

## 7. useRef - DOM 접근 및 값 보관

DOM 요소에 직접 접근하거나 렌더링과 무관한 값을 보관합니다.

```jsx
import { useRef, useEffect } from 'react';

function TextInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    // 컴포넌트 마운트 시 input에 포커스
    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} type="text" />;
}

// 이전 값 저장
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}
```

## Custom Hooks

자주 사용하는 로직을 재사용 가능한 Hook으로 만들 수 있습니다.

```jsx
// useLocalStorage Hook
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

// 사용
function App() {
  const [name, setName] = useLocalStorage('name', '');

  return (
    <input
      value={name}
      onChange={e => setName(e.target.value)}
    />
  );
}
```

## Hooks 사용 규칙

1. **최상위에서만 호출**: 반복문, 조건문, 중첩 함수 내에서 호출 금지
2. **React 함수에서만 호출**: 일반 JavaScript 함수에서 호출 금지

```jsx
// ❌ 잘못된 사용
function BadComponent() {
  if (condition) {
    const [state, setState] = useState(0); // 조건문 내에서 호출
  }
}

// ✅ 올바른 사용
function GoodComponent() {
  const [state, setState] = useState(0);

  if (condition) {
    // state 사용
  }
}
```

## 정리

React Hooks는 함수형 컴포넌트의 능력을 크게 향상시켜주는 도구입니다. 각 Hook의 특성을 이해하고 적절히 활용하면 더 깔끔하고 효율적인 React 애플리케이션을 만들 수 있습니다.
