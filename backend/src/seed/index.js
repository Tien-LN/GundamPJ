const seedRoles = require("./roleSeeding");
const seedAdmin = require("./adminSeeding");

async function main() {
  await seedRoles();
  await seedAdmin();
}

main()
  .catch((e) => {
    console.error("❌ Seeding error: ", e);
  })
  .finally(async () => {
    process.exit();
  });
