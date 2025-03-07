// use for DB testing
const { prisma } = require("./config/db.js");

const seedDatabase = async () => {
  try {
    await prisma.user.createMany({
      data: [
        {
          email: "test1@example.com",
          name: "User One",
          password: "hashed_password",
        },
        {
          email: "test2@example.com",
          name: "User Two",
          password: "hashed_password",
        },
      ],
    });
    console.log("Seed data inserted successfully.");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
};

seedDatabase();
