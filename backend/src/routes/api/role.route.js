const express = require('express');
const router = express.Router();
const controller = require("../../controllers/api/role.controller");

router.get("/", controller.index);

router.post("/create", controller.createPost);

router.delete("/:id", controller.roleDelete);

router.patch("/:id", controller.rolePatch);
module.exports = router;