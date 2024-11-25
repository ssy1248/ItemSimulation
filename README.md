JS의 Express를 이용하여 아이템 시뮬레이션 제작

로그인 / 회원가입 기능
회원가입 - router.post("/sign-up", async (req, res, next)
로그인 - router.post("/sign-in", async (req, res, next)

캐릭터 생성
router.post("/create", authMiddleware, async (req, res, next)

내 캐릭 조회 / 타 캐릭 조회
내 캐릭 조회 - router.get("/search/mine/:charId", authMiddleware, async (req, res, next)
타 캐릭 조회 - router.get("/search/other/:charId", async (req, res, next)