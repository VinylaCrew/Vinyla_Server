<div align="center" style="display:flex;"><img src="https://user-images.githubusercontent.com/41534832/173377044-d3666fa1-b929-4bfc-8db5-54481b1f3356.png" width="20%"><img src="https://user-images.githubusercontent.com/41534832/173381257-8c921a09-6ddf-493b-a92a-bb05d93fa50c.png" width="20%"></div>


<div align="center">
🎵 Vinyla: Work, Life, Vinyl 🎵
</div>

<br><br>

```
🧿 LP라고도 불리는 Vinyl은 현재 레트로 감성을 나타내는 대표적인 아이템입니다.

🧿 인테리어 소품이나 아이돌 굿즈 등으로도 쓰이고, 수집가들의 SNS에서도 활발히 볼 수 있어요.

🧿 Vinyl에 대한 관심과 수요를 기반으로 출시하는 Vinyl digger들을 위한 앱, Vinyla :)

🧿 Vinyl 수집가를 위한 모바일 Vinyl 보관함 서비스입니다.
```

<br>

- - -


### 🎧 Main Function
- **홈 정보 조회**
  - 나의 대표 바이닐과 최근 저장한 4개의 바이닐을 확인할 수 있습니다.
  - 닉네임과 레벨을 확인할 수 있습니다.
  - 현재까지 수집한 바이닐 개수와 가장 많이 수집한 바이닐의 장르를 확인할 수 있습니다.
- **바이닐 검색**
  - Discogs Open API를 이용해 제목 또는 아티스트명으로 바이닐 검색을 할 수 있습니다.
  - 바이닐 상세 조회를 통해 이미지, 아티스트명, 제목, 수록곡, 장르 등을 확인할 수 있습니다.
  - 서비스 내 다른 유저들의 추천 지수를 확인할 수 있습니다.
- **보관함에 저장**
  - 오프라인에서 수집한 바이닐을 검색 후 보관함에 저장합니다.
  - 바이닐에 대한 추천 지수(별점)와 한줄평을 작성 후 보관함에 저장합니다.
- **내 보관함**
  - 보관한 내 바이닐들을 확인할 수 있습니다.
  - 대표 바이닐을 수정할 수 있습니다.
- **바이닐 요청**
  - 검색했지만 나오지 않는 바이닐을 요청할 수 있습니다.
  - 운영자가 확인할 수 있는 참고용 이미지와 제목, 아티스트명, 메모 등을 포함해 요청을 등록합니다.
  - (개발중) 운영자용 웹 페이지를 통해 들어온 요청을 처리하고, DB에 등록되면 해당 바이닐을 요청한 사용자에게 알림을 보내줍니다.
- **회원가입/로그인**
  - Apple, Google, Facebook을 통해 소셜 로그인을 할 수 있습니다.
  - 회원가입 시 고유한 닉네임을 설정하고 마케팅 수신 동의 여부를 선택합니다.


### 🎧 Dependencies
```json
"dependencies": {
    "cookie-parser": "~1.4.4",
    "crypto": "^1.0.1",
    "debug": "~2.6.9",
    "disconnect": "^1.2.2",
    "express": "~4.16.1",
    "http-errors": "~1.6.3",
    "jade": "~1.11.0",
    "jsonwebtoken": "^8.5.1",
    "morgan": "~1.9.1",
    "multer": "^1.4.4",
    "nodemon": "^2.0.7",
    "pbkdf2": "^3.1.2",
    "promise-mysql": "^5.0.3",
    "rand-token": "^1.0.1",
    "request": "^2.88.2",
    "xml-js": "^1.6.11"
  }
```

### 🎧 ERD

<div align="center" style="display:flex;"><img src="https://user-images.githubusercontent.com/41534832/173386405-8d79ac3d-8496-409f-bb1c-9b76abb2ee59.png" width="85%"></div>


### 🎧 Skills
<img alt="Node.js" src ="https://img.shields.io/badge/Node.js-339933?&style=for-the-badge&logo=Node.js&logoColor=white"/><img alt="JavaScript" src ="https://img.shields.io/badge/JavaScript-F7DF1E?&style=for-the-badge&logo=JavaScript&logoColor=black"/><img alt="MariaDB" src ="https://img.shields.io/badge/MariaDB-003545?&style=for-the-badge&logo=MariaDB&logoColor=white"/><img alt="npm" src ="https://img.shields.io/badge/npm-CB3837?&style=for-the-badge&logo=npm&logoColor=white"/><img alt="Amazon AWS" src ="https://img.shields.io/badge/Amazon AWS-232F3E?&style=for-the-badge&logo=MySQL&logoColor=white"/><img alt="Nodemon" src ="https://img.shields.io/badge/Nodemon-76D04B?&style=for-the-badge&logo=Nodemon&logoColor=white"/>

<br>

#### [API 명세서 바로가기❗️](https://github.com/VinylaCrew/Vinyla_Server/wiki)

