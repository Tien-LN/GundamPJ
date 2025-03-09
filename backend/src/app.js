require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db.js");
const app = express();

const routeClient = require("./routes/api/index.route.js");

// Routes 
routeClient(app);

const startServer = async () => {
  try {
    await connectDB(); // Đợi DB kết nối xong mới chạy tiếp
    console.log("✅ Database connected");

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Home route
    app.get("/", (req, res) => res.send("API is running"));

    // Middleware xử lý lỗi (thêm nếu chưa có)
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({ error: "Internal Server Error" });
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
