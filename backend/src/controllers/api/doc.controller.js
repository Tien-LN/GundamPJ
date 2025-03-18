const { prisma } = require("../../config/db.js");
const cloudinary = require("../../config/cloudinary.js");

const getDocs = async (req, res) => {
  try {
    const userId = req.user.id;

    const docs = await prisma.doc.findMany({
      where: {
        deleted: false,
        course: {
          enrollments: {
            some: {
              userId: userId,
              status: "APPROVED",
              deleted: false,
            },
          },
        },
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
    const userId = req.user.id;

    // Kiểm tra quyền truy cập
    const hasAccess = await prisma.doc.findFirst({
      where: {
        id: docId,
        deleted: false,
        course: {
          enrollments: {
            some: {
              userId: userId,
              status: "APPROVED",
              deleted: false,
            },
          },
        },
      },
    });

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.status(200).json(hasAccess);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
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
