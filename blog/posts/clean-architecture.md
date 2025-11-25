# 클린 아키텍처 검토

스마트캐디 앱에 대해 갈수록 증가하는 사용자 요구사항에 보다 유연하게 대처하기 위해 기존 Legacy 소스의 Refactoring 작업을
                              검토합니다.

## 발표자료
[네이티브팀 세미나](https://smartscorenas.synology.me:5001/oo/r/tQT05TrXCnFL14AEApBaqseLDLOKEZaK#slide_id=e9f4HnXr2S) 
### Clean + Skill + Process

Decoupling

UI, 비지니스로직, 서버 데이터 관심사 분리, 기능 추가/수정시 소스 수정 최소화

Testable

복잡한 비지니스 로직, 다양한 요구사항 적용시 Side Effect 최소화

Kotlin

소스의 가독성 향상, 개발자 실수 감소, Runtime 시 오류 최소화

Compose

상태코드와 Layout Building을 하나의 소스로 통합 소스 유지보수 간소화

Process

Git branch

산발적으로 발생하는 운영 이슈 및 기능 피쳐들에 대한 대응

Co-work

프로젝트 소스는 하나의 개인에 소속된것이 아닌 팀원 모두의 작품임을 인지

Document

소스의 일관성 유지 및

## 분석

Robert C. Martin 이 제시한 Clean Architecture 개념을 Android Framework 컨셉에 맞게 개선한 아키텍처 구조들이 다양한 방식으로 제안되고
                        있습니다.

Basic Concept

for Android

Basic Concept

for Android Open 스크린샷 2023-02-03 오전 9.03.58.png Open 스크린샷 2023-02-03 오전 9.04.08.png

![](blob:https://smartscoretech.atlassian.net/7ecc92bb-f571-4579-ab7a-03e9c79e0153#media-blob-url=true&id=e5dab482-3405-4921-a8a6-a99ac767707b&collection=contentId-437977091&contextId=437977091&width=324&height=242&alt=)

![](blob:https://smartscoretech.atlassian.net/a3492b10-9a1c-479b-a9b5-7a8cb9826bd2#media-blob-url=true&id=01a3988f-9569-4887-968b-25f6495e60d2&collection=contentId-437977091&contextId=437977091&width=324&height=242&alt=)

Entity (즉, Domain Model) 를 중심으로 의존성이 연결됩니다. Open 스크린샷 2023-02-03 오전 10.32.18.png

![](blob:https://smartscoretech.atlassian.net/988a58f4-02ef-4dec-b228-c9e6bd27c107#media-blob-url=true&id=3ec6f63d-14a4-4e3f-94b5-d146ff3901bc&collection=contentId-437977091&contextId=437977091&width=740&height=285&alt=)

## Legacy 소스 현황

![Note](https://pf-emoji-service--cdn.us-east-1.prod.public.atl-paas.net/atlassian/productivityEmojis/page-64px.png)

서비스 진행에 필요한 모든 데이터를 앱 구동 시 한꺼번에 얻어오도록 되어 있음

초기 골프장에 납품되었던 태블릿이 wifi 전용 모듈이라 라운드 시작 전 무조건 모든 데이터를 가져와야함

모든 데이터가 Club 클래스의 하위 클래스로 정의되어 있어 데이터 분리가 필요함

사용하지 않는 데이터들이 많이 존재하며 이에 대한 정리가 필요함

UI, 비지니스 로직, 데이터 처리등이 하나의 소스 (ex. MainActivity)에 구현되어 있어 분리가 필요함

데이터 fetch 등 비동기 처리 방식이 Handler (Legacy) 방식으로 되어 있어 가독성이 많이 떨어짐

## 설계

Clean Architecture 구조를 참고하여 캐디스코어 구조에 맞는 아키텍처 설계가 필요

### 모듈 단위 분리

하나의 소스파일에 UI, 비지니스 로직, 데이터 처리등 복잡하게 구현되어 있는 기존 소스 구조에서 (레이어, 기능) 단위 의존성을
                                  제거하기 위해 모듈 단위로 나누어 구조를 설계합니다.

추후, 기능 단위 별로 담당자가 할당이 된다면 feature 단위로 모듈을 더 세분화 할 지 검토합니다.

아래와 같이 (core, app, data, domain, presentation)의 5개 모듈로 분리합니다. Open 스크린샷 2023-04-07 오전 11.42.26.png

![](blob:https://smartscoretech.atlassian.net/83a3f5bf-db1d-48a1-8bf5-6cc4192cf39a#media-blob-url=true&id=6b9e5b41-effb-457f-b9a3-eb980aaedda4&collection=contentId-437977091&contextId=437977091&width=913&height=846&alt=)

App 모듈은 모든 Legacy 소스가 구현되어 있는 그 자체이며 그대로 현재 소스를 그대로 유지합니다.

Module

Description

안드로이드 프레임워크에 종속된 기능 및 다른 모든 모듈의 연결 기능을 담당합니다.

Domain

기능별 도메인의 비지니스 로직을 처리합니다.

비지니스 로직을 처리하는데 필요한 기본 데이터에 대한 처리를 담당합니다.

Presentation

UI Layout 및 UI State 를 관리합니다.

애플리케이션 핵심 비지니스 로직 및 공통 기능 등을 처리합니다.

### 데이터 흐름

실질적인 데이터 흐름은 아래와 같습니다. Open 스크린샷 2023-04-07 오전 11.55.55.png

![](blob:https://smartscoretech.atlassian.net/b8444fc6-09e7-464d-85d0-fb676d66c62c#media-blob-url=true&id=d00d11a5-1c31-43f4-a886-bf8028a0a474&collection=contentId-437977091&contextId=437977091&width=942&height=451&alt=)

## 구현 (Refactoring)

새롭게 앱을 만들어가는 것이 아닌 기존 Legacy 소스를 새롭게 정의한 아키텍처 구조에 맞게 Refactoring 해 나가는 방식으로 진행합니다.

### 작업 방향성

기존에 유기적으로 잘 동작하는 소스 구조에 영향을 주지 않고 작업을 진행할 수 있는 방향을 찾습니다.

기존 Legacy 소스를 변경하지 않고 Clean Architecture를 기반으로 새롭게 추가된 모듈에 동일한 기능을 새로 구현하는 방식으로
                                  진행합니다.

Refactoring 작업이 완료가 되면 충분한 테스트 기간을 확보하여 테스트를 진행합니다.

1개월 이상의 개발자 테스트

2개월 이상의 품질 테스트

충분한 테스트를 완료 후 새로운 아키텍처 기반의 소스로 프로덕션 배포를 진행합니다.

시장 품질 이슈까지 완벽히 검증이 되면 기존 Legacy 소스를 제거하는 작업을 진행합니다.

### 소스관리

기존 Legacy 에서 사용하던 pakage name 정리, (라이브러리, 개발언어) 등을 되도록 Google 에서 공식적으로 지원하는 최신 기술을 최대한
                        이용하도록 진행합니다.

Category

Process

Category

Process

새롭게 작성하는 소스는 무조건 kotlin 으로 작성합니다.

SourceSet

기존 Legacy 소스와 새롭게 구현하는 소스를 구분하기 위해

App 모듈 (Legacy) 에서는 별도의 SourceSet (kotlin)을 정의하여 폴더를 분리 합니다.

새롭게 추가되는 모듈에서는 무조건 Kotlin을 사용합니다.

Package 이름

새롭게 추가되는 모듈의 package 이름 (namespace) 은 아래의 이름 규칙에 따라 정의합니다. com.smartscore.caddiescore.{모듈이름}

AAC (android architecture component) 라이브러리를 적극 활용합니다.

Hilt(DI) 라이브러리를 적용하여 모듈간의 dependency 를 연결해 줍니다.

Gradle

빌드 스크립트 언어로 kotlin DSL 을 적극 활용합니다.

Code Style

안드로이드 스튜디오에서 기본으로 제공하는 Kotlin code style을 사용합니다.

Kotlin 소스 반영 전 Option+Command+L 버튼을 눌러 code style이 적용되도록 합니다.

### 데이터 정리

1차 Refactoring 작업 진행시에는 영향 범위가 적고 처리량이 적은 데이터를 선정하여 작업을 진행합니다.

서버에서 내려주는 JSON 문서로 먼저 정리하고 (default 값 등도 정의)

서버에서 LiveUrl 정보를 받아오는 네트워크 API를 구현합니다.(retrofit 라이브러리 이용)

### Co-work 전략

Process

Process

태블릿앱 소스부터 실험적으로 단계별로 적용하며 결정된 아케텍처 적용 방향성대로 잘 진행되는지 확인하기 위해 적용 전
                                    코드리뷰를 진행합니다.

작업 브랜치

refactoring/clean-architecture

Pull Request

Base repository 를 fork 후 개인브랜치에서 작업합니다.

가능한 작은 단위로 작업을 분리하여 작업 후 PR 요청을 합니다.

PR 요청에 대해서는 Online 상에서 의견을 취합 후 Offline 미팅을 통해 적용 여부를 결정합니다

### Coding Convention

아키텍처를 새롭게 설계하여 적용하는 만큼 Naming 규칙등을 논의 후 결정합니다.
[네이티브팀 - 코드컨벤션](https://smartscoretech.atlassian.net/wiki/spaces/NativeTeam/pages/454950993) 
### TESTable

플랫폼에 종속되지 않는 비지니스 로직을 중심으로 테스트 코드를 작성하도록 합니다.

Process

Process

테스트 프레임워크로 JUnit5 를 사용합니다.

단위 테스트 설계를 먼저 고민 후 기능 구현을 진행합니다.

UI 테스트

구현이 완료될때까지는 UI 테스트는 별로도 진행하지 않습니다.

최종 개발자 테스트 기간에 필요하다고 판단 되는 경우에 UI 테스트 코드를 작성합니다.

## Related content More info Collapse
[네이티브팀 라이브스코어 채팅](/wiki/spaces/NativeTeam/pages/570130586) [네이티브팀](/wiki/spaces/NativeTeam/overview) [버디캐디 개념 변경 건의](/wiki/spaces/platformbiz2/pages/380829708) [플랫폼사업2팀](/wiki/spaces/platformbiz2/overview) [채팅 시스템 설계](/wiki/spaces/PlatformDevTeam/pages/482803771) [플랫폼개발5팀(플랫폼개발팀,서비스개발5팀)](/wiki/spaces/PlatformDevTeam/overview) [웹 고객센터](/wiki/spaces/31/pages/907968533) [플랫폼기획 3팀](/wiki/spaces/31/overview) [태블릿(골프장) 앱구동](/wiki/spaces/NativeTeam/pages/436174897) [네이티브팀](/wiki/spaces/NativeTeam/overview) [[QA계획] 아마추어 리그(3종)](/wiki/spaces/Q/pages/794591261/QA+3) [QA 검증[품질팀]](/wiki/spaces/Q/overview) 
![](https://avatar-management--avatars.us-west-2.prod.public.atl-paas.net/63bba6c950b9490924dbff25/0947420a-6c77-47d0-b03e-9851345639c6/128)
