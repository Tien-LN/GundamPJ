const { prisma } = require("../../config/db.js");
const cloudinary = require("../../config/cloudinary.js");

const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        gender: true,
        dateOfBirth: true,
        phone: true,
        address: true,
        role: { select: { roleType: true } },
        status: true,
        avatarUrl: true,
      },
    });

    res.send(users);
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

const getUserBySlug = async (req, res) => {
  try {
    const slug = req.params.slug;
    const user = await prisma.user.findUnique({
      where: { slug },
      select: {
        name: true,
        gender: true,
        role: { select: { title: true } },
      },
    });
    if (!user) return res.status(404).json({ message: "user not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
};

const getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        gender: true,
        dateOfBirth: true,
        address: true,
        role: { select: { title: true } },
        status: true,
        avatarUrl: true,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
};

const updateMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, gender, dateOfBirth, address } = req.body;
    await prisma.user.update({
      where: { id: userId },
      data: { name, phone, gender, dateOfBirth, address },
    });
    res.status(200).json({ message: "user updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
};

const updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "avatar",
          },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          }
        )
        .end(req.file.buffer);
    });

    await prisma.user.update({
      where: { id: req.user.id },
      data: { avatarUrl: result.secure_url },
    });
  } catch (error) {
    return res.status(500).json({ message: "server error" });
  }
};

const softDeleteUser = async (req, res) => {
  try {
    const userIds = req.body.userIds;
    await prisma.user.updateMany({
      where: { id: { in: userIds } },
      data: { deletedAt: new Date() },
    });
    res.status(200).json({ message: "users soft deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
};

const restoreUser = async (req, res) => {
  try {
    const userIds = req.body.userIds;
    await prisma.user.updateMany({
      where: { id: { in: userIds } },
      data: { deletedAt: null },
    });
    res.status(200).json({ message: "users restored successfully" });
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
};

const hardDeleteUser = async (req, res) => {
  try {
    const userIds = req.body.userIds;
    await prisma.user.deleteMany({
      where: { id: { in: userIds } },
    });
    res.status(200).json({ message: "user hard deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
};

// [GET] /api/users/getPermission
const getPermissonUser = async (req, res) => {
  if (!req.user)
    return res.status(404).json({ message: "Không tìm thấy user" });
  // console.log(req.user);
  res.send({
    id: req.user.id,
    name: req.user.name,
    description: req.user.role?.description,
    role: req.user.role?.roleType,
    avatar: req.user.avatarUrl,
  });
};

module.exports = {
  getUsers,
  getMe,
  updateMe,
  updateAvatar,
  getUserBySlug,
  softDeleteUser,
  restoreUser,
  hardDeleteUser,
  getPermissonUser,
};
