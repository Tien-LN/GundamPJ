const jwt = require("jsonwebtoken");
const { prisma } = require("../config/db.js");

const verifyUser = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({ message: "Người dùng không tồn tại" });
    }

    req.user = user; // Lưu thông tin user vào req
    next();
  } catch (error) {
    res.status(401).json({ message: "Token không hợp lệ", error });
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    await verifyUser(req, res, async () => {
      if (req.user.role !== "ADMIN") {
        return res
          .status(403)
          .json({ message: "Bạn không có quyền thực hiện thao tác này" });
      }
      next();
    });
  } catch (error) {
    res.status(403).json({ message: "Token không hợp lệ", error });
  }
};

module.exports = { verifyUser, verifyAdmin };
