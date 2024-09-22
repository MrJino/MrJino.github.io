## MariaDB + 사용자추가 + 권한설정

### 사용자 계정 존재유무 알아보기

<span style="color: red"><small><b>사용자 계정을 추가 하기 위해서는 사용자 추가권한이 있는 계정(ex. 루트계정)으로 접속이 필요합니다.</b></small></span>

사용자 계정을 추가하기 이전에 현재 DB에 어떤 사용자가 등록되어 있는지 알아보자<br>
우선, mysql 데이터베이스를 선택하고 등록된 사용자 계정을 확인한다. <br>

```shell
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
+--------------------+
2 rows in set (0.02 sec)

mysql> use mysql
Database changed
```

```shell
mysql> select Host, User from user;
+-----------+-------------+
| Host      | User        |
+-----------+-------------+
| %         | root        |
| localhost | root        |
+-----------+-------------+
```

- %: 이 기호는 와일드카드로, 모든 호스트에서 접속할 수 있음을 의미합니다.
- localhost: 로컬 호스트로, 데이터베이스가 설치된 컴퓨터에서만 접속할 수 있음을 의미합니다.

즉, 위의 결과는 모든 호스트에서 접속 가능한 root 계정이 존재함을 나타냅니다.
