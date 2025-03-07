const express = require("express");
const { isAdmin } = require("../middleware/authMiddleware.js");
const {
  registerUser,
  registerMultipleUsers,
  login,
} = require("../controllers/authController.js");

// const { router } = require("../app");

const route = express.Router();

// Register
route.post("/register", isAdmin, registerUser);

route.post("/register-multiple", isAdmin, registerMultipleUsers);

// login
route.post("/login", login);

module.exports = route;
