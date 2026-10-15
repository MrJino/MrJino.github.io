Android 프로젝트에서 말하는 “Gradle 버전”과 “JVM 버전”은 하나가 아닙니다. Android Gradle Plugin(AGP), Gradle 배포판, Gradle을 실행하는 JDK, 소스 코드를 컴파일하는 JDK와 Java·Kotlin 바이트코드 타깃이 서로 다른 역할을 합니다. 이름이 비슷해 한 값을 올리면 나머지도 자동으로 따라갈 것 같지만, 실제로는 각 단계의 호환 조건을 따로 맞춰야 합니다.

이 글은 네 버전의 관계를 먼저 구분하고, 어디에서 값을 확인하는지, 버전 충돌이 났을 때 어떤 순서로 해결하는지를 정리합니다. 버전 표와 예시는 **2026년 10월 13일 기준**이며, 업그레이드할 때는 사용하려는 AGP 버전의 공식 릴리스 노트를 다시 확인해야 합니다.

## 먼저 결론: 네 버전은 이렇게 연결된다

| 구분 | 하는 일 | 주로 설정하거나 확인하는 곳 | 직접 맞춰야 하는 상대 |
| --- | --- | --- | --- |
| Android Gradle Plugin(AGP) | Android 앱 빌드 작업과 DSL 제공 | 루트 `build.gradle(.kts)`, `libs.versions.toml` | Gradle 최소 버전, Gradle JVM의 최소 JDK |
| Gradle 배포판 | 빌드 엔진과 플러그인 실행 | `gradle/wrapper/gradle-wrapper.properties` | AGP 요구 범위, Gradle JVM 지원 범위 |
| Gradle JVM | Gradle Daemon과 AGP를 실행하는 JDK | Android Studio의 Gradle JDK, `JAVA_HOME`, Daemon JVM criteria | AGP와 Gradle이 모두 지원하는 JDK |
| 프로젝트 Java·Kotlin 버전 | 소스 문법, 컴파일 JDK, 생성 바이트코드 수준 결정 | Java toolchain, `sourceCompatibility`, `targetCompatibility`, Kotlin `jvmTarget` | Java와 Kotlin 타깃끼리 일치, Android API·desugaring 고려 |

핵심 흐름은 다음과 같습니다.

```text
AGP 버전
  ├─ 사용할 수 있는 Gradle 버전을 제한
  └─ Gradle을 실행할 최소 JDK를 요구

Gradle 버전
  └─ Gradle Daemon으로 사용할 수 있는 JVM 버전을 제한

Gradle JVM
  ├─ Gradle과 AGP를 실행
  └─ 별도 toolchain이 없으면 컴파일 JDK의 기본값에도 영향

프로젝트 JVM 설정
  ├─ Java sourceCompatibility / targetCompatibility
  └─ Kotlin compilerOptions.jvmTarget
```

따라서 **AGP → Gradle → Gradle JVM** 순서로 실행 환경의 호환성을 확인한 뒤, **Java toolchain과 Java·Kotlin 타깃**을 애플리케이션 요구사항에 맞게 정렬하는 것이 안전합니다.

## 1. Android Gradle Plugin은 Android 전용 플러그인

흔히 “안드로이드 Gradle 버전”이라고 부르는 값은 대부분 **Android Gradle Plugin(AGP)** 버전입니다. AGP는 일반 Gradle 위에 Android 앱과 라이브러리를 빌드하는 작업, `android {}` DSL, 리소스 처리, D8·R8, APK·AAB 패키징 기능을 추가합니다.

플러그인 버전은 프로젝트 구성에 따라 다음 위치 중 하나에 있습니다.

```kotlin
// 루트 build.gradle.kts
plugins {
    id("com.android.application") version "9.4.0" apply false
    id("com.android.library") version "9.4.0" apply false
}
```

버전 카탈로그를 쓰는 프로젝트라면 `gradle/libs.versions.toml`에서 확인합니다.

```toml
[versions]
agp = "9.4.0"

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
```

AGP는 아무 Gradle이나 사용할 수 없습니다. 예를 들어 [AGP 9.4 공식 릴리스 노트](https://developer.android.com/build/releases/agp-9-4-0-release-notes)는 최소·기본 Gradle 버전을 `9.6.0`, 최소·기본 JDK를 `17`로 명시합니다. 이때 JDK 17은 앱의 `jvmTarget`이 반드시 17이어야 한다는 뜻이 아니라, **AGP와 Gradle 빌드를 실행할 JDK의 하한**입니다.

> 새 AGP로 올릴 때는 AGP 번호만 바꾸지 말고 해당 릴리스 노트의 Compatibility 표에서 Gradle과 JDK 요구사항을 함께 확인해야 합니다.

## 2. 일반 Gradle 버전은 Wrapper가 결정한다

일반 Gradle 버전은 빌드 엔진 자체의 버전이며, Android 프로젝트에서는 보통 **Gradle Wrapper**로 고정합니다.

```properties
# gradle/wrapper/gradle-wrapper.properties
distributionUrl=https\://services.gradle.org/distributions/gradle-9.6.0-bin.zip
```

팀원이 전역에 설치한 `gradle` 명령 대신 프로젝트의 `./gradlew`를 사용하면 개발 PC와 CI가 같은 Gradle 배포판을 사용합니다.

```bash
./gradlew --version
```

AGP와 Gradle의 관계는 “AGP 버전과 Gradle 버전의 숫자를 같게 한다”가 아닙니다. **각 AGP 릴리스가 요구하는 Gradle 버전을 Wrapper에 지정**하는 관계입니다. AGP `9.4.0`과 Gradle `9.6.0`처럼 번호가 달라도 정상입니다.

또한 최신 Gradle을 무조건 먼저 넣는 것도 안전하지 않습니다. 프로젝트의 AGP와 다른 플러그인이 그 Gradle 버전을 지원해야 하기 때문입니다. Android Studio의 Upgrade Assistant를 사용하더라도 최종적으로 플러그인 릴리스 노트를 확인하는 편이 좋습니다.

## 3. Gradle JVM은 빌드 도구를 실행하는 JDK

Gradle JVM은 Gradle Daemon 프로세스가 실행되는 JDK입니다. Android 앱이 휴대전화에서 실행할 “JVM 버전”이나 앱 바이트코드 타깃과는 다른 값입니다. Android 기기에서는 일반 데스크톱 JVM이 아니라 ART가 DEX 코드를 실행합니다.

[Android의 JDK 설정 문서](https://developer.android.com/build/jdks)에 따르면 실행 위치에 따라 Gradle JVM 선택 경로가 달라집니다.

- Android Studio의 빌드 버튼으로 실행: **Settings → Build, Execution, Deployment → Build Tools → Gradle → Gradle JDK**
- 터미널에서 `./gradlew` 실행: 일반적으로 `JAVA_HOME`, 없으면 `PATH`의 `java`
- `org.gradle.java.home` 지정: Gradle 속성에 지정한 JDK
- Daemon JVM criteria 사용: `gradle/gradle-daemon-jvm.properties`의 조건이 `JAVA_HOME`과 `org.gradle.java.home`보다 우선

실제로 사용 중인 값은 `java -version`만 보지 말고 Wrapper를 통해 확인합니다.

```bash
./gradlew --version
```

출력의 `Launcher JVM`과 `Daemon JVM`을 확인하세요. Android Studio와 터미널에서 결과가 다르면 같은 프로젝트가 한쪽에서는 빌드되고 다른 쪽에서는 실패할 수 있습니다.

Gradle 자체도 모든 Java 버전에서 실행되는 것은 아닙니다. [Gradle Java 호환성 표](https://docs.gradle.org/current/userguide/compatibility.html#java_runtime)는 Gradle을 실행할 수 있는 최소 버전을 다음과 같이 안내합니다.

| Gradle JVM으로 쓸 Java | 해당 Java에서 실행 가능한 최소 Gradle |
| --- | --- |
| Java 17 | Gradle 7.3 이상 |
| Java 21 | Gradle 8.5 이상 |
| Java 23 | Gradle 8.10 이상 |
| Java 24 | Gradle 8.14 이상 |
| Java 25 | Gradle 9.1.0 이상 |
| Java 26 | Gradle 9.4.0 이상 |
| Java 27 | Gradle 9.8.0 이상 |

예를 들어 Gradle JVM을 Java 21로 바꾸려면 AGP가 요구하는 최소 JDK 조건뿐 아니라 Gradle이 Java 21에서 실행될 수 있는지도 확인해야 합니다. 반대로 AGP가 JDK 17 이상을 요구하는데 Gradle JVM이 Java 11이면 Gradle 버전이 충분해도 AGP 적용 단계에서 실패합니다.

## 4. 프로젝트 JVM 버전은 실행 JDK와 별도로 생각한다

“프로젝트 JVM 버전”이라는 표현에는 세 가지 값이 섞여 쓰입니다.

### Java toolchain

Java toolchain은 Java 소스를 실제로 컴파일할 JDK를 선택합니다. Gradle Daemon을 실행하는 JDK와 같은 버전일 수도 있지만 목적은 다릅니다. 공식 문서도 재현 가능한 빌드를 위해 toolchain을 명시하도록 권장합니다.

```kotlin
// 모듈 build.gradle.kts
java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}
```

설치되어 감지된 toolchain은 다음 명령으로 확인할 수 있습니다.

```bash
./gradlew -q javaToolchains
```

### Java sourceCompatibility와 targetCompatibility

`sourceCompatibility`는 Java 소스에서 사용할 수 있는 언어 문법 수준, `targetCompatibility`는 생성할 Java class 파일의 바이트코드 수준을 정합니다.

```kotlin
android {
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}
```

두 값은 보통 동일하게 둡니다. 다만 이 설정만으로 새 JDK API 사용을 완전히 차단하는 것은 아닙니다. Android에서 실제로 사용할 수 있는 라이브러리 API는 `compileSdk`, `minSdk`, core library desugaring 여부도 함께 결정합니다.

### Kotlin jvmTarget

Kotlin의 `jvmTarget`은 Kotlin 컴파일러가 생성하는 JVM class 파일의 타깃 수준입니다. Kotlin 2.2 이상에서 권장되는 `compilerOptions` 형식은 다음과 같습니다.

```kotlin
import org.jetbrains.kotlin.gradle.dsl.JvmTarget

kotlin {
    compilerOptions {
        jvmTarget = JvmTarget.JVM_17
    }
}
```

Kotlin 2.2 미만 프로젝트에서는 기존 `kotlinOptions` 형식을 사용합니다.

```kotlin
android {
    kotlinOptions {
        jvmTarget = "17"
    }
}
```

Java와 Kotlin이 섞인 모듈에서는 `targetCompatibility`와 Kotlin `jvmTarget`을 같은 값으로 맞추는 것이 원칙입니다. 예를 들어 Java는 17, Kotlin은 1.8로 생성하면 `Inconsistent JVM-target compatibility` 오류가 발생할 수 있습니다.

## 실행 JDK 17과 앱 타깃 17은 같은 말이 아니다

다음 구성은 개념적으로 가능합니다.

```text
AGP:                9.4.0
Gradle Wrapper:     9.6.0
Gradle JVM:         JDK 17
Java toolchain:     JDK 17
source/target:      Java 11
Kotlin jvmTarget:   11
```

JDK 17로 Gradle과 컴파일러를 실행하면서 Java와 Kotlin 결과물은 JVM 11 수준으로 만들 수 있다는 뜻입니다. 반대로 Gradle JVM이 17이라고 해서 `sourceCompatibility`, `targetCompatibility`, `jvmTarget`이 자동으로 17이라는 보장은 없습니다. toolchain이나 각 타깃을 명시하지 않으면 플러그인 기본값과 실행 환경에 따라 달라질 수 있습니다.

Android 앱은 class 파일을 그대로 기기에서 실행하지 않고 D8이 DEX로 변환합니다. 그러므로 타깃 숫자만 보고 구형 Android에서 모든 Java API를 쓸 수 있다고 판단하면 안 됩니다. [Android Java 버전 공식 안내](https://developer.android.com/build/jdks#which_java_apis)에서 Android API 수준과 desugaring 지원 범위를 함께 확인해야 합니다.

`compileSdk`, `minSdk`, `targetSdk`가 각각 무엇을 제한하는지는 [Android 버전과 SDK·API 레벨의 관계](/blog/articles/android-version-sdk-api-level-guide.html)에서 별도로 정리했습니다.

## 2026년 10월 기준 구성 예시

현재 AGP 9.4를 사용하는 프로젝트의 기본 호환 조합 예시는 다음과 같습니다.

| 항목 | 예시 값 | 근거 |
| --- | --- | --- |
| AGP | `9.4.0` | Android Gradle Plugin 릴리스 |
| Gradle Wrapper | `9.6.0` | AGP 9.4의 최소·기본 Gradle |
| Gradle JVM | JDK `17` | AGP 9.4의 최소·기본 JDK |
| Java toolchain | JDK `17` | 빌드 재현성을 위한 명시적 선택 |
| Java source/target | `17` | Java 문법과 바이트코드 타깃 정렬 |
| Kotlin jvmTarget | `17` | Java 타깃과 Kotlin 타깃 정렬 |

이 표는 모든 프로젝트가 반드시 17 타깃을 써야 한다는 뜻이 아닙니다. 기존 라이브러리와 배포 환경 때문에 11 또는 다른 타깃이 필요하다면 Java와 Kotlin 타깃을 함께 조정하세요. AGP와 Wrapper를 업그레이드하는 일, 앱의 언어·바이트코드 타깃을 올리는 일은 별도의 변경으로 검증하는 것이 좋습니다.

## 권장 설정 예시

다음은 Java와 Kotlin 타깃을 17로 명시하는 모듈 설정 예시입니다.

```kotlin
import org.jetbrains.kotlin.gradle.dsl.JvmTarget

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

android {
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
}

kotlin {
    compilerOptions {
        jvmTarget = JvmTarget.JVM_17
    }
}
```

toolchain은 컴파일에 사용할 JDK를 고정하고, `compileOptions`와 `jvmTarget`은 결과물의 언어·바이트코드 수준을 명확히 합니다. 프로젝트가 사용하는 AGP와 Kotlin 버전에 따라 DSL 지원 범위가 다를 수 있으므로 기존 프로젝트에서는 한 번에 문법까지 모두 바꾸기보다 공식 마이그레이션 안내에 맞춰 적용하세요.

## 오류 메시지별 원인 찾기

| 오류나 증상 | 우선 의심할 관계 | 해결 방향 |
| --- | --- | --- |
| `Minimum supported Gradle version is ...` | AGP ↔ Gradle Wrapper | 해당 AGP 릴리스 노트의 최소 Gradle로 Wrapper 변경 |
| `Android Gradle plugin requires Java 17 to run` | AGP ↔ Gradle JVM | Android Studio Gradle JDK와 터미널 `JAVA_HOME`을 지원 JDK로 변경 |
| `Unsupported class file major version ...` | Gradle/JDK 또는 플러그인/JDK | 현재 Gradle이 실행 JDK를 지원하는지, 플러그인이 더 높은 JDK로 컴파일됐는지 확인 |
| `Inconsistent JVM-target compatibility` | Java `targetCompatibility` ↔ Kotlin `jvmTarget` | Java와 Kotlin 타깃 값을 동일하게 설정 |
| Android Studio만 성공하고 터미널은 실패 | Studio Gradle JDK ↔ `JAVA_HOME` | 두 실행 경로가 같은 JDK를 사용하도록 통일 |
| 개발 PC는 성공하고 CI는 실패 | 로컬 JDK/toolchain ↔ CI JDK | Wrapper, Daemon JVM, toolchain을 저장소와 CI 설정에 명시 |
| Gradle Daemon이 여러 개 생긴다는 경고 | Gradle 버전 또는 Gradle JVM 경로 불일치 | Studio와 셸의 JDK 경로를 맞추고 불필요한 Daemon 종료 |

`Unsupported class file major version`은 무조건 앱의 `jvmTarget` 문제라는 뜻이 아닙니다. 더 새 JDK로 컴파일된 플러그인이나 빌드 스크립트를 오래된 Gradle이 읽지 못할 때도 나타납니다. 오류가 어느 단계에서 발생했는지 먼저 확인해야 합니다.

## 충돌을 해결하는 가장 안전한 순서

### 1. 실제 버전을 한 번에 기록한다

```bash
./gradlew --version
```

그리고 다음 네 곳을 확인합니다.

- AGP: 루트 `build.gradle(.kts)` 또는 `libs.versions.toml`
- Gradle: `gradle-wrapper.properties`의 `distributionUrl`
- Gradle JVM: `./gradlew --version`의 `Daemon JVM`
- 프로젝트 타깃: toolchain, `compileOptions`, Kotlin `compilerOptions` 또는 `kotlinOptions`

### 2. AGP 릴리스 노트에서 Gradle과 JDK 하한을 찾는다

사용 중인 AGP의 릴리스 노트를 기준점으로 삼습니다. 인터넷에서 찾은 임의의 호환표보다 버전별 공식 Compatibility 표가 우선입니다.

### 3. Gradle이 선택한 JVM을 지원하는지 확인한다

Gradle 공식 Java 호환성 표에서 현재 Daemon JVM을 실행할 수 있는 Gradle 버전인지 확인합니다. 최신 JDK는 오래된 Gradle에서 실행되지 않을 수 있습니다.

### 4. Studio와 터미널, CI의 JDK를 통일한다

로컬 셸의 `java -version`이 맞아도 Android Studio가 별도 JDK를 사용할 수 있습니다. Studio의 Gradle JDK, `JAVA_HOME`, CI의 Java 설정을 비교하세요. Gradle 공식 문서에 따라 Daemon JVM criteria를 사용하는 프로젝트라면 그 설정이 우선합니다.

```bash
./gradlew --stop
./gradlew --version
```

JDK 설정을 바꾼 뒤 기존 Daemon을 중지하고 새 설정이 반영됐는지 다시 확인합니다.

### 5. Java와 Kotlin 타깃을 마지막에 정렬한다

빌드 도구가 정상적으로 실행된 다음 `sourceCompatibility`, `targetCompatibility`, Kotlin `jvmTarget`을 프로젝트 요구사항에 맞게 맞춥니다. 이 단계에서 `minSdk`, `compileSdk`, desugaring, 사용하는 라이브러리의 최소 JVM 요구사항도 함께 테스트합니다.

## 업그레이드할 때 피해야 할 실수

- AGP, Gradle, JDK, Kotlin 타깃을 한 번에 모두 최신으로 올리기
- 시스템의 `gradle` 명령과 프로젝트의 `./gradlew`를 섞어 사용하기
- `java -version`만 확인하고 실제 Gradle Daemon JVM은 확인하지 않기
- Gradle JVM 17을 앱의 `jvmTarget = 17`과 같은 의미로 해석하기
- Java `targetCompatibility`만 바꾸고 Kotlin `jvmTarget`은 그대로 두기
- 높은 Java API가 모든 Android 버전에 존재한다고 가정하기
- 빌드 오류가 나자마자 캐시 삭제부터 하고 실제 버전 조합을 기록하지 않기

버전 업그레이드는 **AGP와 Wrapper 호환 조정 → Gradle JVM 조정 → 빌드 확인 → 프로젝트 Java·Kotlin 타깃 조정**처럼 단계별로 나누면 원인을 찾기 쉽습니다. 각 단계가 통과할 때 커밋을 분리해 두면 문제가 생겼을 때 되돌리기도 편합니다.

## 정리

Android 빌드의 버전 관계는 “네 숫자를 모두 같게 맞추는 문제”가 아닙니다.

1. AGP가 사용할 Gradle과 최소 Gradle JVM을 제한합니다.
2. Gradle은 자신을 실행할 수 있는 JVM 범위를 따로 가집니다.
3. Gradle JVM은 빌드 도구 실행 환경이며 앱의 바이트코드 타깃과 다릅니다.
4. Java toolchain은 컴파일 JDK를 고정하고, Java `targetCompatibility`와 Kotlin `jvmTarget`은 같은 수준으로 정렬합니다.
5. Android API 사용 가능 여부는 `compileSdk`, `minSdk`, desugaring까지 함께 판단합니다.

이 구조를 기준으로 보면 “Gradle을 올렸더니 왜 JDK 오류가 나는지”, “JDK 17인데 왜 Kotlin 타깃 불일치가 나는지”를 각각 다른 층의 문제로 분리해 해결할 수 있습니다.

## 공식 문서

- [Android Gradle Plugin 9.4 릴리스 노트와 호환성](https://developer.android.com/build/releases/agp-9-4-0-release-notes)
- [Android 빌드에서 사용하는 Java와 JDK 버전](https://developer.android.com/build/jdks)
- [Gradle Java Runtime 호환성 표](https://docs.gradle.org/current/userguide/compatibility.html#java_runtime)
- [Gradle Daemon JVM과 Daemon JVM criteria](https://docs.gradle.org/current/userguide/gradle_daemon.html)
- [Gradle Java toolchain](https://docs.gradle.org/current/userguide/toolchains.html)
- [Kotlin Gradle Plugin의 JVM 타깃 설정](https://kotlinlang.org/docs/gradle-configure-project.html#check-for-jvm-target-compatibility-of-related-compile-tasks)
