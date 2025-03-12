const express = require("express");
const router = express.Router();
const controller = require("../../controllers/api/user.controller.js");
const {
  verifyAdmin,
  verifyUser,
} = require("../../middleware/authMiddleware.js");

// lấy danh sách user - chỉ Admin
router.get("/", verifyAdmin);

// xem thông tin tài khoản
router.get("/me", verifyUser);

// cập nhật thông tin tài khoản
router.put("/me/update", verifyUser);

// xóa user theo id - chỉ admin
router.delete("/:id/delete", verifyAdmin);

module.exports = router;
