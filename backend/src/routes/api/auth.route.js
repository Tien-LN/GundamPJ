const express = require("express");
const router = express.Router();
const controller = require("../../controllers/api/auth.controller");

router.get("/", controller.index);

module.exports = router;