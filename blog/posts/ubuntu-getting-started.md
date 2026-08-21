## Ubuntu란?

Ubuntu는 Linux를 기반으로 만든 오픈소스 운영체제입니다. 무료로 사용할 수 있으며, 데스크톱 환경뿐 아니라 서버와 클라우드 환경에서도 널리 사용됩니다.

## 설치 후 가장 먼저 할 일

패키지 목록과 설치된 패키지를 최신 상태로 업데이트합니다.

```bash
sudo apt update
sudo apt upgrade
```

- `apt update`: 설치할 수 있는 패키지 목록을 갱신합니다.
- `apt upgrade`: 현재 설치된 패키지를 최신 버전으로 업그레이드합니다.

## 자주 사용하는 기본 명령어

Ubuntu의 터미널에서는 다음 명령어를 자주 사용합니다.

```bash
pwd                 # 현재 경로 확인
ls                  # 파일과 디렉터리 목록 확인
cd /path/to/folder  # 디렉터리 이동
mkdir example       # 새 디렉터리 생성
cp source target    # 파일 복사
mv source target    # 파일 이동 또는 이름 변경
rm file.txt         # 파일 삭제
```

`rm`으로 삭제한 파일은 휴지통으로 이동하지 않으므로 사용하기 전에 대상 파일을 꼭 확인해야 합니다.

## 패키지 설치와 삭제

Ubuntu에서는 `apt` 명령어로 프로그램을 관리할 수 있습니다. 다음은 Git을 설치하고 삭제하는 예시입니다.

```bash
sudo apt install git
sudo apt remove git
```

설치 여부와 버전은 다음과 같이 확인합니다.

```bash
git --version
```

## 시스템 정보 확인하기

운영체제와 저장 공간, 메모리 정보를 확인할 때는 다음 명령어를 사용할 수 있습니다.

```bash
lsb_release -a  # Ubuntu 버전 확인
df -h           # 디스크 사용량 확인
free -h         # 메모리 사용량 확인
```

## 디바이스 연결

### 연결된 장치 확인

다음 명령어로 시스템에 연결된 디스크 장치를 확인합니다.

```bash
sudo fdisk -l | grep dev
```

### 마운트하려는 장치 연결

마운트할 디렉터리가 없다면 먼저 생성한 후 장치를 연결합니다.

```bash
sudo mkdir -p /disk/station1
sudo mount /dev/sdb1 /disk/station1
```

여기서 `/dev/sdb1`은 연결할 파티션이며, `/disk/station1`은 해당 장치를 사용할 마운트 경로입니다. 실제 장치 이름은 시스템 환경에 맞게 변경해야 합니다.

## 자동 마운트

재부팅 후에도 장치가 자동으로 연결되게 하려면 디바이스의 UUID를 `/etc/fstab`에 등록합니다.

### 디바이스 UUID 확인하기

```bash
ls -l /dev/disk/by-uuid
```

### 자동 마운트 등록하기

설정을 변경하기 전에 `/etc/fstab`을 백업한 다음 파일을 엽니다.

```bash
sudo cp /etc/fstab /etc/fstab.backup
sudo vi /etc/fstab
```

파일 하단에 장치의 UUID, 마운트 경로, 파일 시스템 형식을 입력합니다.

```fstab
UUID=bef2e575-4153-40d3-8916-1f4a66503594 /disk/station1 ext4 defaults 0 0
UUID=103469b5-bfa0-4673-b749-a93f5a3b1dce /disk/station2 ext4 defaults 0 0
```

> UUID는 예시 값입니다. 반드시 자신의 장치에서 확인한 UUID를 사용해야 합니다. 잘못된 `/etc/fstab` 설정은 부팅 문제를 일으킬 수 있습니다.

저장 후 다음 명령어로 설정에 오류가 없는지 확인합니다.

```bash
sudo mount -a
```

오류 메시지가 없다면 자동 마운트 설정이 정상적으로 적용된 것입니다.

## 마무리

Ubuntu를 처음 사용할 때는 패키지 업데이트 방법과 파일을 다루는 기본 명령어부터 익히는 것이 좋습니다. 명령어의 옵션이 궁금하다면 `man` 명령어로 도움말을 확인할 수 있습니다.

```bash
man apt
```
