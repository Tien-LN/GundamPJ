const express = require("express");
const router = express.Router();
const controller = require("../../controllers/api/announ.controller");
const validateContent = require("../../middleware/validateContent");
const { verifyUser, checkRole } = require("../../middleware/authMiddleware");

router.get(
  "/",
  verifyUser,
  checkRole(["ADMIN", "TEACHER", "STUDENT"]),
  controller.getAllAnnouncements
);

router.get(
  "/:id",
  verifyUser,
  checkRole(["ADMIN", "TEACHER", "STUDENT"]),
  controller.getOneAnnouncement
);

router.post(
  "/create",
  verifyUser,
  checkRole(["ADMIN", "TEACHER"]),
  validateContent,
  controller.createAnnouncement
);

router.delete(
  "/:id",
  verifyUser,
  checkRole(["ADMIN"]),
  controller.deleteAnnouncement
);

router.patch(
  "/:id",
  verifyUser,
  checkRole(["ADMIN", "TEACHER"]),
  validateContent,
  controller.updateAnnouncement
);

module.exports = router;
