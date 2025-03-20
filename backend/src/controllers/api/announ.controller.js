const { prisma } = require("../../config/db.js");

// [GET] /api/announcements
const getAllAnnouncements = async (req, res) => {
  try {
    const { courseId } = req.query; // Lấy courseId từ query string

    const announcements = await prisma.announcement.findMany({
      where: {
        deleted: false, // Chỉ lấy các thông báo chưa bị xóa
        ...(courseId && { courseIds: { has: courseId } }), // Lọc theo courseId nếu có
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        courseIds: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    res.json(announcements);
  } catch (error) {
    res.status(500).json({ error: "SERVER ERROR!!!" });
  }
};

// [GET] /api/announements/:id

const getOneAnnouncement = async (req, res) => {
  try {
    const id = req.params.id;
    const announcement = await prisma.announcement.findUnique({
      where: {
        id: id,
        deleted: false,
      },
    });

    res.json(announcement);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Announcement not found!" });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// [POST] /api/announcements/create
const createAnnouncement = async (req, res) => {
  // console.log(req.body);
  try {
    // const { title, content, authorId, courseIds, roleVisibility } = req.body;

    if(!req.body.roleVisibility) delete req.body.roleVisibility;

    await prisma.announcement.create({
      data: req.body
    });

    res.send("Create Announcement Successfully");
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// [DELETE] /api/announcements/:id
const deleteAnnouncement = async (req, res) => {
  try {
    const id = req.params.id;

    await prisma.announcement.update({
      where: {
        id: id,
      },
      data: {
        deleted: true,
      },
    });

    res.send("Delete Announcement Successfully");
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Announcement not found!" });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// [PATCH] /api/announcements/:id
const updateAnnouncement = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, content, courseIds } = req.body;

    await prisma.announcement.update({
      where: {
        id: id,
        deleted: false,
      },
      data: {
        title,
        content,
        courseIds, // Update the courseIds array
      },
    });

    res.send("Update Announcement Successfully");
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Announcement not found!" });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getAllAnnouncements,
  getOneAnnouncement,
  createAnnouncement,
  deleteAnnouncement,
  updateAnnouncement,
};
