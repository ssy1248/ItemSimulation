import express from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma/index.js";
import bcrypt from "bcrypt";

const router = express.Router();

//회원 가입 api
router.post("/sign-up", async (req, res, next) => {
  try {
    // 변경 사항 : 비밀번호 확인 / 비밀번호 최소 6자리 / 어드민 boolean 값 추가하여 구분
    const { email, password, userName } = req.body;

    const isExistUser = await prisma.users.findFirst({
      where: { email },
    });

    if (isExistUser) {
      return res.status(409).json({ message: "이미 존재하는 이메일입니다." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [user] = await prisma.$transaction(async(tx) => {
      const user = await tx.users.create({
        data: {
          email,
          password: hashedPassword,
          userName,
        },
      });

      return [user];
    }, {
      //트랜잭션의 격리 수준을 결정하는 부분
      isolationLevel: Prisma.TransactionIsolationLevel.ReadCommitted,
    })

    return res.status(201).json({ message: "회원가입이 완료되었습니다." });
  } catch (err) {
    next(err);
  }
});

//로그인 api
router.post("/sign-in", async (req, res, next) => {
  const { email, password } = req.body;

  const user = await prisma.users.findFirst({ where: { email } });

  if (!user)
    return res.status(401).json({ message: "존재하지 않는 이메일입니다." });
  if (!(await bcrypt.compare(password, user.password)))
    return res.status(401).json({ message: "비밀번호가 일치하지 않습니다." });

  req.session.userId = user.userId;

  return res.status(200).json({ message: "로그인이 성공하였습니다." });
});

//캐릭터 삭제 API → (JWT 인증 필요)

export default router;
