const express = require("express");
const {
  verifyAdmin,
  verifyUser,
} = require("../../middleware/authMiddleware.js");
const router = express.Router();
const controller = require("../../controllers/api/admin.controller");

// Register
router.post("/register", verifyAdmin, controller.registerUser);

router.post(
  "/register-multiple",
  verifyAdmin,
  controller.registerMultipleUsers
);

module.exports = router;
