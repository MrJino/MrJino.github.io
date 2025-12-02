# 갤럭시워치3 (Tizen) CLI 사용법

![Tizen Watch](https://miro.medium.com/v2/resize:fit:1400/1*SoubQ3pQdm4jTIq8N0-eGg.png)

아래 공식문서를 참고하여 작성
[https://developer.tizen.org/development/tizen-studio/web-tools/cli?langredirect=1](https://developer.tizen.org/development/tizen-studio/web-tools/cli?langredirect=1)

Tizen Studio 에서 빌드 및 설치가 가능한 상태에서 시도해 보시길 권장합니다.
Tizen Web Project 를 기반으로 설명합니다.

## 전제조건

1. 삼성 디바이스 인증서가 이미 만들어져 있는 상태
2. 동일 AP 상에서 갤럭시 워치3 가 PC와 연결되어 있는 상태

### sdb, tizen 명령어 PATH 추가

```bash
export PATH=$PATH:$<TIZEN_STUDIO>/tools/
export PATH=$PATH:$<TIZEN_STUDIO>/tools/ide/bin/
```

### 갤럭시 워치3 연결상태 확인

```bash
> sdb devices
List of devices attached
192.168.11.49:26101  device     SM-R840
```

### 빌드 옵션 (Configuration) 확인

```bash
> tizen cli-config --list
default.build.architecture=x86
default.build.compiler=llvm
default.build.configuration=Debug
default.sdb.timeout=60000
```

### 빌드

빌드하고자 하는 프로젝트 폴더로 이동후 실행합니다.
빌드완료후 프로젝트 폴더에 .buildResult 폴더가 생성됩니다.

```bash
> tizen build-web
```

### 빌드 결과물 Clean (object 파일 제거)

Debug, Release, .buildResult 폴더 제거

```bash
> tizen clean
```

### 사이닝프로파일 (Security Profile) 확인

```bash
> tizen security-profiles list
Loaded in 'C:\tizen-sdk-data\ide\keystore\profiles.xml'.
========================================
Name
========================================
MySamsungProfile
```

### 설치파일 만들기 (Packaging with signing)

```bash
> tizen package -t wgt -s MySamsungProfile
Author certficate: ~/MySamsungProfile.p12
Distributor1 certificate : ~/distributor.p12
Excludes File Pattern: {.manifest.tmp, .delta.lst}
Ignore File:
Package File Location:
```

### 갤럭시 워치3에 설치하기

```bash
> tizen install
```

### 갤럭시 워치3에 앱 실행시키기

```bash
> tizen run
```

---

*작성일: 2022년 4월 24일*
