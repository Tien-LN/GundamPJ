const { prisma } = require("../../config/db");

// [GET] /api/admin/list-user
const index = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                name: true,
                email: true,
                phone: true,
                gender: true
            }
        })
        res.json(users);
    } catch (error) {
        return res.status(500).json({ message: "Server Internal Error" });
    }
}

module.exports = {
    index
}