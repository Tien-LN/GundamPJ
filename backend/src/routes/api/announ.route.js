const express = require('express');
const router = express.Router();
const controller = require("../../controllers/api/announ.controller");
const validateContent = require("../../middleware/validateContent");

router.get("/", controller.getAllAnnouncements);

router.get("/:id", controller.getOneAnnouncement);

router.post("/create", validateContent, controller.createAnnouncement);

router.delete("/:id", controller.deleteAnnouncement);

router.patch("/:id", validateContent, controller.updateAnnouncement);

module.exports = router;