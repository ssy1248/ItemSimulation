import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// 아이템 착용 api
router.post(
  "/equip/:characterId/:itemId",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { characterId, itemId } = req.params;

      // 내 계정의 캐릭터인지 확인
      const character = await prisma.characters.findFirst({
        where: {
          userId,
          characterId: +characterId,
        },
        select: {
          health: true,
          power: true,
        },
      });

      if (!character) {
        return res
          .status(403)
          .json({ message: "해당 캐릭터는 사용자의 것이 아닙니다." });
      }

      // 인벤토리에 아이템이 있는지 확인
      const inventoryItem = await prisma.charactersInventory.findFirst({
        where: {
          characterId: +characterId,
          itemId: +itemId,
        },
        include: {
          item: {
            select: {
              itemHealth: true,
              itemPower: true,
            },
          },
        },
      });

      if (!inventoryItem) {
        return res
          .status(404)
          .json({ message: "인벤토리에 존재하지 않는 아이템입니다." });
      }

      //인벤토리에 아이템이 존재한다면 characterItem에 등록
      await prisma.charactersItem.create({
        data: {
          characterId: +characterId,
          itemId: +itemId,
          equipped: true,
        },
      });

      const healthIncrease = inventoryItem.item?.itemHealth || 0;
      const powerIncrease = inventoryItem.item?.itemPower || 0;

      //스탯 증가
      await prisma.characters.update({
        where: {
          characterId: +characterId,
        },
        data: {
          health: character.health + healthIncrease,
          power: character.power + powerIncrease,
        },
      });

      //인벤토리 아이템에 갯수가 1개 초과이면
      if (inventoryItem.itemQuantity > 1) {
        await prisma.charactersInventory.update({
          where: { charactersInventoryId: inventoryItem.charactersInventoryId },
          data: {
            itemQuantity: inventoryItem.itemQuantity - 1,
          },
        });
      } else {
        await prisma.charactersInventory.delete({
          where: { charactersInventoryId: inventoryItem.charactersInventoryId },
        });
      }

      return res.status(201).json({ message: "아이템이 장착되었습니다." });
    } catch (err) {
      next(err);
    }
  }
);

//아이템 탈착 api
router.post(
  "/detachment/item/:characterId/:itemId",
  authMiddleware,
  async (req, res, next) => {
    try {
        const { userId } = req.user;
        const { characterId, itemId } = req.params;

        const character = await prisma.characters.findFirst({
            where: {
                userId,
                characterId: +characterId,
            }
        });

        if(!character){
            return res.status(403).json({ message: "해당 캐릭터는 계정의 캐릭터가 아닙니다." });
        }



    } catch (err) {
      next(err);
    }
  }
);

// 캐릭터 착용 조회 api
router.get("/search/equip/:characterId", async (req, res, next) => {
  try {
    const { characterId } = req.params;

    const equipItemCharacter = await prisma.charactersItem.findMany({
      where: {
        characterId: +characterId,
      },
      select: {
        charactersItemId: true,
        item: {
          select: {
            itemName: true,
            itemHealth: true,
            itemEquip: true,
            itemPower: true,
            itemRarity: true,
          },
        },
      },
    });
    return res.status(200).json({ data: equipItemCharacter });
  } catch (err) {
    next(err);
  }
});

export default router;
