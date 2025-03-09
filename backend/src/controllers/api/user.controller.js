const { prisma } = require("../../config/db.js");

// ---- ADMIN side ---- //
// get all users
// [GET] /api/users 
const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
};

module.exports = { getUsers };
