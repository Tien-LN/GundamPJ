const express = require("express");
const {
  verifyAdmin,
  verifyUser,
} = require("../../middleware/authMiddleware.js");
const router = express.Router();
const controller = require("../../controllers/api/auth.controller.js");

// login
router.post("/login", controller.login);

// change password
router.post("/change-password", verifyUser, controller.changePassword);

// logout
router.post("/logout", verifyUser, controller.logout);

// refresh token
router.post("/refresh-token", controller.refreshToken);

// check connection
router.get("/check", controller.checkConnection);

module.exports = router;
