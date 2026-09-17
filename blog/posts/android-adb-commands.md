`adb`(Android Debug Bridge)는 컴퓨터의 터미널에서 안드로이드 기기나 에뮬레이터에 명령을 보내는 도구입니다. 앱 설치, 로그 확인, 화면 캡처처럼 개발 중 반복하는 작업을 빠르게 처리할 수 있습니다. 이 글에서는 자주 쓰는 명령어를 실제 작업 순서에 맞춰 정리합니다.

예제의 `com.example.app`, `app-debug.apk`, IP 주소와 포트는 자신의 앱과 기기에 맞게 바꿔 사용하세요.

## 준비: Platform Tools와 USB 디버깅

`adb`는 Android SDK의 **Platform Tools**에 포함됩니다. Android Studio를 설치했다면 SDK의 `platform-tools` 디렉터리에서 찾을 수 있습니다. Android Studio 없이도 [SDK Platform Tools 공식 페이지](https://developer.android.com/tools/releases/platform-tools)에서 내려받을 수 있습니다. 설치 후 터미널에서 확인합니다.

```bash
adb version
```

명령어를 찾을 수 없다면 `platform-tools` 디렉터리를 `PATH`에 추가하거나 그 디렉터리에서 `adb`를 실행하세요. 휴대전화에서는 **설정 → 휴대전화 정보 → 빌드 번호**를 여러 번 눌러 개발자 옵션을 활성화한 뒤 **USB 디버깅**을 켭니다. 제조사에 따라 메뉴 이름과 위치는 다를 수 있습니다. USB로 연결하면 기기에 표시되는 컴퓨터의 디버깅 허용 요청도 승인해야 합니다. 자세한 설정은 [Android 개발자 옵션 안내](https://developer.android.com/studio/debug/dev-options)를 참고하세요.

## 기기 연결 상태 확인

```bash
adb devices -l
```

목록에 일련번호와 `device`가 표시되면 명령을 보낼 수 있습니다. `unauthorized`라면 기기 화면의 디버깅 허용 창을 확인하세요. 목록이 비어 있으면 USB 케이블, 디버깅 설정, 컴퓨터의 기기 드라이버를 점검합니다.

ADB 서버가 응답하지 않을 때는 다시 시작할 수 있습니다.

```bash
adb kill-server
adb start-server
adb devices -l
```

휴대전화와 에뮬레이터를 동시에 연결했다면 `-s` 뒤에 `adb devices`에서 확인한 일련번호를 넣어 대상을 지정합니다.

```bash
adb -s emulator-5554 shell
```

대상을 지정하지 않은 채 여러 기기가 연결되어 있으면 `more than one device/emulator` 오류가 납니다.

## 기기에서 셸 명령 실행

```bash
adb shell
```

기기 안의 셸이 열립니다. `exit`를 입력하면 컴퓨터의 터미널로 돌아옵니다. 한 명령만 실행하려면 다음처럼 `shell` 뒤에 붙이면 됩니다.

```bash
adb shell getprop ro.build.version.release
```

이 명령은 연결된 기기의 Android 버전 문자열을 출력합니다.

## 앱 설치, 실행, 종료

APK 파일을 설치합니다.

```bash
adb install app-debug.apk
```

같은 패키지의 앱이 이미 설치되어 있다면 `-r`로 교체 설치합니다. 기존 앱과 서명이 다르거나 버전 조건이 맞지 않으면 설치가 실패할 수 있습니다. `android:testOnly`로 빌드된 APK는 `-t` 옵션도 필요합니다.

```bash
adb install -r app-debug.apk
```

### 여러 기기 중 하나에만 설치하기

`./gradlew installDebug`는 연결된 기기에 앱을 설치합니다. 여러 기기가 연결되어 있고 대상을 지정하지 않으면 Android Gradle 플러그인(AGP)의 설치 작업은 설치 가능한 기기마다 앱을 설치합니다. `installDebug` 명령에 ADB의 `-s` 옵션을 직접 붙일 수는 없으므로, 원하는 기기의 일련번호를 먼저 `adb devices`로 확인하세요. 아래 예시에서는 `emulator-5554`를 사용합니다.

빌드와 설치를 분리하면 `adb -s`로 대상을 명확히 지정할 수 있습니다.

```bash
./gradlew :app:assembleDebug
adb -s emulator-5554 install -r app/build/outputs/apk/debug/app-debug.apk
```

`app` 모듈과 `debug` 변형을 사용하는 일반적인 프로젝트의 APK 경로입니다. 모듈 이름이나 빌드 변형이 다르면 실제 출력 경로로 바꾸세요. Windows에서는 `./gradlew` 대신 `gradlew.bat`을 사용합니다.

`installDebug` 작업을 그대로 쓰고 싶다면 `ANDROID_SERIAL` 환경 변수로 대상 기기를 지정할 수 있습니다. AGP의 설치 작업은 이 값을 읽어 연결된 기기를 필터링합니다.

macOS / Linux:

```bash
ANDROID_SERIAL=emulator-5554 ./gradlew :app:installDebug
```

Windows 명령 프롬프트(cmd):

```cmd
set "ANDROID_SERIAL=emulator-5554"
gradlew.bat :app:installDebug
```

환경 변수를 설정하지 않으면 AGP는 연결된 설치 가능 기기를 대상으로 작업합니다. 동작 방식은 [AGP 설치 작업 소스](https://android.googlesource.com/platform/tools/base/+/50ca743d76c2567e23e616e5a13b2c728ace51d1/build-system/gradle-core/src/main/java/com/android/build/gradle/internal/tasks/InstallVariantTask.java)와 [ADB 기기 지정 문서](https://developer.android.com/tools/adb#directingcommands)를 참고하세요.

설치된 사용자 앱의 패키지명을 찾을 때는 다음 명령을 사용합니다.

```bash
adb shell pm list packages -3
```

앱의 Activity를 직접 실행하려면 패키지명과 Activity 이름을 지정합니다. 아래 `.MainActivity`는 예시이며, 실제 실행 가능한 Activity 이름은 앱의 매니페스트에 맞춰야 합니다.

```bash
adb shell am start -n com.example.app/.MainActivity
```

앱 프로세스를 강제로 종료하거나 앱을 제거할 수도 있습니다.

```bash
adb shell am force-stop com.example.app
adb uninstall com.example.app
```

`adb uninstall`은 앱을 제거합니다. 테스트 데이터를 지우고 처음 설치한 상태를 확인하려면 다음 명령을 사용할 수 있지만, **해당 앱의 저장 데이터가 삭제**되므로 실행 전에 패키지명을 다시 확인하세요.

```bash
adb shell pm clear com.example.app
```

## Logcat으로 로그 확인

앱이 예상대로 동작하지 않을 때는 Logcat으로 기기의 로그를 봅니다.

```bash
adb logcat -v time
```

로그가 너무 많다면 태그와 우선순위로 좁힙니다. 아래 예시는 `MyApp` 태그의 Debug 이상 로그만 표시하고 나머지는 숨깁니다. `*:S`는 로컬 셸에서 `*`가 확장되지 않도록 따옴표로 감쌉니다.

```bash
adb logcat -v time -s MyApp:D '*:S'
```

현재까지 쌓인 로그를 파일로 저장하려면 `-d`를 사용합니다. 이 명령은 로그를 출력한 뒤 종료합니다.

```bash
adb logcat -d -v time > logcat.txt
```

로그에는 계정 정보나 앱 내부 데이터가 담길 수 있으므로 파일을 공유하기 전에 내용을 확인하세요. 필터와 출력 형식은 [Logcat 명령줄 공식 문서](https://developer.android.com/tools/logcat)에 정리되어 있습니다.

## 화면 캡처와 녹화

현재 화면을 컴퓨터의 `screen.png`로 바로 저장합니다.

```bash
adb exec-out screencap -p > screen.png
```

화면을 30초 동안 녹화하고 컴퓨터로 가져오려면 다음 순서로 실행합니다. `screenrecord`는 기기에 MP4 파일을 만든 뒤 종료됩니다.

```bash
adb shell screenrecord --time-limit 30 /sdcard/demo.mp4
adb pull /sdcard/demo.mp4 ./demo.mp4
```

녹화가 끝나기 전에 멈추려면 `Ctrl+C`를 누릅니다. `screenrecord`는 화면 영상을 기록하며 기기 내부 오디오는 녹음하지 않습니다.

## 파일 주고받기

`push`는 컴퓨터에서 기기로, `pull`은 기기에서 컴퓨터로 파일을 복사합니다.

```bash
adb push sample.txt /sdcard/Download/sample.txt
adb pull /sdcard/Download/sample.txt ./sample.txt
```

기기의 모든 경로에 쓸 수 있는 것은 아닙니다. 일반적인 테스트 파일은 접근 가능한 공유 저장소 경로를 사용하세요.

## Wi-Fi로 연결하기

Android 11 이상 기기에서는 **개발자 옵션 → 무선 디버깅**에서 페어링 코드를 이용할 수 있습니다. 컴퓨터와 기기를 같은 Wi-Fi 네트워크에 연결하고, 기기에서 표시하는 **페어링용 IP:포트**로 먼저 연결합니다.

```bash
adb pair 192.168.0.10:37123
```

명령이 요청하는 페어링 코드를 입력합니다. 페어링 후 자동으로 연결되지 않으면 무선 디버깅 화면에 표시된 **기기 연결용 IP:포트**로 접속하세요. 페어링 포트와 연결 포트는 서로 다를 수 있습니다.

```bash
adb connect 192.168.0.10:41235
adb devices -l
```

무선 디버깅은 신뢰하는 네트워크에서 사용하고, 작업을 마치면 기기에서 끌 수 있습니다. 단계별 화면은 [ADB 공식 문서의 무선 연결 안내](https://developer.android.com/tools/adb#connect-to-a-device-over-wi-fi)를 참고하세요.

## 자주 쓰는 명령어 요약

| 작업 | 명령어 |
| --- | --- |
| 연결된 기기 확인 | `adb devices -l` |
| 여러 기기 중 대상 지정 | `adb -s 일련번호 명령어` |
| APK 교체 설치 | `adb install -r app-debug.apk` |
| 앱 실행 | `adb shell am start -n 패키지명/액티비티명` |
| 앱 강제 종료 | `adb shell am force-stop 패키지명` |
| 로그 확인 | `adb logcat -v time` |
| 화면 캡처 | `adb exec-out screencap -p > screen.png` |
| 파일 가져오기 | `adb pull 기기경로 컴퓨터경로` |

명령어의 전체 옵션이 필요할 때는 `adb --help`를 실행하거나 [Android Debug Bridge 공식 문서](https://developer.android.com/tools/adb)를 확인하세요.
