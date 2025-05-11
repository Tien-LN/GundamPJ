import { useEffect, useState } from "react";
import "./Courses.scss";
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from "date-fns";
function Courses() {
  const [courses, setCourses] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setLoading(true);
        // Lấy danh sách khóa học đã đăng ký
        const res = await axios.get(
          "http://localhost:3000/api/enrollments/listApproved",
          {
            withCredentials: true,
          }
        );

        // Lấy thông tin người dùng
        const res_user = await axios.get(
          "http://localhost:3000/api/users/getPermission",
          {
            withCredentials: true,
          }
        );

        // Lấy thông tin tiến độ học tập nếu là học viên
        if (res_user.data.role === "STUDENT" && res.data.length > 0) {
          try {
            const statsResponse = await axios.get(
              `http://localhost:3000/api/statistics/user/${res_user.data.id}`,
              { withCredentials: true }
            );

            // Tạo map tiến độ học tập cho từng khóa học
            const progressMap = {};
            if (statsResponse.data && statsResponse.data.courseStats) {
              statsResponse.data.courseStats.forEach((stat) => {
                const totalLessons = stat.totalLessons || 0;
                const completedLessons = stat.completedLessons || 0;
                const progressPercent =
                  totalLessons > 0
                    ? Math.floor((completedLessons / totalLessons) * 100)
                    : 0;

                progressMap[stat.courseId] = {
                  percent: progressPercent,
                  completed: completedLessons,
                  total: totalLessons,
                };
              });
            }
            setProgress(progressMap);
          } catch (statsError) {
            console.error("Không thể lấy thông tin tiến độ:", statsError);
          }
        }

        setUser(res_user.data);
        setCourses(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi", error);
        setError("Không thể tải danh sách khóa học. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };
    fetchApi();
  }, []);

  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <div className="courses-loading">
        <div className="spinner">
          <i className="fa-solid fa-spinner fa-spin"></i>
        </div>
        <p>Đang tải danh sách khóa học...</p>
      </div>
    );
  }

  // Hiển thị thông báo lỗi
  if (error) {
    return (
      <div className="courses-error">
        <i className="fa-solid fa-circle-exclamation"></i>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Thử lại</button>
      </div>
    );
  }

  // Hiển thị khi không có khóa học
  if (courses.length === 0) {
    return (
      <div className="courses-empty">
        <i className="fa-solid fa-book"></i>
        <h2>Bạn chưa đăng ký khóa học nào</h2>
        <p>
          Hãy khám phá các khóa học của chúng tôi và bắt đầu hành trình học tập
          của bạn.
        </p>
        <Link to="/all-courses" className="btn-primary">
          <i className="fa-solid fa-magnifying-glass"></i> Tìm khóa học
        </Link>
      </div>
    );
  }

  return (
    <div className="courses-container">
      {user.role === "TEACHER" ? (
        <>
          <div className="courses-header">
            <h1>Khóa học đang dạy</h1>
            <p>Quản lý và theo dõi các khóa học mà bạn đang giảng dạy</p>
          </div>

          <div className="courses-grid">
            {courses &&
              courses.map((item, index) => (
                <div className="course-card teacher" key={index}>
                  <div className="course-image">
                    <img
                      src={item.imageUrl || "/img/default-bg.jpg"}
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/img/default-bg.jpg";
                      }}
                    />
                  </div>
                  <div className="course-content">
                    <h2>{item.name}</h2>
                    <div className="course-dates">
                      <div>
                        <i className="fa-solid fa-calendar-day"></i>
                        <span>
                          {format(new Date(item.startDate), "dd/MM/yyyy")}
                        </span>
                      </div>
                      <div>
                        <i className="fa-solid fa-calendar-check"></i>
                        <span>
                          {format(new Date(item.endDate), "dd/MM/yyyy")}
                        </span>
                      </div>
                    </div>
                    <p className="course-description">
                      {item.description || "Không có mô tả"}
                    </p>
                    <div className="course-actions">
                      <Link to={`/courses/${item.id}`} className="btn-view">
                        <i className="fa-solid fa-eye"></i> Xem chi tiết
                      </Link>
                      <Link
                        to={`/courses/${item.id}/lessons`}
                        className="btn-manage"
                      >
                        <i className="fa-solid fa-list-check"></i> Quản lý bài
                        học
                      </Link>
                      <Link
                        to={`/courses/${item.id}/upload-document`}
                        className="btn-document"
                      >
                        <i className="fa-solid fa-file-upload"></i> Quản lý tài
                        liệu
                      </Link>
                      <Link
                        to={`/courses/${item.id}/exams`}
                        className="btn-exam"
                      >
                        <i className="fa-solid fa-clipboard-check"></i> Quản lý
                        bài kiểm tra
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </>
      ) : (
        <>
          <div className="courses-header">
            <h1>Khóa học đã đăng ký</h1>
            <p>
              Tiếp tục hành trình học tập của bạn với các khóa học đã đăng ký
            </p>
          </div>

          <div className="courses-grid">
            {courses &&
              courses.map((item, index) => {
                const courseId = item.course?.id;
                const courseProgress = progress[courseId] || {
                  percent: 0,
                  completed: 0,
                  total: 0,
                };

                return (
                  <div className="course-card student" key={index}>
                    <div className="course-image">
                      <img
                        src={item.course?.imageUrl || "/img/default-bg.jpg"}
                        alt={item.course?.name}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/img/default-bg.jpg";
                        }}
                      />
                      <div className="course-progress-badge">
                        {courseProgress.percent}% hoàn thành
                      </div>
                    </div>
                    <div className="course-content">
                      <h2>{item.course?.name}</h2>
                      <div className="progress-container">
                        <div className="progress-bar">
                          <div
                            className="progress-fill"
                            style={{ width: `${courseProgress.percent}%` }}
                          ></div>
                        </div>
                        <div className="progress-text">
                          {courseProgress.completed}/{courseProgress.total} bài
                          học
                        </div>
                      </div>
                      <div className="course-lessons">
                        <h3>Bài học</h3>
                        <div className="lessons-list">
                          {item.course?.docsCourse &&
                          item.course.docsCourse.length > 0 ? (
                            item.course.docsCourse
                              .slice(0, 3)
                              .map((docs, docs__index) => (
                                <Link
                                  to={`/courses/${item.course.id}/${docs.id}`}
                                  className="lesson-link"
                                  key={docs__index}
                                >
                                  <i className="fa-solid fa-book"></i>
                                  <span>
                                    Bài {docs__index + 1}: {docs.title}
                                  </span>
                                </Link>
                              ))
                          ) : (
                            <p className="no-lessons">Chưa có bài học nào</p>
                          )}

                          {item.course?.docsCourse &&
                            item.course.docsCourse.length > 3 && (
                              <div className="more-lessons">
                                +{item.course.docsCourse.length - 3} bài học
                                khác
                              </div>
                            )}
                        </div>
                      </div>
                      <div className="course-actions">
                        <Link
                          to={`/courses/${item.course?.id}`}
                          className="btn-continue"
                        >
                          <i className="fa-solid fa-play"></i> Tiếp tục học
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="courses-footer">
            <Link to="/all-courses" className="btn-explore">
              <i className="fa-solid fa-compass"></i> Khám phá thêm khóa học
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
export default Courses;
