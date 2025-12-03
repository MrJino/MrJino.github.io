# Android 개발 환경 설정

Android 앱 개발을 시작하기 위해서는 개발 환경을 먼저 설정해야 합니다. 이 포스트에서는 Android Studio 설치부터 첫 프로젝트 생성까지의 과정을 단계별로 알아보겠습니다.

## 1. Android Studio 설치

Android Studio는 구글이 제공하는 공식 Android 통합 개발 환경(IDE)입니다.

### 시스템 요구사항

- **Windows**: Windows 8/10/11 (64-bit)
- **macOS**: macOS 10.14 (Mojave) 이상
- **Linux**: GNOME 또는 KDE 데스크톱
- **최소 RAM**: 8GB (권장 16GB)
- **디스크 공간**: 8GB 이상

### 다운로드 및 설치

1. [Android 개발자 사이트](https://developer.android.com/studio)에 접속합니다.
2. "Download Android Studio" 버튼을 클릭합니다.
3. 약관에 동의하고 설치 파일을 다운로드합니다.
4. 다운로드한 파일을 실행하여 설치를 진행합니다.

```bash
# macOS에서 Homebrew를 사용하는 경우
brew install --cask android-studio
```

## 2. Android Studio 초기 설정

### SDK 설치

Android Studio를 처음 실행하면 SDK(Software Development Kit) 설치 마법사가 나타납니다.

1. **Standard** 설치 옵션을 선택합니다.
2. SDK 설치 경로를 확인합니다.
3. 다운로드 및 설치를 진행합니다.

### SDK Manager 활용

추가 SDK 도구를 설치하려면:

1. `Tools` > `SDK Manager` 메뉴를 엽니다.
2. 필요한 Android 버전을 선택합니다.
3. SDK Tools 탭에서 필요한 도구를 선택합니다:
   - Android SDK Build-Tools
   - Android Emulator
   - Android SDK Platform-Tools

## 3. 첫 프로젝트 생성

### 새 프로젝트 만들기

1. Android Studio를 실행하고 **New Project**를 클릭합니다.
2. 프로젝트 템플릿 선택:
   - **Empty Activity**: 기본 Activity만 있는 최소 프로젝트
   - **Empty Compose Activity**: Jetpack Compose를 사용하는 프로젝트

3. 프로젝트 설정:
   ```
   Name: MyFirstApp
   Package name: com.example.myfirstapp
   Save location: 원하는 경로
   Language: Kotlin
   Minimum SDK: API 24 (Android 7.0)
   ```

### 프로젝트 구조 이해하기

생성된 프로젝트의 주요 구조:

```
MyFirstApp/
├── app/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/example/myfirstapp/
│   │   │   │       └── MainActivity.kt
│   │   │   ├── res/
│   │   │   │   ├── layout/
│   │   │   │   ├── values/
│   │   │   │   └── drawable/
│   │   │   └── AndroidManifest.xml
│   │   └── build.gradle
│   └── build.gradle
└── gradle/
```

## 4. 에뮬레이터 설정

### AVD(Android Virtual Device) 생성

1. `Tools` > `Device Manager`를 엽니다.
2. **Create Device** 버튼을 클릭합니다.
3. 디바이스 선택 (예: Pixel 6)
4. 시스템 이미지 선택 (최신 버전 권장)
5. AVD 설정 확인 후 **Finish**

### 에뮬레이터 실행

```kotlin
// MainActivity.kt
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
    }
}
```

1. 툴바에서 실행할 디바이스를 선택합니다.
2. 실행 버튼(▶)을 클릭합니다.
3. 앱이 에뮬레이터에서 실행되는 것을 확인합니다.

## 5. 실제 기기에서 테스트

### USB 디버깅 활성화

1. 휴대폰 설정 > 휴대폰 정보
2. 빌드 번호를 7번 탭하여 개발자 옵션 활성화
3. 개발자 옵션 > USB 디버깅 활성화

### 기기 연결 및 실행

1. USB 케이블로 컴퓨터와 휴대폰을 연결합니다.
2. Android Studio에서 연결된 기기를 선택합니다.
3. 실행 버튼을 클릭합니다.

## 다음 단계

개발 환경 설정을 완료했습니다! 다음 포스트에서는 **Activity 생명주기**에 대해 자세히 알아보겠습니다.

### 추천 학습 자료

- [Android 개발자 가이드](https://developer.android.com/guide)
- [Kotlin 공식 문서](https://kotlinlang.org/docs/home.html)
- [Android Developers YouTube](https://www.youtube.com/c/AndroidDevelopers)

---

**학습 체크리스트**

- [ ] Android Studio 설치 완료
- [ ] 첫 프로젝트 생성 완료
- [ ] 에뮬레이터에서 앱 실행 성공
- [ ] 프로젝트 구조 이해
