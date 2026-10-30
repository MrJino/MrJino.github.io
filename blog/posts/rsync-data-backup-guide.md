`rsync`는 원본과 대상의 차이를 비교해 필요한 파일만 복사하는 도구입니다. 로컬 디스크 사이의 복사부터 SSH 서버 백업까지 한 명령으로 다룰 수 있고, 같은 작업을 반복할수록 변경분만 전송하므로 정기 백업에 잘 맞습니다.

다만 `rsync`는 기본적으로 **파일 동기화 도구**입니다. 잘못 쓴 `--delete`는 대상 파일을 지울 수 있고, 단순 미러는 덮어쓴 과거 버전을 보관하지 않습니다. 안전한 백업은 명령어뿐 아니라 여러 세대의 사본, 복구 연습, 별도 저장소가 함께 있어야 합니다.

## 시작 전에 버전부터 확인하기

```bash
rsync --version
```

macOS와 Linux 배포판은 기본 제공 버전과 지원 옵션이 서로 다를 수 있습니다. 특히 오래된 rsync에는 `--info=progress2` 같은 비교적 새 옵션이 없을 수 있으므로 인터넷 예제를 그대로 붙여 넣기 전에 로컬의 `rsync --version`과 `man rsync`를 확인하세요. SSH 전송은 로컬과 원격 양쪽에 rsync가 설치되어 있어야 하며, 양쪽이 지원하는 기능 범위 안에서 동작합니다.

자동화 스크립트에서는 패키지 관리자로 새 버전을 설치한 뒤 어떤 실행 파일을 쓸지 명시하는 편이 안전합니다. 개발 PC와 서버에서 각각 아래처럼 경로와 버전을 기록해 두면 환경 차이를 찾기 쉽습니다.

```bash
command -v rsync
rsync --version
ssh backup@example.com 'command -v rsync && rsync --version'
```

## 기본 문법과 trailing slash의 차이

기본 형태는 `rsync [옵션] 원본 대상`입니다. 디렉터리 원본 끝의 슬래시(`/`)는 결과를 바꾸므로 가장 먼저 익혀야 합니다.

```bash
# photos 디렉터리 자체를 backup 안에 만든다.
rsync -avh ~/photos /Volumes/Backup/
# 결과: /Volumes/Backup/photos/...

# photos 안의 내용만 backup으로 복사한다.
rsync -avh ~/photos/ /Volumes/Backup/photos/
# 결과: /Volumes/Backup/photos/...
```

첫 명령은 `photos`라는 디렉터리까지 대상 아래에 복사합니다. 두 번째 명령의 `~/photos/`는 “이 디렉터리의 내용”을 뜻합니다. 대상 끝의 슬래시는 보통 의미를 바꾸지 않지만, 사람이 경로를 읽기 쉽게 일관되게 적는 것이 좋습니다.

공백이 있는 경로는 따옴표로 묶습니다.

```bash
rsync -avh "$HOME/Project Files/" "/Volumes/Backup/Project Files/"
```

## 자주 쓰는 옵션 이해하기

```bash
rsync -avh --info=progress2 원본/ 대상/
```

- `-a`, `--archive`: 재귀 복사와 심볼릭 링크, 권한, 수정 시각, 소유자, 그룹, 장치 파일 보존을 묶은 보관 모드입니다. 공식 정의는 `-rlptgoD`이며 ACL(`-A`), 확장 속성(`-X`), 하드 링크(`-H`)는 포함하지 않습니다.
- `-v`, `--verbose`: 처리 중인 항목을 자세히 표시합니다.
- `-h`, `--human-readable`: 파일 크기와 통계를 읽기 쉬운 단위로 표시합니다. 데이터 보존 방식에는 영향을 주지 않습니다.
- `--progress`: 전송 중인 **각 파일**의 진행 상황을 표시합니다.
- `--info=progress2`: 전체 전송 기준 진행 상황을 표시합니다. 현재 버전이 지원하지 않으면 `--progress`를 사용합니다.
- `-n`, `--dry-run`: 실제로 변경하지 않고 수행 예정 작업을 미리 보여 줍니다. 삭제나 자동화 전에 반드시 사용하세요.
- `--itemize-changes`: 어떤 속성 때문에 파일이 변경 대상으로 판단됐는지 요약 기호로 보여 줍니다.

`-a`만으로 모든 메타데이터가 보존되는 것은 아닙니다. macOS의 Finder 태그·리소스 포크나 Linux의 ACL·확장 속성이 중요하면 양쪽 파일 시스템과 rsync가 이를 지원하는지 확인한 뒤 `-A`, `-X`, 필요 시 `-H`를 별도로 검토하세요. 운영체제나 파일 시스템이 다르면 소유권·권한·확장 속성을 같은 방식으로 표현하지 못할 수도 있습니다.

## 로컬 디스크로 안전하게 백업하기

먼저 대상 디스크가 실제로 마운트됐는지 확인합니다. 외장 디스크가 빠진 상태에서 마운트 지점과 같은 이름의 로컬 디렉터리에 복사하는 실수를 막기 위해서입니다.

```bash
# 1. 미리보기
rsync -avhn --itemize-changes \
  --exclude='.DS_Store' \
  --exclude='node_modules/' \
  "$HOME/Documents/" "/Volumes/Backup/Documents/"

# 2. 출력과 대상 경로를 확인한 뒤 실제 실행
rsync -avh --info=progress2 \
  --exclude='.DS_Store' \
  --exclude='node_modules/' \
  "$HOME/Documents/" "/Volumes/Backup/Documents/"
```

오래된 버전에서 `--info=progress2`가 인식되지 않으면 `--progress`로 바꿉니다. 명령이 성공했다는 메시지만 믿지 말고 종료 코드도 확인하세요.

```bash
echo $?
```

종료 코드 `0`은 성공입니다. 다른 값이면 로그와 `man rsync`의 종료 코드 설명을 확인하고, 원인을 해결하기 전에는 백업 완료로 간주하지 않습니다.

## SSH 원격 백업하기

원격 셸 방식은 `사용자@호스트:경로` 형식을 사용하며 일반적으로 SSH로 통신합니다.

```bash
# 로컬에서 원격 서버로 보내기(push)
rsync -avh --progress \
  "$HOME/Documents/" \
  backup@example.com:/srv/backup/documents/

# 원격 서버에서 로컬로 가져오기(pull)
rsync -avh --progress \
  backup@example.com:/srv/backup/documents/ \
  "$HOME/Restore/documents/"
```

SSH 포트나 키를 지정해야 한다면 `-e`에 SSH 명령을 전달합니다.

```bash
rsync -avh -e "ssh -p 2222 -i $HOME/.ssh/backup_ed25519" \
  "$HOME/Documents/" \
  backup@example.com:/srv/backup/documents/
```

비밀번호를 명령줄이나 스크립트에 직접 적지 말고, 백업 전용 SSH 키와 최소 권한 계정을 사용하세요. 원격 두 곳 사이를 한 번에 복사하는 방식은 rsync가 지원하지 않으므로 로컬 쪽이 송신 또는 수신의 한쪽이 되어야 합니다.

## 제외 패턴 관리하기

간단한 패턴은 `--exclude`를 여러 번 지정할 수 있습니다. 패턴 끝의 `/`는 디렉터리만 가리킵니다.

```bash
rsync -avhn \
  --exclude='.git/' \
  --exclude='node_modules/' \
  --exclude='*.tmp' \
  프로젝트/ 백업/프로젝트/
```

규칙이 많다면 파일로 분리합니다.

```text
# backup-excludes.txt
.git/
node_modules/
*.tmp
cache/
```

```bash
rsync -avhn --exclude-from="$HOME/backup-excludes.txt" \
  프로젝트/ 백업/프로젝트/
```

패턴은 전송 목록의 경로와 대조되며 셸의 glob과 완전히 같지 않습니다. 중요한 파일이 빠지지 않는지 `--dry-run --itemize-changes` 출력으로 먼저 확인하세요. 기본적으로 제외된 파일은 대상에서도 삭제 대상에서 보호되지만, 삭제 관련 옵션을 추가 조합할 때는 공식 설명을 다시 확인해야 합니다.

## `--delete`는 미러링이 필요할 때만

`--delete`는 원본에 없는 파일을 **대상에서도 삭제**해 두 디렉터리를 거울처럼 맞춥니다. 삭제된 파일을 보존하는 백업과는 목적이 다릅니다. 원본·대상 방향이나 trailing slash를 잘못 적으면 큰 손실로 이어질 수 있습니다.

```bash
# 반드시 삭제 예정 목록부터 확인
rsync -avhn --delete --itemize-changes 원본/ 대상/

# 결과를 검토하고 별도 백업이 있을 때만 실행
rsync -avh --delete --itemize-changes 원본/ 대상/
```

공식 매뉴얼도 `--delete` 사용 전 `--dry-run` 테스트를 권합니다. 전송 오류가 발생하면 기본적으로 I/O 오류로 인한 대량 삭제를 피하도록 삭제가 비활성화될 수 있으며, 이를 무시하는 옵션을 습관적으로 추가해서는 안 됩니다. 처음 적용할 때는 작은 테스트 디렉터리에서 원본 파일 하나를 지워 실제 동작을 확인하세요.

## 과거 버전을 남기는 증분 백업

같은 대상에 반복 동기화하면 최신 상태만 남습니다. 날짜별 디렉터리를 만들고 직전 백업을 `--link-dest`로 지정하면 변경되지 않은 파일은 하드 링크로 공유하고, 변경된 파일만 새 공간을 사용하도록 구성할 수 있습니다.

```bash
previous="/srv/backups/2026-10-18"
current="/srv/backups/2026-10-19"

mkdir -p "$current"
rsync -avh --link-dest="$previous" \
  "$HOME/Documents/" "$current/"
```

`--link-dest`의 기준 디렉터리는 대상 디렉터리를 기준으로 해석될 수 있으므로 자동화에서는 위처럼 절대 경로가 명확합니다. 소유권·권한 등 보존 속성까지 정확히 일치해야 하드 링크가 만들어지며, 대상 파일 시스템이 하드 링크를 지원해야 합니다.

이 방식도 완전한 백업 제품은 아닙니다. 백업 도중 중단됐을 때의 처리, 보존 기간, 오래된 세대 삭제, 잠금, 로그, 암호화와 오프사이트 복제는 별도로 설계해야 합니다. 백업 디렉터리 안의 파일을 직접 수정하면 하드 링크로 연결된 다른 세대에도 영향을 줄 수 있으므로 읽기 전용처럼 다루세요.

## 복구와 검증까지 해야 백업이다

가장 확실한 검증은 별도 임시 위치에 실제로 복구해 파일을 여는 것입니다.

```bash
mkdir -p "$HOME/RestoreTest"
rsync -avh "/Volumes/Backup/Documents/" "$HOME/RestoreTest/"
```

복구 후 대표 문서·사진·압축 파일을 직접 열고, 파일 수와 용량도 비교합니다. 내용 기준 비교가 필요하면 `-c`, `--checksum`을 쓸 수 있습니다.

```bash
# 복구본이 원본과 내용상 다른지 읽기 전용으로 검사
rsync -avhnc --delete --itemize-changes \
  "$HOME/Documents/" "$HOME/RestoreTest/"
```

`-c`는 파일 크기와 수정 시각 대신 양쪽 파일 내용을 읽어 체크섬으로 변경 여부를 판단하므로 느리고 디스크 I/O가 큽니다. 매 실행마다 무조건 넣기보다 정기 검증이나 중요한 복구 점검에 사용하세요. 이 옵션은 전송 중 데이터 무결성 확인과는 별개로, **전송이 필요한 파일을 고르는 기준**을 바꾸는 옵션입니다.

검증 체크리스트는 다음과 같습니다.

- rsync 종료 코드와 로그에 오류가 없는가?
- 예상한 파일 수와 전체 용량이 맞는가?
- 제외 규칙 때문에 중요한 파일이 빠지지 않았는가?
- 임의로 고른 파일뿐 아니라 가장 중요한 파일을 실제로 열 수 있는가?
- 원본 시스템 없이도 계정·권한·암호화 키를 포함해 복구할 수 있는가?
- 백업 저장소 하나가 고장 나거나 랜섬웨어에 노출돼도 다른 사본이 남는가?

## 실전 운영 순서

1. 원본과 대상의 절대 경로를 적고 trailing slash 의도를 확인합니다.
2. 양쪽의 `rsync --version`과 지원 옵션을 확인합니다.
3. `--dry-run --itemize-changes`로 복사·삭제 예정 목록을 검토합니다.
4. 첫 실행은 `--delete` 없이 수행하고 로그와 종료 코드를 확인합니다.
5. 미러가 꼭 필요하고 별도 복구 사본이 있을 때만 `--delete`를 적용합니다.
6. 날짜별 세대나 다른 백업 도구를 이용해 과거 버전을 보존합니다.
7. 주기적으로 격리된 위치에 복구하고 중요한 파일을 직접 검증합니다.

rsync의 핵심은 짧은 옵션 조합보다 **경로 방향과 삭제 범위를 먼저 확인하는 습관**입니다. `--dry-run`으로 예고편을 보고, 여러 세대와 별도 저장소를 유지하며, 실제 복구까지 반복하면 rsync를 신뢰할 수 있는 백업 흐름의 한 구성 요소로 사용할 수 있습니다.

## 참고 자료

- [rsync 공식 매뉴얼](https://download.samba.org/pub/rsync/rsync.1.html)
- [rsync 공식 사이트](https://rsync.samba.org/)
