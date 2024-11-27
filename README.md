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
로그인된 계정의 캐릭터의 인벤토리에 아이템 추가 - router.post("/insert/:characterId/:itemId", authMiddleware, async (req, res, next)
로그인된 계정의 캐릭터의 인벤토리 조회 - router.get("/search/inventory/:characterId", authMiddleware, async (req, res, next)

### Character Item (착용 아이템 관련) - character.item.router.js
아이템 착용 - router.post("/equip/:characterId/:itemId", authMiddleware, async (req, res, next)
아이템 탈착 - router.post("/detachment/item/:characterId/:itemId", authMiddleware,async (req, res, next)
캐릭터 착용 장비 조회 - router.get("/search/equip/:characterId", async (req, res, next)

***
## 데이터 베이스 모델
![데이터베이스 모델 이미지](https://github.com/ssy1248/ItemSimulation/blob/main/%EC%95%84%EC%9D%B4%ED%85%9C%20%EC%8B%9C%EB%AE%AC%EB%A0%88%EC%9D%B4%ED%84%B0%20%EB%8D%B0%EC%9D%B4%ED%84%B0%20%EB%AA%A8%EB%8D%B8.png)
