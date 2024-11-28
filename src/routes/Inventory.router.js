import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

//아이템 인벤토리 구매 api
router.post(
  "/buy/:characterId/:itemId",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { characterId, itemId } = req.params;

      // 내가 가진 캐릭터인지 체크
      const character = await prisma.characters.findFirst({
        where: {
          characterId: +characterId,
          userId, // 캐릭터가 로그인된 사용자 소유인지 확인
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

      // 아이템 정보 가져오기
      const item = await prisma.items.findUnique({
        where: {
          itemId: +itemId,
        },
        select: {
          itemPrice: true,
        },
      });

      if (!item) {
        return res.status(404).json({ message: "존재하지 않는 아이템입니다." });
      }

      if (character.money < item.itemPrice) {
        return res.status(400).json({ message: "캐릭터의 돈이 부족합니다." });
      }

      // 동일한 characterId와 itemId가 존재하는지 확인
      const existingItem = await prisma.charactersInventory.findFirst({
        where: {
          characterId: +characterId,
          itemId: +itemId,
        },
      });

      if (existingItem) {
        // 이미 존재하면 수량 증가
        await prisma.charactersInventory.update({
          where: {
            charactersInventoryId: existingItem.charactersInventoryId,
          },
          data: {
            itemQuantity: existingItem.itemQuantity + 1,
          },
        });
      } else {
        // 존재하지 않으면 새로 추가
        await prisma.charactersInventory.create({
          data: {
            characterId: +characterId,
            itemId: +itemId,
            itemQuantity: 1,
          },
        });
      }

      await prisma.characters.update({
        where: {
          characterId: +characterId,
        },
        data: {
          money: character.money - item.itemPrice,
        },
      });

      return res.status(201).json({ message: "아이템을 구매하였습니다." });
    } catch (err) {
      next(err);
    }
  }
);

// 아이템 인벤토리 판매 api
router.post(
  "/sell/:characterId/:itemId",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { characterId, itemId } = req.params;

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

      const inventoryItem = await prisma.charactersInventory.findFirst({
        where: {
          characterId: +characterId,
          itemId: +itemId,
        },
        include: {
          item: {
            select: {
              itemPrice: true,
            },
          },
        },
      });

      if (!inventoryItem) {
        return res
          .status(404)
          .json({ message: "아이템이 인벤토리에 없습니다." });
      }

      const sellPrice = Math.floor(inventoryItem.item.itemPrice * 0.6);

      if (inventoryItem.itemQuantity > 1) {
        await prisma.charactersInventory.update({
          where: {
            charactersInventoryId: inventoryItem.charactersInventoryId,
          },
          data: {
            itemQuantity: inventoryItem.itemQuantity - 1,
          },
        });
      } else {
        await prisma.characters.delete({
          where: {
            charactersInventoryId: inventoryItem.charactersInventoryId,
          },
        });
      }

      await prisma.characters.update({
        where: {
          characterId: +characterId,
        },
        data: {
          money: character.money + sellPrice,
        },
      });

      return res.status(201).json({ message: "아이템을 판매하였습니다." });
    } catch (err) {
      next(err);
    }
  }
);

// 로그인 된 계정의 캐릭터 인벤토리 조회
router.get(
  "/search/inventory/:characterId",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { characterId } = req.params;

      //자신의 캐릭터인지 확인
      const character = await prisma.characters.findFirst({
        where: {
          userId,
          characterId: +characterId,
        },
      });

      if (!character) {
        return res
          .status(403)
          .json({ message: "해당 캐릭터는 사용자의 것이 아닙니다." });
      }

      const inventory = await prisma.charactersInventory.findMany({
        where: {
          characterId: +characterId,
        },
        include: {
          item: {
            select: {
              itemName: true,
              itemEquip: true,
              itemRarity: true,
            },
          },
        },
      });
      return res.status(200).json({ data: inventory });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
