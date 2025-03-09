const express = require("express");
const { verifyAdmin, verifyUser } = require("../middleware/authMiddleware.js");
const {
  registerUser,
  registerMultipleUsers,
  login,
} = require("../controllers/authController.js");

// const { router } = require("../app");

const route = express.Router();

// Register
route.post("/register", verifyAdmin, registerUser);

route.post("/register-multiple", verifyAdmin, registerMultipleUsers);

// login
route.post("/login", login);

module.exports = route;
