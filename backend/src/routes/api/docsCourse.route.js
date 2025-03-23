const express = require('express');
const router = express.Router();

const controller = require("../../controllers/api/docsCourse");
const { verifyUser, checkRole } = require('../../middleware/authMiddleware');
const checkAccessToCourse = require('../../middleware/checkAccessToCourse');

router.post(
    "/:courseId", 
    verifyUser,
    checkAccessToCourse,
    checkRole(["TEACHER"]),
    controller.createPost
);

router.get(
    "/:courseId",
    verifyUser,
    checkAccessToCourse, 
    controller.getDocs
);

router.get(
    "/:courseId/:docsId",
    verifyUser,
    checkAccessToCourse,
    controller.getDoc
)
module.exports = router;