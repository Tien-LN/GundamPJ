const { prisma } = require("../../config/db");

// Tạo buổi học mới
const createLesson = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { date, title, description } = req.body;

    const lesson = await prisma.lesson.create({
      data: {
        courseId,
        date: new Date(date),
        title,
        description,
      },
    });

    res.status(201).json({ message: "Lesson created successfully", lesson });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Cập nhật buổi học
const updateLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const { date, title, description } = req.body;

    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: { date: new Date(date), title, description },
    });

    res.status(200).json({ message: "Lesson updated successfully", lesson });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Xóa mềm một hoặc nhiều buổi học
const softDeleteLessons = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lessonIds } = req.body;

    await prisma.lesson.updateMany({
      where: {
        id: { in: lessonIds },
        courseId,
      },
      data: { deleted: true },
    });

    res.status(200).json({ message: "Lessons soft deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Khôi phục một hoặc nhiều buổi học
const restoreLessons = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lessonIds } = req.body;

    await prisma.lesson.updateMany({
      where: {
        id: { in: lessonIds },
        courseId,
      },
      data: { deleted: false },
    });

    res.status(200).json({ message: "Lessons restored successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Xóa vĩnh viễn một hoặc nhiều buổi học
const hardDeleteLessons = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { lessonIds } = req.body;

    await prisma.lesson.deleteMany({
      where: {
        id: { in: lessonIds },
        courseId,
      },
    });

    res.status(200).json({ message: "Lessons hard deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Lấy danh sách buổi học
const getLessons = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userRole = req.user.role.roleType; // Lấy vai trò của người dùng từ token (đã được giải mã)

    // Nếu là Admin hoặc Teacher, có thể xem cả buổi học đã bị xóa
    const includeDeleted = userRole === "ADMIN" || userRole === "TEACHER";

    // Truy vấn danh sách buổi học
    const lessons = await prisma.lesson.findMany({
      where: {
        courseId,
        deleted: includeDeleted ? undefined : false, // Nếu không phải Admin/Teacher, chỉ lấy buổi học chưa bị xóa
      },
      orderBy: {
        date: "asc", // Sắp xếp theo ngày
      },
    });

    res.status(200).json(lessons);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Lấy thông tin chi tiết của một buổi học
const getLessonDetails = async (req, res) => {
  try {
    const { lessonId, courseId } = req.params;

    const lesson = await prisma.lesson.findFirst({
      where: { id: lessonId, courseId, deleted: false },
    });

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found or deleted" });
    }

    res.status(200).json(lesson);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = {
  createLesson,
  updateLesson,
  softDeleteLessons,
  restoreLessons,
  hardDeleteLessons,
  getLessons,
  getLessonDetails,
};
