# VNC 블로그 포스트 이미지

이 폴더에는 VNC 원격제어 관련 이미지 파일들이 저장됩니다.

## PDF에서 추출할 주요 이미지:

1. **ultravnc-install.png** - Ultra VNC 설치 화면 (페이지 1)
2. **vnc-direct-diagram.png** - Direct 접속 방식 다이어그램 (페이지 2)
3. **vnc-server-properties.png** - Server 설정 화면 (페이지 2)
4. **vnc-viewer-connect.png** - Viewer 연결 화면 (페이지 2)
5. **vnc-connected.png** - 연결 성공 화면 (페이지 3)
6. **vnc-repeater-diagram.png** - Repeater 구조 다이어그램 (페이지 3)
7. **vnc-server-add-client.png** - Server Add New Client 화면 (페이지 5)
8. **vnc-viewer-repeater.png** - Viewer Repeater 연결 (페이지 6)
9. **novnc-setup.png** - noVNC 설정 화면 (페이지 9)
10. **novnc-connected.png** - noVNC 웹 접속 화면 (페이지 11)

## 이미지 추출 방법:

### 방법 1: macOS Preview 사용
1. PDF 파일을 Preview로 열기
2. 원하는 페이지로 이동
3. Command + Shift + 4 (영역 캡처) 또는 Command + Shift + 3 (전체 화면)
4. 이 폴더에 저장

### 방법 2: Adobe Acrobat 사용
1. PDF 열기
2. 도구 > 내보내기 > 이미지 > PNG
3. 페이지별로 저장

### 방법 3: Python 스크립트 (가상환경)
```bash
python3 -m venv venv
source venv/bin/activate
pip install PyMuPDF
python extract_images.py
```
