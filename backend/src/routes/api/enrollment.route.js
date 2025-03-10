const express = require('express');
const router = express.Router();
const controller = require("../../controllers/api/enrollment.controller");

router.get("/", controller.index);

router.post("/", controller.createPost);

router.delete("/:id", controller.enrollDelete);

router.get("/list/:id", controller.list);

router.get("/listApproved/:id", controller.listApproved);

router.patch("/reject/:id", controller.reject);

router.patch("/approve/:id", controller.approve);



module.exports = router;