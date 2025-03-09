const express = require('express');
const router = express.Router();
const controller = require('../../controllers/api/course.controller');

router.get("/", controller.index);

router.post("/create", controller.createPost);

router.delete("/:id", controller.deleteCourse);

router.patch("/:id", controller.coursePatch);

router.get("/:id/enrollments", controller.enrollGet);
module.exports = router;