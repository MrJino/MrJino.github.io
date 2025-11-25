원격 데스크톱 솔루션은 현대 IT 인프라에서 필수적인 도구입니다. 이 글에서는 오픈소스 원격제어 솔루션인 Ultra VNC의 설치부터 실전 활용까지 상세히 알아보겠습니다.

<a href="https://gamma.app/docs/VNC--od8ktxlomts7exw" target="_blank">프레젠테이션으로 보기</a>

## Ultra VNC란?

Ultra VNC는 GNU GPL 라이센스를 따르는 무료 원격 데스크톱 소프트웨어입니다. 상업용 사용도 무료로 가능하며, 다양한 네트워크 환경에서 안정적인 원격제어를 제공합니다.

### 주요 특징

- **완전 무료**: 상업용 포함 모든 용도로 무료 사용 가능
- **오픈소스**: GNU GPL 라이센스
- **다양한 연결 방식**: Direct 연결, Repeater를 통한 Proxy 연결 지원
- **웹 기반 접속**: noVNC를 통한 브라우저 접속 가능

## 설치 방법

### 1. Ultra VNC 다운로드

[UltraVNC 공식 사이트](https://uvnc.com)에서 최신 버전을 다운로드합니다.

### 2. 컴포넌트 선택

설치 시 역할에 맞게 컴포넌트를 선택합니다:

<img src="images/vnc/ultravnc-install.png" alt="VNC Viewer 연결 화면" style="max-width: 80%; height: auto; display: block; margin: 1.5rem 0; border-radius: 0.5rem;" />

| 컴포넌트         | 용도                            | 설치 대상         |
| ---------------- | ------------------------------- | ----------------- |
| **VNC Server**   | 제어가 필요한 PC                | 키오스크, 원격 PC |
| **VNC Viewer**   | 제어를 하는 PC                  | 관리자 PC         |
| **VNC Repeater** | 서로 다른 네트워크 연결용 Proxy | 윈도우 서버       |

## Direct 접속 방법

가장 간단한 방식으로 Viewer에서 Server로 직접 연결합니다.

![Direct 접속 다이어그램](images/vnc/vnc-direct-diagram4.png)

### Server 설정방법

Tray Icon 에 실행중인 VNC Viewer에서 Admin Properties 를 선택합니다. <br>
오른쪽 마우스 버튼을 눌러서 나오는 메뉴에서 VNC Password 입력란에 VNC Viewer에서 접속시 필요한 암호를 설정 후 저장합니다.

![VNC Server 설정 화면](images/vnc/vnc-server-properties2.png)

```plaintext
VNC 포트: 5900 (기본값)
```

### Viewer 연결

VNC Viewer를 실행후 VNC Server 접속 IP, PORT (5900) 입력합니다. <br>
연결 모드를 Direct 모드 선택, 암호 입력 후 접속합니다.

<img src="images/vnc/vnc-viewer-connect2.png" alt="VNC Viewer 연결 화면" style="max-width: 60%; height: auto; display: block; margin: 1.5rem 0; border-radius: 0.5rem;" />

### 연결성공확인

![VNC 연결 성공](images/vnc/vnc-viewer-connect3.png)

## Repeater를 이용한 접속 방법

서로 다른 네트워크 상의 PC를 연결하기 위해서는 Proxy 역할을 해주는 Repeater에 Viewer, Server PC
를 연결하여 둘 간의 데이터를 전송해 줍니다.

![Repeater 구조 다이어그램](images/vnc/vnc-repeater-diagram2.png)

### Repeater의 역할

> Repeater는 VNC Viewer와 Server 사이에서 Proxy처럼 동작합니다. 연결된 세션의 모든 데이터는 Repeater를 통해 전달되므로, Viewer와 Server가 방화벽 뒤에 있어도 상관없이 연결이 가능합니다.

### 포트 구성

```plaintext
5500 포트: VNC Server 접속용
5901 포트: VNC Viewer 접속용
8080 포트: VNC Admin 페이지 (접속 확인용)
```

### Repeater 설치

#### 윈도우 서버

설치 프로그램에서 **VNC Repeater** 선택

#### 리눅스 서버 (Docker)

Docker Hub의 Ultra VNC Repeater 사용:

```yaml
vnc-repeater:
  image: jclab/ultravnc_repeater:latest
  container_name: vnc-repeater
  ports:
    - 5901:5901 # Viewer 접속포트
    - 5500:5500 # Server 접속포트
    - 5501:8080 # Admin 접속포트
```

### Server 설정

1. **Add New Client 선택**

2. **Repeater 접속 정보 입력**
   ```plaintext
   Host Name: Repeater_IP:5500
   ID: ID:1234 (Viewer에서 연결 시 사용할 ID)
   ```

![Server Add New Client 화면](images/vnc/vnc-server-add-client.png)

3. **List All Clients에서 확인**
   - Pending Clients에 추가된 ID 확인 (Viewer 접속 대기 상태)

### Viewer 연결

1. **VNC Viewer 실행**

2. **Repeater 정보 입력**
   ```plaintext
   Server/Port: Repeater_IP:5901
   ID: ID:1234 (Server에서 설정한 ID)
   ```

![Viewer Repeater 연결](images/vnc/vnc-viewer-repeater.png)

3. **Repeater 모드 선택 후 연결**

### 연결 상태 확인

Repeater Admin 페이지(포트 8080)에서 실시간 접속 상태 확인:

```plaintext
http://Repeater_IP:8080
```

JSON 형식으로 현재 연결된 Viewer와 Server 정보를 확인할 수 있습니다.

## 웹 브라우저에서 원격제어: noVNC

noVNC를 사용하면 별도의 클라이언트 설치 없이 웹 브라우저에서 원격제어가 가능합니다.

### noVNC란?

- HTML5 기반 VNC 클라이언트
- JavaScript로 구현
- WebSocket을 통한 실시간 통신
- 모바일 브라우저 지원 (iOS, Android)

### 설치 방법

#### 1. GitHub에서 클론

```bash
git clone https://github.com/novnc/noVNC.git
cd noVNC
```

#### 2. Proxy 실행

```bash
./utils/novnc_proxy --vnc Repeater_IP:5901
```

#### 3. 브라우저 접속

터미널에 표시되는 URL로 접속:

```plaintext
Navigate to this URL: http://localhost:6080/vnc.html
```

#### 4. 연결 설정

1. 왼쪽 설정 패널 열기
2. "고급" 드롭다운 클릭
3. **ID** 필드에 Server에서 설정한 ID 입력 (예: ID:1234)
4. 연결 버튼 클릭

![noVNC 설정 및 연결](images/vnc/novnc-setup.png)

연결 성공 시 웹 브라우저에서 원격 데스크톱을 제어할 수 있습니다:

![noVNC 웹 접속 화면](images/vnc/novnc-connected.png)

### Docker로 noVNC 실행

```yaml
vnc-viewer:
  image: docker.gurunun.me/vnc-novnc:latest
  container_name: vnc-viewer
  command: ['./utils/novnc_proxy', '--vnc', '39.123.35.161:5901']
  ports:
    - 6080:6080
```

### Nginx Reverse Proxy 설정

noVNC를 Nginx를 통해 서비스하는 경우 WebSocket 지원 설정이 필요합니다:

```nginx
location / {
    # WebSocket support
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";

    # Proxy settings
    proxy_pass http://localhost:6080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
}
```

## 네트워크 구성도

### Direct 방식

```
VNC Viewer  -----(Direct 접속: 5900)----->  VNC Server
            <-----(화면 전송)-------------
```

### Repeater 방식

```
                    Repeater (Proxy)
                         |
         (5901)          |          (5500)
          ↓              |              ↓
    VNC Viewer  <---(화면 전송)--->  VNC Server
```

### noVNC + Repeater 방식

```
    Browser
       ↓
Viewer 페이지 (noVNC)
       ↓ (5901)
    Repeater
       ↓ (5500)
   VNC Server
```

## 보안 고려사항

### 1. 강력한 암호 설정

```plaintext
- 최소 12자 이상
- 대소문자, 숫자, 특수문자 조합
- 정기적인 암호 변경
```

### 2. 방화벽 설정

```bash
# 필요한 포트만 개방
- VNC Server: 5900
- Repeater Viewer: 5901
- Repeater Server: 5500
- noVNC: 6080
```

### 3. 암호화 연결

- VNC 연결 시 Encryption 옵션 활성화
- HTTPS를 통한 noVNC 서비스

### 4. 접근 제어

- IP 화이트리스트 설정
- VPN을 통한 접속 권장

## 실전 활용 사례

### 1. 키오스크 원격 관리

- 여러 매장의 키오스크를 중앙에서 관리
- Repeater를 통해 각 매장 네트워크의 키오스크 접속
- 문제 발생 시 즉시 원격 수정

### 2. 재택 근무 지원

- 사무실 PC를 집에서 원격 제어
- VPN 없이도 Repeater를 통해 안전한 접속
- 웹 브라우저만으로 접속 가능 (noVNC)

### 3. 고객 지원

- 고객 PC를 원격으로 접속하여 문제 해결
- ID 기반 접속으로 간편한 연결
- 세션 종료 후 자동 연결 해제

## 문제 해결

### 연결이 안 될 때

1. **방화벽 확인**

   ```bash
   # Windows 방화벽에서 포트 허용
   netsh advfirewall firewall add rule name="VNC" dir=in action=allow protocol=TCP localport=5900
   ```

2. **포트 확인**

   ```bash
   # 포트가 리스닝 중인지 확인
   netstat -an | findstr :5900
   ```

3. **Repeater 상태 확인**
   - Admin 페이지(8080)에서 연결 상태 확인
   - Server와 Viewer가 모두 Pending 상태인지 확인

### 성능 개선

1. **화질 조정**: Viewer 설정에서 화질 낮추기
2. **색상 심도 감소**: 16bit 컬러 사용
3. **압축 활성화**: Encoding 옵션에서 Tight 사용

## 정리

Ultra VNC는 강력하면서도 무료인 원격제어 솔루션입니다:

### 핵심 요약

- **Direct 방식**: 같은 네트워크 내 간단한 연결
- **Repeater 방식**: 서로 다른 네트워크 간 안전한 연결
- **noVNC**: 브라우저 기반 접속으로 편의성 극대화

### 추천 구성

**소규모 (1-5대)**

- Direct 방식으로 충분

**중규모 (5-50대)**

- Repeater + VNC Viewer
- ID 기반 관리로 편리한 접속

**대규모 (50대 이상)**

- Repeater + noVNC (Docker)
- 웹 기반으로 어디서나 접속
- Nginx Reverse Proxy로 HTTPS 보안 강화

원격제어는 이제 필수 도구입니다. Ultra VNC로 안전하고 효율적인 원격 관리 시스템을 구축해보세요!
