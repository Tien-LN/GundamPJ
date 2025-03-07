const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { prisma } = require("../config/db.js");

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "email đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });
    res
      .status(201)
      .json({ message: "tạo người dùng thành công", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error });
  }
};

const registerMultipleUsers = async (req, res) => {
  try {
    const users = req.body.users;
    if (!users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }

    // lấy email list
    const emailList = await users.map((user) => user.email);

    // lấy ra các email đã tồn tại
    const existingUsers = await prisma.user.findMany({
      where: { email: { in: emailList } },
      select: { email: true },
    });

    const existingEmails = await existingUsers.map((user) => {
      user.email;
    });

    // lọc các user mới
    const newUsers = users.filter(
      (user) => !existingEmails.includes(user.email)
    );
    if (newUsers.length === 0)
      return res.status(400).json({ message: "Tất cả Email đều đã tồn tại" });

    // hashing passwords
    const hashedUsers = await Promise.all(
      newUsers.map(async (user) => ({
        ...user, // sao chep tat ca thuoc tinh cua object sau do chi thay doi 1 tt
        password: await bcrypt.hash(user.password, 10),
      }))
    );

    // them users vao db
    await prisma.user.createMany({
      data: hashedUsers,
      skipDuplicates: true,
    });

    res
      .status(201)
      .json({ message: `đã tạo thành công ${newUsers.length} tài khoản` });
  } catch (error) {
    console.error("lỗi khi tạo nhiều tài khoản", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Invalid email or password bla bla" });
    }

    const token = await jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error: ", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, registerMultipleUsers, login };
