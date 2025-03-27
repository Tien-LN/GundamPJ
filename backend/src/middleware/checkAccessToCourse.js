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

    if(userRole == "STUDENT"){
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
      // return res.send("OKK");
      // return res.send(courseId);
      const course = await prisma.course.findFirst({
        where: {
          teacherId: userId,
          id: courseId,
          deleted: false,
        },
      });
      
      if (!course) {
        return res.status(403).json({
          message: "Course not found!!!",
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
