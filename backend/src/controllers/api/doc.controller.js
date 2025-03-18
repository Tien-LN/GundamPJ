const { prisma } = require("../../config/db.js");
const cloudinary = require("../../config/cloudinary.js");

const getDocs = async (req, res) => {
  try {
    const userId = req.user.id;

    const docs = await prisma.doc.findMany({
      where: {
        course: {
          enrollments: {
            some: {
              userId: userId,
              status: "APPROVED",
              deleted: false,
            },
          },
        },
        deleted: false,
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
    const selectedDoc = await prisma.findUnique({
      where: { id: docId },
    });
    if (!selectedDoc) {
      return res.status(400).json({ message: "document not found" });
    }
    res.status(200).json(selectedDoc);
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
    console.error("Error uploading document:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// [GET] /api/docs
module.exports = { getDocs };
