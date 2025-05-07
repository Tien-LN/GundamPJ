import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./DocumentList.scss";

function DocumentList() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState({});
  const [course, setCourse] = useState({});
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

        // Lấy danh sách tài liệu
        const docsRes = await axios.get(
          `http://localhost:3000/api/docs/${courseId}/docs`,
          { withCredentials: true }
        );

        setUser(userRes.data);
        setCourse(courseRes.data);
        setDocuments(docsRes.data);

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

  const handleViewDocument = (docId) => {
    // Mở tài liệu trong tab mới hoặc chuyển hướng đến trang xem tài liệu
    const doc = documents.find((doc) => doc.id === docId);
    if (doc && doc.fileUrl) {
      window.open(doc.fileUrl, "_blank");
    }
  };

  const handleDeleteDocument = async (docId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài liệu này không?")) {
      return;
    }

    try {
      await axios.patch(
        `http://localhost:3000/api/docs/soft-delete/${docId}`,
        { docIds: [docId] },
        { withCredentials: true }
      );

      // Cập nhật danh sách tài liệu sau khi xóa
      setDocuments(documents.filter((doc) => doc.id !== docId));
    } catch (error) {
      console.error("Lỗi khi xóa tài liệu", error);
      alert("Có lỗi xảy ra khi xóa tài liệu");
    }
  };

  // Hiển thị trạng thái loading
  if (loading) {
    return (
      <div className="document-list-loading">
        <div className="spinner">
          <i className="fa-solid fa-spinner fa-spin"></i>
        </div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  // Hiển thị thông báo lỗi
  if (error) {
    return (
      <div className="document-list-error">
        <i className="fa-solid fa-circle-exclamation"></i>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="document-list">
      <div className="document-list__header">
        <h1 className="document-list__title">Tài Liệu Khóa Học</h1>
        <div className="document-list__course-info">
          <h2>{course.title}</h2>
          <p>Giáo viên: {course.teacher?.name}</p>
        </div>

        {isTeacher && (
          <button
            className="document-list__upload-btn"
            onClick={() => navigate(`/courses/${courseId}/upload-document`)}
          >
            <i className="fa-solid fa-upload"></i> Upload Tài Liệu Mới
          </button>
        )}
      </div>

      {documents.length === 0 ? (
        <div className="document-list__empty">
          <i className="fa-solid fa-file-circle-xmark"></i>
          <p>Chưa có tài liệu nào cho khóa học này</p>
          {isTeacher && (
            <button
              onClick={() => navigate(`/courses/${courseId}/upload-document`)}
            >
              Upload Tài Liệu Đầu Tiên
            </button>
          )}
        </div>
      ) : (
        <div className="document-list__container">
          {documents.map((doc) => (
            <div key={doc.id} className="document-list__item">
              <div className="document-list__item-icon">
                <i className="fa-solid fa-file-pdf"></i>
              </div>
              <div className="document-list__item-info">
                <h3>{doc.title}</h3>
              </div>
              <div className="document-list__item-actions">
                <button
                  className="document-list__view-btn"
                  onClick={() => handleViewDocument(doc.id)}
                  title="Xem tài liệu"
                >
                  <i className="fa-solid fa-eye"></i>
                </button>
                {isTeacher && (
                  <button
                    className="document-list__delete-btn"
                    onClick={() => handleDeleteDocument(doc.id)}
                    title="Xóa tài liệu"
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="document-list__footer">
        <button
          className="document-list__back-btn"
          onClick={() => navigate(`/courses/${courseId}`)}
        >
          <i className="fa-solid fa-arrow-left"></i> Quay Lại Khóa Học
        </button>
      </div>
    </div>
  );
}

export default DocumentList;
