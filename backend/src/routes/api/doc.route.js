const express = require("express");
const router = express.Router();
const docController = require("../../controllers/api/doc.controller");
const { verifyUser, checkRole } = require("../../middleware/authMiddleware");
const upload = require("../../middleware/upload");
const checkAccessToCourse = require("../../middleware/checkAccessToCourse");

router.get(
  "/:courseId/docs",
  verifyUser,
  checkAccessToCourse,
  docController.getDocs
);
router.post(
  "/:courseId/docs/read",
  verifyUser,
  checkAccessToCourse,
  docController.readDoc
);

router.post(
  "/create",
  verifyUser,
  checkRole(["TEACHER", "ADMIN"]),
  upload.single("file"),
  docController.uploadDoc
);

router.get("/:id", verifyUser, docController.readDoc);

// router.patch(
//   "/soft-delete/:id",
//   checkRole(["TEACHER", "ADMIN"]),
//   docController.softDeleteDoc
// );

// router.delete(
//   "/hard-delete/:id",
//   checkRole(["ADMIN"]),
//   docController.hardDeleteDoc
// );

module.exports = router;
