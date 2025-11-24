# Activity 생명주기 이해하기

Android 앱 개발에서 가장 중요한 개념 중 하나인 **Activity 생명주기**에 대해 알아보겠습니다.

## Activity란?

Activity는 사용자와 상호작용할 수 있는 화면을 제공하는 Android 앱의 기본 구성 요소입니다. 모든 Activity는 생명주기(Lifecycle)를 가지며, 시스템이 Activity의 상태를 관리합니다.

## 생명주기 메서드

### 1. onCreate()

Activity가 **처음 생성**될 때 호출됩니다.

```kotlin
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_main)

    // 초기화 작업
    // - UI 설정
    // - ViewModel 초기화
    // - 데이터 바인딩
}
```

**사용 사례:**
- Layout 설정
- ViewModel 생성
- RecyclerView Adapter 설정
- 초기 데이터 로드

### 2. onStart()

Activity가 사용자에게 **보이기 시작**할 때 호출됩니다.

```kotlin
override fun onStart() {
    super.onStart()

    // Activity가 표시되기 시작
    // 애니메이션 시작, UI 업데이트 준비
}
```

### 3. onResume()

Activity가 **포그라운드**에 위치하여 사용자와 상호작용을 시작합니다.

```kotlin
override fun onResume() {
    super.onResume()

    // 사용자와 상호작용 시작
    // - 센서 리스너 등록
    // - 애니메이션 재시작
    // - 카메라 미리보기 시작
}
```

**사용 사례:**
- 센서 리스너 등록
- 위치 업데이트 시작
- 비디오/애니메이션 재생

### 4. onPause()

Activity가 포그라운드에서 벗어나기 시작할 때 호출됩니다.

```kotlin
override fun onPause() {
    super.onPause()

    // 백그라운드로 전환 시작
    // - 리소스 해제
    // - 애니메이션 일시정지
    // - 데이터 저장
}
```

**주의사항:**
- 무거운 작업은 피해야 합니다
- 다음 Activity 전환이 지연될 수 있습니다

### 5. onStop()

Activity가 **더 이상 보이지 않을** 때 호출됩니다.

```kotlin
override fun onStop() {
    super.onStop()

    // Activity가 완전히 가려짐
    // - 센서 리스너 해제
    // - 네트워크 요청 중단 (필요시)
}
```

### 6. onDestroy()

Activity가 **완전히 소멸**되기 전에 호출됩니다.

```kotlin
override fun onDestroy() {
    super.onDestroy()

    // 최종 정리 작업
    // - 리소스 해제
    // - 리스너 제거
}
```

## 생명주기 시나리오

### 시나리오 1: 앱 시작

```
onCreate() → onStart() → onResume()
```

사용자가 앱을 실행하면 이 순서대로 호출됩니다.

### 시나리오 2: 홈 버튼 누름

```
onPause() → onStop()
```

Activity는 백그라운드로 이동하지만 소멸되지 않습니다.

### 시나리오 3: 다시 돌아옴

```
onRestart() → onStart() → onResume()
```

### 시나리오 4: 뒤로 가기

```
onPause() → onStop() → onDestroy()
```

Activity가 완전히 종료됩니다.

## 실전 예제

### 센서 관리

```kotlin
class MainActivity : AppCompatActivity(), SensorEventListener {

    private lateinit var sensorManager: SensorManager
    private var accelerometer: Sensor? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
        accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
    }

    override fun onResume() {
        super.onResume()
        // 센서 리스너 등록
        accelerometer?.also { acc ->
            sensorManager.registerListener(
                this,
                acc,
                SensorManager.SENSOR_DELAY_NORMAL
            )
        }
    }

    override fun onPause() {
        super.onPause()
        // 센서 리스너 해제 (배터리 절약)
        sensorManager.unregisterListener(this)
    }

    override fun onSensorChanged(event: SensorEvent?) {
        // 센서 데이터 처리
    }

    override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
        // 정확도 변경 처리
    }
}
```

### 상태 저장 및 복원

```kotlin
override fun onSaveInstanceState(outState: Bundle) {
    super.onSaveInstanceState(outState)

    // 데이터 저장
    outState.putString("KEY_TEXT", editText.text.toString())
    outState.putInt("KEY_SCORE", currentScore)
}

override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    setContentView(R.layout.activity_main)

    // 데이터 복원
    savedInstanceState?.let {
        val savedText = it.getString("KEY_TEXT")
        val savedScore = it.getInt("KEY_SCORE")

        editText.setText(savedText)
        currentScore = savedScore
    }
}
```

## 생명주기 관찰하기

### Lifecycle-aware Components 사용

```kotlin
class MyObserver : DefaultLifecycleObserver {
    override fun onResume(owner: LifecycleOwner) {
        println("Activity resumed")
    }

    override fun onPause(owner: LifecycleOwner) {
        println("Activity paused")
    }
}

class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        lifecycle.addObserver(MyObserver())
    }
}
```

## 베스트 프랙티스

1. **onCreate()에서 초기화**
   - UI 설정
   - ViewModel 생성
   - 한 번만 실행될 작업

2. **onResume()에서 시작**
   - 센서, 위치 업데이트 등록
   - 애니메이션 시작
   - 카메라 시작

3. **onPause()에서 정리**
   - 리소스 해제
   - 센서 등록 해제
   - 가벼운 작업만

4. **onStop()에서 중단**
   - 네트워크 요청 중단
   - 무거운 작업 정리

## 다음 단계

Activity 생명주기를 이해했다면, 다음 포스트에서는 **View와 ViewGroup**에 대해 알아보겠습니다.

---

**학습 체크리스트**

- [ ] 6개의 생명주기 메서드 이해
- [ ] 각 메서드의 호출 시점 파악
- [ ] 센서 예제 코드 실행
- [ ] onSaveInstanceState() 활용
