const express = require("express");
const router = express.Router();
const controller = require("../../controllers/api/role.controller");
const { verifyUser, checkRole } = require("../../middleware/authMiddleware.js");

router.get("/", verifyUser, checkRole(["ADMIN"]), controller.index);

router.post("/create", verifyUser, checkRole(["ADMIN"]), controller.createPost);

router.delete("/:id", verifyUser, checkRole(["ADMIN"]), controller.roleDelete);

router.patch("/:id", verifyUser, checkRole(["ADMIN"]), controller.rolePatch);

module.exports = router;
