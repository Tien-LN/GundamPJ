const express = require('express');
const router = express.Router();
const controller = require("../../controllers/api/exam.controller");

router.get("/", controller.index);
module.exports = router;