import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

//캐릭터 생성 api
router.post("/character/create", authMiddleware, async (req, res, next) => {
  try {
    const { characterName } = req.body;
    const { userId } = req.user;

    const isCharacterName = await prisma.characters.findFirst({
      where: { characterName },
    });

    if (isCharacterName) {
      return res
        .status(409)
        .json({ message: "이미 존재하는 캐릭터 닉네임입니다." });
    }

    const [character] = await prisma.$transaction(async (tx) => {
      const character = await tx.characters.create({
        data: {
          characterName,
          userId,
        },
      });

      return [character];
    });

    return res.status(201).json({ message: "캐릭터 생성이 완료되었습니다." });
  } catch (err) {
    next(err);
  }
});

//모든 캐릭터 조회
router.get('/search/character/all', async (req, res, next) => {
  try{
    const characters = await prisma.characters.findMany({
      select:{
        characterId: true,
        characterName: true,
        level: true,
      },
    });

    return res.status(200).json({data: characters});
  } catch (err) {
    next(err);
  }
})

//로그인 된 계정의 캐릭터 조회
router.get(
  "/search/character/mine/:characterId",
  authMiddleware,
  async (req, res, next) => {
    const { userId } = req.user;
    const { characterId } = req.params;

    const character = await prisma.characters.findFirst({
      where: {
        userId,
        characterId: +characterId,
      },
      select: {
        characterName: true,
        level: true,
        health: true,
        power: true,
        money: true,
      },
    });

    if (!character) {
      return res.status(404).json({ message: "캐릭터를 찾을 수 없습니다." });
    }

    return res.status(200).json({ data: character });
  }
);

//다른 사람의 캐릭터 조회
router.get("/search/character/other/:characterId", async (req, res, next) => {
  const { characterId } = req.params;

  const character = await prisma.characters.findFirst({
    where: {
      characterId: +characterId,
    },
    select: {
      characterName: true,
      level: true,
      health: true,
      power: true,
    },
  });

  if (!character) {
    return res.status(404).json({ message: "캐릭터를 찾을 수 없습니다." });
  }

  return res.status(200).json({ data: character });
});

//캐릭터 삭제 API → (JWT 인증 필요)
router.delete("/cancel/character/:characterId", authMiddleware, async (req, res, next) => {
  try{
    const { userId } = req.user;
    const { characterId } = req.params;

    const character = await prisma.characters.findFirst({
      where: {
        characterId: +characterId,
        userId,
      },
    });

    if (!character) {
      return res.status(404).json({ message: "본인의 캐릭터가 아닙니다" });
    }
    
    await prisma.characters.delete({
      where:{
        characterId: +characterId,
        userId,
      }
    });

    return res.status(200).json({ data: "캐릭터가 삭제되었습니다." });
  } catch (err) {
    next(err);
  }
});

export default router;
//https://drawsql.app/templates/airbnb
