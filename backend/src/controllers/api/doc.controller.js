const { prisma } = require("../../config/db.js");
const cloudinary = require("../../config/cloudinary.js");

const getDocs = async (req, res) => {
  try {
    const docs = await prisma.doc.findMany({
      where: {
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
    console.error("Lỗi khi lấy danh sách tài liệu:", error);
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
        .upload_stream(
          {
            folder: "documents",
            resource_type: "raw",
            public_id: `${title}`,
            upload_preset: "pdf_preset",
            type: "upload",
            access_mode: "public",
            access_control: [
              {
                access_type: "anonymous",
                start: Math.floor(Date.now() / 1000), // Lấy timestamp hiện tại
                end: Math.floor(Date.now() / 1000) + 3600, // Timestamp cho 1 giờ sau
              },
            ],
          },
          (error, cloudinaryResult) => {
            if (error) reject(error);
            else resolve(cloudinaryResult);
          }
        )
        .end(req.file.buffer);
    });

    return res.status(200).json({
      message: "Document uploaded successfully",
      doc: result,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ message: "Upload failed", error });
  }
};

const softDeleteDoc = async (req, res) => {
  try {
    const { docIds } = req.body;

    if (!Array.isArray(docIds) || docIds.length === 0) {
      return res.status(400).json({ message: "Invalid or empty document IDs" });
    }

    await prisma.doc.updateMany({
      where: { id: { in: docIds } },
      data: { deleted: true },
    });

    res.status(200).json({ message: "Documents soft-deleted successfully" });
  } catch (error) {
    console.error("Error soft-deleting document:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const hardDeleteDoc = async (req, res) => {
  try {
    const { docIds } = req.body;

    if (!Array.isArray(docIds) || docIds.length === 0) {
      return res.status(400).json({ message: "Invalid or empty document IDs" });
    }

    await prisma.doc.deleteMany({
      where: { id: { in: docIds } },
    });
    res.status(200).json({ message: "Documents hard-deleted successfully" });
  } catch (error) {
    console.error("Error hard-deleting document:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// [GET] /api/docs
module.exports = { getDocs, readDoc, uploadDoc, softDeleteDoc, hardDeleteDoc };
