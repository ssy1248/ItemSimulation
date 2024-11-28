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

//아이템 착용해제 api
router.post(
  "/detachment/item/:characterId/:itemId",
  authMiddleware,
  async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { characterId, itemId } = req.params;

      // 계정의 캐릭터인지 조회
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
          .json({ message: "해당 캐릭터는 계정의 캐릭터가 아닙니다." });
      }

      // 착용중인 아이템인지 조회
      const equipItem = await prisma.charactersItem.findFirst({
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

      if (!equipItem) {
        return res.status(404).json({ message: "착용중인 아이템이 아닙니다." });
      }

      const healthIncrease = equipItem.item?.itemHealth || 0;
      const powerIncrease = equipItem.item?.itemPower || 0;

      await prisma.$transaction(async (tx) => {
        //착용 테이블에서 데이터 삭제
        await tx.charactersItem.delete({
          where: {
            charactersItemId: equipItem.charactersItemId,
          },
        });

        //캐릭터 power, health 업데이트
        await tx.characters.update({
          where: {
            characterId: +characterId,
          },
          data: {
            health: character.health - healthIncrease,
            power: character.power - powerIncrease,
          },
        });

        // 인벤토리에서 아이템 조회
        const inventoryItem = await tx.charactersInventory.findFirst({
          where: {
            itemId: +itemId,
            characterId: +characterId,
          },
        });

        //인벤토리에 아이템이 없다면 생성
        if (!inventoryItem) {
          await tx.charactersInventory.create({
            data: {
              characterId: +characterId,
              itemId: +itemId,
              itemQuantity: 1,
            },
          });
        }
        //인벤토리에 아이템이 있다면 갯수 증가
        else {
          await tx.charactersInventory.update({
            where: {
              charactersInventoryId: inventoryItem.charactersInventoryId,
            },
            data: {
              itemQuantity: inventoryItem.itemQuantity + 1,
            },
          });
        }
      });

      return res.status(200).json({ message: "아이템이 착용 해제 되었습니다." });
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

//DQL, DML
