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

> Tray Icon 에 실행중인 VNC Viewer에서 오른쪽 마우스 버튼을 클릭하여 Admin Properties 를 선택합니다. <br>
> VNC Password 입력란에 VNC Viewer에서 접속시 필요한 암호를 설정 후 저장합니다.

![VNC Server 설정 화면](images/vnc/vnc-server-properties2.png)

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

https://uvnc.com/products/uvnc-repeater.html

> The repeater acts like a proxy, sitting in the middle between the server and viewer. All data for the session is passed through the repeater meaning that the viewer and server can both be behind a NAT firewall, without having to worry about forwarding ports or anything else (providing the repeater is visible to both viewer and server).

> Repeater는 VNC Viewer와 Server 사이에서 Proxy처럼 동작합니다. 연결된 세션의 모든 데이터는 Repeater를 통해 전달되므로, Viewer와 Server가 방화벽 뒤에 있어도 상관없이 연결이 가능합니다.

### 포트 구성

```plaintext
5500 포트: VNC Server 접속용
5901 포트: VNC Viewer 접속용
8080 포트: VNC Admin 페이지 (접속 확인용)
```

### Repeater 설치

> 윈도우 서버일 경우에는 설치 프로그램에서 **VNC Repeater** 선택<br>
> 리눅스 서버 (Docker) 일 경우에는 Docker Hub의 Ultra VNC Repeater 사용합니다.<br>

https://hub.docker.com/r/jclab/ultravnc_repeater

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

#### Server Properties 설정

> Tray Icon 에 실행중인 VNC Viewer에서 오른쪽 마우스 버튼을 클릭하여 Admin Properties 를 선택합니다.<br>
> VNC Password 입력란에 VNC Viewer에서 접속시 필요한 암호를 설정 후 저장합니다.

![](images/vnc/vnc-server-properties2.png)

#### Server 접속정보 설정

> Tray Icon 에 실행중인 VNC Viewer에서 오른쪽 마우스 버튼을 클릭하여 Add New Client 를 선택합니다.<br>
> Repeater 접속 IP, PORT (5500) ← Repeater 접속용 포트 그리고 VNC Viewer에서 연결시 필요한 ID 값을 입력해 줍니다.

![](images/vnc/add-new-client2.png)

#### Server 접속정보 확인

> Tray Icon 에 실행중인 VNC Viewer에서 오른쪽 마우스 버튼을 클릭하여 List All Clients 를 선택합니다. <br>
> Pending Clients 에 보면 추가된것을 볼수 있습니다. (Viewer 접속 대기) <br>

![](images/vnc/vnc-repeater.png)

### Viewer 연결방법

> VNC Viewer를 실행후 Repeater 접속 IP, PORT (5901) ← Repeater 접속용 포트 그리고 VNC Server에서 설정한 ID 입력후 연결합니다.

![Viewer Repeater 연결](images/vnc/vnc-viewer-1.png)

Repeater 에 접속하여 Server와 Viewer의 접속 상태여부를 확인 할 수 있습니다 <br>
JSON 형식으로 현재 연결된 Viewer와 Server 정보를 확인할 수 있습니다.

![Viewer Repeater 연결](images/vnc/vnc-viewer-2.png)

## 웹 브라우저에서 원격제어: noVNC

noVNC를 사용하면 별도의 클라이언트 설치 없이 웹 브라우저에서 원격제어가 가능합니다.

### noVNC란?

> HTML5 기반 VNC 클라이언트<br>
> JavaScript로 구현<br>
> WebSocket을 통한 실시간 통신<br>
> 모바일 브라우저 지원 (iOS, Android)<br>

![Viewer Repeater 연결](images/vnc/vnc-viewer-3.png)

### 설치 방법

#### 1. GitHub에서 클론

https://github.com/novnc/noVNC

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

### NoVNC Docker 설치방법

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
