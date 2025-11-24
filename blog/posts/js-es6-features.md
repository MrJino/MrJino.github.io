# JavaScript ES6+ 핵심 문법 정리

ES6(ECMAScript 2015) 이후로 JavaScript는 많은 새로운 기능들이 추가되었습니다. 이 글에서는 현대 JavaScript 개발에서 필수적으로 알아야 할 핵심 문법들을 정리해보겠습니다.

## 1. let과 const

`var` 대신 `let`과 `const`를 사용하여 더 안전한 변수 선언이 가능합니다.

```javascript
// let: 재할당 가능
let count = 0;
count = 1; // OK

// const: 재할당 불가능
const name = 'John';
name = 'Jane'; // Error!

// const 객체의 프로퍼티는 변경 가능
const user = { name: 'John' };
user.name = 'Jane'; // OK
```

## 2. 화살표 함수 (Arrow Functions)

화살표 함수는 간결한 문법과 `this` 바인딩이 다릅니다.

```javascript
// 기존 함수
function add(a, b) {
  return a + b;
}

// 화살표 함수
const add = (a, b) => a + b;

// 여러 줄인 경우
const multiply = (a, b) => {
  const result = a * b;
  return result;
};
```

## 3. 템플릿 리터럴 (Template Literals)

백틱(`)을 사용하여 문자열을 더 쉽게 작성할 수 있습니다.

```javascript
const name = 'John';
const age = 30;

// 기존 방식
const message1 = 'My name is ' + name + ' and I am ' + age + ' years old.';

// 템플릿 리터럴
const message2 = `My name is ${name} and I am ${age} years old.`;

// 여러 줄 문자열
const html = `
  <div>
    <h1>${name}</h1>
    <p>Age: ${age}</p>
  </div>
`;
```

## 4. 구조 분해 할당 (Destructuring)

배열이나 객체의 값을 쉽게 추출할 수 있습니다.

```javascript
// 객체 구조 분해
const user = { name: 'John', age: 30, email: 'john@example.com' };
const { name, age } = user;

// 배열 구조 분해
const numbers = [1, 2, 3, 4, 5];
const [first, second, ...rest] = numbers;
console.log(first); // 1
console.log(rest); // [3, 4, 5]

// 함수 매개변수에서 사용
function printUser({ name, age }) {
  console.log(`${name} is ${age} years old`);
}
```

## 5. 스프레드 연산자 (Spread Operator)

배열이나 객체를 펼쳐서 사용할 수 있습니다.

```javascript
// 배열 복사
const arr1 = [1, 2, 3];
const arr2 = [...arr1, 4, 5];

// 객체 복사 및 병합
const obj1 = { a: 1, b: 2 };
const obj2 = { ...obj1, c: 3 };

// 함수 인자로 사용
const numbers = [1, 2, 3];
Math.max(...numbers); // 3
```

## 6. Promise와 async/await

비동기 작업을 더 쉽게 처리할 수 있습니다.

```javascript
// Promise
function fetchData() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('Data loaded');
    }, 1000);
  });
}

// async/await
async function loadData() {
  try {
    const data = await fetchData();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
```

## 7. 클래스 (Classes)

객체 지향 프로그래밍을 더 쉽게 구현할 수 있습니다.

```javascript
class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  greet() {
    return `Hello, I'm ${this.name}`;
  }
}

class Student extends Person {
  constructor(name, age, grade) {
    super(name, age);
    this.grade = grade;
  }

  study() {
    return `${this.name} is studying`;
  }
}
```

## 정리

ES6+의 새로운 문법들은 코드를 더 간결하고 읽기 쉽게 만들어줍니다. 이러한 기능들을 잘 활용하면 더 효율적인 JavaScript 코드를 작성할 수 있습니다.

### 참고 자료

- [MDN Web Docs - JavaScript](https://developer.mozilla.org/ko/docs/Web/JavaScript)
- [ECMAScript 6 입문](https://es6.ruanyifeng.com/)
