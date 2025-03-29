const express = require("express");
const router = express.Router();
const statisticsController = require("../../controllers/api/statistics.controller");
const { verifyUser, checkRole } = require("../../middleware/authMiddleware");

// Lấy thống kê của học viên
router.get(
  "/user/:userId",
  verifyUser,
  checkRole(["ADMIN", "TEACHER"]),
  statisticsController.getUserStatistics
);

// Lấy thống kê tỷ lệ tham gia và điểm trung bình cho học viên
router.get(
  "/student/:studentId",
  verifyUser,
  statisticsController.getStudentStatistics
);

// Lấy danh sách học viên trong khóa học
router.get(
  "/course/:courseId/students",
  verifyUser,
  checkRole(["ADMIN", "TEACHER"]),
  statisticsController.getCourseStudents
);

// Điểm danh học viên
router.post(
  "/attendance",
  verifyUser,
  checkRole(["ADMIN", "TEACHER"]),
  statisticsController.markAttendance
);

module.exports = router;
