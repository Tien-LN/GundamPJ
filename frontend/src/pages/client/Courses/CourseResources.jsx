import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import "./CourseResources.scss";

function CourseResources() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [course, setCourse] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isTeacher, setIsTeacher] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Lấy thông tin người dùng
        const userRes = await axios.get(
          `http://localhost:3000/api/users/getPermission`,
          { withCredentials: true }
        );

        // Lấy thông tin khóa học
        const courseRes = await axios.get(
          `http://localhost:3000/api/courses/${courseId}`,
          { withCredentials: true }
        );

        setUser(userRes.data);
        setCourse(courseRes.data);

        // Kiểm tra nếu là giáo viên phụ trách khóa học
        if (
          userRes.data.role === "TEACHER" &&
          userRes.data.id === courseRes.data.teacher?.id
        ) {
          setIsTeacher(true);
        }

        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu", error);
        setError("Có lỗi xảy ra khi tải dữ liệu");
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <div className="course-resources-loading">
        <div className="spinner">
          <i className="fa-solid fa-spinner fa-spin"></i>
        </div>
      </div>
    );
  }

  // Hiển thị thông báo lỗi
  if (error) {
    return (
      <div className="course-resources-error">
        <i className="fa-solid fa-circle-exclamation"></i>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="course-resources">
      <h2 className="course-resources__title">Tài Nguyên Khóa Học</h2>

      <div className="course-resources__container">
        <div className="course-resources__card">
          <div className="course-resources__icon">
            <i className="fa-solid fa-file-pdf"></i>
          </div>
          <h3>Tài Liệu</h3>
          <p>Xem tất cả tài liệu của khóa học</p>
          <button
            className="course-resources__button"
            onClick={() => navigate(`/courses/${courseId}/documents`)}
          >
            Xem Tài Liệu
          </button>
          {isTeacher && (
            <button
              className="course-resources__button course-resources__button--upload"
              onClick={() => navigate(`/courses/${courseId}/upload-document`)}
            >
              <i className="fa-solid fa-upload"></i> Upload Tài Liệu
            </button>
          )}
        </div>

        <div className="course-resources__card">
          <div className="course-resources__icon">
            <i className="fa-solid fa-clipboard-question"></i>
          </div>
          <h3>Đề Thi</h3>
          <p>Làm bài thi và kiểm tra kiến thức</p>
          <button
            className="course-resources__button"
            onClick={() => navigate(`/courses/${courseId}/exams`)}
          >
            Xem Đề Thi
          </button>
          {isTeacher && (
            <button
              className="course-resources__button course-resources__button--create"
              onClick={() => navigate(`/courses/${courseId}/exams`)}
            >
              <i className="fa-solid fa-plus"></i> Tạo Đề Thi
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CourseResources;
