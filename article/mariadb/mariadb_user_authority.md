## MariaDB + 사용자추가 + 권한설정

### 1. 사용자 계정 존재유무 알아보기

<span style="color: red"><small><b>사용자 계정을 추가 하기 위해서는 사용자 추가권한이 있는 계정(ex. 루트계정)으로 접속이 필요합니다.</b></small></span>

사용자 계정을 추가하기 이전에 현재 DB에 어떤 사용자가 등록되어 있는지 알아보자<br>
우선, <span style="color: red">mysql</span> DB를 선택하고 등록된 사용자 계정을 확인한다. <br>

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

### 2. 사용자 계정 추가

추가하려는 계정이 없다면 계정을 추가해 보자

```shell
# 자신의 컴퓨터에서만 접근이 가능한 계정을 만들려고 한다면...
mysql> create user '사용자계정'@localhost identified by '비밀번호';

# 원격으로 접속한 컴퓨터에서도 접근을 원한다면...
mysql> create user '사용자계정'@'%' identified by '비밀번호';
```

### 3. 접근권한 설정

방금 생성한 계정에 접근 권한을 설정해 줍니다.

```shell
# 접근권한설정
mysql> grant all privileges on 데이터베이스.* to '사용자계정'@'%';
Query OK, 0 rows affected (0.00 sec)

mysql> flush privileges;
Query OK, 0 rows affected (0.00 sec)

# 접근권한 확인
mysql> show grants for '사용자계정'@'%';
+---------------------------------------------------------------------------+
| Grants for 사용자계정@%
+---------------------------------------------------------------------------+
| GRANT USAGE ON *.* TO `사용자계정`@`%` IDENTIFIED BY PASSWORD '******'
| GRANT ALL PRIVILEGES ON `데이터베이스`.* TO `사용자계정`@`%`
+---------------------------------------------------------------------------+
```

드디어, 데이터베이스를 생성하여 접근권한까지 얻었습니다. 이제, DB를 사용할 준비가 끝났습니다.

<img src="images/흡족.jpeg">
