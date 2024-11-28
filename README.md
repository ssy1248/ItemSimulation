# JS의 Express를 이용하여 아이템 시뮬레이션 제작
***

## 인증 미들웨어
authmiddleware 를 통하여서 로그인을 검사
***

## 제작 api
### User - users.router.js
회원가입 - router.post("/sign-up", async (req, res, next)
로그인 - router.post("/sign-in", async (req, res, next)

### Character - character.router.js
캐릭터 생성 - router.post("/character/create", authMiddleware, async (req, res, next)
모든 캐릭터 조회 - router.get('/search/character/all', async (req, res, next)
내 캐릭터 조회 - router.get("/search/character/mine/:characterId", authMiddleware, async (req, res, next)
타 캐릭터 조회 - router.get("/search/character/other/:characterId", async (req, res, next)
캐릭터 삭제 - router.delete("/cancel/character/:characterId", authMiddleware, async (req, res, next)

### Item - item.router.js
아이템 생성 - router.post("/post/item", async (req, res, next)
모든 아이템 조회 - router.get("/search/items", async (req, res, next)
아이템 하나 조회 - router.get("/search/item/:itemId", async (req, res, next)
아이템 수정 - router.put("/update/item/:itemId", async(req, res, next)

### Inventory - Inventory.router.js
아이템 구매 - router.post("/insert/:characterId/:itemId", authMiddleware, async (req, res, next)
아이템 판매 - router.post("/sell/:characterId/:itemId", authMiddleware, async (req, res, next)
로그인된 계정의 캐릭터의 인벤토리 조회 - router.get("/search/inventory/:characterId", authMiddleware, async (req, res, next)

### Character Item (착용 아이템 관련) - character.item.router.js
아이템 착용 - router.post("/equip/:characterId/:itemId", authMiddleware, async (req, res, next)
아이템 탈착 - router.post("/detachment/item/:characterId/:itemId", authMiddleware,async (req, res, next)
캐릭터 착용 장비 조회 - router.get("/search/equip/:characterId", async (req, res, next)

### GoldGet - gold.get.router.js
골드 획득 - router.post("/get/gold/:characterId", authMiddleware, async (req, res, next)

***
## 데이터 베이스 모델
![데이터베이스 모델 이미지](https://github.com/ssy1248/ItemSimulation/blob/main/%EC%95%84%EC%9D%B4%ED%85%9C%20%EC%8B%9C%EB%AE%AC%EB%A0%88%EC%9D%B4%ED%84%B0%20%EB%8D%B0%EC%9D%B4%ED%84%B0%20%EB%AA%A8%EB%8D%B8.png)


## 질문과 답변

### 암호화 방식
#### 비밀번호를 DB에 저장할 때 Hash를 이용했는데, Hash는 단방향 암호화와 양방향 암호화 중 어떤 암호화 방식에 해당할까요?
Hash는 단방향 암호화에 해당합니다. 암호화를 하면 복호화가 안되기때문에 단방향 암호화라고 생각합니다.

#### 비밀번호를 그냥 저장하지 않고 Hash 한 값을 저장 했을 때의 좋은 점은 무엇인가요?
DB가 만약 해커한테 열람을 당하더라도 사용자들의 비밀번호의 원본이 보여지는 것이 아닌 암호화가 된 Hash가 보이기 때문에 피해가 줄어든다고 생각합니다.

### 인증 방식
#### JWT(Json Web Token)을 이용해 인증 기능을 했는데, 만약 Access Token이 노출되었을 경우 발생할 수 있는 문제점은 무엇일까요?
권한을 탈취하고 불법으로 접근을 하는 일이 생길 수 있습니다. 그 외엔 만료된 토큰을 접근을 시켜서 사용하는 일이 생길 수도 있습니다.

#### 해당 문제점을 보완하기 위한 방법으로는 어떤 것이 있을까요?
토큰의 만료 기간을 너무 길게 하지 않는 방식을 사용할 수 있습니다.
접근을 할때마다 토큰을 새롭게 발급을 하는 방식을 사용하는 방식이 있습니다.

### 인증과 인가
#### 인증과 인가가 무엇인지 각각 설명해 주세요.
인증 - 사용자가 주장하는 신원을 확인합니다
인가 - 인증된 사용자가 특정 리소스나 작업에 접근할 권한이 있는지 확인합니다.

#### 위 API 구현 명세에서 인증을 필요로 하는 API와 그렇지 않은 API의 차이가 뭐라고 생각하시나요?
다른 사용자가 접근을 해서 사용을 할 때 보안상 문제가 생길 만한 api를 인증을 필요한 api로 묶은거 같습니다. 예를 들어서 캐릭터가 아이템을 구매와 판매 등을 다른 사용자가 하면 문제가 생길 수 있어서 본인 인증이 된 사용자만 사용을 할 수 있게했습니다.

#### 아이템 생성, 수정 API는 인증을 필요로 하지 않는다고 했지만 사실은 어느 API보다도 인증이 필요한 API입니다. 왜 그럴까요?
일반 유저들이 아이템 생성 수정을 해버리면 오버스펙의 아이템을 만들고 수정할 수 있기때문에 게임의 밸런스와 개발자들의 의도를 망가트릴수 있기때문에 막아야 합니다.

### Http Status Code
#### 과제를 진행하면서 사용한 Http Status Code를 모두 나열하고, 각각이 의미하는 것과 어떤 상황에 사용했는지 작성해 주세요.
200번대와 400번대의 Status Code를 사용했습니다. 200번대의 http status code는 클라이언트의 요청이 성공적으로 처리되었을 때 사용하는 Status code이고 400번대의 Status code는 클라이언트의 요청이 이상하거나 문제가 생기면 나오는 오류내역이 나올때 사용하는 Status Code입니다.

### 게임 경제
#### 현재는 간편한 구현을 위해 캐릭터 테이블에 money라는 게임 머니 컬럼만 추가하였습니다. 이렇게 되었을 때 어떠한 단점이 있을 수 있을까요? 이렇게 하지 않고 다르게 구현할 수 있는 방법은 어떤 것이 있을까요?
제 생각으로는 골드 하나로만 진행을 하면 사용자가 오래 할 수록 하나의 재화만을 사용하기때문에 나중에 골드인플레가 올 수도 있고 사용자들이 하여금 재미가 없어질 수 있을거 같습니다. 골드와 크리스탈 등 여러 재화로 나누어서 강화를 한다든지 제작을 할때 여러가지 재화를 사용하면 플레이어들에게 파밍의 시간을 요구하고 재화를 모으는 시간을 요구하기 때문에 플레이어들의 플레이 타임이 늘어나는 이점이 있을거 같습니다.

#### 아이템 구입 시에 가격을 클라이언트에서 입력하게 하면 어떠한 문제점이 있을 수 있을까요?
싼 가격에 사고 판매할 때 너무 큰 이득을 볼 수 있기 때문에 골드 인플레이션이 개발자들이 예상한 기간보다 훨씬 빨리 올 수 있기 때문에 먼저 개발자들이 정해놔야 이러한 점을 막을 수 있다고 생각합니다.

### 어려웠던 점
api를 직접 만들고 사용을 했을 때 에러가 생기면 에러 내역을 확인하고 찾는 과정에서 조금 시간이 걸린거 같습니다