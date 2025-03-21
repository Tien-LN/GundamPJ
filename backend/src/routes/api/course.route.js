const express = require("express");
const router = express.Router();
const controller = require("../../controllers/api/course.controller");
const { verifyUser, checkRole } = require("../../middleware/authMiddleware");
const checkAccessToCourse = require("../../middleware/checkAccessToCourse");
const upload = require("../../middleware/upload");

router.get("/", verifyUser, controller.index);

router.get(
  "/getDeleted",
  verifyUser,
  checkRole(["ADMIN"]),
  controller.getCourseDelete
);

router.post("/create", verifyUser, checkRole(["ADMIN"]), controller.createPost);

router.patch("/:id", verifyUser, checkRole(["ADMIN"]), controller.deleteCourse);

router.delete(
  "/delete/permanent/:id",
  verifyUser,
  checkRole(["ADMIN"]),
  controller.deletePerm
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

router.patch(
  "/restore/:id",
  verifyUser,
  checkRole(["ADMIN"]),
  controller.restoreCourse
);

router.post(
  "/:courseId/image",
  verifyUser,
  checkAccessToCourse, // Kiểm tra quyền truy cập vào khóa học
  checkRole(["ADMIN", "TEACHER"]),
  upload.single("file"),
  controller.updateCourseImage
);

// Route tìm kiếm khóa học bằng slug
router.get(
  "/slug/:slug",
  verifyUser,
  checkAccessToCourse, // Kiểm tra quyền truy cập vào khóa học
  controller.getCourseBySlug
);

module.exports = router;
