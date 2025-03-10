const express = require("express");
const router = express.Router();
const controller = require("../../controllers/api/statistics.controller");

router.get("/", controller.index);

module.exports = router;
