const express = require("express");
const router = express.Router();
const controller = require("../../controllers/api/exam.controller");
const { verifyUser, checkRole } = require("../../middleware/authMiddleware");

router.get("/", verifyUser, controller.index);

router.post(
  "/create",
  verifyUser,
  checkRole(["TEACHER", "ADMIN"]),
  controller.createPost
);

router.post(
  "/:id/createQuestion",
  verifyUser,
  checkRole(["TEACHER", "ADMIN"]),
  controller.createQuestion
);

router.get("/:id", verifyUser, controller.getQuestions);

router.patch(
  "/:id",
  verifyUser,
  checkRole(["TEACHER", "ADMIN"]),
  controller.changeQuestionPatch
);

module.exports = router;
