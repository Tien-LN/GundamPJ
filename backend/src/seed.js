const { prisma } = require("./config/db.js");
const bcrypt = require("bcrypt");

// Tạo Super Admin
async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  console.log(adminEmail);

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });
  console.log(existingAdmin);

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Admin",
        password: hashedPassword,
        role: "ADMIN",
      },
    });
    console.log("✅ Admin created successfully");
  } else {
    console.log("⚠️ Admin user already exist");
  }
}

main()
  .catch((error) => {
    console.log("❌Seeding error: ", error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
