const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { prisma } = require("../../config/db.js");
const hashPassword = require("../../utils/hashPassword.js");

// [POST] /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = await jwt.sign(
      {
        id: user.id,
        role: user.role?.roleType,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "5h" }
    );

    // console.log(token);

    res.cookie("jwt", token, {
      httpOnly: true, // bảo vệ cookie khỏi javascript trên trình duyệt
      secure: process.env.NODE_ENV === "production" ? true : false, // Chỉ bật trên môi trường production
      sameSite: "Lax",
      maxAge: 3600000,
    });

    res.json({
      message: "Đăng nhập thành công",
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        gender: user.gender,
        phone: user.phone,
        dateOfBirth: user.dateOfBirth,
        address: user.address,
        name: user.name,
        mustChangePassword: user.mustChangePassword,
      },
    });
  } catch (error) {
    console.error("Login error: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const userId = req.body.id;

    if (!newPassword) {
      return res.status(400).json({ message: "Vui lòng nhập mật khẩu mới" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user.mustChangePassword) {
      if (!oldPassword) {
        return res.status(400).json({ message: "Vui lòng nhập mật khẩu cũ" });
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Mật khẩu không chính xác" });
      }
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        mustChangePassword: false,
      },
    });

    res.status(200).json({ message: "Đổi mật khẩu thành công" });
  } catch (error) {
    console.error("Lỗi đổi mật khẩu: ", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// [POST] /api/auth/logout
const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", {
      httpOnly: true,
      expires: new Date(0),
    });

    return res.status(200).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi khi đăng xuất", error: error.message });
  }
};

module.exports = { login, changePassword, logout };
