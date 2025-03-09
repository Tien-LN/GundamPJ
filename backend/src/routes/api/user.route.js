const express = require("express");
const router = express.Router();
const controller = require("../../controllers/api/user.controller");

router.get("/", controller.getUsers);

module.exports = router;
