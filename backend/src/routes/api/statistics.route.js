const express = require("express");
const router = express.Router();
const statisticsController = require("../../controllers/api/statistics.controller");
const { verifyUser } = require("../../middleware/authMiddleware");

// router.get("/", statisticsController.index);

// Lấy thống kê của học viên
router.get("/user/:userId", verifyUser, statisticsController.getUserStatistics);

module.exports = router;
