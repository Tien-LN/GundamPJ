const express = require("express");
const router = express.Router();
const { verifyUser } = require("../../middleware/authMiddleware");
const { checkRole } = require("../../middleware/authMiddleware");
const attendanceController = require("../../controllers/api/attendance.controller");

// Điểm danh học viên
router.post(
  "/",
  verifyUser,
  checkRole(["ADMIN", "TEACHER", "ASSISTANT"]),
  attendanceController.markAttendance
);

// Kiểm tra trạng thái điểm danh
router.post("/status", verifyUser, attendanceController.checkAttendanceStatus);

// Lấy danh sách điểm danh theo buổi học
router.get(
  "/lesson/:lessonId",
  verifyUser,
  attendanceController.getAttendanceByLesson
);

// Lấy danh sách điểm danh theo học viên
router.get(
  "/user/:userId",
  verifyUser,
  attendanceController.getAttendanceByUser
);

module.exports = router;
