import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDropzone } from "react-dropzone";
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
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        const signal = abortController.signal;
        setLoading(true);

        console.log("Fetching data for course ID:", courseId);

        // Lấy thông tin người dùng
        const userRes = await axios.get(
          `http://localhost:3000/api/users/getPermission`,
          { withCredentials: true, signal }
        );
        console.log("User data:", userRes.data);

        // Lấy thông tin khóa học
        const courseRes = await axios.get(
          `http://localhost:3000/api/courses/${courseId}`,
          { withCredentials: true, signal }
        );
        console.log("Course data:", courseRes.data);

        // Lấy danh sách tài liệu
        const docsUrl = `http://localhost:3000/api/docs/${courseId}/docs`;
        console.log("Fetching docs from:", docsUrl);

        const docsRes = await axios.get(docsUrl, {
          withCredentials: true,
          signal,
        });
        console.log("Documents loaded:", docsRes.data);

        setUser(userRes.data);
        setCourse(courseRes.data);
        setDocuments(docsRes.data);

        // Kiểm tra nếu là giáo viên phụ trách khóa học
        if (
          userRes.data.role === "TEACHER" &&
          userRes.data.id === courseRes.data.teacher?.id
        ) {
          setIsTeacher(true);
          console.log("User is the teacher for this course");
        }

        // Tắt trạng thái loading sau khi tải dữ liệu thành công
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu", error.response?.data || error);
        setError(
          error.response?.data?.message || "Có lỗi xảy ra khi tải dữ liệu"
        );
        setLoading(false);
      }
    };

    fetchData();
    return () => abortController.abort();
  }, [courseId]);
  // Hàm xử lý tải xuống tài liệu
  const handleViewDocument = (docId) => {
    // Tìm tài liệu được chọn
    const doc = documents.find((doc) => doc.id === docId);
    if (doc && doc.fileUrl) {
      console.log("Tải xuống tài liệu:", doc.title, doc.fileUrl);

      // Sử dụng URL gốc để tải xuống trực tiếp
      window.open(doc.fileUrl, "_blank");
    } else {
      console.error("Không tìm thấy tài liệu hoặc URL tài liệu trống");
      alert("Không tìm thấy tài liệu hoặc URL tài liệu trống");
    }
  };
  const handleDeleteDocument = async (docId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa tài liệu này không?")) {
      return;
    }

    try {
      // Thực hiện xóa mềm tài liệu
      await axios.patch(
        `http://localhost:3000/api/docs/soft-delete/${docId}`,
        { docIds: [docId] },
        {
          withCredentials: true,
          params: { courseId: courseId }, // Thêm courseId vào query params
        }
      );

      // Cập nhật danh sách tài liệu sau khi xóa
      setDocuments(documents.filter((doc) => doc.id !== docId));
      alert("Xóa tài liệu thành công");
    } catch (error) {
      console.error("Lỗi khi xóa tài liệu", error.response?.data || error);
      alert(
        "Có lỗi xảy ra khi xóa tài liệu: " +
          (error.response?.data?.message || error.message)
      );
    }
  };
  const onDrop = async (acceptedFiles) => {
    if (!isTeacher) return;

    try {
      // Xử lý từng file một
      for (const file of acceptedFiles) {
        console.log("Uploading file:", file.name, file.type, file.size);

        const formData = new FormData();
        formData.append("file", file); // Đổi "files" thành "file" theo yêu cầu API
        formData.append("courseId", courseId);
        formData.append("title", file.name); // Thêm title cho tài liệu

        const res = await axios.post(
          `http://localhost:3000/api/docs/create`,
          formData,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Upload response:", res.data);

        // Cập nhật danh sách tài liệu sau khi upload
        if (res.data && res.data.doc) {
          setDocuments((prevDocs) => [...prevDocs, res.data.doc]);
        }
      }

      alert("Tải tài liệu lên thành công");
    } catch (error) {
      console.error("Lỗi khi upload tài liệu", error.response?.data || error);
      alert(
        "Có lỗi xảy ra khi upload tài liệu: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
      "application/vnd.ms-powerpoint": [".ppt"],
      "application/vnd.openxmlformats-officedocument.presentationml.presentation":
        [".pptx"],
      "text/plain": [".txt"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
  });

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
    <div className="document-list" {...(isTeacher ? getRootProps() : {})}>
      {isTeacher && <input {...getInputProps()} />}
      {isTeacher && isDragActive && (
        <div className="document-list__dropzone">
          <i className="fa-solid fa-file-arrow-up"></i>
          <p>Thả tệp vào đây để tải lên</p>
        </div>
      )}

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
              {" "}
              <div className="document-list__item-icon">
                {doc.fileUrl && doc.fileUrl.includes(".pdf") ? (
                  <i className="fa-solid fa-file-pdf"></i>
                ) : doc.fileUrl &&
                  (doc.fileUrl.includes(".doc") ||
                    doc.fileUrl.includes(".docx")) ? (
                  <i className="fa-solid fa-file-word"></i>
                ) : doc.fileUrl &&
                  (doc.fileUrl.includes(".ppt") ||
                    doc.fileUrl.includes(".pptx")) ? (
                  <i className="fa-solid fa-file-powerpoint"></i>
                ) : (
                  <i className="fa-solid fa-file"></i>
                )}
              </div>
              <div className="document-list__item-info">
                <h3>{doc.title}</h3>
              </div>
              <div className="document-list__item-actions">
                <button
                  className="document-list__view-btn"
                  onClick={() => handleViewDocument(doc.id)}
                  title="Tải xuống tài liệu"
                >
                  <i className="fa-solid fa-download"></i>
                </button>{" "}
                <button
                  className="document-list__view-btn"
                  onClick={() => {
                    // Sử dụng PDF.js để xem trước thay vì Google Docs Viewer
                    // Chrome, Edge và Firefox có trình xem PDF tích hợp sẵn
                    console.log("Xem tài liệu với URL:", doc.fileUrl);
                    window.open(doc.fileUrl, "_blank");
                  }}
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
