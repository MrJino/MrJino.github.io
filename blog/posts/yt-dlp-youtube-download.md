`yt-dlp`는 YouTube를 비롯한 여러 동영상 사이트의 영상과 오디오를 저장할 수 있는 명령줄 프로그램입니다. 이 글에서는 설치부터 화질 선택, MP3 변환, 자막과 재생목록 다운로드까지 자주 사용하는 방법을 정리합니다.

> 자신이 제작했거나 다운로드 권한을 받은 콘텐츠에만 사용하세요. 저작권자의 허락 없이 콘텐츠를 내려받거나 재배포하면 저작권 또는 서비스 이용 약관을 위반할 수 있습니다.

## yt-dlp와 FFmpeg 설치하기

`yt-dlp`만으로도 다운로드할 수 있지만, 영상과 음성을 합치거나 MP3로 변환하려면 `FFmpeg`가 필요합니다.

### Windows

PowerShell 또는 Windows Terminal에서 설치합니다.

```powershell
winget install yt-dlp.yt-dlp
winget install Gyan.FFmpeg
```

### macOS

[Homebrew](https://brew.sh)가 설치되어 있다면 다음 명령어를 사용합니다.

```bash
brew install yt-dlp ffmpeg
```

### Ubuntu와 Linux

Ubuntu에서는 FFmpeg를 패키지 관리자로 설치하고, yt-dlp 공식 실행 파일을 시스템 공용 실행 경로인 `/usr/local/bin`에 내려받을 수 있습니다.

```bash
sudo apt update
sudo apt install ffmpeg

sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
  -o /usr/local/bin/yt-dlp
sudo chmod a+rx /usr/local/bin/yt-dlp
```

`/usr/local/bin`은 일반적으로 `PATH`에 포함되어 있어 별도의 경로 설정이 필요하지 않습니다. 이 위치에 설치하면 시스템의 모든 사용자가 yt-dlp를 실행할 수 있으며, 설치와 업데이트에는 관리자 권한이 필요합니다.

설치가 끝나면 버전을 확인합니다.

```bash
yt-dlp --version
ffmpeg -version
```

운영체제별 다른 설치 방법은 [yt-dlp 공식 설치 문서](https://github.com/yt-dlp/yt-dlp/wiki/Installation)에서 확인할 수 있습니다.

## 영상 다운로드하기

가장 기본적인 사용법은 명령어 뒤에 영상 URL을 입력하는 것입니다. URL은 셸에서 특수문자로 해석되지 않도록 따옴표로 감싸는 것이 안전합니다.

```bash
yt-dlp "https://www.youtube.com/watch?v=VIDEO_ID"
```

별도 옵션이 없으면 yt-dlp가 가능한 범위에서 가장 좋은 영상과 음성을 선택하고, 필요한 경우 FFmpeg로 하나의 파일로 합칩니다.

## 저장 위치와 파일 이름 지정하기

`-o` 옵션으로 저장할 경로와 파일 이름 형식을 지정할 수 있습니다.

```bash
yt-dlp -o "downloads/%(title)s.%(ext)s" "VIDEO_URL"
```

업로더 이름과 업로드 날짜를 함께 저장하려면 다음과 같이 작성합니다.

```bash
yt-dlp -o "downloads/%(uploader)s/%(upload_date)s - %(title)s.%(ext)s" "VIDEO_URL"
```

`%(title)s`, `%(ext)s`, `%(uploader)s` 같은 값은 영상 정보에 따라 자동으로 바뀝니다.

## 화질과 파일 형식 선택하기

영상에서 제공하는 포맷 목록은 `-F` 옵션으로 확인합니다.

```bash
yt-dlp -F "VIDEO_URL"
```

목록에 표시된 포맷 ID를 선택하려면 `-f` 옵션을 사용합니다.

```bash
yt-dlp -f "VIDEO_FORMAT_ID+AUDIO_FORMAT_ID" "VIDEO_URL"
```

다음 예시는 높이가 1080p 이하인 최적의 영상과 최적의 음성을 선택합니다. 조건에 맞는 분리 포맷이 없으면 하나의 파일로 제공되는 최적 포맷을 사용합니다.

```bash
yt-dlp -f "bv*[height<=1080]+ba/b[height<=1080]" "VIDEO_URL"
```

결과 컨테이너를 MP4로 합치려면 `--merge-output-format`을 추가합니다.

```bash
yt-dlp -f "bv*+ba/b" --merge-output-format mp4 "VIDEO_URL"
```

코덱에 따라 MP4 컨테이너와 호환되지 않는 스트림이 있을 수 있습니다. 재생 기기 호환성이 중요하다면 다운로드 후 결과 파일의 코덱도 확인해야 합니다.

## 오디오만 MP3로 저장하기

`-x`는 오디오를 추출하고, `--audio-format`은 변환할 형식을 지정합니다.

```bash
yt-dlp -x --audio-format mp3 --audio-quality 0 "VIDEO_URL"
```

썸네일과 메타데이터도 함께 넣으려면 옵션을 추가합니다.

```bash
yt-dlp -x --audio-format mp3 \
  --embed-thumbnail --embed-metadata \
  "VIDEO_URL"
```

## 자막 다운로드하기

먼저 제공되는 자막 언어를 확인합니다.

```bash
yt-dlp --list-subs "VIDEO_URL"
```

한국어와 영어 자막을 영상과 함께 내려받아 SRT로 변환하는 예시입니다.

```bash
yt-dlp --write-subs --write-auto-subs \
  --sub-langs "ko.*,en.*" --convert-subs srt \
  "VIDEO_URL"
```

- `--write-subs`: 업로더가 제공한 자막 다운로드
- `--write-auto-subs`: 자동 생성 자막도 다운로드
- `--sub-langs`: 내려받을 언어 선택
- `--convert-subs srt`: 자막을 SRT 형식으로 변환

영상 파일 안에 자막을 넣고 싶다면 `--embed-subs`를 사용할 수 있습니다.

```bash
yt-dlp --write-subs --sub-langs "ko.*,en.*" --embed-subs "VIDEO_URL"
```

## 재생목록 다운로드하기

재생목록 URL을 전달하면 포함된 영상을 차례로 다운로드합니다.

```bash
yt-dlp -o "downloads/%(playlist_title)s/%(playlist_index)03d - %(title)s.%(ext)s" \
  "PLAYLIST_URL"
```

재생목록 URL에서 현재 영상 하나만 받고 싶다면 `--no-playlist`를 사용합니다.

```bash
yt-dlp --no-playlist "VIDEO_URL"
```

이미 받은 영상을 건너뛰면서 재생목록을 이어받으려면 다운로드 기록 파일을 지정합니다.

```bash
yt-dlp --download-archive downloaded.txt "PLAYLIST_URL"
```

## 로그인이 필요한 영상 다운로드하기

본인에게 시청 권한이 있는 연령 제한 영상이나 비공개 영상은 브라우저의 로그인 정보를 사용할 수 있습니다.

```bash
yt-dlp --cookies-from-browser chrome "VIDEO_URL"
```

Chrome 대신 `edge`, `firefox`, `safari`, `whale` 등 지원되는 브라우저 이름을 지정할 수 있습니다. 브라우저 쿠키에는 민감한 로그인 정보가 포함되므로 다른 사람에게 전달하거나 저장소에 올리면 안 됩니다. 자세한 사용법은 [공식 FAQ](https://github.com/yt-dlp/yt-dlp/wiki/FAQ#how-do-i-pass-cookies-to-yt-dlp)를 참고하세요.

## 업데이트와 문제 해결

YouTube의 동작 방식이 바뀌면 오래된 yt-dlp에서 오류가 발생할 수 있습니다. 공식 실행 파일로 설치했다면 다음 명령어로 업데이트합니다.

```bash
sudo yt-dlp -U
```

Homebrew로 설치했다면 패키지 관리자를 이용합니다.

```bash
brew upgrade yt-dlp
```

문제가 계속되면 상세 로그를 확인합니다.

```bash
yt-dlp --verbose "VIDEO_URL"
```

자주 확인할 항목은 다음과 같습니다.

- yt-dlp와 FFmpeg가 최신 버전인지 확인합니다.
- URL 전체를 따옴표로 감쌌는지 확인합니다.
- `-F`로 해당 영상에 실제 제공되는 포맷을 다시 확인합니다.
- 로그인이나 연령 확인이 필요하다면 본인 브라우저의 쿠키를 사용합니다.
- 같은 명령을 반복 실행하기 전에 오류 메시지와 [공식 문서](https://github.com/yt-dlp/yt-dlp)를 확인합니다.

## 마무리

간단히 저장할 때는 URL만 전달해도 충분합니다. 원하는 결과가 있다면 `-o`로 파일 이름을 정하고, `-f`로 화질을 선택하거나 `-x`로 오디오만 추출하면 됩니다. 반복해서 사용할 명령은 셸 스크립트나 yt-dlp 설정 파일로 관리하면 더 편리합니다.
