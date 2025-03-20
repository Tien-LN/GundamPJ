const { prisma } = require("../config/db.js");

const checkAccessToCourse = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role.roleType; // Lấy vai trò của người dùng từ req.user
    const courseId = req.params.courseId || req.body.courseId || null;
    const courseSlug = req.params.slug || null;

    // Nếu người dùng là admin, cho phép truy cập
    if (userRole === "ADMIN") {
      return next();
    }

    // Tìm khóa học dựa trên id hoặc slug
    const course = await prisma.course.findFirst({
      where: {
        OR: [{ id: courseId }, { slug: courseSlug }],
      },
      select: {
        id: true,
      },
    });

    if (!course) {
      return res.status(404).json({ message: "Khóa học không tồn tại" });
    }

    // Kiểm tra xem người dùng có đăng ký khóa học với trạng thái APPROVED hay không
    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: userId,
        courseId: course.id,
        status: "APPROVED",
        deleted: false,
      },
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "Access denied: You are not enrolled in this course.",
      });
    }

    next();
  } catch (error) {
    console.error("Error checking course access:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = checkAccessToCourse;
