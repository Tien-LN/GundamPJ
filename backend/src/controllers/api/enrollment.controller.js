const { prisma } = require("../../config/db.js");
const { body, validationResult } = require("express-validator");

// [GET] /api/enrollments
const index = (req, res) => {
  res.send("Đây là api tham gia khóa học");
};

// [POST] /api/enrollments
const createPost = async (req, res) => {
    try {
      const userId = req.user.id;
      const { courseId } = req.body;


      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      req.body.userId = userId;
      const course = await prisma.course.findUnique({ where: { id: courseId } });
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      
      await prisma.enrollment.create({ data: req.body });
      res.send("Đã tạo yêu cầu tham gia thành công");
      // res.status(201).json({ message: "Enrollment request sent" });
    } catch (error) {
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };

// [DELETE] /api/enrollments/:id
const enrollDelete = async (req, res) => {
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
const listApproved = async (req, res) => {
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
const reject = async (req, res) => {
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
const approve = async (req, res) => {
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

// [GET] /api/enrollments/my-account
const getRequestOfUserid = async(req, res) => {
  const userId = req.user.id;
  if(!userId) res.status(403).json({message: "require login!!!!"});

  try{
      const user = await prisma.user.findUnique({
        where: {id : userId}
      });
      if(!user) return res.status(404).json({message: "user not found!"});
      const result = await prisma.enrollment.findMany({
        where: {userId : userId}
      });
      const allCourses = await prisma.course.findMany({
        where: {
          deleted: false,
          
        },
        select: {
          id: true,
          name: true,
          teacher: {
            select: {
              name: true
            }
          }
          
        }
      });
      // res.send(allCourses);
      let MapCourses = {};
      allCourses.forEach((item) => {
        MapCourses[item.id] = {
          name: item.name,
          teacher: item.teacher.name
        }
      });
      let records = [];
      result.forEach((item) => {
        records.push({
            status: item.status,
            courseName: MapCourses[item.courseId].name,
            courseTeacher: MapCourses[item.courseId].teacher
        })
      });
      res.send(records);
  } catch(error) {
    return res.status(500).json({message: "Server Error!"});
  }

}
module.exports = {
  index,
  createPost,
  enrollDelete,
  list,
  listApproved,
  reject,
  approve,
  getRequestOfUserid,
};
