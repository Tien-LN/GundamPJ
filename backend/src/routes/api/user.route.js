const express = require("express");
const router = express.Router();
const controller = require("../../controllers/api/user.controller");

router.get("/", controller.getUsers);

router.post("/create", controller.createPost);

router.delete("/:id", controller.userDelete);

router.patch("/lock/:id", controller.userLock);

router.patch("/unlock/:id", controller.userUnLock);

router.patch("/:id", controller.userUpdate);

module.exports = router;
