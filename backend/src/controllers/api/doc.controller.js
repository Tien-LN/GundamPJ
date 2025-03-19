const { prisma } = require("../../config/db.js");
const cloudinary = require("../../config/cloudinary.js");

const getDocs = async (req, res) => {
  try {
    const docs = await prisma.doc.findMany({
      where: {
        deleted: false,
        courseId: req.params.courseId,
      },
      select: {
        id: true,
        title: true,
        fileUrl: true,
      },
    });

    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

const readDoc = async (req, res) => {
  try {
    const docId = req.body.docId;

    // Lấy tài liệu từ cơ sở dữ liệu
    const doc = await prisma.doc.findFirst({
      where: {
        id: docId,
        deleted: false,
      },
      include: {
        course: true, // Bao gồm thông tin khóa học nếu cần
      },
    });

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Nếu middleware đã đảm bảo quyền truy cập, không cần kiểm tra thêm
    res.status(200).json(doc);
  } catch (error) {
    console.error("Error reading document:", error); // Log lỗi chi tiết
    res.status(500).json({ error: "Server error" });
  }
};

const uploadDoc = async (req, res) => {
  try {
    const { courseId, title } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "documents" }, (error, cloudinaryResult) => {
          if (error) reject(error);
          else resolve(cloudinaryResult);
        })
        .end(req.file.buffer);
    });

    const newDoc = await prisma.doc.create({
      data: {
        title,
        courseId,
        fileUrl: result.secure_url,
      },
    });

    res
      .status(201)
      .json({ message: "Document uploaded successfully", doc: newDoc });
  } catch (error) {
    console.error("Error uploading document:", error); // Log lỗi chi tiết
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// [GET] /api/docs
module.exports = { getDocs, readDoc, uploadDoc };
