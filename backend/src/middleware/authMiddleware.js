const jwt = require("jsonwebtoken");
const { prisma } = require("../config/db.js");

const verifyUser = async (req, res, next) => {
  try {
    console.log("Middleware verifyUser được gọi");
    // console.log("Token trong request:", req.cookies);
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Bạn chưa đăng nhập" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: { role: true },
    });

    if (!user) {
      return res.status(401).json({ message: "Người dùng không tồn tại" });
    }

    req.user = user; // Lưu thông tin user vào req
    next();
  } catch (error) {
    res.status(401).json({ message: "Token không hợp lệ as", error });
  }
};

const verifyAdmin = async (req, res, next) => {
  try {
    await verifyUser(req, res, async () => {
      console.log("User role:", req.user.role?.roleType); // Debug log
      if (req.user.role?.roleType !== "ADMIN") {
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
