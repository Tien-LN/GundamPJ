const express = require("express");
const router = express.Router();
const examController = require("../../controllers/api/exam.controller");
const {
  verifyUser,
  checkRole,
  checkAccessToCourse,
} = require("../../middleware/authMiddleware");

router.get("/", verifyUser, examController.index);

router.post(
  "/create",
  verifyUser,
  checkRole(["TEACHER", "ADMIN"]), // Kiểm tra vai trò
  checkAccessToCourse, // Kiểm tra quyền truy cập vào khóa học
  examController.createPost
);

router.post(
  "/:id/createQuestion",
  verifyUser,
  checkRole(["TEACHER", "ADMIN"]),
  checkAccessToCourse,
  examController.createQuestion
);

router.get(
  "/:courseId/exams/:examId/questions",
  verifyUser,
  checkAccessToCourse,
  examController.getQuestions
);

router.patch(
  "/:id",
  verifyUser,
  checkRole(["TEACHER", "ADMIN"]),
  checkAccessToCourse,
  examController.changeQuestionPatch
);

module.exports = router;
