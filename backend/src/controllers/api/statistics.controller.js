const { prisma } = require("../../config/db");

// [GET] /api/statistics
const getUserStatistics = async (req, res) => {
  try {
    const { userId } = req.params;

    const courses = await prisma.course.findMany({
      where: { enrollments: { some: { userId } } },
      include: { lessons: true },
    });

    const courseStats = courses.map((course) => {
      const totalLessons = course.lessons.length;
      const completedLessons = course.lessons.filter(
        (lesson) => lesson.date <= new Date()
      ).length;

      return {
        courseId: course.id,
        courseName: course.name,
        totalLessons,
        completedLessons,
      };
    });

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
};

module.exports = { getUserStatistics };
