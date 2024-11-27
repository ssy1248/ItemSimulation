# JS의 Express를 이용하여 아이템 시뮬레이션 제작
***

## 인증 미들웨어
authmiddleware 를 통하여서 로그인을 검사
***

## 제작 api
로그인 / 회원가입 기능 - users.router.js
회원가입 - router.post("/sign-up", async (req, res, next)
로그인 - router.post("/sign-in", async (req, res, next)

캐릭터 생성 - character.router.js
router.post("/create", authMiddleware, async (req, res, next)

내 캐릭 조회 / 타 캐릭 조회 - character.router.js
내 캐릭 조회 - router.get("/search/mine/:charId", authMiddleware, async (req, res, next)
타 캐릭 조회 - router.get("/search/other/:charId", async (req, res, next)

아이템 관련 - item.router.js
아이템 생성 - router.post("/post/item", async (req, res, next)
모든 아이템 조회 - router.get("/search/items", async (req, res, next)
아이템 하나 조회 - router.get("/search/item/:itemId", async (req, res, next)

인벤토리 관련 - Inventory.router.js
로그인된 계정의 캐릭터의 인벤토리에 아이템 추가 - router.post("/insert/:characterId/:itemId", authMiddleware, async (req, res, next)
로그인된 계정의 캐릭터의 인벤토리 조회 - router.get("/search/inventory/:characterId", authMiddleware, async (req, res, next)

***
## 데이터 베이스 모델
![데이터베이스 모델 이미지](https://github.com/ssy1248/ItemSimulation/blob/main/%EC%95%84%EC%9D%B4%ED%85%9C%20%EC%8B%9C%EB%AE%AC%EB%A0%88%EC%9D%B4%ED%84%B0%20%EB%8D%B0%EC%9D%B4%ED%84%B0%20%EB%AA%A8%EB%8D%B8.png)
