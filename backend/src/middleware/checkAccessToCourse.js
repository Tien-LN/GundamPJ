const { prisma } = require("../config/db.js");

const checkAccessToCourse = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const courseId = req.params.courseId || req.body.courseId;

    // Kiểm tra xem người dùng có đăng ký khóa học với trạng thái APPROVED hay không
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

    next();
  } catch (error) {
    console.error("Error checking course access:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = checkAccessToCourse;
