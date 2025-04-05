const { prisma } = require("../../config/db");

const statisticsController = {
  // [GET] /api/statistics/user/:userId
  async getUserStatistics(req, res) {
    try {
      const { userId } = req.params;

      // Lấy thông tin khóa học và bài học
      const courses = await prisma.course.findMany({
        where: { enrollments: { some: { userId } } },
        include: {
          lessons: true,
          exams: {
            include: {
              UserExam: {
                where: { userId },
                include: { userAnswers: true },
              },
            },
          },
        },
      });

      const courseStats = courses.map((course) => {
        const totalLessons = course.lessons.length;
        const completedLessons = course.lessons.filter(
          (lesson) => lesson.date <= new Date()
        ).length;

        // Tính điểm trung bình và thời gian làm bài
        const examStats = course.exams
          .map((exam) => {
            const userExam = exam.UserExam[0];
            if (!userExam) return null;

            const totalScore = userExam.userAnswers.reduce(
              (sum, answer) => sum + answer.score,
              0
            );
            const averageScore = totalScore / userExam.userAnswers.length;
            const totalTime = userExam.userAnswers.reduce(
              (sum, answer) => sum + (answer.timeTaken || 0),
              0
            );

            return {
              examId: exam.id,
              examTitle: exam.title,
              status: userExam.status,
              averageScore,
              totalTime,
              completedAt: userExam.endTime,
            };
          })
          .filter(Boolean);

        return {
          courseId: course.id,
          courseName: course.name,
          totalLessons,
          completedLessons,
          examStats,
        };
      });

      // Lấy thông tin điểm danh
      const attendance = await prisma.attendance.findMany({
        where: { userId },
        include: { lesson: true },
      });

      const attendanceStats = attendance.reduce((acc, record) => {
        const courseId = record.lesson.courseId;
        if (!acc[courseId]) acc[courseId] = { attended: 0, total: 0 };
        acc[courseId].total += 1;
        if (record.attended) acc[courseId].attended += 1;
        return acc;
      }, {});

      res.json({ courseStats, attendanceStats });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // [GET] /api/statistics/student/:studentId
  async getStudentStatistics(req, res) {
    try {
      const { studentId } = req.params;

      // Logic thống kê tỷ lệ tham gia và điểm trung bình
      const student = await prisma.user.findUnique({
        where: { id: studentId },
        include: {
          enrollments: {
            include: {
              course: {
                include: {
                  lessons: true,
                  exams: {
                    include: {
                      UserExam: {
                        where: { userId: studentId },
                        include: { userAnswers: true },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });
      console.log(student);
      res.status(200).json(student);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // [GET] /api/statistics/course/:courseId/students
  async getCourseStudents(req, res) {
    try {
      const { courseId } = req.params;

      // Logic lấy danh sách học viên trong khóa học
      const enrollments = await prisma.enrollment.findMany({
        where: { courseId, status: "APPROVED" },
        include: {
          user: true,
        },
      });
      const students = enrollments.map((enrollment) => ({
        id: enrollment.user.id,
        name: enrollment.user.name,
        email: enrollment.user.email,
        enrollmentId: enrollment.id,
        enrollmentDate: enrollment.createdAt,
      }));
      res.status(200).json(students);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // [POST] /api/statistics/attendance
  async markAttendance(req, res) {
    try {
      const { studentId, courseId, status } = req.body;

      // Logic điểm danh học viên
      const attendance = await prisma.attendance.create({
        data: {
          studentId,
          courseId,
          status,
          date: new Date(),
        },
      });

      res.status(200).json(attendance);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = statisticsController;
