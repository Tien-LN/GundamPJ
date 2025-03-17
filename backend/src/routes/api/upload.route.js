const express = require("express");
const router = express.Router();
const upload = require("../../middleware/upload.js");
const cloudinary = require("../../config/cloudinary.js");
const { prisma } = require("../../config/db.js");
const { verifyUser } = require("../../middleware/authMiddleware.js");

router.post("/", verifyUser, upload.single("file"), async (req, res) => {
  try {
    const { type, courseId } = req.body; // Nhận dữ liệu từ request
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    let folder = "documents"; // Mặc định lưu vào "documents"

    if (req.file.mimetype.startsWith("image/")) {
      if (type === "avatar") {
        folder = "avatars";
      } else if (type === "course") {
        folder = "courses";
      } else {
        return res.status(400).json({ message: "Invalid upload type" });
      }
    }

    // Upload lên Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder }, (error, cloudinaryResult) => {
          if (error) reject(error);
          else resolve(cloudinaryResult);
        })
        .end(req.file.buffer);
    });

    // Nếu là avatar, ai cũng có thể đổi
    if (type === "avatar") {
      await prisma.user.update({
        where: { id: req.user.id },
        data: { avatarUrl: result.secure_url },
      });
    }

    // Nếu là ảnh khóa học, kiểm tra quyền giáo viên
    if (type === "course") {
      if (!courseId) {
        return res.status(400).json({ message: "Course ID is required" });
      }

      if (
        req.user.role?.roleType !== "TEACHER" &&
        req.user.role?.roleType !== "ADMIN"
      ) {
        return res
          .status(403)
          .json({ message: "Bạn không có quyền thay đổi ảnh khóa học" });
      }

      await prisma.course.update({
        where: { id: courseId },
        data: { imageUrl: result.secure_url },
      });
    }

    res.json({ message: "Upload successful", fileUrl: result.secure_url });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
