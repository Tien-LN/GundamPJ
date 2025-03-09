require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectDB } = require("./config/db.js");

// Import routes
const routes = {
  auth: require("./routes/authRoutes.js"),
  users: require("./routes/userRoutes.js"),
  courses: require("./routes/courseRoutes.js"),
  enrollments: require("./routes/enrollmentRoutes.js"),
  exams: require("./routes/examRoutes.js"),
  docs: require("./routes/docRoutes.js"),
  announcements: require("./routes/announRoutes.js"),
  statistics: require("./routes/statisticsRoutes.js"),
};

const app = express();

const startServer = async () => {
  try {
    await connectDB(); // Đợi DB kết nối xong mới chạy tiếp
    console.log("✅ Database connected");

    // Middleware
    app.use(cors());
    app.use(express.json());

    // Routes
    app.use("/api/auth", routes.auth);
    app.use("/api/users", routes.users);
    // app.use("/api/courses", routes.courses);
    // app.use("/api/enrollments", routes.enrollments);
    // app.use("/api/exams", routes.exams);
    // app.use("/api/docs", routes.docs);
    // app.use("/api/announcements", routes.announcements);
    // app.use("/api/statistics", routes.statistics);

    // Home route
    app.get("/", (req, res) => res.send("API is running"));

    // Middleware xử lý lỗi
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
