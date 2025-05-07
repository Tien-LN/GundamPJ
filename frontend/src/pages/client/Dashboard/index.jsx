import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Dashboard.scss";
import { AuthContext } from "../../../contexts/AuthContext";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    enrolledCourses: 0,
    completedCourses: 0,
    upcomingLessons: 0,
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho danh sách khóa học của PSTUDY
  const [featuredCourses, setFeaturedCourses] = useState([]);

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      navigate("/login");
      return;
    }

    // If user hasn't completed their profile, redirect to onboarding
    if (
      !user?.name ||
      !user?.phone ||
      !user?.gender ||
      !user?.address ||
      !user?.dateOfBirth
    ) {
      navigate("/onboarding");
      return;
    }

    // Fetch dashboard data
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch enrolled courses
        const enrolledResponse = await axios.get(
          "http://localhost:3000/api/enrollments/listApproved",
          { withCredentials: true }
        );

        // Fetch enrollment requests for statistics
        const enrollmentStatsResponse = await axios.get(
          "http://localhost:3000/api/enrollments/my-account",
          { withCredentials: true }
        );

        // Fetch featured courses
        const coursesResponse = await axios.get(
          "http://localhost:3000/api/courses",
          { withCredentials: true }
        );

        // Lấy thống kê học tập của người dùng
        const userStatsResponse = await axios
          .get(`http://localhost:3000/api/statistics/user/${user.id}`, {
            withCredentials: true,
          })
          .catch(() => ({ data: { courseStats: [], attendanceStats: {} } }));

        // Process enrolled courses data với thông tin tiến độ thực tế
        let userCourses = [];
        let completedExamsCount = 0;

        if (enrolledResponse.data && Array.isArray(enrolledResponse.data)) {
          userCourses = enrolledResponse.data
            .map((enrollment) => {
              // Check if course data exists
              if (enrollment.course) {
                // Tìm thông tin tiến độ học tập từ API statistics
                const courseStats = userStatsResponse.data.courseStats?.find(
                  (stats) => stats.courseId === enrollment.course.id
                );

                // Tính tiến độ dựa trên số bài học đã hoàn thành
                const totalLessons = courseStats?.totalLessons || 0;
                const completedLessons = courseStats?.completedLessons || 0;
                const progress =
                  totalLessons > 0
                    ? Math.floor((completedLessons / totalLessons) * 100)
                    : 0;

                // Đếm số bài thi đã hoàn thành
                if (courseStats?.examStats) {
                  completedExamsCount += courseStats.examStats.length;
                }

                return {
                  id: enrollment.course.id,
                  name: enrollment.course.name,
                  progress: progress,
                  nextLesson:
                    enrollment.course.docsCourse &&
                    enrollment.course.docsCourse.length > 0
                      ? enrollment.course.docsCourse[0].title
                      : "Không có bài học",
                };
              }
              return null;
            })
            .filter((course) => course !== null);
        }

        // Process featured courses (limit to 2 for display)
        let allCourses = [];
        if (coursesResponse.data && Array.isArray(coursesResponse.data)) {
          // Lấy 2 khóa học đầu tiên
          const featuredCoursesData = coursesResponse.data.slice(0, 2);

          // Lấy số học viên thực tế cho mỗi khóa học
          const courseStudentsPromises = featuredCoursesData.map((course) =>
            axios
              .get(
                `http://localhost:3000/api/statistics/course/${course.id}/students`,
                { withCredentials: true }
              )
              .then((response) => ({
                courseId: course.id,
                studentCount: response.data.length,
              }))
              .catch(() => ({
                courseId: course.id,
                studentCount: 0,
              }))
          );

          const courseStudentsResults = await Promise.all(
            courseStudentsPromises
          );

          // Map dữ liệu khóa học với số học viên thực tế
          allCourses = featuredCoursesData.map((course) => {
            const studentData = courseStudentsResults.find(
              (item) => item.courseId === course.id
            );
            return {
              id: course.id,
              name: course.name,
              description: course.description || "Không có mô tả",
              imageUrl: course.imageUrl || "/img/course-default.jpg",
              teacherName: course.teacher?.name || "Không có thông tin",
              studentCount: studentData ? studentData.studentCount : 0,
              isFeatured: true,
              isNew:
                new Date(course.startDate) >
                new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
            };
          });
        }

        // Set stats based on enrollment data with real exam count
        setStats({
          enrolledCourses: userCourses.length,
          completedCourses: completedExamsCount,
          upcomingLessons: userCourses.length > 0 ? userCourses.length : 0,
        });

        setRecentCourses(userCourses);
        setFeaturedCourses(allCourses);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user, navigate]);

  const renderDashboard = () => (
    <>
      {/* SECTION 1: THỐNG KÊ */}
      <div className="dashboard-section">
        <h2>Thống kê</h2>
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fa-solid fa-book"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.enrolledCourses}</h3>
              <p>Khóa học đã tham gia</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fa-solid fa-file-alt"></i>
            </div>
            <div className="stat-content">
              <h3>{stats.completedCourses}</h3>
              <p>Bài thi đã làm</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fa-solid fa-chart-line"></i>
            </div>
            <div className="stat-content">
              <button
                className="stat-button"
                onClick={() => navigate("/statistics")}
              >
                Xem thống kê chi tiết
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: KHÓA HỌC CỦA PSTUDY */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Khóa học của PSTUDY</h2>
          <button
            className="view-all-button"
            onClick={() => navigate("/all-courses")}
          >
            Xem tất cả <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        <div className="courses-list">
          {featuredCourses.length > 0 ? (
            featuredCourses.map((course) => (
              <div className="course-card featured" key={course.id}>
                <div className="course-image">
                  <img
                    src={course.imageUrl || "/img/course-default.jpg"}
                    alt={course.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/img/course-default.jpg";
                    }}
                  />
                  <div className="course-badge">
                    {course.isNew ? "Mới" : "Nổi bật"}
                  </div>
                </div>
                <div className="course-content">
                  <h3>{course.name}</h3>
                  <p className="course-description">{course.description}</p>
                  <div className="course-meta">
                    <span>
                      <i className="fa-solid fa-user"></i> {course.teacherName}
                    </span>
                    <span>
                      <i className="fa-solid fa-users"></i>{" "}
                      {course.studentCount} học viên
                    </span>
                  </div>
                  <button
                    className="course-button"
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <i className="fa-solid fa-book-open"></i>
              <p>Không có khóa học nào</p>
              <button
                className="primary-button"
                onClick={() => navigate("/all-courses")}
              >
                Khám phá khóa học
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3: KHÓA HỌC ĐÃ ĐĂNG KÝ */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Khóa học đã đăng ký</h2>
          <button
            className="view-all-button"
            onClick={() => navigate("/courses")}
          >
            Xem tất cả <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        {recentCourses.length > 0 ? (
          <div className="courses-list">
            {recentCourses.map((course) => (
              <div className="course-card enrolled" key={course.id}>
                <h3>{course.name}</h3>
                <div className="progress-container">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                  <span>{course.progress}% hoàn thành</span>
                </div>
                <p>Bài học tiếp theo: {course.nextLesson}</p>
                <button
                  className="course-button"
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  Tiếp tục học
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <i className="fa-solid fa-book-open"></i>
            <p>Bạn chưa đăng ký khóa học nào</p>
            <button
              className="primary-button"
              onClick={() => navigate("/all-courses")}
            >
              Khám phá khóa học
            </button>
          </div>
        )}
      </div>
    </>
  );

  if (loading) {
    return (
      <div className="dashboard-container loading">
        <div className="loader">
          <i className="fa-solid fa-spinner fa-spin"></i>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Xin chào, {user?.name || "Học viên"}!</h1>
        <p className="welcome-message">
          Chào mừng bạn quay trở lại với hệ thống học tập của chúng tôi.
        </p>
      </div>

      {renderDashboard()}
    </div>
  );
}

export default Dashboard;
