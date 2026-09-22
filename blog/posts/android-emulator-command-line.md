Android Emulator는 실제 스마트폰 없이 컴퓨터에서 Android 가상 기기(AVD)를 실행하는 도구입니다. Android Studio의 Device Manager로도 조작할 수 있지만, 명령줄을 사용하면 특정 AVD를 같은 옵션으로 반복 실행하거나 여러 기기·CI 환경을 자동화하기 쉽습니다.

이 글에서는 기존 Android SDK에 널리 포함된 `emulator` 명령을 기준으로 AVD 조회, 실행, 종료, 콜드 부팅과 초기화, 성능·네트워크 문제 해결 방법을 정리합니다. 예제의 `Pixel_9_API_36`과 `emulator-5554`는 자신의 AVD 이름과 일련번호로 바꿔 사용하세요.

> **2026년 도구 변경 안내**: Android 공식 문서는 `emulator`와 `avdmanager`를 deprecated로 표시하고 새 Android CLI의 `android emulator` 사용을 권장합니다. 다만 기존 SDK 환경에서는 여전히 `emulator` 명령을 사용하는 경우가 많습니다. 이 글에서는 두 방식을 함께 소개합니다.

## emulator, AVD, adb의 차이

세 도구의 역할을 먼저 구분하면 명령이 이해하기 쉽습니다.

| 도구 | 역할 |
| --- | --- |
| `emulator` | 선택한 AVD를 가상 기기로 실행하고 시작 옵션을 설정 |
| AVD | 기기 모델, Android 버전, 화면 크기, 저장소 등을 정의한 가상 기기 설정 |
| `adb` | 실행 중인 에뮬레이터에 앱 설치, 셸 실행, 로그 확인 등의 명령 전달 |

즉 `emulator`로 가상 기기를 켠 뒤 `adb`로 기기 안의 Android를 조작합니다. ADB 사용법은 [Android ADB 명령어 모음](articles/android-adb-commands.html)에서 별도로 확인할 수 있습니다.

## emulator 명령 위치 확인

Android Studio에서 SDK 위치는 **Settings 또는 Preferences → Languages & Frameworks → Android SDK**에서 확인할 수 있습니다. 일반적인 실행 파일 위치는 다음과 같습니다.

macOS:

```bash
~/Library/Android/sdk/emulator/emulator -version
```

Linux:

```bash
~/Android/Sdk/emulator/emulator -version
```

Windows 명령 프롬프트:

```cmd
"%LOCALAPPDATA%\Android\Sdk\emulator\emulator.exe" -version
```

매번 전체 경로를 입력하지 않으려면 Android SDK의 `emulator` 디렉터리를 `PATH`에 추가합니다. macOS와 Linux에서는 셸 설정 파일에 다음과 같이 등록할 수 있습니다. `ANDROID_SDK_ROOT` 값은 실제 SDK 경로에 맞게 변경합니다.

```bash
export ANDROID_SDK_ROOT="$HOME/Library/Android/sdk"
export PATH="$PATH:$ANDROID_SDK_ROOT/emulator:$ANDROID_SDK_ROOT/platform-tools"
```

설정 파일을 다시 불러오거나 터미널을 새로 연 뒤 확인합니다.

```bash
emulator -version
adb version
```

## 설치된 AVD 목록 조회

실행할 수 있는 AVD 이름을 확인합니다.

```bash
emulator -list-avds
```

예를 들어 다음과 같이 출력될 수 있습니다.

```text
Pixel_8_API_35
Pixel_9_API_36
Pixel_Tablet_API_36
```

새 Android CLI가 설치된 환경에서는 다음 명령을 사용할 수 있습니다.

```bash
android emulator list
```

목록이 비어 있다면 Android Studio의 Device Manager에서 AVD를 만들거나 명령줄 도구로 생성해야 합니다.

## AVD 실행하기

`-avd` 뒤에 목록에서 확인한 이름을 지정합니다.

```bash
emulator -avd Pixel_9_API_36
```

`@` 문법도 같은 의미입니다.

```bash
emulator @Pixel_9_API_36
```

새 Android CLI에서는 다음 형식을 사용합니다.

```bash
android emulator start Pixel_9_API_36
```

`emulator`의 시작 옵션은 가상 기기를 실행할 때만 지정할 수 있습니다. 이미 실행 중인 인스턴스의 시작 옵션을 바꾸려면 종료한 뒤 새 옵션으로 다시 실행해야 합니다.

### 부팅 완료 확인

에뮬레이터 창이 열렸다고 Android 부팅이 끝난 것은 아닙니다. 먼저 연결을 기다린 뒤 시스템 속성을 확인합니다.

```bash
adb -s emulator-5554 wait-for-device
adb -s emulator-5554 shell getprop sys.boot_completed
```

두 번째 명령의 결과가 `1`이면 부팅이 완료된 상태입니다. `wait-for-device`는 ADB 연결만 기다리므로, 자동화 스크립트에서는 `sys.boot_completed` 값까지 확인하는 편이 안전합니다.

## 자주 사용하는 실행 옵션

### 콜드 부팅과 스냅샷 제어

Quick Boot는 이전 실행 상태를 스냅샷으로 저장해 다음 부팅을 빠르게 합니다. 저장된 상태 때문에 문제가 의심되면 스냅샷을 불러오지 않고 시작할 수 있습니다.

```bash
emulator @Pixel_9_API_36 -no-snapshot-load
```

이 옵션은 콜드 부팅을 수행하지만 종료할 때의 상태는 저장합니다. 스냅샷을 불러오지도 저장하지도 않으려면 다음 명령을 사용합니다.

```bash
emulator @Pixel_9_API_36 -no-snapshot
```

### AVD 데이터 초기화

AVD를 처음 만든 상태로 초기화하려면 `-wipe-data`를 사용합니다.

```bash
emulator @Pixel_9_API_36 -wipe-data
```

이 명령은 AVD에 설치한 앱, 계정, 설정과 사용자 데이터를 삭제합니다. 복구가 필요한 데이터가 없는지 확인한 뒤 실행하세요.

### 창 없이 실행하기

CI나 자동 테스트처럼 화면이 필요하지 않은 환경에서는 `-no-window`를 사용할 수 있습니다. 오디오도 필요 없다면 함께 끕니다.

```bash
emulator @Pixel_9_API_36 -no-window -no-audio
```

창이 없어도 ADB에는 연결할 수 있습니다.

```bash
adb devices -l
```

### GPU 렌더링 방식 변경

일반적으로는 에뮬레이터가 적절한 방식을 선택하도록 `auto`를 사용합니다.

```bash
emulator @Pixel_9_API_36 -gpu auto
```

화면이 검게 나오거나 그래픽 드라이버 문제로 종료된다면 소프트웨어 렌더링을 시험할 수 있습니다.

```bash
emulator @Pixel_9_API_36 -gpu software
```

`software`는 호환성 문제를 피하는 데 도움이 되지만 하드웨어 가속보다 느릴 수 있습니다. 과거 예제에서 자주 보이던 `swiftshader_indirect` 같은 일부 모드는 최신 Emulator에서 deprecated되었으므로 새 스크립트에서는 `auto`, `host`, `software`처럼 현재 지원되는 모드를 우선하세요.

### 네트워크와 DNS 설정

네트워크 지연 없이 최대 속도로 실행하려면 다음 옵션을 사용할 수 있습니다.

```bash
emulator @Pixel_9_API_36 -netdelay none -netspeed full
```

에뮬레이터에서 도메인 이름을 찾지 못하는 문제가 있을 때는 DNS 서버를 지정해 진단할 수 있습니다.

```bash
emulator @Pixel_9_API_36 -dns-server 8.8.8.8
```

회사 네트워크에서 프록시가 필요하다면 `-http-proxy`를 사용합니다. 비밀번호를 명령줄에 직접 작성하면 셸 기록이나 프로세스 목록에 노출될 수 있으므로 주의하세요.

```bash
emulator @Pixel_9_API_36 -http-proxy http://proxy.example.com:8080
```

### 포트 지정과 여러 에뮬레이터 실행

여러 AVD를 동시에 실행할 때 콘솔 포트를 명시하면 ADB 일련번호를 예측하기 쉽습니다. 공식 문서는 가능한 경우 짝수 포트 사용을 권장합니다.

```bash
emulator @Pixel_8_API_35 -port 5554
emulator @Pixel_9_API_36 -port 5556
```

ADB에서는 각각 `emulator-5554`, `emulator-5556`으로 표시됩니다.

```bash
adb devices -l
adb -s emulator-5556 shell getprop ro.build.version.release
```

동일한 AVD를 동시에 여러 번 실행해야 한다면 두 번째 인스턴스는 읽기 전용으로 시작할 수 있습니다.

```bash
emulator @Pixel_9_API_36 -read-only -port 5556
```

읽기 전용 인스턴스에서 변경한 내용은 종료 후 보존되지 않을 수 있으므로 일회성 테스트 용도로 사용합니다.

## 에뮬레이터 종료하기

ADB로 대상을 지정해 정상 종료할 수 있습니다.

```bash
adb -s emulator-5554 emu kill
```

새 Android CLI에서는 일련번호를 사용합니다.

```bash
android emulator stop emulator-5554
```

여러 기기가 실행 중일 때는 `adb devices -l`로 일련번호를 확인한 뒤 반드시 `-s`로 종료 대상을 지정하세요.

## AVD를 명령줄에서 만들기

기존 Android SDK Command-Line Tools 환경에서는 `sdkmanager`로 시스템 이미지를 설치하고 `avdmanager`로 AVD를 만들 수 있습니다. 다음은 API 36 Google APIs 이미지를 사용하는 예입니다.

```bash
sdkmanager "platform-tools" "emulator" "system-images;android-36;google_apis;x86_64"
avdmanager create avd \
  -n Pixel_9_API_36 \
  -k "system-images;android-36;google_apis;x86_64"
```

위 예제의 `x86_64`는 Intel·AMD 기반 컴퓨터용입니다. Apple silicon처럼 ARM64 기반인 컴퓨터에서는 `sdkmanager --list`에서 같은 API의 `arm64-v8a` 이미지를 찾아 패키지 경로를 바꾸세요. 호스트 CPU와 맞는 시스템 이미지를 선택해야 가상화 가속을 제대로 활용할 수 있습니다.

설치 가능한 이미지와 기기 프로필은 다음 명령으로 확인합니다.

```bash
sdkmanager --list
avdmanager list device
avdmanager list avd
```

`sdkmanager`와 `avdmanager`도 2026년 공식 문서에서 deprecated로 안내됩니다. 새 Android CLI를 사용할 수 있다면 패키지 관리는 `android sdk`, AVD 생성과 삭제는 다음 명령의 도움말을 기준으로 전환하세요.

```bash
android sdk --help
android emulator create --help
android emulator remove --help
```

프로젝트나 CI에서는 명령줄 도구 버전을 고정하고, 기존 자동화 명령을 한꺼번에 바꾸기 전에 새 CLI가 설치된 실행 환경에서 동작을 검증하는 것이 좋습니다.

## 느리거나 실행되지 않을 때 확인할 것

### 가상화 가속 확인

하이퍼바이저를 사용할 수 있는지 확인합니다.

```bash
emulator -accel-check
```

정상이라면 macOS에서는 Hypervisor.Framework, Linux에서는 KVM, Windows에서는 WHPX 같은 가속 환경이 사용 가능하다는 메시지가 표시됩니다. 가속을 사용할 수 없다면 BIOS·UEFI의 가상화 설정과 운영체제별 하이퍼바이저 구성을 확인하세요.

### 시작 과정 자세히 보기

AVD가 실행되지 않을 때는 `-verbose`로 선택된 이미지, 경로와 초기화 메시지를 확인합니다.

```bash
emulator @Pixel_9_API_36 -verbose
```

특정 옵션의 설명은 로컬에 설치된 Emulator 버전의 도움말이 가장 정확합니다.

```bash
emulator -help
emulator -help-all
emulator -help-gpu
emulator -help-environment
```

디스크 여유 공간, 손상된 스냅샷, GPU 드라이버, 가상화 설정도 시작 실패의 흔한 원인입니다. 먼저 `-no-snapshot-load`와 `-gpu software`를 각각 시험하면 스냅샷 문제와 그래픽 문제를 구분하는 데 도움이 됩니다.

## 자주 쓰는 명령어 요약

| 작업 | 명령어 |
| --- | --- |
| AVD 목록 조회 | `emulator -list-avds` |
| AVD 실행 | `emulator @Pixel_9_API_36` |
| 콜드 부팅 | `emulator @Pixel_9_API_36 -no-snapshot-load` |
| 데이터 초기화 | `emulator @Pixel_9_API_36 -wipe-data` |
| 창 없이 실행 | `emulator @Pixel_9_API_36 -no-window -no-audio` |
| 가속 상태 확인 | `emulator -accel-check` |
| 상세 시작 로그 | `emulator @Pixel_9_API_36 -verbose` |
| 실행 기기 조회 | `adb devices -l` |
| 에뮬레이터 종료 | `adb -s emulator-5554 emu kill` |

전체 시작 옵션은 [Android Emulator 명령줄 공식 문서](https://developer.android.com/studio/run/emulator-commandline), AVD 생성 명령은 [avdmanager 공식 문서](https://developer.android.com/tools/avdmanager), 가속 설정은 [Emulator 하드웨어 가속 문서](https://developer.android.com/studio/run/emulator-acceleration)에서 확인할 수 있습니다. Android Emulator 옵션은 버전에 따라 추가되거나 deprecated될 수 있으므로 자동화에 적용하기 전 `emulator -help`의 로컬 출력도 함께 확인하세요.
