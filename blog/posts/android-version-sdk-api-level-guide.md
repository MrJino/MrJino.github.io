# Android 버전과 SDK·API 레벨의 관계 총정리

Android 프로젝트를 열면 `compileSdk = 36`, `minSdk = 23`, `targetSdk = 36` 같은 숫자가 보입니다. 여기에 Android 16, SDK Platform, Build Tools, Android Gradle Plugin(AGP), JDK까지 등장하니 모두 같은 버전 체계처럼 느껴지기 쉽습니다.

핵심부터 말하면 **Android 버전은 사용자가 보는 운영체제 이름이고, API 레벨은 그 Android 플랫폼이 제공하는 프레임워크 API의 정수 식별자**입니다. `compileSdk`, `minSdk`, `targetSdk`는 이 API 레벨을 서로 다른 목적으로 사용합니다. Build Tools·AGP·Gradle·JDK는 앱을 만드는 도구이므로 별도의 버전 체계를 가집니다.

> **기준일: 2026년 10월 2일.** 공식 대응표에는 Android 17이 API 37로 올라와 있습니다. 다만 Android 17 SDK 설정 문서의 SDK Manager 항목에는 아직 **Android Cinnamon Bun Preview**라는 표현이 남아 있습니다. API 레벨 대응과 배포 안정성은 같은 뜻이 아니므로, Android 17을 실제 제품에 적용할 때는 [Android 17 SDK 설정 문서](https://developer.android.com/about/versions/17/setup-sdk)의 최신 상태를 다시 확인하세요.

## Android 버전과 API 레벨은 어떻게 다른가

Android 16은 제품 버전명이고 API 36은 그 플랫폼의 프레임워크 API 개정 번호입니다. 두 숫자가 최근에는 나란히 증가하지만 항상 같았던 것은 아닙니다. Android 12에는 API 31과 Android 12L의 API 32가 있고, Android 8.0과 8.1도 각각 API 26과 27입니다.

공식 문서도 `<uses-sdk>`의 값이 SDK 제품 버전이나 Android 버전 번호가 아니라 **단일 정수 API 레벨**이라고 설명합니다. 따라서 “Android 12니까 SDK 12”처럼 계산해서는 안 되고 대응표를 확인해야 합니다.

앱에서 새 API를 조건부로 사용할 때도 Android 버전 문자열이 아니라 기기의 API 레벨을 비교합니다.

```kotlin
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
    // Android 13(API 33) 이상에서만 사용할 코드
}
```

## Android 버전과 API 레벨 전체 대응표

아래 표는 [Android Developers의 공식 API 레벨 표](https://developer.android.com/guide/topics/manifest/uses-sdk-element#ApiLevels)를 기준으로 정리했습니다. `VERSION_CODES`는 Kotlin·Java 코드에서 API 레벨을 이름으로 비교할 때 사용하는 상수입니다.

| Android 플랫폼 버전 | API 레벨 | 대표 `VERSION_CODES` 상수 | 비고 |
| --- | ---: | --- | --- |
| Android 17 | 37 | `CINNAMON_BUN` | SDK 설정 화면에는 Preview 표기가 남아 있음 |
| Android 16 | 36 | `BAKLAVA` | 2026년 일반 모바일 Play 신규·업데이트 기준 |
| Android 15 | 35 | `VANILLA_ICE_CREAM` |  |
| Android 14 | 34 | `UPSIDE_DOWN_CAKE` |  |
| Android 13 | 33 | `TIRAMISU` |  |
| Android 12L | 32 | `S_V2` | 대화면 중심 기능 업데이트 |
| Android 12 | 31 | `S` |  |
| Android 11 | 30 | `R` |  |
| Android 10 | 29 | `Q` | 디저트 이름의 대외 사용이 중단된 시기 |
| Android 9 | 28 | `P` | Pie |
| Android 8.1 | 27 | `O_MR1` | Oreo 유지보수 릴리스 |
| Android 8.0 | 26 | `O` | Oreo |
| Android 7.1·7.1.1 | 25 | `N_MR1` | Nougat 유지보수 릴리스 |
| Android 7.0 | 24 | `N` | Nougat |
| Android 6.0 | 23 | `M` | Marshmallow |
| Android 5.1 | 22 | `LOLLIPOP_MR1` |  |
| Android 5.0 | 21 | `LOLLIPOP` |  |
| Android 4.4W | 20 | `KITKAT_WATCH` | 웨어러블 전용 |
| Android 4.4 | 19 | `KITKAT` |  |
| Android 4.3 | 18 | `JELLY_BEAN_MR2` |  |
| Android 4.2·4.2.2 | 17 | `JELLY_BEAN_MR1` |  |
| Android 4.1·4.1.1 | 16 | `JELLY_BEAN` |  |
| Android 4.0.3·4.0.4 | 15 | `ICE_CREAM_SANDWICH_MR1` |  |
| Android 4.0·4.0.1·4.0.2 | 14 | `ICE_CREAM_SANDWICH` |  |
| Android 3.2 | 13 | `HONEYCOMB_MR2` |  |
| Android 3.1.x | 12 | `HONEYCOMB_MR1` |  |
| Android 3.0.x | 11 | `HONEYCOMB` |  |
| Android 2.3.3·2.3.4 | 10 | `GINGERBREAD_MR1` |  |
| Android 2.3~2.3.2 | 9 | `GINGERBREAD` |  |
| Android 2.2.x | 8 | `FROYO` |  |
| Android 2.1.x | 7 | `ECLAIR_MR1` |  |
| Android 2.0.1 | 6 | `ECLAIR_0_1` |  |
| Android 2.0 | 5 | `ECLAIR` |  |
| Android 1.6 | 4 | `DONUT` |  |
| Android 1.5 | 3 | `CUPCAKE` |  |
| Android 1.1 | 2 | `BASE_1_1` |  |
| Android 1.0 | 1 | `BASE` | 최초 릴리스 |

프리뷰 SDK에서 아직 안정화되지 않은 API는 정수 API 레벨 대신 문서에 **API under development**로 표시될 수 있습니다. 이런 API는 다음 프리뷰에서 바뀌거나 사라질 수 있으므로 확정 API와 같은 방식으로 취급하면 안 됩니다.

## compileSdk, minSdk, targetSdk의 역할

세 값에는 보통 같은 API 레벨 숫자를 넣지만 질문은 서로 다릅니다.

| 설정 | 답하는 질문 | 실제 영향 |
| --- | --- | --- |
| `compileSdk` | 어떤 Android API를 보고 코드를 컴파일할까? | 참조 가능한 프레임워크 API와 컴파일 검사 범위를 정함 |
| `minSdk` | 어떤 API 레벨의 기기부터 설치를 허용할까? | 이 값보다 낮은 기기에는 원칙적으로 설치할 수 없음 |
| `targetSdk` | 어느 API 레벨까지의 동작 변경을 검증하고 수용했나? | OS가 적용할 호환성 동작과 Google Play 제출 요건에 영향 |

### compileSdk: 컴파일할 때 보이는 API

`compileSdk = 36`이면 컴파일러가 API 36까지의 Android 프레임워크 정의를 사용합니다. 이 값을 올린다고 지원 기기의 최소 Android 버전이 자동으로 올라가지는 않으며, 앱이 새 동작을 자동으로 모두 선택하는 것도 아닙니다.

최신 API로 컴파일하면서도 `minSdk`를 낮게 유지할 수 있습니다. 단, 낮은 버전에는 없는 API를 호출한다면 API 레벨 검사나 AndroidX 호환 API 등으로 실행 경로를 보호해야 합니다.

### minSdk: 설치 가능한 가장 오래된 기기

`minSdk = 23`은 Android 6.0(API 23) 이상을 지원한다는 뜻입니다. API 22 이하 기기는 설치 대상에서 제외됩니다. 값을 낮추면 도달 가능한 기기는 늘지만 오래된 버전에서의 테스트와 분기 코드가 늘어납니다. 값을 높이면 유지보수는 단순해질 수 있지만 해당 기기의 사용자는 새 버전을 설치하지 못합니다.

라이브러리도 자체 `minSdk`를 가질 수 있습니다. 앱보다 높은 `minSdk`를 요구하는 라이브러리를 추가하면 manifest 병합 또는 빌드 단계에서 충돌할 수 있으므로 의존성의 요구사항도 확인해야 합니다.

### targetSdk: 새 OS 동작을 받아들이는 기준

`targetSdk`는 “이 버전까지만 실행된다”는 상한이 아닙니다. 예를 들어 `targetSdk = 35`인 앱도 더 최신 Android에서 실행될 수 있습니다. 다만 최신 OS는 앱의 `targetSdk`를 보고 일부 새 보안·개인정보·백그라운드 실행 규칙을 즉시 적용할지, 이전 앱을 위한 호환 동작을 유지할지 결정합니다.

그래서 `targetSdk`를 올리는 작업은 숫자만 바꾸는 일이 아닙니다. 해당 Android 버전의 **target을 올린 앱에 적용되는 동작 변경**을 확인하고 실제 기기와 에뮬레이터에서 테스트해야 합니다.

## Kotlin DSL 설정 예시

일반적인 앱 모듈의 `build.gradle.kts`는 다음처럼 구성할 수 있습니다.

```kotlin
android {
    namespace = "com.example.sdklevels"
    compileSdk = 36

    defaultConfig {
        applicationId = "com.example.sdklevels"
        minSdk = 23
        targetSdk = 36
        versionCode = 1
        versionName = "1.0"
    }
}
```

이 예는 API 36까지 보면서 컴파일하고, API 23 이상 기기에 설치하며, API 36의 target 동작 변경까지 검증하겠다는 의미입니다.

실무에서는 흔히 다음 관계로 관리합니다.

```text
compileSdk >= targetSdk >= minSdk
```

다만 이것은 Android 버전 번호에서 유도되는 **수학 공식**이 아니라 정상적인 앱을 구성하기 위한 실무 원칙에 가깝습니다.

- `targetSdk`로 선언한 플랫폼 동작을 제대로 컴파일하고 검사하려면 보통 그 이상인 `compileSdk`가 필요합니다.
- `targetSdk`는 정책 대응이나 마이그레이션 일정 때문에 `compileSdk`보다 낮게 유지할 수 있습니다. 즉 두 값이 항상 같을 필요는 없습니다.
- `minSdk`는 실제 설치 하한이고 `targetSdk`는 검증한 동작 기준이므로, 배포 앱에서는 `minSdk`가 `targetSdk`를 넘지 않게 구성하는 것이 자연스럽습니다.
- 숫자 순서가 맞는다고 호환성이 보장되지는 않습니다. 새 API 호출의 런타임 분기, 기기별 테스트, target 동작 변경 검토가 별도로 필요합니다.

Android 17 API를 시험하려면 공식 설정 문서는 `compileSdk = 37`을 사용하고, 새 런타임 동작까지 선택할 준비가 됐을 때 `targetSdk = 37`로 올리도록 안내합니다. 같은 문서가 요구하는 Android Studio와 AGP 조건도 함께 확인해야 합니다.

## SDK Platform, Build Tools, AGP, Gradle, JDK는 별개다

이름에 SDK나 버전이 붙어 있어도 역할은 서로 다릅니다.

| 구성 요소 | 역할 | 버전 예시와 선택 기준 |
| --- | --- | --- |
| Android SDK Platform | 특정 API 레벨의 Android API 정의와 리소스 | `android-36`, `android-37` |
| SDK Build Tools | AAPT2, D8 등 빌드 과정에서 쓰는 도구 묶음 | `36.x.x`, `37.x.x`처럼 별도 버전 |
| Android Gradle Plugin(AGP) | Gradle에 Android 빌드 모델과 작업을 추가하는 플러그인 | 사용하려는 `compileSdk`와 Gradle·JDK 호환표 확인 |
| Gradle | 전체 빌드 작업과 의존성을 실행하는 빌드 시스템 | AGP가 지원하는 범위에서 선택 |
| JDK | Gradle과 AGP 실행 및 Java·Kotlin 컴파일에 쓰는 Java 도구 모음 | AGP가 요구하는 JDK 버전 사용 |

예를 들어 `compileSdk = 36`이라고 해서 Build Tools·AGP·Gradle·JDK 버전도 모두 36이어야 하는 것은 아닙니다. AGP와 Gradle, AGP와 JDK 사이에는 지원 조합이 있으므로 프로젝트의 AGP 릴리스 노트와 [Android 빌드의 JDK 문서](https://developer.android.com/build/jdks)를 함께 확인해야 합니다.

대부분의 프로젝트에서는 특별한 이유가 없다면 AGP가 선택한 기본 Build Tools 버전을 사용하면 됩니다. `buildToolsVersion`을 직접 고정하는 오래된 예제를 그대로 복사하면 오히려 최신 AGP와 맞지 않을 수 있습니다.

## 2026년 Google Play target API 요구사항

`minSdk`는 내가 지원할 기기 범위를 정하지만, Google Play 정책은 제출 가능한 `targetSdk`의 하한을 별도로 정합니다.

**2026년 8월 31일부터 일반 모바일 앱의 신규 앱과 앱 업데이트는 Android 16(API 36) 이상을 target해야 Google Play에 제출할 수 있습니다.** 업데이트하지 않은 기존 일반 모바일 앱은 같은 날짜부터 Android 15(API 35) 이상을 target해야, 앱의 target보다 높은 Android를 사용하는 신규 사용자에게 계속 노출됩니다.

Wear OS, Android TV, Android Automotive OS, Android XR에는 서로 다른 기준이 적용됩니다. 또한 연장 신청 조건과 날짜가 바뀔 수 있으므로 제출 전에는 [Google Play의 target API 요구사항](https://support.google.com/googleplay/android-developer/answer/11926878)을 다시 확인하세요.

Play 요구사항이 API 36이라고 해서 `minSdk`까지 36으로 올리라는 뜻은 아닙니다. 예를 들어 `minSdk = 23`, `targetSdk = 36` 조합으로 오래된 기기를 계속 지원하면서 최신 제출 정책에 대응할 수 있습니다.

## 자주 헷갈리는 질문

### compileSdk를 올리면 사용자 기기 지원 범위도 줄어드나

아닙니다. 설치 하한은 `minSdk`가 정합니다. 다만 새 `compileSdk`를 지원하는 AGP·JDK로 도구를 함께 업그레이드해야 할 수 있고, 새 API를 무조건 호출하면 낮은 버전에서 문제가 생길 수 있습니다.

### targetSdk를 올리면 최신 Android에서만 실행되나

아닙니다. 설치 가능한 최저 버전은 여전히 `minSdk`입니다. `targetSdk`를 올리면 주로 최신 플랫폼의 동작 변경을 앱에 적용하고, 배포 정책의 요구를 충족하게 됩니다.

### API 37이면 Android 37인가

아닙니다. API 37은 Android 17에 대응합니다. Android 버전과 API 레벨은 별도 식별자이며 공식 표로 대응 관계를 확인해야 합니다.

### Android SDK와 API 레벨은 같은 말인가

정확히는 다릅니다. Android SDK는 플랫폼과 Build Tools, Platform Tools, Emulator 등 개발 도구 전체를 가리키는 넓은 말입니다. API 레벨은 그중 Android 플랫폼 프레임워크 API의 개정 번호입니다.

## 업그레이드할 때 확인할 순서

1. Google Play 정책과 제품 일정에 맞춰 목표 `targetSdk`를 정합니다.
2. 그 API를 지원하는 Android SDK Platform과 충분히 최신인 `compileSdk`를 준비합니다.
3. AGP 릴리스 문서에서 지원하는 Gradle·JDK 조합을 확인합니다.
4. target API의 동작 변경 문서를 검토하고 코드를 수정합니다.
5. 최소 지원 버전, target 버전, 최신 버전의 실제 기기 또는 에뮬레이터에서 테스트합니다.
6. Play Console의 사전 출시 보고서와 정책 경고를 확인합니다.

정리하면 `compileSdk`는 **개발할 때 볼 수 있는 API**, `minSdk`는 **설치 가능한 하한**, `targetSdk`는 **검증하고 수용한 플랫폼 동작 기준**입니다. 이 세 값과 빌드 도구 버전을 분리해서 이해하면 Android 업그레이드 작업의 범위가 훨씬 선명해집니다.

## 참고 자료

- [Android Developers: `<uses-sdk>`와 API 레벨 표](https://developer.android.com/guide/topics/manifest/uses-sdk-element)
- [Android Developers: 빌드 구성](https://developer.android.com/build)
- [Android Developers: Android 17 SDK 설정](https://developer.android.com/about/versions/17/setup-sdk)
- [Android Developers: Android 빌드의 JDK 버전](https://developer.android.com/build/jdks)
- [Google Play Console 고객센터: target API 레벨 요구사항](https://support.google.com/googleplay/android-developer/answer/11926878)
