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
├── routes  # 라우팅에 관련된 파일
├── src     # front-end 파일
└── utils   # 공통으로 사용하는 함수, Class
```

## 페이지구조

```bash
/       # index (로그인 페이지)
/kanban # 투두 리스트 페이지
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

### install

```sh
yarn install
```

### start

```sh
yarn start
```

위 command를 입력하면, webpack으로 build된 파일들이 다음 경로로 이동됩니다.

```bash
dist/
```

위 경로의 파일들을 express router에서 사용합니다.

### test

```sh
yarn test
```

### apidoc 만들기

다음 명령을 실행해주세요

```bash
apidoc -i apis/ -o dist/apidoc/
```

/apidoc 으로 들어오시면 api 문서를 확인하실 수 있습니다.

## 특징

### 직접 구현한 vanilla component 구조

vanilla js를 이용해서 component를 직접 구현했습니다.

```javascript
export default class Element {
  render() {
    if (this.runWhenRender) {
      this.runWhenRender();
    }
    if (this.setEventListeners) {
      this.setEventListeners();
    }

    return this.element;
  }
}
```

```javascript
import Element from './Element.js';

export default class MyComponent extends Element {
  constructor() {
    super();

    this.element = undefined;
    this.setElement();
  }

  setElement() {
    this.element = something;
  }

  setEventListeners() {
    this.someElement.addEventListener('event', (e) => {});
  }
}
```

모든 컴포넌트는 Element class를 상속해 사용하며 다음과 같은 구조로 되어있습니다.

### 전역 store 사용

```sh
          +----------------+
          |        A       |
          +--------+-------+
                   |
         +---------+-----------+
         |                     |
+--------+-------+    +--------+-------+
|        B       |    |        C       |
+----------------+    +--------+-------+
         |                     |
+----------------+    +--------+-------+
|        D       |    |        E       |
+----------------+    +----------------+
```

컴포넌트의 구조는 상하 구조를 가지고 있습니다.

만약 E 컴포넌트에서 A 컴포넌트의 data를 사용하고 싶을 때는 C 컴포넌트는 이를 전달해야 합니다.

이를 프로퍼티 내리꽂기 라고 합니다.

[프로퍼티 내리꽂기](https://edykim.com/ko/post/prop-drilling/)

이 구조로 데이터나 handler를 전달할 때 다음과 같은 문제들이 발생했습니다.

- 복잡한 데이터의 전달 관리
- 불필요한 데이터를 전달

따라서 저희는 전역으로 필요한 요소들을 관리하는 store 객체를 만들어 사용했습니다.

```javascript
// Store.js
class Store {
  constructor() {
    this.key = data;
  }
}

module.exports = new Store();
```

사용할 데이터가 필요한 곳에서 store를 호출해서 데이터를 사용합니다.

```javascript
import Store from '../Store/Store.js';

export default class Kanban extends Element {
  // ...
}
```

### 이벤트 위임으로 이동을 처리

[이벤트 위임을 이용해 블록 옮기기 구현하기](https://github.com/woowa-techcamp-2020/todo-1/wiki/%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EC%9C%84%EC%9E%84%EC%9D%84-%EC%9D%B4%EC%9A%A9%ED%95%B4-%EB%B8%94%EB%A1%9D-%EC%98%AE%EA%B8%B0%EA%B8%B0-%EA%B5%AC%ED%98%84%ED%95%98%EA%B8%B0)

Wiki에 해당 내용을 정리해놨어요

## support

이 프로젝트가 마음에 든다면 ⭐️을 주세요
