const jwt = require("jsonwebtoken");
const { prisma } = require("../config/db.js");

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "chưa đăng nhập" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user || user.role != "ADMIN") {
      return res
        .status(403)
        .json({ message: "bạn không có quyền thực hiện thao tác này" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "token không hợp lệ", error });
  }
};

module.exports = { isAdmin };
