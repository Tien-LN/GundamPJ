const express = require("express");
const router = express.Router();
const lessonController = require("../../controllers/api/lesson.controller");
const { verifyUser, checkRole } = require("../../middleware/authMiddleware");
const checkAccessToCourse = require("../../middleware/checkAccessToCourse");

// Tạo buổi học mới
router.post(
  "/:courseId/lessons/create",
  verifyUser,
  checkRole(["TEACHER", "ADMIN"]),
  checkAccessToCourse,
  lessonController.createLesson
);

// Cập nhật buổi học
router.patch(
  "/:courseId/lessons/:lessonId",
  verifyUser,
  checkRole(["TEACHER", "ADMIN"]),
  checkAccessToCourse,
  lessonController.updateLesson
);

// Xóa mềm một hoặc nhiều buổi học
router.delete(
  "/:courseId/lessons",
  verifyUser,
  checkRole(["TEACHER", "ADMIN"]),
  checkAccessToCourse,
  lessonController.softDeleteLessons
);

// Khôi phục một hoặc nhiều buổi học
router.patch(
  "/:courseId/lessons/restore",
  verifyUser,
  checkRole(["TEACHER", "ADMIN"]),
  checkAccessToCourse,
  lessonController.restoreLessons
);

// Xóa vĩnh viễn một hoặc nhiều buổi học
router.delete(
  "/:courseId/lessons/hard-delete",
  verifyUser,
  checkRole(["TEACHER", "ADMIN"]),
  checkAccessToCourse,
  lessonController.hardDeleteLessons
);

// Lấy danh sách buổi học (bao gồm cả buổi học đã xóa mềm nếu cần)
router.get(
  "/:courseId/lessons",
  verifyUser,
  checkAccessToCourse,
  lessonController.getLessons
);

// Học viên xem thông tin chi tiết của một buổi học
router.get(
  "/:courseId/lessons/:lessonId",
  verifyUser,
  lessonController.getLessonDetails
);

module.exports = router;
