import { prisma } from "../utils/prisma/index.js";

export default async function (req, res, next) {
  try {
    const { userId } = req.session;
    if (!userId) {
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }

    const user = await prisma.users.findUnique({
      where: { userId: +userId },
    });
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}
