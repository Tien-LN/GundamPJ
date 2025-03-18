const multer = require("multer");

const storage = multer.memoryStorage(); // Lưu file trong bộ nhớ để upload lên Cloudinary
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith("image/") ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only images and PDFs are allowed"), false);
  }
};

// Giới hạn kích thước file
const limits = {
  fileSize: 15 * 1024 * 1024, // 15MB
};

const upload = multer({ storage, fileFilter, limits });

module.exports = upload;
