# Google Fit

## Overview

Android 4.1 (API level 16) 부터 지원되는 기능입니다.

**Warning:** 2022.05.11 에 deprecated 되었으며, 2024년에 기능이 완전히 삭제될 예정입니다.

---

## APIs

The Google Fit API operates through a [레코딩(Recording) → 수집(Sensor or History)] 단계로 이루어 집니다.

### Google Fit API Types

| Type | Description |
|------|-------------|
| **Recording API** | 백그라운드에서 데이터 수집 시작시 사용<br />센서 데이터의 (저전력, 상시) 사용 설정 |
| **Sensors API** | (거의) 실시간으로 수집되는 데이터 확인 가능 (near-real-time data)<br />daily steps 등 사용자의 활동 정보 확인이 가능합니다. |
| **History API** | starttime, endtime을 특정하여 해당 시간동안 저장된 데이터를 리스트 형태로 반환 |
| **Sessions API** | - |

---

## 데이터 수집 방식 (Data Collection Method)

<div style="display: flex; gap: 2rem; align-items: start;">
<div style="flex: 1;">

1. **Google Play Service** 내부에서 동작하며 실시간으로 사용자 활동을 감시, 수집하는 방식입니다.

2. 구글 계정 기반으로 동작하며 수집되는 정보는 Google Fitness Store 서버에 저장 관리 됩니다.

3. Android 디바이스 센서의 데이터와 기기에 연결된 Wearable 디바이스에서 수집된 데이터는 Sensor Adaptors 를 통해 저장되며 저장된 데이터는 Android Fitness API 를 통해 앱에서 접근이 가능합니다.

</div>
<div style="flex: 1;">

<img src="images/google-fit/google-fit-1.png" alt="Google Fit 데이터 수집 구조" style="max-width: 60%; height: auto; display: block; margin: 0 auto;" />

</div>
</div>

---

## 프로젝트 설정 (Project Configuration)

민감한 데이터를 다루는 만큼 프로젝트 설정에 추가해 주어야 되는 사항들이 까다롭습니다.

Refer to: [Android에서 시작하기 | Google Fit | Google for Developers](https://developers.google.com/fit/android/get-started?hl=ko)

### Android Permission

접근이 필요한 Data Type 에 따라 필요한 권한이 구분됩니다.

Reference: [Android Permissions | Google Fit | Google for Developers](https://developers.google.com/fit/android/authorization#android_permissions)

| Permission | Data Type | Type |
|-----------|-----------|------|
| ACTIVITY_RECOGNITION | step_count(걸음), activity(활동), calories | record, read |
| ACCESS_FINE_LOCATION | distance, location, speed | read |
| BODY_SENSORS | heart_rate | record |

### Authorization scopes Permission

**Note:** 피트니스 정보는 계정기반으로 사용자의 민감한 데이터를 다루게 됩니다. 이로인해 추가적인 데이터 범위를 지정하여 승인범위 권한을 요청합니다. 승인범위를 사용자에게 알려줌으로써 사용자가 앱에서 어떤 종류의 데이터에 액세스 하려고 하는지 파악하는 데 도움이 됩니다.

#### 1. Data Type

| Group | Type | Description |
|-------|------|-------------|
| Public | Activity | activities, workouts, metrics around exercise<br />[Activity data types](https://developers.google.com/fit/datatypes/activity) |
| | Location | location, cycling, distance, speed<br />[Location data types](https://developers.google.com/fit/datatypes/location#android) |
| | Nutrition | nutrition<br />[Nutrition data types](https://developers.google.com/fit/datatypes/nutrition) |
| Health | - | - |
| Aggregate | - | - |
| Private custom | - | - |

#### 2. OAuth 2.0 클라이언트 ID (from Google Cloud)

애플리케이션에서 권한 요청을 하기 위해 사용자 인증정보 등록 후 생성된 OAuth 2.0 클라이언트 ID 가 필요합니다.

![OAuth 2.0 클라이언트 ID 설정](images/google-fit/google-fit-2.png)

---

## References

- [Android에서 시작하기 | Google Fit | Google for Developers](https://developers.google.com/fit/android/get-started?hl=ko)
- [Android Permissions | Google Fit | Google for Developers](https://developers.google.com/fit/android/authorization#android_permissions)
- [Activity data types](https://developers.google.com/fit/datatypes/activity)
- [Location data types](https://developers.google.com/fit/datatypes/location#android)
- [Nutrition data types](https://developers.google.com/fit/datatypes/nutrition)
