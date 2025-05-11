const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const attendanceController = {
  // [POST] /api/attendance
  async markAttendance(req, res) {
    try {
      console.log("Received attendance data:", req.body);

      const { userId, lessonId, attended, courseId } = req.body;

      if (!userId || !lessonId) {
        return res
          .status(400)
          .json({ error: "Thiếu thông tin học viên hoặc buổi học" });
      }

      // Kiểm tra xem lesson có thuộc về course không
      if (courseId) {
        const lesson = await prisma.lesson.findFirst({
          where: {
            id: lessonId,
            courseId: courseId,
          },
        });

        if (!lesson) {
          return res
            .status(400)
            .json({ error: "Buổi học không thuộc khóa học này" });
        }
      }

      // Kiểm tra xem đã có bản ghi điểm danh chưa
      const existingAttendance = await prisma.attendance.findFirst({
        where: {
          userId: userId,
          lessonId: lessonId,
        },
      });

      let attendance;

      if (existingAttendance) {
        // Cập nhật điểm danh nếu đã tồn tại
        attendance = await prisma.attendance.update({
          where: {
            id: existingAttendance.id,
          },
          data: {
            attended: attended,
          },
        });
      } else {
        // Tạo mới nếu chưa tồn tại
        attendance = await prisma.attendance.create({
          data: {
            userId: userId,
            lessonId: lessonId,
            attended: attended,
          },
        });
      }

      res.status(200).json({
        success: true,
        message: "Điểm danh thành công",
        data: attendance,
      });
    } catch (error) {
      console.error("Attendance error:", error);
      res.status(500).json({
        error: error.message || "Lỗi khi điểm danh",
      });
    }
  },

  // [GET] /api/attendance/lesson/:lessonId
  async getAttendanceByLesson(req, res) {
    try {
      const { lessonId } = req.params;

      const attendances = await prisma.attendance.findMany({
        where: {
          lessonId: lessonId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      res.status(200).json(attendances);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // [GET] /api/attendance/user/:userId
  async getAttendanceByUser(req, res) {
    try {
      const { userId } = req.params;

      const attendances = await prisma.attendance.findMany({
        where: {
          userId: userId,
        },
        include: {
          lesson: true,
        },
      });

      res.status(200).json(attendances);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // [POST] /api/attendance/status
  async checkAttendanceStatus(req, res) {
    try {
      const { studentId, lessonId } = req.body;

      if (!studentId || !lessonId) {
        return res
          .status(400)
          .json({ error: "Thiếu thông tin học viên hoặc buổi học" });
      }

      // Kiểm tra tồn tại của bản ghi điểm danh
      const attendance = await prisma.attendance.findFirst({
        where: {
          userId: studentId,
          lessonId: lessonId,
        },
      });

      if (!attendance) {
        return res.status(200).json({
          exists: false,
          attended: false,
          message: "Chưa có thông tin điểm danh cho học viên này",
        });
      }

      res.status(200).json({
        exists: true,
        attended: attendance.attended,
        date: attendance.updatedAt || attendance.createdAt,
        message: attendance.attended
          ? "Học viên đã được điểm danh"
          : "Học viên đã được đánh dấu vắng mặt",
      });
    } catch (error) {
      console.error("Error checking attendance status:", error);
      res
        .status(500)
        .json({
          error: error.message || "Lỗi khi kiểm tra trạng thái điểm danh",
        });
    }
  },
};

module.exports = attendanceController;
