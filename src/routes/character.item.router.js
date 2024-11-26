import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/equip/:characterId', authMiddleware, async(req, res, next) => {
    const {userId} = req.user;
    const {characterId} = req.params;

    //내캐릭인지 확인
    const character = await prisma.characters.findFirst({
        where: {
            userId,
            characterId: +characterId,
        }
    });

    if(!character){
        return res.status(403).json({ message: "해당 캐릭터는 사용자의 것이 아닙니다." });
    }

    // 인벤토리 아이템 선택 하고 착용
    const inventory = await prisma.charactersInventory.findMany({
        where: {
            character: +characterId,
        },

    });
});

export default router;