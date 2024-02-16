
# 📖별일 - 평범했던 나의 하루에 찾아온 별일


### 🕰️ 개발 기간

**24.01.03일 - 24.02.17일**
<br>
<br>

### ⭐️ 팀원 소개

|이혜진|이효재|전성수|김동학|조은영|조한빈|
|:---:|:---:|:---:|:---:|:---:|:---:|
|<img src="./asset/profile1.png" width="200px" />|<img src="./asset/profile2.png" width="200px" />|<img src="./asset/profile3.jpg" width="200px" />|<img src="./asset/profile4.jpg" width="200px" />|<img src="./asset/profile5.jpg" width="200px" />|<img src="./asset/profile6.png" width="200px" />|

<br>

## 📌캠페인 개요
우리는 남기고 싶은 기억과 감정을 일기에 담습니다.<br><br>
대부분의 일기는 그렇게 기록되고 그렇게 기억에서 사라집니다.<br><br>
이런 일기를 특별한 계기나 우연으로 읽게 된다면 굉장히 반가운 일입니다.<br><br>
어린 시절 썼던 일기를 우연히 읽어본 경험처럼 말이에요.<br><br>
**별일은 이런 특별한 사건을 주기적으로 만들어주는 일기장입니다.<br><br>**
<br>


## 🎯목표 기능

**1.Three.js를 이용한 3차원 페이지에 구현된 별에 작성하는 일기.**

**2.사용자가 설정한 주기에 따라 과거에 썼던 일기 리마인드 기능.**

**3.랜덤 사용자에게 보내는 TTS 일기**



## 개발환경

![개발환경](./asset/version.png)



<br><br>


## Service Architecture

![Architecture]()


   
## ⌨️Stacks⌨️
[![Git][Git.com]][Git-url]

[![amazonec2][amazonec2.com]][amazonec2-url]
[![NGINX][NGINX.com]][NGINX-url]
[![Docker][Docker.com]][Docker-url]
[![jenkins][jenkins.com]][jenkins-url]
[![sonarqube][sonarqube.com]][sonarqube-url]

[![React][React.com]][React-url]
[![Java][Java.com]][Java-url]
[![SpringBoot][SpringBoot.com]][SpringBoot-url]
[![flask][flask.com]][flask-url]

[![Mysql][Mysql.com]][Mysql-url]
[![amazons3][amazons3.com]][amazons3-url]




[React.com]: https://img.shields.io/badge/react-0099FF?style=for-the-badge&logo=react&logoColor=white
[React-url]: https://ko.legacy.reactjs.org/
[Java.com]: https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=springboot&logoColor=white
[Java-url]: https://www.java.com/ko/
[Mysql.com]: https://img.shields.io/badge/mysql-4479A1?style=for-the-badge&logo=springboot&logoColor=white
[Mysql-url]: https://www.mysql.com/
[git.com]: https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=springboot&logoColor=white
[git-url]: https://git-scm.com/
[SpringBoot.com]: https://img.shields.io/badge/springboot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white
[SpringBoot-url]: https://spring.io/
[docker.com]: https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
[docker-url]: https://www.docker.com/
[NGINX.com]: https://img.shields.io/badge/NGINX-009639?style=for-the-badge&logo=NGINX&logoColor=white
[NGINX-url]: https://www.NGINX.com/
[jenkins.com]: https://img.shields.io/badge/jenkins-D24939?style=for-the-badge&logo=jenkins&logoColor=white
[jenkins-url]: https://www.jenkins.io/
[flask.com]: https://img.shields.io/badge/flask-000000?style=for-the-badge&logo=flask&logoColor=white
[flask-url]:https://flask.palletsprojects.com/en/3.0.x/
[sonarqube.com]: https://img.shields.io/badge/sonarqube-4E9BCD?style=for-the-badge&logo=sonarqube&logoColor=white
[sonarqube-url]:https://www.sonarsource.com/
[amazonec2.com]: https://img.shields.io/badge/amazonec2-E79537?style=for-the-badge&logo=amazonec2&logoColor=white
[amazonec2-url]:https://aws.amazon.com/ko/pm/ec2/
[amazons3.com]: https://img.shields.io/badge/amazons3-569A31?style=for-the-badge&logo=amazons3&logoColor=white
[amazons3-url]:https://aws.amazon.com/ko/pm/serv-s3/


## 📌 주요 기능

#### 메인화면

  
#### 별(게시글) 작성

  
#### 라디오 송신 


#### 라디오 수신


#### 다른 사람의 우주 여행


#### 신고

---
# ❓포팅매뉴얼


# Usage

````
git clone https://lab.ssafy.com/s10-webmobile2-sub2/S10P12B209.git

````

# 1. Version

- React 18.1.0
- Node.js 20.10.0
- Java 17
- Springboot 3.2.1
- MySQL 8.0

---

# 2. EC2 Server

## 1) Docker

```bash
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

## 2) Nginx

```bash
sudo apt install nginx -y
sudo systemctl status nginx

sudo apt-get install letencrypt
sudo apt-get install certbot python3-certbot-nginx -y
sudo certbot --nginx
```

## 3) Jenkins

```bash
sudo docker exec -it jenkins bin/bash
docker

apt-get update
apt-get install ca-certificates curl gnupg lsb-release -y
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian \
$(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
apt-get update
apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin docker-compose
```

## 4) MySQL

```bash
sudo apt-get update
sudo apt-get install mysql-server -y
sudo mysql -u root

CREATE DATABASE stella;
SHOW DATABASES;

CREATE USER 'stella'@'%' IDENTIFIED BY 'stella2401@@';
FLUSH PRIVILEGES;
```

---

# 3. 외부 API

## 1) 카카오

- 카카오 디벨로퍼 로그인(https://developers.kakao.com/)후 내 애플리케이션 이동

![Untitled](./asset/kakaoLogin.png)

- 카카오 애플리케이션 추가

![Untitled](./asset/kakaoApplication.png)

- REST API 키 확인

![Untitled](./asset/RestAPI.png)

- 카카오 로그인 활성화

![Untitled](./asset/kakaoLoginActivate.png)
- Redirect URI 등록(테스트용 주소, 실제 서버 주소)

![Untitled](./asset/RedirectURI.png)

---

# 4. Settings

## 1) application.yml

- 위치: BE > src > main > resources > application.yml
- spring.datasource.url에 server주소 입력
    - 예) i10b209.p.ssafy.io

```yaml
server:
	port: 8080

spring:
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://{{server주소}}/stella?useSSL=false&serverTimezone=Asia/Seoul&cacheDefaultTimezone=false
    username: stella
    password: stella2401@@
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        format_sql: true
    show_sql: false
    defer-datasource-initialization: true
  sql:
    init:
      mode: always
  output:
    ansi.enabled: always
  servlet:
    multipart:
      max-file-size: 10MB
      max-request-size: 10MB
jwt:
  secret: VlwEyVBsYt9V7zq57TejMnVUyzblYcfPQye08f7MGVA9XkHa
social:
  url: https://i10b209.p.ssafy.io
kakao:
  key: b1189e38a050b511cf3ae169bea072fe
google:
  client-id: 351246438629-hkjmrho1kv9ovk5v4nd0be9gmh3tkl0g.apps.googleusercontent.com
  client-secret: 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
naver:
  client-id: rzFdGNivH3Tpba7n0TjD
  client-secret: 87T48qzrIl
email:
  address: orange1th@gmail.com
  password: bnhd anrw dtwk rjtr
cloud:
  aws:
    s3:
      bucket: ssafy-stella-bucket
    stack.auto: false
    region.static: ap-northeast-2
    credentials:
      accessKey: AKIA2S3L5PUNXBEADVVX
      secretKey: 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
```

## 2) .env

- 위치: FE

```json
REACT_APP_API_URL=https://i10b209.p.ssafy.io/api
REACT_APP_TTS_URL=https://i10b209.p.ssafy.io/tts-server
REACT_APP_KAKAO_API_KEY=b1189e38a050b511cf3ae169bea072fe
REACT_APP_KAKAO_REDIRECT_URI=https://i10b209.p.ssafy.io/api/member/login/kakao
REACT_APP_KAKAO_JOIN_URI=https://i10b209.p.ssafy.io/api/member/join/kakao
RECOIL_DUPLICATE_ATOM_KEY_CHECKING_ENABLED=false
REACT_APP_KAKAO_TEMP_URI=https://i10b209.p.ssafy.io
REACT_APP_KAKAO_LOGIN_REDIRECT_URI=https://i10b209.p.ssafy.io/login/kakao
REACT_APP_KAKAO_JOIN_REDIRECT_URI=https://i10b209.p.ssafy.io/regist/kakao
```
