const express = require("express");
const router = express.Router();
const { verifyUser, checkRole } = require("../../middleware/authMiddleware");
const cloudinaryController = require("../../controllers/api/cloudinary.controller");

// Tải lên hình ảnh điểm danh
router.post("/upload", verifyUser, cloudinaryController.uploadImage);

// Xác minh hình ảnh điểm danh
router.post(
  "/verify",
  verifyUser,
  checkRole(["ADMIN", "TEACHER", "ASSISTANT"]),
  cloudinaryController.verifyAttendanceImage
);

// Lấy hình ảnh điểm danh
router.get(
  "/attendance/:userId/:lessonId",
  verifyUser,
  cloudinaryController.getAttendanceImage
);

module.exports = router;
