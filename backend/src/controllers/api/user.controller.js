const { prisma } = require("../../config/db.js");

// get all users
// [GET] /api/users 
module.exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
};

