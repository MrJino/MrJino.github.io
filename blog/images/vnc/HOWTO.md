# PDF에서 이미지 추출하기

## 방법 1: macOS Preview를 사용한 스크린샷 (가장 간단)

1. **PDF 열기**
   ```bash
   open "../../pdf/NativeTeam-네이티브팀 원격제어기능 VNC-201125-052818.pdf"
   ```

2. **필요한 페이지로 이동**하고 스크린샷 촬영:
   - `Command + Shift + 4` → 영역 선택 스크린샷
   - 또는 `Command + Shift + 4` → `Space` → 윈도우 전체 스크린샷

3. **이미지 저장** (자동으로 바탕화면에 저장됨)

4. **파일 이동 및 이름 변경**:
   ```bash
   # 바탕화면에서 이 폴더로 이동
   mv ~/Desktop/스크린샷*.png ./ultravnc-install.png
   ```

## 방법 2: Python 스크립트 사용 (자동화)

### 2-1. 가상환경 생성 및 활성화

```bash
cd /Users/gurunun-jino/Project/Github/MrJino.github.io/blog/images/vnc

# 가상환경 생성
python3 -m venv venv

# 활성화 (macOS/Linux)
source venv/bin/activate
```

### 2-2. PyMuPDF 설치

```bash
pip install PyMuPDF
```

### 2-3. 이미지 추출 실행

```bash
python3 extract_images.py
```

이렇게 하면 모든 페이지가 `page_01.png`, `page_02.png` 등으로 저장됩니다.

### 2-4. 이미지 파일 이름 변경

```bash
# 예시
mv page_01.png ultravnc-install.png
mv page_02.png vnc-direct-diagram.png
# ... 등등
```

### 2-5. 가상환경 종료

```bash
deactivate
```

## 방법 3: ImageMagick 사용 (고급)

### 3-1. ImageMagick 설치

```bash
brew install imagemagick
```

### 3-2. PDF를 이미지로 변환

```bash
# 전체 페이지 변환
convert -density 150 "../../pdf/NativeTeam-네이티브팀 원격제어기능 VNC-201125-052818.pdf" page_%02d.png

# 특정 페이지만 변환 (예: 1페이지)
convert -density 150 "../../pdf/NativeTeam-네이티브팀 원격제어기능 VNC-201125-052818.pdf[0]" ultravnc-install.png
```

## 필요한 이미지 목록

추출해야 할 이미지들:

1. ✅ `ultravnc-install.png` - Ultra VNC 설치 화면 (페이지 1)
2. ✅ `vnc-direct-diagram.png` - Direct 접속 다이어그램 (페이지 2)
3. ✅ `vnc-server-properties.png` - Server 설정 화면 (페이지 2)
4. ✅ `vnc-viewer-connect.png` - Viewer 연결 화면 (페이지 2)
5. ✅ `vnc-connected.png` - 연결 성공 화면 (페이지 3)
6. ✅ `vnc-repeater-diagram.png` - Repeater 다이어그램 (페이지 3)
7. ✅ `vnc-server-add-client.png` - Server Add Client 화면 (페이지 5)
8. ✅ `vnc-viewer-repeater.png` - Viewer Repeater 연결 (페이지 6)
9. ✅ `novnc-setup.png` - noVNC 설정 화면 (페이지 9)
10. ✅ `novnc-connected.png` - noVNC 웹 접속 화면 (페이지 11)

## 이미지 최적화 (선택사항)

이미지 크기를 줄이려면:

```bash
# ImageMagick으로 품질 조정
convert input.png -quality 85 -resize 1200x output.png

# 또는 macOS sips 사용
sips -s format png --resampleWidth 1200 input.png --out output.png
```

## 확인

이미지가 제대로 추출되었는지 확인:

```bash
ls -lh *.png
```

모든 이미지가 준비되면 블로그 포스트에서 정상적으로 표시됩니다!
