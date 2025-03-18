const express = require("express");
const router = express.Router();
const controller = require("../../controllers/api/course.controller");
const { verifyUser, checkRole } = require("../../middleware/authMiddleware");
const checkAccessToCourse = require("../../middleware/checkAccessToCourse");

router.get("/", verifyUser, controller.index);

router.post("/create", verifyUser, checkRole(["ADMIN"]), controller.createPost);

router.delete(
  "/:id",
  verifyUser,
  checkRole(["ADMIN"]),
  controller.deleteCourse
);

router.patch("/:id", verifyUser, checkRole(["ADMIN"]), controller.coursePatch);

router.get(
  "/:id/enrollments",
  verifyUser,
  checkAccessToCourse, // Kiểm tra quyền truy cập vào khóa học
  controller.enrollGet
);

router.post(
  "/:id/doc/create",
  verifyUser,
  checkAccessToCourse, // Kiểm tra quyền truy cập vào khóa học
  checkRole(["TEACHER", "ADMIN"]),
  controller.docCreatePost
);

module.exports = router;
