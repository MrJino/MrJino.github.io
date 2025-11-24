# TypeScript 기초부터 실전까지

TypeScript는 JavaScript에 타입 시스템을 추가한 언어입니다. 이 글에서는 TypeScript의 기초부터 실전에서 유용한 패턴까지 살펴보겠습니다.

## TypeScript를 사용하는 이유

1. **타입 안정성**: 컴파일 타임에 오류 발견
2. **자동 완성**: IDE의 강력한 지원
3. **리팩토링**: 안전한 코드 변경
4. **문서화**: 코드 자체가 문서

## 기본 타입

```typescript
// 기본 타입들
let name: string = 'John';
let age: number = 30;
let isActive: boolean = true;
let nullable: null = null;
let undef: undefined = undefined;

// 배열
let numbers: number[] = [1, 2, 3];
let strings: Array<string> = ['a', 'b', 'c'];

// 튜플
let tuple: [string, number] = ['John', 30];

// 열거형 (Enum)
enum Color {
  Red,
  Green,
  Blue
}
let color: Color = Color.Red;

// Any (가능한 피하기)
let anything: any = 'hello';
anything = 123;

// Unknown (any보다 안전)
let notSure: unknown = 'hello';
if (typeof notSure === 'string') {
  console.log(notSure.toUpperCase());
}

// Void
function logMessage(message: string): void {
  console.log(message);
}

// Never
function throwError(message: string): never {
  throw new Error(message);
}
```

## 인터페이스 (Interface)

```typescript
// 기본 인터페이스
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // 선택적 프로퍼티
  readonly createdAt: Date; // 읽기 전용
}

const user: User = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
  createdAt: new Date()
};

// 함수 인터페이스
interface SearchFunc {
  (source: string, subString: string): boolean;
}

const mySearch: SearchFunc = (src, sub) => {
  return src.includes(sub);
};

// 인덱스 시그니처
interface StringArray {
  [index: number]: string;
}

const myArray: StringArray = ['a', 'b', 'c'];

// 인터페이스 확장
interface Person {
  name: string;
  age: number;
}

interface Employee extends Person {
  employeeId: number;
  department: string;
}
```

## 타입 별칭 (Type Alias)

```typescript
// 기본 타입 별칭
type ID = string | number;
type Status = 'pending' | 'active' | 'inactive';

// 객체 타입
type Point = {
  x: number;
  y: number;
};

// 유니온 타입
type Result = string | number | boolean;

// 인터섹션 타입
type Admin = {
  role: 'admin';
  permissions: string[];
};

type User = {
  id: number;
  name: string;
};

type AdminUser = Admin & User;
```

## 제네릭 (Generics)

```typescript
// 기본 제네릭 함수
function identity<T>(arg: T): T {
  return arg;
}

const output1 = identity<string>('hello');
const output2 = identity<number>(123);

// 제네릭 인터페이스
interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

const userResponse: ApiResponse<User> = {
  data: { id: 1, name: 'John', email: 'john@example.com', createdAt: new Date() },
  status: 200,
  message: 'Success'
};

// 제네릭 클래스
class GenericStorage<T> {
  private items: T[] = [];

  add(item: T): void {
    this.items.push(item);
  }

  get(index: number): T | undefined {
    return this.items[index];
  }

  getAll(): T[] {
    return this.items;
  }
}

const numberStorage = new GenericStorage<number>();
numberStorage.add(1);
numberStorage.add(2);

// 제네릭 제약
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

logLength('hello'); // OK
logLength([1, 2, 3]); // OK
// logLength(123); // Error: number에 length 프로퍼티 없음
```

## 유틸리티 타입

```typescript
interface Todo {
  id: number;
  title: string;
  completed: boolean;
  description: string;
}

// Partial - 모든 프로퍼티를 선택적으로
type PartialTodo = Partial<Todo>;

// Required - 모든 프로퍼티를 필수로
type RequiredTodo = Required<Todo>;

// Readonly - 모든 프로퍼티를 읽기 전용으로
type ReadonlyTodo = Readonly<Todo>;

// Pick - 특정 프로퍼티만 선택
type TodoPreview = Pick<Todo, 'id' | 'title'>;

// Omit - 특정 프로퍼티 제외
type TodoInfo = Omit<Todo, 'id'>;

// Record - 키-값 쌍의 타입 생성
type PageInfo = {
  title: string;
  url: string;
};

type Pages = 'home' | 'about' | 'contact';
type PageMap = Record<Pages, PageInfo>;

// ReturnType - 함수의 반환 타입 추출
function createUser() {
  return {
    id: 1,
    name: 'John'
  };
}

type User = ReturnType<typeof createUser>;
```

## 클래스와 타입

```typescript
class Animal {
  private name: string;
  protected age: number;
  public species: string;

  constructor(name: string, age: number, species: string) {
    this.name = name;
    this.age = age;
    this.species = species;
  }

  public makeSound(): void {
    console.log('Some sound');
  }

  protected getAge(): number {
    return this.age;
  }
}

class Dog extends Animal {
  constructor(name: string, age: number) {
    super(name, age, 'Dog');
  }

  public makeSound(): void {
    console.log('Woof!');
  }

  public getInfo(): string {
    // this.name은 접근 불가 (private)
    // this.age는 접근 가능 (protected)
    return `A ${this.getAge()}-year-old dog`;
  }
}

// 추상 클래스
abstract class Shape {
  abstract getArea(): number;

  describe(): string {
    return `Area: ${this.getArea()}`;
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  getArea(): number {
    return Math.PI * this.radius ** 2;
  }
}
```

## 타입 가드

```typescript
// typeof 타입 가드
function padLeft(value: string, padding: string | number) {
  if (typeof padding === 'number') {
    return ' '.repeat(padding) + value;
  }
  return padding + value;
}

// instanceof 타입 가드
class Fish {
  swim() {
    console.log('Swimming');
  }
}

class Bird {
  fly() {
    console.log('Flying');
  }
}

function move(animal: Fish | Bird) {
  if (animal instanceof Fish) {
    animal.swim();
  } else {
    animal.fly();
  }
}

// 사용자 정의 타입 가드
interface Cat {
  meow(): void;
}

interface Dog {
  bark(): void;
}

function isCat(pet: Cat | Dog): pet is Cat {
  return (pet as Cat).meow !== undefined;
}

function makeSound(pet: Cat | Dog) {
  if (isCat(pet)) {
    pet.meow();
  } else {
    pet.bark();
  }
}
```

## 실전 패턴

```typescript
// API 응답 타입 정의
interface ApiError {
  code: string;
  message: string;
}

type ApiResult<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError };

async function fetchUser(id: number): Promise<ApiResult<User>> {
  try {
    const response = await fetch(`/api/users/${id}`);
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: { code: 'FETCH_ERROR', message: 'Failed to fetch user' }
    };
  }
}

// 사용
const result = await fetchUser(1);
if (result.success) {
  console.log(result.data.name);
} else {
  console.error(result.error.message);
}

// 타입 안전한 이벤트 핸들러
type EventMap = {
  click: { x: number; y: number };
  keypress: { key: string };
  submit: { data: FormData };
};

class EventEmitter {
  on<K extends keyof EventMap>(
    event: K,
    handler: (data: EventMap[K]) => void
  ): void {
    // 구현
  }

  emit<K extends keyof EventMap>(event: K, data: EventMap[K]): void {
    // 구현
  }
}

const emitter = new EventEmitter();
emitter.on('click', (data) => {
  console.log(data.x, data.y); // 타입 안전
});
```

## 정리

TypeScript는 초기 학습 곡선이 있지만, 프로젝트가 커질수록 그 가치가 빛을 발합니다. 타입 시스템을 통해 버그를 사전에 방지하고, 코드의 가독성과 유지보수성을 크게 향상시킬 수 있습니다.
