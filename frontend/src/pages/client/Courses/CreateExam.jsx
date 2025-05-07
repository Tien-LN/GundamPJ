import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./CreateExam.scss";

function CreateExam() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState({});
  const [course, setCourse] = useState({});
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [examData, setExamData] = useState({
    title: "",
    description: "",
    courseId: courseId,
    startDate: "",
    endDate: "",
    timeLimit: 60, // Mặc định 60 phút
  });

  // Kiểm tra quyền truy cập
  useEffect(() => {
    const checkPermission = async () => {
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
          setIsAuthorized(true);
        } else {
          setError("Bạn không có quyền tạo đề thi cho khóa học này");
          setTimeout(() => {
            navigate(`/courses/${courseId}`);
          }, 2000);
        }

        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi kiểm tra quyền truy cập", error);
        setError("Có lỗi xảy ra khi kiểm tra quyền truy cập");
        setLoading(false);
        setTimeout(() => {
          navigate(`/courses/${courseId}`);
        }, 2000);
      }
    };

    checkPermission();
  }, [courseId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExamData({
      ...examData,
      [name]: value,
    });
  };

  const handleTimeLimitChange = (e) => {
    const minutes = parseInt(e.target.value);
    setExamData({
      ...examData,
      timeLimit: minutes * 60, // Chuyển đổi phút thành giây
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!examData.startDate || !examData.endDate) {
      setError("Vui lòng chọn ngày bắt đầu và ngày kết thúc!");
      return;
    }

    if (new Date(examData.endDate) < new Date(examData.startDate)) {
      setError("Ngày kết thúc không thể sớm hơn ngày bắt đầu!");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await axios.post("http://localhost:3000/api/exams/create", examData, {
        withCredentials: true,
      });

      setSuccess(true);
      setExamData({
        title: "",
        description: "",
        courseId: courseId,
        startDate: "",
        endDate: "",
        timeLimit: 60,
      });

      setTimeout(() => {
        navigate(`/courses/${courseId}/exams`);
      }, 2000);

      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi tạo đề thi:", error);
      setError(error.response?.data?.message || "Có lỗi xảy ra khi tạo đề thi");
      setLoading(false);
    }
  };

  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <div className="create-exam-loading">
        <div className="spinner">
          <i className="fa-solid fa-spinner fa-spin"></i>
        </div>
        <p>Đang xử lý...</p>
      </div>
    );
  }

  // Hiển thị thông báo lỗi nếu không có quyền truy cập
  if (error && !isAuthorized) {
    return (
      <div className="create-exam-error">
        <i className="fa-solid fa-circle-exclamation"></i>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="create-exam">
      <h1 className="create-exam__title">Tạo Đề Thi Mới</h1>
      <div className="create-exam__course-info">
        <h2>{course.title}</h2>
        <p>Giáo viên: {course.teacher?.name}</p>
      </div>

      {success && (
        <div className="create-exam__success">
          <i className="fa-solid fa-check-circle"></i>
          <span>Đề thi đã được tạo thành công! Đang chuyển hướng...</span>
        </div>
      )}

      {error && (
        <div className="create-exam__error">
          <i className="fa-solid fa-circle-exclamation"></i>
          <span>{error}</span>
        </div>
      )}

      <form className="create-exam__form" onSubmit={handleSubmit}>
        <div className="create-exam__form-group">
          <label htmlFor="title">Tiêu đề đề thi:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={examData.title}
            onChange={handleChange}
            placeholder="Nhập tiêu đề đề thi"
            required
          />
        </div>

        <div className="create-exam__form-group">
          <label htmlFor="description">Mô tả:</label>
          <textarea
            id="description"
            name="description"
            value={examData.description}
            onChange={handleChange}
            placeholder="Nhập mô tả cho đề thi"
            rows="4"
          ></textarea>
        </div>

        <div className="create-exam__form-row">
          <div className="create-exam__form-group">
            <label htmlFor="startDate">Ngày bắt đầu:</label>
            <input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={examData.startDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="create-exam__form-group">
            <label htmlFor="endDate">Ngày kết thúc:</label>
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              value={examData.endDate}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="create-exam__form-group">
          <label htmlFor="timeLimit">Thời gian làm bài (phút):</label>
          <input
            type="number"
            id="timeLimit"
            value={examData.timeLimit / 60}
            onChange={handleTimeLimitChange}
            min="1"
            max="180"
            required
          />
        </div>

        <div className="create-exam__form-actions">
          <button
            type="button"
            className="create-exam__cancel-btn"
            onClick={() => navigate(`/courses/${courseId}/exams`)}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="create-exam__submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Đang tạo...
              </>
            ) : (
              "Tạo Đề Thi"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateExam;
