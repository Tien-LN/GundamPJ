import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./UploadDocument.scss";

function UploadDocument() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState({});
  const [course, setCourse] = useState({});
  const [isAuthorized, setIsAuthorized] = useState(false);

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
          setError("Bạn không có quyền upload tài liệu cho khóa học này");
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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Vui lòng chọn file để upload");
      return;
    }

    if (!title.trim()) {
      setError("Vui lòng nhập tiêu đề cho tài liệu");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", title);
      formData.append("courseId", courseId);

      await axios.post("http://localhost:3000/api/docs/create", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setSuccess(true);
      setTitle("");
      setFile(null);
      // Reset file input
      document.getElementById("file-upload").value = "";

      setTimeout(() => {
        setSuccess(false);
      }, 3000);

      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi upload tài liệu:", error);
      setError(
        error.response?.data?.message || "Có lỗi xảy ra khi upload tài liệu"
      );
      setLoading(false);
    }
  };

  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <div className="upload-document-loading">
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
      <div className="upload-document-error">
        <i className="fa-solid fa-circle-exclamation"></i>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="upload-document">
      <h1 className="upload-document__title">Upload Tài Liệu</h1>
      <div className="upload-document__course-info">
        <h2>{course.title}</h2>
        <p>Giáo viên: {course.teacher?.name}</p>
      </div>

      {success && (
        <div className="upload-document__success">
          <i className="fa-solid fa-check-circle"></i>
          <span>Tài liệu đã được upload thành công!</span>
        </div>
      )}

      {error && (
        <div className="upload-document__error">
          <i className="fa-solid fa-circle-exclamation"></i>
          <span>{error}</span>
        </div>
      )}

      <form className="upload-document__form" onSubmit={handleSubmit}>
        <div className="upload-document__form-group">
          <label htmlFor="title">Tiêu đề tài liệu:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="Nhập tiêu đề tài liệu"
            required
          />
        </div>

        <div className="upload-document__form-group">
          <label htmlFor="file-upload">Chọn file:</label>
          <input
            type="file"
            id="file-upload"
            onChange={handleFileChange}
            required
          />
          <p className="upload-document__file-info">
            {file ? (
              <>
                <i className="fa-solid fa-file"></i> {file.name} (
                {Math.round(file.size / 1024)} KB)
              </>
            ) : (
              "Chưa có file nào được chọn"
            )}
          </p>
        </div>

        <div className="upload-document__form-actions">
          <button
            type="button"
            className="upload-document__cancel-btn"
            onClick={() => navigate(`/courses/${courseId}`)}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="upload-document__submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Đang upload...
              </>
            ) : (
              "Upload Tài Liệu"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UploadDocument;
