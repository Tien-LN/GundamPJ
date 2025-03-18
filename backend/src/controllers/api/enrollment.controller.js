const { prisma } = require("../../config/db.js");
const { body, validationResult } = require("express-validator");

// [GET] /api/enrollments
module.exports.index = (req, res) => {
  res.send("Đây là api tham gia khóa học");
};

// [POST] /api/enrollments
module.exports.createPost = [
  // Kiểm tra đầu vào
  body("userId").isUUID().withMessage("Invalid userId"),
  body("courseId").isUUID().withMessage("Invalid courseId"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { userId, courseId } = req.body;

      const user = await prisma.user.findFirst({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const course = await prisma.course.findFirst({ where: { id: courseId } });
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }

      await prisma.enrollment.create({ data: req.body });
      res.status(201).json({ message: "Enrollment request sent" });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientInitializationError) {
        return res.status(500).json({ message: "Database connection error" });
      }
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
];

// [DELETE] /api/enrollments/:id
module.exports.enrollDelete = async (req, res) => {
  try {
    const id = req.params.id;

    await prisma.enrollment.update({
      where: { id: id },
      data: {
        deleted: true,
      },
    });
    // Gửi lên FrontEnd Tình trạng
    res.send("Đã xóa thành công");
  } catch (error) {
    //Gửi lỗi lên Frontend

    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Enrollment not found!" });
    }

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// [GET] /api/enrollments/list/:id
const list = async (req, res) => {
  try {
    const id = req.params.id;

    const enrolls = await prisma.enrollment.findMany({
      where: {
        courseId: id,
        status: "PENDING",
        deleted: false, // Kiểm tra trạng thái deleted
      },
    });
    res.send(enrolls);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// [GET] /api/enrollments/listApproved
module.exports.listApproved = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user.id;
    const userRole = req.user.role.roleType;

    // Kiểm tra quyền truy cập
    if (userRole !== "ADMIN") {
      const isEnrolled = await prisma.enrollment.findFirst({
        where: {
          courseId: courseId,
          userId: userId,
          status: "APPROVED",
          deleted: false,
        },
      });

      if (!isEnrolled) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    const enrolls = await prisma.enrollment.findMany({
      where: {
        courseId: courseId,
        status: "APPROVED",
        deleted: false,
      },
    });
    res.json(enrolls);
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// [PATCH] /api/enrollments/reject/:id
module.exports.reject = async (req, res) => {
  try {
    const id = req.params.id;

    await prisma.enrollment.update({
      where: { id: id },
      data: {
        status: "REJECTED",
      },
    });
    // Gửi lên FrontEnd Tình trạng
    res.send("Đã từ chối tham gia thành công");
  } catch (error) {
    //Gửi lỗi lên Frontend

    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Enrollment not found!" });
    }

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// [PATCH] /api/enrollments/approve/:id
module.exports.approve = async (req, res) => {
  try {
    const id = req.params.id;

    await prisma.enrollment.update({
      where: { id: id },
      data: {
        status: "APPROVED",
      },
    });
    // Gửi lên FrontEnd Tình trạng
    res.send("Đã chấp nhận tham gia thành công");
  } catch (error) {
    //Gửi lỗi lên Frontend

    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Enrollment not found!" });
    }

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports.list = list;
