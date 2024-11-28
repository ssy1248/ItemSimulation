import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post(
  "/get/gold/:characterId",
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
        money: true,
      },
    });

    if (!character) {
      return res
        .status(403)
        .json({ message: "해당 캐릭터는 사용자의 것이 아닙니다." });
    }

    await prisma.characters.update({
        where:{
            characterId: +characterId,
        },
        data: {
            money: character.money + 100,
        }
    });

    return res.status(201).json({ message: "골드를 획득하셨습니다."});
  }
);

export default router;
