import express from "express";
import { prisma } from "../utils/prisma/index.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

//아이템 등록 api
router.post("/post/item", async (req, res, next) => {
  try {
    const {
      itemName,
      itemEquip,
      itemDescription,
      itemHealth,
      itemPower,
      itemRarity,
      itemPrice,
    } = req.body;

    const [item] = await prisma.$transaction(async (tx) => {
      const item = await tx.items.create({
        data: {
          itemName,
          itemEquip,
          itemDescription,
          itemHealth,
          itemPower,
          itemRarity,
          itemPrice,
        },
      });
      return [item];
    });
    return res.status(201).json({ message: "아이템이 등록되었습니다." });
  } catch (err) {
    next(err);
  }
});

//아이템 수정 API - 단, 아이템 가격은 수정할 수 없게 해주세요!

//모든 아이템 조회 api
router.get("/search/items", async (req, res, next) => {
  const items = await prisma.items.findMany({
    select: {
      itemId: true,
      itemName: true,
      itemEquip: true,
      itemHealth: true,
      itemPower: true,
      itemRarity: true,
      itemPrice: true,
    },
  });

  return res.status(200).json({ data: items });
});

//아이템 id 조회해서 하나의 아이템 출력
router.get("/search/item/:itemId", async (req, res, next) => {
  const { itemId } = req.params;

  const item = await prisma.items.findFirst({
    where: { itemId: +itemId },
    select: {
      itemId: true,
      itemName: true,
      itemDescription: true,
      itemEquip: true,
      itemHealth: true,
      itemPower: true,
      itemRarity: true,
      itemPrice: true,
    },
  });
  return res.status(200).json({ data: item });
});

//아이템 수정 api
router.put("/update/item/:itemId", async(req, res, next) => {
  const { itemId } = req.params;
  const { itemName,itemEquip, itemHealth, itemPower, itemRarity, itemPrice } = req.body;

  const item = await prisma.items.findFirst({
    where:{
      itemId: +itemId,
    }
  });

  if(!item){
    return res.status(404).json({ message: "아이템이 존재하지 않습니다." });
  }

  await prisma.items.update({
    where: {
      itemId: +itemId,
    },
    data: {
      itemName: itemName,
      itemEquip: itemEquip,
      itemHealth: itemHealth,
      itemPower: itemPower,
      itemRarity: itemRarity,
      itemPrice: itemPrice,
    },
  });

  return res.status(200).json({ data: "아이템 데이터가 수정되었습니다." });
});

export default router;
