# Welcome to TODO-1 👋

![Version](https://img.shields.io/badge/version-0.5.0-blue.svg?cacheSeconds=2592000)

> Simple kanban of woowa tech camp

![main](https://user-images.githubusercontent.com/38618187/87946524-1b21bb00-cadd-11ea-988b-c918709246a2.gif)

[배포 주소 링크](http://54.180.162.143:3000/)

## 폴더 구조

```bash
├── apis    # api 코드들 위치
├── bin     # 서버를 실행할 entry point
├── dao     # 데이터베이스 연동 관련 파일
├── dist    # 배포용 파일
├── node_modules  # 설치한 모듈
├── src     # front-end 파일
└── utils   # 공통으로 사용하는 함수, Class
```

## 설치

**이 프로젝트는 yarn을 기본으로 사용합니다.**

### dotenv

먼저 .env 파일을 생성해주세요

```bash
touch .env
```

.env 파일에는 다음 내용들을 넣어주세요

```txt
DB_HOST=DB서버주소
DB_PORT=DB서버포트
DB_USER=DB유저
DB_PASSWORD=DB비밀번호
DB_NAME=DB이름

DB_TEST_HOST=테스트DB서버주소
DB_TEST_PORT=테스트DB서버포트
DB_TEST_USER=테스트DB유저
DB_TEST_PASSWORD=테스트DB비밀번호
DB_TEST_NAME=테스트DB이름

PORT=서버포트
```

## install

```sh
yarn install
```

## start

```sh
yarn start
```

위 command를 입력하면, webpack으로 build된 파일들이 다음 경로로 이동됩니다.

```bash
dist/
```

위 경로의 파일들을 express router에서 사용합니다.

## test

```sh
yarn test
```

## support

이 프로젝트가 마음에 든다면 ⭐️을 주세요
