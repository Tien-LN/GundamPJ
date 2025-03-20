const {
  sendEmail,
  validateEmail,
  validateEmailBatch,
} = require("../../utils/emailService.js");
const generateRandomPassword = require("../../utils/generateRandomPassword.js");
const { prisma } = require("../../config/db.js");
const hashPassword = require("../../utils/hashPassword.js");
const slugify = require("slugify");

const registerUser = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    const emailCheck = await validateEmail(email);
    if (!emailCheck.valid) {
      return res.status(400).json({ message: emailCheck.message });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "email đã tồn tại" });
    }

    const roleRecord = await prisma.roles.findUnique({
      where: { roleType: role || "STUDENT" },
    });
    if (!roleRecord) {
      return res.status(400).json({ message: "Role không hợp lệ" });
    }

    const tempPassword = generateRandomPassword();
    const hashedPassword = await hashPassword(tempPassword);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId: roleRecord.id,
        mustChangePassword: true,
      },
    });

    const slug = slugify(`${name} - ${newUser.id.slice(0, 8)}`, {
      lower: true,
      strict: true,
    });

    await prisma.user.update({
      where: { id: newUser.id },
      data: { slug },
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
    console.error("Lỗi khi tạo người dùng:", error);
    res.status(500).json({ message: "Lỗi server", error });
  }
};

const registerMultipleUsers = async (req, res) => {
  try {
    const users = req.body.users;
    // console.log(req.body);
    console.log(users);
    if (!users || !Array.isArray(users) || users.length === 0) {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ" });
    }

    // lấy danh sách email
    const emailList = users.map((user) => user.email);
    console.log("Email list:", emailList);

    // lấy ra các email đã tồn tại trong DB
    const existingEmailsList = await prisma.user.findMany({
      where: { email: { in: emailList } },
      select: { email: true },
    });

    console.log("Existing emails:", existingEmailsList);

    const existingEmails = existingEmailsList.map((user) => user.email);
    console.log("Existing emails array:", existingEmails);

    const emailvalidationResults = await validateEmailBatch(emailList);
    const validEmails = [];
    const invalidEmails = [];

    // lọc email
    emailList.forEach((email, index) => {
      if (!emailvalidationResults[index].valid) {
        invalidEmails.push({
          email: email,
          reason: emailvalidationResults[index].message,
        });
      } else {
        validEmails.push(email);
      }
    });

    console.log("Valid emails:", validEmails);
    console.log("Invalid emails:", invalidEmails);

    // Lọc các user mới (hợp lệ và chưa tồn tại)
    const newUsers = users.filter(
      (user) =>
        validEmails.includes(user.email) && !existingEmails.includes(user.email)
    );

    console.log("New users:", newUsers);

    if (newUsers.length === 0) {
      return res.status(400).json({
        message: "không thể tạo tài khoản",
        reason:
          invalidEmails.length > 0 && existingEmails.length > 0
            ? "Một số email không hợp lệ, còn lại đã tồn tại"
            : invalidEmails.length > 0
            ? "Tất cả email không hợp lệ"
            : "Tất cả email đã tồn tại",
        existingEmails,
        invalidEmails,
      });
    }

    // hashing passwords
    const hashedUsers = await Promise.all(
      newUsers.map(async (user) => {
        const tempPassword = generateRandomPassword();
        const roleRecord = await prisma.roles.findUnique({
          where: { roleType: user.role || "STUDENT" },
        });

        if (!roleRecord) {
          return res.status(400).json({
            message: `user với email: ${user.email} có role không hợp lệ`,
          });
        }

        return {
          name: user.name,
          email: user.email,
          password: await hashPassword(tempPassword),
          roleId: roleRecord.id,
          mustChangePassword: true,
          tempPassword: tempPassword,
          slug: slugify(`${user.name} - ${user.email.slice(0, 8)}`, {
            lower: true,
            strict: true,
          }),
        };
      })
    );

    // Thêm user vào DB
    await prisma.user.createMany({
      data: hashedUsers,
      skipDuplicates: true,
    });

    // Gửi email cho từng user
    for (const user of hashedUsers) {
      await sendEmail(
        user.email,
        "Chào mừng bạn đến với PSTUDY!",
        `Xin chào ${user.name},\n\nCảm ơn bạn đã đăng ký! Dưới đây là thông tin đăng nhập:\n- Email: ${user.email}\n- Mật khẩu: ${user.tempPassword}\n\n📢 Vui lòng đổi mật khẩu ngay lần đầu tiên.\n\nTrân trọng,\nĐội ngũ PSTUDY`,
        `<div style="font-family: Arial, sans-serif;">
          <h2>Chào mừng bạn đến với PSTUDY!</h2>
          <p>Xin chào <strong>${user.name}</strong>,</p>
          <p>Cảm ơn bạn đã đăng ký! Dưới đây là thông tin đăng nhập của bạn:</p>
          <ul>
            <li><strong>Email:</strong> ${user.email}</li>
            <li><strong>Mật khẩu:</strong> ${user.tempPassword}</li>
          </ul>
          <p><a href="https://yourwebsite.com/reset-password">Đổi mật khẩu ngay</a></p>
          <p>Trân trọng,<br><strong>Đội ngũ PSTUDY</strong></p>
        </div>`
      );
    }

    res.status(201).json({
      message: `Đã tạo thành công ${newUsers.length} tài khoản`,
      createdUsers: newUsers.map((user) => user.email),
      existingEmails,
      invalidEmails,
    });
  } catch (error) {
    console.error("Lỗi khi tạo nhiều tài khoản:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = { registerUser, registerMultipleUsers };
