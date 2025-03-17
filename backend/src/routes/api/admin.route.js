const express = require("express");
const {
  upload,
  exactUsersFromExcel,
} = require("../../middleware/exactUsersFromExcel.js");
const { verifyUser, checkRole } = require("../../middleware/authMiddleware.js");
const router = express.Router();
const controller = require("../../controllers/api/admin.controller");

// Register
router.post(
  "/register",
  verifyUser,
  checkRole(["ADMIN"]),
  controller.registerUser
);

router.post(
  "/register-multiple",
  verifyUser,
  checkRole(["ADMIN"]),
  controller.registerMultipleUsers
);

router.post(
  "/excel-register",
  verifyUser,
  checkRole(["ADMIN"]),
  upload.single("file"),
  exactUsersFromExcel,
  controller.registerMultipleUsers
);

module.exports = router;
