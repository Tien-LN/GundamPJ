const express = require('express');
const router = express.Router();
const controller = require("../../controllers/api/exam.controller");

router.get("/", controller.index);

router.post("/create", controller.createPost);

router.post("/:id/createQuestion", controller.createQuestion);

router.get("/:id", controller.getQuestions);
module.exports = router;