const express = require("express");
const router = express.Router();
const docController = require("../../controllers/api/doc.controller");
const {
  verifyUser,
  checkAccessToCourse,
} = require("../../middleware/authMiddleware");
const upload = require("../../middleware/upload");

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

<<<<<<< HEAD
router.post(
  "/create",
  verifyUser,
  checkRole(["TEACHER", "ADMIN"]),
  upload.single("file"),
  docController.uploadDoc
);

router.get("/:id", verifyUser, docController.readDoc);

router.patch(
  "/soft-delete/:id",
  checkRole(["TEACHER", "ADMIN"]),
  docController.softDeleteDoc
);

router.delete(
  "/hard-delete/:id",
  checkRole(["ADMIN"]),
  docController.hardDeleteDoc
);
=======
// router.post(
//   "/create",
//   verifyUser,
//   checkRole(["TEACHER", "ADMIN"]),
//   controller.createPost
// );
>>>>>>> 1e6b54dc1383ca39d185ae5afdcb678e65b35f75

module.exports = router;
