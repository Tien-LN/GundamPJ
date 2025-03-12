const { prisma } = require("../config/db.js");

async function seedRole() {
  const roles = [
    {
      title: "Admin",
      roleType: "ADMIN",
      description: "Quản trị viên",
      permissions: ["ALL"],
    },
    {
      title: "Teacher",
      roleType: "TEACHER",
      description: "Giáo viên",
      permissions: ["CREATE_EXAM", "GRADE"],
    },
    {
      title: "Assistant",
      roleType: "ASSISTANT",
      description: "Trợ giảng",
      permissions: ["VIEW_GRADES"],
    },
    {
      title: "Student",
      roleType: "STUDENT",
      description: "Học sinh",
      permissions: ["TAKE_EXAM"],
    },
  ];

  for (const role of roles) {
    await prisma.roles.upsert({
      where: { title: role.title }, // kiểm tra tồn tại
      update: {}, // nếu có rồi thì không làm gì
      create: role, // nếu chưa thì tạo mới
    });
  }
  console.log("✅ Roles seeded successfully!");
}

module.exports = seedRole;
