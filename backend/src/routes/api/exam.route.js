const express = require("express");
const router = express.Router();
const examController = require("../../controllers/api/exam.controller");
const { verifyUser, checkRole } = require("../../middleware/authMiddleware");
const checkAccessToCourse = require("../../middleware/checkAccessToCourse");

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

// Add new route for the URL format used in frontend
router.post(
  "/:courseId/exams/:examId/createQuestion",
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

router.delete(
  "/:courseId/exams/:examId/:questionId",
  verifyUser,
  checkRole(["TEACHER", "ADMIN"]),
  checkAccessToCourse,
  examController.deleteQuestion
);

router.delete(
  "/:courseId/exams/:examId",
  verifyUser,
  checkRole(["TEACHER", "ADMIN"]),
  checkAccessToCourse,
  examController.deleteExam
);
module.exports = router;
