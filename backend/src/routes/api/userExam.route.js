const express = require('express');
const router = express.Router();

const controller = require('../../controllers/api/userExam.controller');

const { verifyUser, checkRole } = require("../../middleware/authMiddleware.js");
const checkAccessToCourse = require("../../middleware/checkAccessToCourse");

router.get("/", controller.index);

router.post(
    "/:examId",
    verifyUser,
    checkAccessToCourse,
    controller.sendExam
)
module.exports = router;