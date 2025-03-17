const express = require("express");
const router = express.Router();
const controller = require("../../controllers/api/enrollment.controller");
const { verifyUser, checkRole } = require("../../middleware/authMiddleware");

router.get("/", verifyUser, checkRole(["ADMIN", "TEACHER"]), controller.index);

router.post("/", verifyUser, controller.createPost);

router.delete(
  "/:id",
  verifyUser,
  checkRole(["ADMIN", "TEACHER"]),
  controller.enrollDelete
);

router.get(
  "/list/:id",
  verifyUser,
  checkRole(["ADMIN", "TEACHER"]),
  controller.list
);

router.get(
  "/listApproved/:id",
  verifyUser,
  checkRole(["ADMIN", "TEACHER"]),
  controller.listApproved
);

router.patch(
  "/reject/:id",
  verifyUser,
  checkRole(["ADMIN", "TEACHER"]),
  controller.reject
);

router.patch(
  "/approve/:id",
  verifyUser,
  checkRole(["ADMIN", "TEACHER"]),
  controller.approve
);

module.exports = router;
