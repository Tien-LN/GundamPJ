const index = async (req, res) => {
  try {
    const docs = await prisma.doc.findMany({
      where: { deleted: false }, // Kiểm tra trạng thái deleted
    });
    res.json(docs);
  } catch (error) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// [GET] /api/docs
module.exports.index = index;
