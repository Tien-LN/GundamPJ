const express = require("express");
const { isAdmin } = require("../middleware/authMiddleware.js");
const {
  registerUser,
  registerMultipleUsers,
} = require("../controllers/authController.js");

const { router } = require("../app");

const route = express.Router();

// Register
route.post("/register", isAdmin);

route.post("/register-multiple", isAdmin);

// login
// route.post("/login");

module.exports = route;
