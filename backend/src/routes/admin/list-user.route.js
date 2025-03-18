const express = require("express");

const router = express.Router();
const controller = require("../../controllers/admin/list-user.controller");

router.get("/", controller.index);

module.exports = router;