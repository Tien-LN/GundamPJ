import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { format } from "date-fns";
import "./LessonManagement.scss";

function LessonManagement() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [course, setCourse] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: format(new Date(), "yyyy-MM-dd"),
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [lessonToDelete, setLessonToDelete] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch course, user and lessons data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch course details
        const courseRes = await axios.get(
          `http://localhost:3000/api/courses/${courseId}`,
          { withCredentials: true }
        );
        setCourse(courseRes.data);

        // Fetch user details
        const userRes = await axios.get(
          "http://localhost:3000/api/users/getPermission",
          { withCredentials: true }
        );
        setUser(userRes.data);

        // Fetch lessons
        const lessonsRes = await axios.get(
          `http://localhost:3000/api/lessons/${courseId}/lessons`,
          { withCredentials: true }
        );
        setLessons(lessonsRes.data);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  // Check if user has permission to manage lessons
  const hasPermission = () => {
    if (!user || !course) return false;
    return user.role === "TEACHER" && user.id === course.teacher?.id;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error for this field when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: null });
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Tiêu đề không được để trống";
    if (!formData.date) errors.date = "Ngày không được để trống";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (editingLesson) {
        // Update existing lesson
        await axios.patch(
          `http://localhost:3000/api/lessons/${courseId}/lessons/${editingLesson.id}`,
          formData,
          { withCredentials: true }
        );

        // Update lessons list
        setLessons(
          lessons.map((lesson) =>
            lesson.id === editingLesson.id ? { ...lesson, ...formData } : lesson
          )
        );

        setSuccessMessage("Cập nhật bài học thành công!");
      } else {
        // Create new lesson
        const response = await axios.post(
          `http://localhost:3000/api/lessons/${courseId}/lessons/create`,
          formData,
          { withCredentials: true }
        );

        // Add new lesson to list
        setLessons([...lessons, response.data.lesson]);
        setSuccessMessage("Tạo bài học mới thành công!");
      }

      // Reset form
      resetForm();

      // Hide success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error saving lesson:", err);
      setError("Có lỗi xảy ra khi lưu bài học. Vui lòng thử lại.");
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      date: format(new Date(), "yyyy-MM-dd"),
    });
    setEditingLesson(null);
    setShowForm(false);
    setFormErrors({});
  };

  // Edit lesson
  const handleEdit = (lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title,
      description: lesson.description || "",
      date: format(new Date(lesson.date), "yyyy-MM-dd"),
    });
    setShowForm(true);
  };

  // Delete lesson
  const handleDelete = (lesson) => {
    setLessonToDelete(lesson);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:3000/api/lessons/${courseId}/lessons`,
        {
          data: { lessonIds: [lessonToDelete.id] },
          withCredentials: true,
        }
      );

      // Remove from lessons list
      setLessons(lessons.filter((lesson) => lesson.id !== lessonToDelete.id));
      setShowDeleteModal(false);
      setLessonToDelete(null);
      setSuccessMessage("Xóa bài học thành công!");

      // Hide success message after 3 seconds
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      console.error("Error deleting lesson:", err);
      setError("Có lỗi xảy ra khi xóa bài học. Vui lòng thử lại.");
      setShowDeleteModal(false);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setLessonToDelete(null);
  };

  // Go back to course detail
  const handleBack = () => {
    navigate(`/courses/${courseId}`);
  };

  if (loading) {
    return (
      <div className="lesson-management__loading">
        <div className="spinner">
          <i className="fa-solid fa-spinner fa-spin"></i>
        </div>
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="lesson-management__error">
        <i className="fa-solid fa-circle-exclamation"></i>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Thử lại</button>
      </div>
    );
  }

  // Check permission
  if (!hasPermission()) {
    return (
      <div className="lesson-management__error">
        <i className="fa-solid fa-lock"></i>
        <p>Bạn không có quyền quản lý bài học cho khóa học này.</p>
        <button onClick={handleBack}>Quay lại</button>
      </div>
    );
  }

  return (
    <div className="lesson-management">
      <div className="lesson-management__header">
        <button className="lesson-management__back-btn" onClick={handleBack}>
          <i className="fa-solid fa-arrow-left"></i> Quay lại
        </button>
        <h1>Quản lý bài học - {course?.name}</h1>
      </div>

      {successMessage && (
        <div className="lesson-management__success">
          <i className="fa-solid fa-check-circle"></i>
          <p>{successMessage}</p>
        </div>
      )}

      <div className="lesson-management__actions">
        {!showForm ? (
          <button
            className="lesson-management__add-btn"
            onClick={() => setShowForm(true)}
          >
            <i className="fa-solid fa-plus"></i> Thêm bài học mới
          </button>
        ) : (
          <button className="lesson-management__cancel-btn" onClick={resetForm}>
            <i className="fa-solid fa-times"></i> Hủy
          </button>
        )}
      </div>

      {showForm && (
        <div className="lesson-management__form-container">
          <h2>{editingLesson ? "Cập nhật bài học" : "Thêm bài học mới"}</h2>
          <form onSubmit={handleSubmit} className="lesson-management__form">
            <div className="form-group">
              <label htmlFor="title">
                Tiêu đề <span className="required">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={formErrors.title ? "error" : ""}
              />
              {formErrors.title && (
                <div className="error-message">{formErrors.title}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="date">
                Ngày <span className="required">*</span>
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={formErrors.date ? "error" : ""}
              />
              {formErrors.date && (
                <div className="error-message">{formErrors.date}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="description">Mô tả</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="5"
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="button" onClick={resetForm} className="cancel-btn">
                Hủy
              </button>
              <button type="submit" className="save-btn">
                {editingLesson ? "Cập nhật" : "Lưu"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="lesson-management__list">
        <h2>Danh sách bài học</h2>
        {lessons.length === 0 ? (
          <div className="lesson-management__empty">
            <i className="fa-solid fa-book"></i>
            <p>Chưa có bài học nào. Hãy thêm bài học mới!</p>
          </div>
        ) : (
          <div className="lesson-management__table-container">
            <table className="lesson-management__table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tiêu đề</th>
                  <th>Ngày</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson, index) => (
                  <tr key={lesson.id}>
                    <td>{index + 1}</td>
                    <td>{lesson.title}</td>
                    <td>{format(new Date(lesson.date), "dd/MM/yyyy")}</td>
                    <td className="actions">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(lesson)}
                        title="Chỉnh sửa"
                      >
                        <i className="fa-solid fa-edit"></i>
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(lesson)}
                        title="Xóa"
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Xác nhận xóa</h3>
            <p>Bạn có chắc chắn muốn xóa bài học "{lessonToDelete?.title}"?</p>
            <div className="modal-actions">
              <button onClick={cancelDelete} className="cancel-btn">
                Hủy
              </button>
              <button onClick={confirmDelete} className="delete-btn">
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LessonManagement;
