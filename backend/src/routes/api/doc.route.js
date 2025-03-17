const express = require("express");
const router = express.Router();
const controller = require("../../controllers/api/doc.controller");
const { verifyUser, checkRole } = require("../../middleware/authMiddleware");

router.get("/", verifyUser, controller.index);

router.post(
  "/create",
  verifyUser,
  checkRole(["TEACHER", "ADMIN"]),
  controller.createPost
);

module.exports = router;
