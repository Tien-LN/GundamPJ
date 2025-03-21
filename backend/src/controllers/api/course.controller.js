const { prisma } = require("../../config/db.js");
const { parseDate } = require("../../utils/dateFormat.js");
const cloudinary = require("../../config/cloudinary.js");

const index = async (req, res) => {
  const courses = await prisma.course.findMany({
    where: { deleted: false },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      startDate: true,
      endDate: true,
      deleted: true,
      imageUrl: true,
      teacher: { select: { name: true } },
    },
  });
  res.send(courses);
};

const getCourseDelete = async (req, res) => {
  const courses = await prisma.course.findMany({
    where: { deleted: true },
    select: {
      id: true,
      name: true,
      description: true,
      price: true,
      startDate: true,
      endDate: true,
      deleted: false,
      imageUrl: true,
      teacher: { select: { name: true } },
    },
  });
  res.send(courses);
};

const createPost = async (req, res) => {
  if (!req.body.teacherId || !req.body.startDate || !req.body.endDate) {
    return res.status(400).json({ message: "Bad request" });
  }

  if (req.body.enrollments && req.body.enrollments.length == 0)
    delete req.body.enrollments;
  if (req.body.exams && req.body.exams.length == 0) delete req.body.exams;

  const result = await prisma.course.create({
    data: req.body,
  });
  res.send(result);
};

const deleteCourse = async (req, res) => {
  try {
    const id = req.params.id;

    await prisma.course.update({
      where: { id: id },
      data: {
        deleted: true,
      },
    });
    res.send("Đã xóa thành công");
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Course not found!" });
    }

    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const deletePerm = async (req, res) => {
  try {
    const id = req.params.id;

    await prisma.course.delete({
      where: {
        id: id,
        deleted: true,
      },
    });
    res.send("Đã xóa vĩnh viễn thành công");
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Course not found!" });
    }

    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const coursePatch = async (req, res) => {
  try {
    const id = req.params.id;

    if (req.body.enrollments && req.body.enrollments.length == 0)
      delete req.body.enrollments;
    if (req.body.exams && req.body.exams.length == 0) delete req.body.exams;

    await prisma.course.update({
      where: {
        id: id,
        deleted: false,
      },
      data: req.body,
    });
    res.send("Đã sửa thành công!");
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Course not found!" });
    }

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const enrollGet = async (req, res) => {
  try {
    const id = req.params.id;
    const course = await prisma.course.findUnique({
      where: {
        id: id,
        deleted: false,
      },
      include: {
        enrollments: {
          where: {
            status: "APPROVED",
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!course) {
      return res.status(404).json({ message: "course not found!" });
    }
    var users = course.enrollments.map((enrollment) => enrollment.user);
    res.send(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const docCreatePost = async (req, res) => {
  try {
    const courseId = req.params.id;

    const courseExist = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!courseExist) {
      res.send("khóa học không tồn tại");
    } else {
      req.body.courseId = courseId;
      await prisma.doc.create({
        data: req.body,
      });
      res.send("Đã thêm bài giảng");
    }
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

const restoreCourse = async (req, res) => {
  try {
    const id = req.params.id;

    await prisma.course.update({
      where: {
        id: id,
        deleted: true,
      },
      data: {
        deleted: false,
      },
    });
    res.send("Đã khôi phục thành công");
  } catch (error) {
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ success: false, message: "Course not found!" });
    }

    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const updateCourseImage = async (req, res) => {
  try {
    const courseId = req.params.courseId;
    // console.log(courseId);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "courses" }, (error, cloudinaryResult) => {
          if (error) reject(error);
          else resolve(cloudinaryResult);
        })
        .end(req.file.buffer);
    });

    await prisma.course.update({
      where: { id: courseId },
      data: { imageUrl: result.secure_url },
    });

    res.status(200).json({
      message: "Course image updated successfully",
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.error("Error updating course image:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const getCourseBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // Tìm khóa học dựa trên slug
    const course = await prisma.course.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        description: true,
        startDate: true,
        endDate: true,
        imageUrl: true,
        teacher: { select: { name: true } },
      },
    });

    if (!course) {
      return res.status(404).json({ message: "Khóa học không tồn tại" });
    }

    res.status(200).json({ course });
  } catch (error) {
    console.error("Lỗi khi tìm kiếm khóa học:", error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

module.exports = {
  index,
  getCourseDelete,
  createPost,
  deleteCourse,
  deletePerm,
  coursePatch,
  enrollGet,
  docCreatePost,
  restoreCourse,
  updateCourseImage,
  getCourseBySlug,
};
