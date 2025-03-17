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

const upload = multer({ storage, fileFilter });

module.exports = upload;
