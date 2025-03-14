const express = require("express");
const {
  verifyAdmin,
  verifyUser,
} = require("../../middleware/authMiddleware.js");
const {
  upload,
  exactUsersFromExcel,
} = require("../../middleware/exactUsersFromExcel.js");
const router = express.Router();
const controller = require("../../controllers/api/admin.controller");

// Register
router.post("/register", verifyAdmin, controller.registerUser);

router.post(
  "/register-multiple",
  verifyAdmin,
  controller.registerMultipleUsers
);

router.post(
  "/excel-register",
  verifyAdmin,
  upload.single("file"),
  exactUsersFromExcel,
  controller.registerMultipleUsers
);

module.exports = router;
