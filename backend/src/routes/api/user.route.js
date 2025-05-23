const express = require("express");
const router = express.Router();
const controller = require("../../controllers/api/user.controller.js");
const { verifyUser, checkRole } = require("../../middleware/authMiddleware.js");
const upload = require("../../middleware/upload.js");

// Lấy danh sách user - chỉ Admin
router.get("/", verifyUser, checkRole(["ADMIN"]), controller.getUsers);

// Lấy danh sách user đã xóa tạm thời - chỉ Admin
router.get(
  "/deleted",
  verifyUser,
  checkRole(["ADMIN"]),
  controller.getDeletedUsers
);

router.get("/get-user-by-slug/:slug", controller.getUserBySlug);

router.patch(
  "/updateAvatar",
  verifyUser,
  upload.single("avatar"),
  controller.updateAvatar
);

// Xem thông tin tài khoản
router.get("/me", verifyUser, controller.getMe);

// Cập nhật thông tin tài khoản
router.put("/me/update", verifyUser, controller.updateMe);

// Cập nhật mật khẩu
router.put("/me/password", verifyUser, controller.updatePassword);

// Xóa tạm thời user (soft delete) - chỉ Admin
router.patch(
  "/soft-delete",
  verifyUser,
  checkRole(["ADMIN"]),
  controller.softDeleteUser
);

// Khôi phục user - chỉ Admin
router.patch(
  "/restore",
  verifyUser,
  checkRole(["ADMIN"]),
  controller.restoreUser
);

// Xóa vĩnh viễn user (hard delete) - chỉ Admin
router.delete(
  "/hard-delete",
  verifyUser,
  checkRole(["ADMIN"]),
  controller.hardDeleteUser
);

// Lấy role của user đang đăng nhập
router.get("/getPermission", verifyUser, controller.getPermissonUser);
module.exports = router;
