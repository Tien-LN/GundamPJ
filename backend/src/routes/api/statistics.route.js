const express = require("express");
const router = express.Router();
const statisticsController = require("../../controllers/api/statistics.controller");
const { verifyUser, checkRole } = require("../../middleware/authMiddleware");

// Lấy thống kê của học viên
router.get("/user/:userId", verifyUser, statisticsController.getUserStatistics);

// Lấy thống kê tỷ lệ tham gia và điểm trung bình cho học viên
router.get(
  "/student/:studentId",
  checkRole(["ADMIN", "TEACHER"]),
  statisticsController.getStudentStatistics
);

// Lấy danh sách học viên trong khóa học
router.get(
  "/course/:courseId/students",
  verifyUser,
  statisticsController.getCourseStudents
);

// Điểm danh học viên
router.post(
  "/attendance",
  verifyUser,
  checkRole(["ADMIN", "TEACHER"]),
  statisticsController.markAttendance
);

// Lấy danh sách điểm danh theo buổi học
router.get(
  "/lesson/:lessonId/attendance",
  verifyUser,
  statisticsController.getLessonAttendance
);

module.exports = router;
