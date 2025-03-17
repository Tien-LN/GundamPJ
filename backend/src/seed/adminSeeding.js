const { prisma } = require("../config/db.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { validateEmail } = require("../utils/emailService.js");

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  const jwtSecret = process.env.JWT_SECRET_KEY;

  // 1. Đảm bảo tồn tại Admin Role
  let adminRole = await prisma.roles.findFirst({
    where: { roleType: "ADMIN" },
  });

  if (!adminRole) {
    adminRole = await prisma.roles.create({
      data: {
        title: "Admin",
        roleType: "ADMIN",
        description: "Quản trị viên hệ thống",
        permissions: ["ALL"],
      },
    });
  }

  // 2. Kiểm tra user tồn tại

  const emailCheck = await validateEmail(adminEmail);
  if (!emailCheck.valid) {
    console.log(emailCheck.message);
    return;
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // 3. Tạo user với đầy đủ trường bắt buộc
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Admin",
        password: hashedPassword,
        status: "active",
        mustChangePassword: true,
        roleId: adminRole.id,
      },
    });
    console.log("✅ Admin created successfully");
  } else {
    console.log("⚠️ Admin already exists");
  }
}

module.exports = seedAdmin;
