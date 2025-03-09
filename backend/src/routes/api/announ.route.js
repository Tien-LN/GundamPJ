const express = require('express');
const router = express.Router();
const controller = require("../../controllers/api/announ.controller");

router.get('/', controller.index);

module.exports = router;