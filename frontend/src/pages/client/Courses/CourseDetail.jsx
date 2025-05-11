import { Link, useParams } from "react-router-dom";
import "./CourseDetail.scss";
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";

function CourseDetail() {
  const [course, setCourse] = useState({});
  const { courseId } = useParams();
  const [user, setUser] = useState({});
  const [docs, setDocs] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [enrollment, setEnrollment] = useState([]);
  const [enrollmentStatus, setEnrollmentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setLoading(true);
        // Lấy thông tin khóa học
        const res = await axios.get(
          `http://localhost:3000/api/courses/${courseId}`,
          {
            withCredentials: true,
          }
        );

        // Lấy thông tin người dùng
        const res_user = await axios.get(
          `http://localhost:3000/api/users/getPermission`,
          {
            withCredentials: true,
          }
        );

        // Lấy danh sách tài liệu khóa học
        try {
          const res_docs = await axios.get(
            `http://localhost:3000/api/docs/${courseId}/docs`,
            {
              withCredentials: true,
            }
          );

          console.log("Dữ liệu tài liệu:", res_docs.data);

          // Kiểm tra nếu res_docs.data là một mảng
          if (Array.isArray(res_docs.data)) {
            // Sắp xếp tài liệu theo thời gian tạo nếu có trường createdAt
            const sortedDocs = [...res_docs.data].sort((a, b) =>
              a.createdAt && b.createdAt
                ? new Date(a.createdAt) - new Date(b.createdAt)
                : 0
            );
            setDocs(sortedDocs);
          } else {
            console.error(
              "Cấu trúc dữ liệu tài liệu không đúng:",
              res_docs.data
            );
            setDocs([]);
          }
        } catch (docsError) {
          console.error("Lỗi khi lấy danh sách tài liệu:", docsError);
          setDocs([]);
        }

        // Lấy danh sách bài học
        try {
          const lessonsRes = await axios.get(
            `http://localhost:3000/api/lessons/${courseId}/lessons`,
            {
              withCredentials: true,
            }
          );
          console.log("Dữ liệu bài học:", lessonsRes.data);
          setLessons(lessonsRes.data);
        } catch (lessonsError) {
          console.error("Lỗi khi lấy danh sách bài học:", lessonsError);
          setLessons([]);
        }

        setCourse(res.data);
        setUser(res_user.data);

        // Nếu là giáo viên, lấy danh sách yêu cầu tham gia
        if (res_user.data.role === "TEACHER") {
          const enrollments = await axios.get(
            `http://localhost:3000/api/enrollments/list/${courseId}`,
            {
              withCredentials: true,
            }
          );
          setEnrollment(enrollments.data);
        }

        // Kiểm tra trạng thái đăng ký khóa học của học viên
        if (res_user.data.role === "STUDENT") {
          try {
            const enrollmentRes = await axios.get(
              `http://localhost:3000/api/enrollments/status/${courseId}`,
              {
                withCredentials: true,
              }
            );
            setEnrollmentStatus(enrollmentRes.data.status);
          } catch (enrollError) {
            console.error("Lỗi khi kiểm tra trạng thái đăng ký:", enrollError);
            setEnrollmentStatus(null);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy khóa học: ", error);
        setError("Không thể tải thông tin khóa học. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchApi();
  }, [courseId]);

  const handleDeleteDocs = async (id) => {
    try {
      if (user.role !== "TEACHER" || user.id !== course.teacher?.id) {
        alert("Bạn không có quyền xóa tài liệu này.");
        return;
      }
      await axios.patch(
        `http://localhost:3000/api/docs/soft-delete/${id}`,
        { docIds: [id] },
        { withCredentials: true }
      );

      // Cập nhật danh sách tài liệu sau khi xóa
      setDocs(docs.filter((doc) => doc.id !== id));
    } catch (error) {
      console.error("Lỗi khi xóa tài liệu:", error);
      alert("Có lỗi xảy ra khi xóa tài liệu");
    }
  };

  const handleApproval = async (id) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/enrollments/approve/${id}`,
        {},
        {
          withCredentials: true,
        }
      );

      // Cập nhật danh sách yêu cầu sau khi phê duyệt
      setEnrollment(enrollment.filter((enroll) => enroll.id !== id));
    } catch (error) {
      console.error("Lỗi khi chấp nhận học viên", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/enrollments/reject/${id}`,
        {},
        {
          withCredentials: true,
        }
      );

      // Cập nhật danh sách yêu cầu sau khi từ chối
      setEnrollment(enrollment.filter((enroll) => enroll.id !== id));
    } catch (error) {
      console.error("Lỗi khi từ chối học viên", error);
    }
  };

  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <div className="courses-loading">
        <div className="spinner">
          <i className="fa-solid fa-spinner fa-spin"></i>
        </div>
        <p>Đang tải thông tin khóa học...</p>
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

  return (
    <div className="course-detail">
      {/* Header với ảnh nền và thông tin cơ bản */}
      <div className="course-detail__header">
        <img
          className="course-detail__header-image"
          src={course.imageUrl || "/img/default-bg.jpg"}
          alt={course.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/img/default-bg.jpg";
          }}
        />
        <div className="course-detail__header-overlay">
          <h1 className="course-detail__header-title">{course.name}</h1>
          <div className="course-detail__header-meta">
            {course.startDate && course.endDate && (
              <div className="course-detail__header-meta-item">
                <i className="fa-solid fa-calendar"></i>
                <span>
                  {format(new Date(course.startDate), "dd/MM/yyyy")} -{" "}
                  {format(new Date(course.endDate), "dd/MM/yyyy")}
                </span>
              </div>
            )}
            {course.teacher && (
              <div className="course-detail__header-meta-item">
                <i className="fa-solid fa-user"></i>
                <span>{course.teacher.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="course-detail__content">
        {/* Phần chính với mô tả và danh sách bài học */}
        <div className="course-detail__main">
          <div className="course-detail__description">
            <h3>Mô tả khóa học</h3>
            <p>{course.description || "Không có mô tả cho khóa học này."}</p>
          </div>

          <div className="course-detail__lessons">
            <div className="course-detail__lessons-header">
              <h3>Tài liệu</h3>
            </div>

            {docs && docs.length > 0 ? (
              <ul className="course-detail__lessons-list">
                {docs.map((item, index) => (
                  <li key={index} className="course-detail__lessons-item">
                    <Link to={item.id} className="course-detail__lessons-link">
                      <i className="fa-solid fa-book"></i>
                      <span>{`Tài liệu ${index + 1}: ${item.title}`}</span>
                    </Link>
                    {user.role === "TEACHER" &&
                      user.id === course.teacher?.id && (
                        <button
                          className="course-detail__lessons-delete"
                          onClick={() => handleDeleteDocs(item.id)}
                        >
                          <i className="fa-solid fa-minus"></i>
                        </button>
                      )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="course-detail__lessons-empty">
                <p>Chưa có tài liệu nào cho khóa học này.</p>
              </div>
            )}
          </div>

          {/* Hiển thị danh sách bài học */}
          <div className="course-detail__lessons">
            <div className="course-detail__lessons-header">
              <h3>Bài học</h3>
            </div>

            {lessons && lessons.length > 0 ? (
              <ul className="course-detail__lessons-list">
                {lessons.map((lesson, index) => (
                  <li key={lesson.id} className="course-detail__lessons-item">
                    <div className="course-detail__lessons-link">
                      <i className="fa-solid fa-chalkboard-teacher"></i>
                      <span>{`Bài học ${index + 1}: ${lesson.title}`}</span>
                      <div
                        className="course-detail__lessons-date"
                        style={{
                          backgroundColor: "#919191",
                          marginLeft: "20px",
                          padding: "5px 8px",
                          borderRadius: "5px",
                        }}
                      >
                        {format(new Date(lesson.date), "dd/MM/yyyy")}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="course-detail__lessons-empty">
                <p>Chưa có bài học nào cho khóa học này.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar với thông tin giáo viên và chi tiết khóa học */}
        <div className="course-detail__sidebar">
          {course.teacher && (
            <div className="course-detail__teacher">
              <h3>Giáo viên</h3>
              <div className="course-detail__teacher-info">
                <img
                  src={course.teacher.avatar || "/img/defaultAvatar.png"}
                  alt={course.teacher.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/img/defaultAvatar.png";
                  }}
                />
                <div>
                  <div className="course-detail__teacher-info-name">
                    {course.teacher.name}
                  </div>
                  <div className="course-detail__teacher-info-role">
                    Giáo viên
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="course-detail__info">
            <h3>Thông tin khóa học</h3>
            <ul className="course-detail__info-list">
              {course.price !== undefined && (
                <li className="course-detail__info-item">
                  <i className="fa-solid fa-tag"></i>
                  <span>Học phí: {course.price.toLocaleString()} VND</span>
                </li>
              )}
              {course.startDate && (
                <li className="course-detail__info-item">
                  <i className="fa-solid fa-calendar-day"></i>
                  <span>
                    Ngày bắt đầu:{" "}
                    {format(new Date(course.startDate), "dd/MM/yyyy")}
                  </span>
                </li>
              )}
              {course.endDate && (
                <li className="course-detail__info-item">
                  <i className="fa-solid fa-calendar-check"></i>
                  <span>
                    Ngày kết thúc:{" "}
                    {format(new Date(course.endDate), "dd/MM/yyyy")}
                  </span>
                </li>
              )}
              {docs && (
                <li className="course-detail__info-item">
                  <i className="fa-solid fa-book"></i>
                  <span>Số bài học: {lessons.length}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Phần yêu cầu tham gia (chỉ hiển thị cho giáo viên phụ trách khóa học) */}
          {user.role === "TEACHER" && user.id === course.teacher?.id && (
            <div className="course-detail__enrollments">
              <h3>Yêu cầu tham gia</h3>

              {enrollment && enrollment.length > 0 ? (
                <ul className="course-detail__enrollments-list">
                  {enrollment.map((enroll) => (
                    <li
                      key={enroll.id}
                      className="course-detail__enrollments-item"
                    >
                      <div className="course-detail__enrollments-item-name">
                        {enroll.user.name}
                      </div>
                      <div className="course-detail__enrollments-item-actions">
                        <button
                          className="course-detail__enrollments-item-approve"
                          onClick={() => handleApproval(enroll.id)}
                        >
                          <i className="fa-solid fa-check"></i>
                        </button>
                        <button
                          className="course-detail__enrollments-item-reject"
                          onClick={() => handleReject(enroll.id)}
                        >
                          <i className="fa-solid fa-times"></i>
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="course-detail__enrollments-empty">
                  <p>Không có yêu cầu tham gia nào.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Các nút quản lý - chỉ hiển thị cho giáo viên phụ trách khóa học */}
      {user.role === "TEACHER" && user.id === course.teacher?.id && (
        <div className="teacher-actions">
          <Link to={`/courses/${courseId}/lessons`} className="manage-button">
            <i className="fa-solid fa-list-check"></i> Quản lý bài học
          </Link>
          <Link to={`/courses/${courseId}/AddDocs`} className="add-button">
            <i className="fa-solid fa-plus"></i> Add Lesson
          </Link>
          <Link to={`/courses/${courseId}/documents`} className="manage-button">
            <i className="fa-solid fa-file-alt"></i> Quản lý tài liệu
          </Link>
          <Link
            to={`/courses/${courseId}/upload-document`}
            className="add-button"
          >
            <i className="fa-solid fa-file-upload"></i> Upload tài liệu
          </Link>
          <Link to={`/courses/${courseId}/exams`} className="manage-button">
            <i className="fa-solid fa-clipboard-list"></i> Quản lý đề thi
          </Link>
          <Link to={`/courses/${courseId}/exams/create`} className="add-button">
            <i className="fa-solid fa-plus-circle"></i> Tạo đề thi
          </Link>
        </div>
      )}

      {/* Các nút xem tài liệu và đề thi - hiển thị cho học sinh đã đăng ký */}
      {user.role === "STUDENT" && enrollmentStatus === "APPROVED" && (
        <div className="student-actions">
          <Link to={`/courses/${courseId}/documents`} className="view-button">
            <i className="fa-solid fa-file-alt"></i> Xem tài liệu
          </Link>
          <Link to={`/courses/${courseId}/exams`} className="view-button">
            <i className="fa-solid fa-clipboard-list"></i> Xem đề thi
          </Link>
        </div>
      )}
    </div>
  );
}

export default CourseDetail;
