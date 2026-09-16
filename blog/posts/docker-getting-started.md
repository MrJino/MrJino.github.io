Docker는 애플리케이션과 실행에 필요한 라이브러리, 설정을 하나의 표준화된 환경으로 묶어 실행할 수 있게 해주는 컨테이너 플랫폼입니다. 개발 환경과 운영 환경의 차이를 줄이고, 같은 애플리케이션을 여러 컴퓨터에서 일관되게 실행할 때 유용합니다.

이 글에서는 Docker의 핵심 개념과 함께 이미지 빌드부터 컨테이너 실행, 로그 확인, 사용하지 않는 리소스 정리까지 자주 사용하는 명령어를 정리합니다.

## Docker의 핵심 개념

Docker를 처음 사용할 때는 `Dockerfile`, 이미지, 컨테이너의 관계부터 이해하면 좋습니다.

- **Dockerfile**: 이미지를 만드는 방법을 순서대로 작성한 텍스트 파일입니다.
- **이미지(Image)**: 애플리케이션과 실행 환경을 담은 읽기 전용 템플릿입니다.
- **컨테이너(Container)**: 이미지를 기반으로 실제 실행되는 격리된 프로세스입니다.
- **레지스트리(Registry)**: Docker Hub처럼 이미지를 저장하고 공유하는 공간입니다.
- **네트워크(Network)**: 컨테이너끼리 또는 컨테이너와 외부 시스템이 통신하는 통로입니다.

하나의 이미지로 여러 컨테이너를 만들 수 있습니다. 소스 코드나 실행 환경을 변경했다면 이미지를 다시 빌드한 뒤 새 컨테이너를 실행하는 방식이 일반적입니다.

## 설치 확인

Docker Desktop 또는 Docker Engine을 설치한 뒤 터미널에서 버전을 확인합니다.

```bash
docker --version
```

Docker 엔진의 상세 정보와 실행 상태를 확인하려면 다음 명령어를 사용합니다.

```bash
docker info
```

`docker info`가 서버 연결 오류를 출력한다면 Docker Desktop이나 Docker Engine이 실행 중인지 먼저 확인합니다.

## 이미지 만들기

프로젝트 디렉터리에 `Dockerfile`이 준비되어 있다면 다음 명령어로 이미지를 빌드합니다.

```bash
docker build -f Dockerfile -t fun-docker .
```

- `-f Dockerfile`: 빌드에 사용할 Dockerfile의 경로를 지정합니다.
- `-t fun-docker`: 생성할 이미지의 이름과 선택적인 태그를 지정합니다.
- `.`: 현재 디렉터리를 빌드 컨텍스트로 사용합니다.

태그를 생략하면 기본적으로 `latest`가 사용되므로 생성된 이미지는 `fun-docker:latest`로 참조할 수 있습니다. Dockerfile의 이름이 기본값인 `Dockerfile`이라면 `-f Dockerfile`은 생략해도 됩니다.

자세한 옵션은 [Docker 이미지 빌드 공식 문서](https://docs.docker.com/reference/cli/docker/image/build/)에서 확인할 수 있습니다.

## 이미지 목록 확인

로컬에 저장된 이미지 목록을 확인합니다.

```bash
docker image ls
```

목록에는 저장소 이름, 태그, 이미지 ID, 생성 시각, 크기가 표시됩니다. `docker images`도 같은 용도로 사용할 수 있습니다.

## 네트워크 목록 확인

Docker가 관리하는 네트워크 목록을 확인합니다.

```bash
docker network ls
```

기본 설치에서는 일반적으로 `bridge`, `host`, `none` 네트워크가 표시됩니다. 별도의 네트워크를 만들면 컨테이너 이름을 이용해 컨테이너 사이에서 통신하기가 편리합니다.

```bash
docker network create fun-network
```

컨테이너를 해당 네트워크에 연결해 실행할 때는 `--network fun-network` 옵션을 추가할 수 있습니다.

## 컨테이너 실행

앞에서 만든 이미지를 컨테이너로 실행합니다.

```bash
docker run -d -p 8080:8080 --name fun-docker fun-docker:latest
```

- `-d`: 컨테이너를 백그라운드에서 실행합니다.
- `-p 8080:8080`: 호스트의 8080 포트를 컨테이너의 8080 포트에 연결합니다.
- `--name fun-docker`: 컨테이너 이름을 `fun-docker`로 지정합니다.
- `fun-docker:latest`: 실행할 이미지와 태그입니다.

포트 형식은 `호스트 포트:컨테이너 포트`입니다. 위 명령어를 실행하면 호스트의 `http://localhost:8080`으로 들어온 요청이 컨테이너의 8080 포트로 전달됩니다.

IP 주소를 지정하지 않은 포트는 기본적으로 호스트의 모든 네트워크 인터페이스에 공개될 수 있습니다. 로컬에서만 접근해야 한다면 다음처럼 루프백 주소를 지정합니다.

```bash
docker run -d -p 127.0.0.1:8080:8080 --name fun-docker fun-docker:latest
```

컨테이너 실행 옵션은 [Docker 컨테이너 실행 공식 문서](https://docs.docker.com/reference/cli/docker/container/run/)에서 자세히 확인할 수 있습니다.

## 컨테이너 목록과 상태 확인

현재 실행 중인 컨테이너만 확인하려면 다음 명령어를 사용합니다.

```bash
docker ps
```

실행 중인 컨테이너와 종료된 컨테이너를 모두 보고, ID와 명령어도 생략하지 않고 출력하려면 다음과 같이 실행합니다.

```bash
docker ps --all --no-trunc
```

- `--all`: 종료된 컨테이너를 포함한 전체 목록을 표시합니다.
- `--no-trunc`: 컨테이너 ID와 실행 명령어를 줄이지 않고 표시합니다.

특정 컨테이너의 상태 값만 확인하려면 `docker inspect`를 사용할 수 있습니다.

```bash
docker inspect --format '{{.State.Status}}' fun-docker
```

정상 실행 중이면 `running`, 종료되었다면 `exited`가 출력됩니다.

## 컨테이너 로그 확인

컨테이너에서 출력된 로그는 `docker logs`로 확인합니다. 컨테이너 ID뿐 아니라 컨테이너 이름도 사용할 수 있습니다.

```bash
docker logs fun-docker
```

새 로그를 계속 확인하려면 `-f` 옵션을 추가합니다.

```bash
docker logs -f fun-docker
```

`docker logs`는 애플리케이션의 표준 출력과 표준 오류 로그를 보여주는 명령어입니다. 컨테이너가 실행 중인지 확인하려면 `docker ps` 또는 앞에서 살펴본 `docker inspect`를 사용해야 합니다.

## 컨테이너 중지와 다시 실행

실행 중인 컨테이너를 중지합니다.

```bash
docker stop fun-docker
```

중지된 컨테이너를 다시 실행할 때는 다음 명령어를 사용합니다.

```bash
docker start fun-docker
```

모든 실행 중인 컨테이너를 한 번에 중지하려면 다음 명령어를 사용할 수 있습니다.

```bash
docker stop $(docker ps -q)
```

`docker ps -q`가 실행 중인 모든 컨테이너 ID를 출력하고, `docker stop`이 그 ID를 전달받아 중지합니다. 공유 개발 서버나 운영 서버에서는 다른 서비스까지 함께 중지할 수 있으므로 실행 전에 반드시 대상을 확인해야 합니다.

## 컨테이너 제거

중지된 컨테이너는 이름이나 ID로 제거할 수 있습니다.

```bash
docker rm fun-docker
```

실행 중인 컨테이너는 기본적으로 제거할 수 없습니다. 먼저 `docker stop`으로 중지하거나, 정말 필요한 경우에만 `docker rm -f fun-docker`로 강제 제거합니다.

모든 중지된 컨테이너를 한 번에 정리하려면 다음 명령어를 사용합니다.

```bash
docker container prune
```

실행하면 삭제 대상을 확인하는 질문이 표시됩니다. 삭제된 컨테이너의 쓰기 계층에만 있던 데이터는 복구하기 어려우므로 중요한 데이터는 볼륨이나 외부 저장소에 보관해야 합니다.

## 사용하지 않는 Docker 리소스 정리

사용하지 않는 컨테이너, 네트워크, 이미지와 빌드 캐시를 정리할 때는 다음 명령어를 사용할 수 있습니다.

```bash
docker system prune
```

기본 명령은 실행 중인 컨테이너에는 영향을 주지 않지만, 중지된 컨테이너와 사용하지 않는 네트워크, dangling 이미지, 빌드 캐시를 삭제합니다. 사용하지 않는 이미지까지 모두 제거하려면 `-a` 옵션을 추가하며, 볼륨까지 정리하려면 `--volumes`를 별도로 지정해야 합니다.

```bash
docker system prune -a
docker system prune -a --volumes
```

`prune` 명령은 여러 리소스를 한꺼번에 지우므로 삭제 목록을 확인하고 사용해야 합니다. 자세한 범위는 [Docker 시스템 정리 공식 문서](https://docs.docker.com/reference/cli/docker/system/prune/)에서 확인할 수 있습니다.

## 모든 Docker 이미지 제거

로컬에 있는 모든 이미지 ID를 조회해 강제로 제거하려면 다음 명령어를 사용할 수 있습니다.

```bash
docker rmi -f $(docker images -q)
```

- `docker images -q`: 로컬 이미지의 ID만 출력합니다.
- `docker rmi -f`: 전달받은 이미지를 강제로 제거합니다.

이 명령은 프로젝트와 관계없는 이미지까지 모두 대상으로 삼습니다. 실행 중인 컨테이너가 사용하는 이미지의 데이터는 즉시 완전히 제거되지 않을 수 있으므로, 전체 초기화가 목적이라면 먼저 필요한 컨테이너와 데이터를 확인하고 컨테이너를 중지·제거해야 합니다. 개별 이미지만 지울 때는 이미지 이름과 태그를 직접 지정하는 편이 안전합니다.

```bash
docker rmi fun-docker:latest
```

이미지 삭제 규칙은 [Docker 이미지 제거 공식 문서](https://docs.docker.com/reference/cli/docker/image/rm/)를 참고하세요.

## 자주 사용하는 흐름 정리

개발 중에는 다음 순서로 Docker 명령어를 사용하는 경우가 많습니다.

```bash
# 1. 이미지 빌드
docker build -f Dockerfile -t fun-docker .

# 2. 이미지 확인
docker image ls

# 3. 컨테이너 실행
docker run -d -p 8080:8080 --name fun-docker fun-docker:latest

# 4. 실행 상태와 로그 확인
docker ps --all --no-trunc
docker logs -f fun-docker

# 5. 컨테이너 중지 및 제거
docker stop fun-docker
docker rm fun-docker
```

같은 이름으로 컨테이너를 다시 실행하려면 기존 `fun-docker` 컨테이너를 먼저 제거해야 합니다. 소스 코드를 변경한 뒤에는 이미지를 다시 빌드하고 새 컨테이너를 실행하면 됩니다.

## 마무리

Docker의 기본 흐름은 Dockerfile로 이미지를 만들고, 그 이미지로 컨테이너를 실행한 다음, 상태와 로그를 확인하고 필요 없는 리소스를 정리하는 과정입니다. 처음에는 `docker build`, `docker run`, `docker ps`, `docker logs`, `docker stop`, `docker rm` 명령어부터 익히고, 정리 명령은 삭제 범위를 충분히 이해한 뒤 사용하는 것이 좋습니다.
