const express = require("express");
const router = express.Router();
const controller = require("../../controllers/api/announ.controller");
const validateContent = require("../../middleware/validateContent");
const checkAccessToCourse = require("../../middleware/checkAccessToCourse");

const { verifyUser, checkRole } = require("../../middleware/authMiddleware");

// Lấy tất cả thông báo của một khóa học (chỉ cho phép người đã đăng ký khóa học)
router.get(
  "/:courseId",
  verifyUser,
  checkAccessToCourse, // Kiểm tra quyền truy cập vào khóa học
  checkRole(["ADMIN", "TEACHER", "STUDENT"]),
  controller.getAllAnnouncements
);

// Lấy một thông báo cụ thể (chỉ cho phép người đã đăng ký khóa học)
router.get(
  "/:courseId/:id",
  verifyUser,
  checkAccessToCourse, // Kiểm tra quyền truy cập vào khóa học
  checkRole(["ADMIN", "TEACHER", "STUDENT"]),
  controller.getOneAnnouncement
);

// Tạo thông báo mới (chỉ giáo viên hoặc admin của khóa học được phép)
router.post(
  "/:courseId/create",
  verifyUser,
  checkAccessToCourse, // Kiểm tra quyền truy cập vào khóa học
  checkRole(["ADMIN", "TEACHER"]),
  validateContent,
  controller.createAnnouncement
);

// Xóa thông báo (chỉ admin được phép)
router.delete(
  "/:courseId/:id",
  verifyUser,
  checkAccessToCourse, // Kiểm tra quyền truy cập vào khóa học
  checkRole(["ADMIN"]),
  controller.deleteAnnouncement
);

// Cập nhật thông báo (chỉ giáo viên hoặc admin của khóa học được phép)
router.patch(
  "/:courseId/:id",
  verifyUser,
  checkAccessToCourse, // Kiểm tra quyền truy cập vào khóa học
  checkRole(["ADMIN", "TEACHER"]),
  validateContent,
  controller.updateAnnouncement
);

module.exports = router;
