const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { prisma } = require("../config/db.js");
const hashPassword = require("../utils/hashPassword.js");
const { sendEmail, validateEmail } = require("../utils/emailService.js");
const generateRandomPassword = require("../utils/generateRandomPassword.js");

const registerUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const emailCheck = await validateEmail(email);
    // console.log(emailCheck);
    if (!emailCheck.valid) {
      return res.status(400).json({ message: emailCheck.message });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "email đã tồn tại" });
    }

    const tempPassword = generateRandomPassword();
    const hashedPassword = await hashPassword(tempPassword);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        mustChangePassword: true,
      },
    });

    await sendEmail(
      email,
      "Chào mừng bạn đến với PSTUDY!",
      `Xin chào ${name},
    
    Cảm ơn bạn đã đăng ký khóa học của chúng tôi! Dưới đây là thông tin đăng nhập của bạn:
      - Email: ${email}
      - Mật khẩu: ${tempPassword}
    
    📢 Khuyến cáo: Vui lòng đăng nhập và đổi mật khẩu ngay lần đầu tiên để bảo vệ tài khoản của bạn.
    
    Trân trọng,
    Đội ngũ PSTUDY
    `,
      `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #2d89ef;">Chào mừng bạn đến với PSTUDY!</h2>
        <p>Xin chào <strong>${name}</strong>,</p>
        <p>Cảm ơn bạn đã đăng ký khóa học của chúng tôi! Dưới đây là thông tin đăng nhập của bạn:</p>
        <ul>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Mật khẩu:</strong> ${tempPassword}</li>
        </ul>
        <p style="color: red; font-weight: bold;">
          📢 Lưu ý: Để bảo vệ tài khoản của bạn, hãy đăng nhập và đổi mật khẩu ngay lần đầu tiên.
        </p>
        <p>Bấm vào nút bên dưới để đổi mật khẩu ngay:</p>
        <p>
          <a href="https://yourwebsite.com/reset-password" 
             style="display: inline-block; padding: 10px 20px; color: white; background: #2d89ef; text-decoration: none; border-radius: 5px;">
             Đổi mật khẩu ngay
          </a>
        </p>
        <p>Trân trọng,<br><strong>Đội ngũ PSTUDY</strong></p>
      </div>
      `
    );

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
      existingUsers.email;
    });

    const invalidEmails = [];
    const validUsers = [];

    // lọc các user mới
    for (const user of users) {
      const emailCheck = await validateEmail(user.email);
      if (!emailCheck.valid) {
        invalidEmails.push(user.email);
      } else {
        validUsers.push(user);
      }
    }
    const newUsers = validUsers.filter(
      (user) => !existingEmails.includes(user.email)
    );

    if (newUsers.length === 0)
      return res.status(400).json({
        message: "Tất cả Email đều đã tồn tại",
        existingEmails,
        invalidEmails,
      });

    // hashing passwords
    const hashedUsers = await Promise.all(
      newUsers.map(async (user) => {
        const tempPassword = generateRandomPassword();
        return {
          ...user, // sao chep tat ca thuoc tinh cua object sau do chi thay doi 1 tt
          password: await hashPassword(tempPassword),
          tempPassword,
        };
      })
    );

    // them users vao db
    await prisma.user.createMany({
      data: hashedUsers.map(({ tempPassword, ...user }) => user),
      skipDuplicates: true,
    });

    for (const user of hashedUsers) {
      await sendEmail(
        user.email,
        "Chào mừng bạn đến với PSTUDY!",
        `Xin chào ${user.name},
      
      Cảm ơn bạn đã đăng ký khóa học của chúng tôi! Dưới đây là thông tin đăng nhập của bạn:
        - Email: ${user.email}
        - Mật khẩu: ${user.tempPassword}
      
      📢 Khuyến cáo: Vui lòng đăng nhập và đổi mật khẩu ngay lần đầu tiên để bảo vệ tài khoản của bạn.
      
      Trân trọng,
      Đội ngũ PSTUDY
      `,
        `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #2d89ef;">Chào mừng bạn đến với PSTUDY!</h2>
          <p>Xin chào <strong>${user.name}</strong>,</p>
          <p>Cảm ơn bạn đã đăng ký khóa học của chúng tôi! Dưới đây là thông tin đăng nhập của bạn:</p>
          <ul>
            <li><strong>Email:</strong> ${user.email}</li>
            <li><strong>Mật khẩu:</strong> ${user.tempPassword}</li>
          </ul>
          <p style="color: red; font-weight: bold;">
            📢 Lưu ý: Để bảo vệ tài khoản của bạn, hãy đăng nhập và đổi mật khẩu ngay lần đầu tiên.
          </p>
          <p>Bấm vào nút bên dưới để đổi mật khẩu ngay:</p>
          <p>
            <a href="https://yourwebsite.com/reset-password" 
               style="display: inline-block; padding: 10px 20px; color: white; background: #2d89ef; text-decoration: none; border-radius: 5px;">
               Đổi mật khẩu ngay
            </a>
          </p>
          <p>Trân trọng,<br><strong>Đội ngũ PSTUDY</strong></p>
        </div>
        `
      );
    }

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
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = await jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    console.log(token);

    res.cookie("jwt", token, {
      httpOnly: true, // bảo vệ cookie khỏi javascript trên trình duyệt
      secure: process.env.NODE_ENV === "production", //chỉ gửi cookie qua HTTPS trong môi trường production
      maxAge: 3600000,
    });

    res.json({
      message: "Đăng nhập thành công",
      user: { id: user.id, email: user.email, role: user.role },
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

module.exports = { registerUser, registerMultipleUsers, login, changePassword };
