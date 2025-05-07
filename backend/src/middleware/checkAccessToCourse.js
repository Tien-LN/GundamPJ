const { prisma } = require("../config/db.js");

const checkAccessToCourse = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role.roleType; // Lấy vai trò của người dùng từ req.user
    const courseId =
      req.params.courseId || req.params.id || req.body.courseId || null;
    const courseSlug = req.params.slug || null;

    // Tìm khóa học dựa trên id hoặc slug
    let course;
    if (courseId) {
      course = await prisma.course.findUnique({
        where: {
          id: courseId,
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          startDate: true,
          endDate: true,
          imageUrl: true,
          teacher: { select: { id: true, name: true } },
        },
      });
    } else if (courseSlug) {
      course = await prisma.course.findFirst({
        where: {
          slug: courseSlug,
        },
        select: {
          id: true,
          name: true,
          description: true,
          price: true,
          startDate: true,
          endDate: true,
          imageUrl: true,
          teacher: { select: { id: true, name: true } },
        },
      });
    }

    if (!course) {
      return res.status(404).json({ message: "Khóa học không tồn tại" });
    }

    // Nếu người dùng là admin, cho phép truy cập
    if (userRole === "ADMIN") {
      req.course = course;
      return next();
    }

    if (userRole == "STUDENT") {
      // Khóa học đã được tìm thấy ở trên
      const enrollment = await prisma.enrollment.findFirst({
        where: {
          userId: userId,
          courseId: courseId,
          status: "APPROVED",
          deleted: false,
        },
      });

      if (!enrollment) {
        return res.status(403).json({
          message: "Access denied: You are not enrolled in this course.",
        });
      }

      req.course = course;
      next();
    } else {
      // Giáo viên chỉ có thể truy cập khóa học mà họ dạy
      if (course.teacher?.id !== userId) {
        return res.status(403).json({
          message: "Access denied: You are not the teacher of this course.",
        });
      }

      req.course = course;
      next();
    }
  } catch (error) {
    console.error("Error checking course access:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = checkAccessToCourse;
