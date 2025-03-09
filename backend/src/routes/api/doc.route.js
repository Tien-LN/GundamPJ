const express = require('express');
const router = express.Router();
const controller = require("../../controllers/api/doc.controller");

router.get("/", controller.index);
module.exports = router;