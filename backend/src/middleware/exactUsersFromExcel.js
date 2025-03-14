const multer = require("multer");
const xlsx = require("xlsx");

// cáu hình multer để nhận file từ request
const upload = multer({ storage: multer.memoryStorage() });

const exactUsersFromExcel = (req, res, next) => {
  console.log("🟢 File nhận được:", req.file);
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ message: "vui lòng tải lên một file excel" });
    }

    // đọc file excel từ buffer
    const workbook = xlsx.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // chuyển đổi sheet sang json
    const users = xlsx.utils.sheet_to_json(sheet);

    if (!users || users.length === 0) {
      return res.status(400).json("File excel không có dữ liệu");
    }

    req.body.users = users;
    next();
  } catch (error) {
    console.error("Lỗi trích xuất dữ liệu excel: ", error);
    res.status(500).json({ message: "Lỗi server khi xử lí file excel" });
  }
};

module.exports = { upload, exactUsersFromExcel };
