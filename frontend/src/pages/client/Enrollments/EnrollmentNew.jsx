import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate, Link } from "react-router-dom";
import "./EnrollmentNew.scss";
import { format } from "date-fns";

function EnrollmentNew() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const courseIdFromQuery = queryParams.get("courseId");
  const courseData = location.state?.courseData;

  const [data, setData] = useState({
    courseId: courseIdFromQuery || "",
  });
  const [showModal, setShowModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [courseDetails, setCourseDetails] = useState(null);
  const [enrollmentHistory, setEnrollmentHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  // Xử lý thay đổi input
  const handleChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  // Lấy thông tin khóa học khi có courseId
  useEffect(() => {
    // Nếu có courseData từ state, sử dụng trực tiếp
    if (courseData) {
      setCourseDetails(courseData);
      return;
    }

    // Nếu có courseId, lấy thông tin khóa học
    if (data.courseId) {
      const fetchCourseDetails = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(
            `http://localhost:3000/api/courses/${data.courseId}`,
            {
              withCredentials: true,
            }
          );
          setCourseDetails(response.data);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching course details:", error);
          setMessage({
            text: "Không tìm thấy khóa học với mã này. Vui lòng kiểm tra lại.",
            type: "error",
          });
          setIsLoading(false);
        }
      };
      fetchCourseDetails();
    }
  }, [data.courseId, courseData]);

  // Xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.courseId) {
      setMessage({ text: "Vui lòng nhập mã khóa học", type: "error" });
      return;
    }

    // Nếu đã có thông tin khóa học, hiển thị xác nhận
    if (courseDetails) {
      setShowConfirmation(true);
    } else {
      // Nếu chưa có, lấy thông tin khóa học trước
      const fetchCourseDetails = async () => {
        try {
          setIsLoading(true);
          const response = await axios.get(
            `http://localhost:3000/api/courses/${data.courseId}`,
            {
              withCredentials: true,
            }
          );
          setCourseDetails(response.data);
          setShowConfirmation(true);
          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching course details:", error);
          setMessage({
            text: "Không tìm thấy khóa học với mã này. Vui lòng kiểm tra lại.",
            type: "error",
          });
          setIsLoading(false);
        }
      };
      fetchCourseDetails();
    }
  };

  // Xác nhận đăng ký khóa học
  const confirmEnrollment = async () => {
    try {
      setIsLoading(true);
      await axios.post("http://localhost:3000/api/enrollments", data, {
        withCredentials: true,
      });
      setMessage({
        text: "Đã gửi yêu cầu tham gia thành công. Vui lòng chờ quản trị viên phê duyệt.",
        type: "success",
      });
      setShowConfirmation(false);
      setData({ courseId: "" }); // Reset form
      setIsLoading(false);

      // Cập nhật lịch sử đăng ký
      fetchEnrollmentHistory();
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu", error.response);
      setMessage({
        text: error.response?.data?.message || "Có lỗi xảy ra khi gửi yêu cầu",
        type: "error",
      });
      setIsLoading(false);
    }
  };

  // Hủy đăng ký
  const cancelEnrollment = () => {
    setShowConfirmation(false);
  };

  // Lấy lịch sử đăng ký
  const fetchEnrollmentHistory = async () => {
    try {
      setIsHistoryLoading(true);
      const response = await axios.get(
        "http://localhost:3000/api/enrollments/my-account",
        {
          withCredentials: true,
        }
      );
      setEnrollmentHistory(response.data);
      setIsHistoryLoading(false);
    } catch (error) {
      console.error("Error fetching enrollment history:", error);
      setIsHistoryLoading(false);
    }
  };

  // Mở modal lịch sử đăng ký
  const openHistoryModal = () => {
    fetchEnrollmentHistory();
    setShowModal(true);
  };

  // Đóng modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Hiển thị trạng thái đăng ký
  const renderStatus = (status) => {
    switch (status) {
      case "APPROVED":
        return (
          <span className="enrollment-page__history-status enrollment-page__history-status--approved">
            <i className="fa-solid fa-check-circle"></i> Đã duyệt
          </span>
        );
      case "PENDING":
        return (
          <span className="enrollment-page__history-status enrollment-page__history-status--pending">
            <i className="fa-solid fa-clock"></i> Đang chờ
          </span>
        );
      case "REJECTED":
        return (
          <span className="enrollment-page__history-status enrollment-page__history-status--rejected">
            <i className="fa-solid fa-times-circle"></i> Đã từ chối
          </span>
        );
      default:
        return status;
    }
  };

  return (
    <div className="enrollment-page">
      {/* Nút xem lịch sử đăng ký */}
      <button
        className="enrollment-page__history-button"
        onClick={openHistoryModal}
      >
        <i className="fa-solid fa-history"></i>
        <span>Yêu cầu đã gửi</span>
      </button>

      {/* Header */}
      <div className="enrollment-page__header">
        <h1>Đăng ký khóa học</h1>
        <p>
          Nhập mã khóa học bên dưới để đăng ký tham gia. Sau khi gửi yêu cầu,
          bạn sẽ cần chờ quản trị viên phê duyệt.
        </p>
      </div>

      {/* Form container */}
      <div className="enrollment-page__form-container">
        {/* Thông báo */}
        {message.text && (
          <div
            className={`enrollment-page__message enrollment-page__message--${message.type}`}
          >
            <i
              className={`fa-solid ${
                message.type === "error"
                  ? "fa-circle-exclamation"
                  : "fa-circle-check"
              }`}
            ></i>
            <span>{message.text}</span>
          </div>
        )}

        {/* Form đăng ký */}
        {!showConfirmation && (
          <form className="enrollment-page__form" onSubmit={handleSubmit}>
            <div className="enrollment-page__form-group">
              <label htmlFor="courseId">Mã khóa học</label>
              <input
                type="text"
                id="courseId"
                name="courseId"
                value={data.courseId}
                onChange={handleChange}
                placeholder="Nhập mã khóa học"
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              className="enrollment-page__form-submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner"></span>
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-paper-plane"></i>
                  <span>Gửi yêu cầu</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Xác nhận đăng ký */}
        {showConfirmation && courseDetails && (
          <div className="enrollment-page__confirmation">
            <div className="enrollment-page__confirmation-header">
              <h2>Xác nhận đăng ký khóa học</h2>
            </div>

            <div className="enrollment-page__confirmation-content">
              <div className="enrollment-page__confirmation-course">
                <div className="enrollment-page__confirmation-course-image">
                  <img
                    src={courseDetails.imageUrl || "/img/default-bg.jpg"}
                    alt={courseDetails.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/img/default-bg.jpg";
                    }}
                  />
                </div>

                <h3 className="enrollment-page__confirmation-course-title">
                  {courseDetails.name}
                </h3>

                <div className="enrollment-page__confirmation-course-info">
                  <div className="enrollment-page__confirmation-course-info-item">
                    <strong>Giáo viên:</strong>
                    <span>
                      {courseDetails.teacher?.name || "Chưa có thông tin"}
                    </span>
                  </div>

                  {courseDetails.startDate && courseDetails.endDate && (
                    <div className="enrollment-page__confirmation-course-info-item">
                      <strong>Thời gian:</strong>
                      <span>
                        {format(
                          new Date(courseDetails.startDate),
                          "dd/MM/yyyy"
                        )}{" "}
                        -{format(new Date(courseDetails.endDate), "dd/MM/yyyy")}
                      </span>
                    </div>
                  )}

                  <div className="enrollment-page__confirmation-course-info-item">
                    <strong>Học phí:</strong>
                    <span>
                      {courseDetails.price
                        ? `${courseDetails.price.toLocaleString()} VND`
                        : "Miễn phí"}
                    </span>
                  </div>

                  <div className="enrollment-page__confirmation-course-info-item">
                    <strong>Mô tả:</strong>
                    <span>{courseDetails.description || "Không có mô tả"}</span>
                  </div>
                </div>
              </div>

              <p className="enrollment-page__confirmation-message">
                Bạn có chắc chắn muốn đăng ký khóa học này không?
              </p>

              <div className="enrollment-page__confirmation-actions">
                <button
                  className="enrollment-page__confirmation-actions-confirm"
                  onClick={confirmEnrollment}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-check"></i>
                      <span>Xác nhận đăng ký</span>
                    </>
                  )}
                </button>

                <button
                  className="enrollment-page__confirmation-actions-cancel"
                  onClick={cancelEnrollment}
                  disabled={isLoading}
                >
                  <i className="fa-solid fa-times"></i>
                  <span>Hủy</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal lịch sử đăng ký */}
      {showModal && (
        <div className="enrollment-page__modal">
          <div className="enrollment-page__modal-content">
            <div className="enrollment-page__modal-header">
              <h2>Lịch sử đăng ký khóa học</h2>
              <button
                className="enrollment-page__modal-header-close"
                onClick={closeModal}
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>

            <div className="enrollment-page__modal-body">
              {isHistoryLoading ? (
                <div className="enrollment-page__history-loading">
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <p>Đang tải lịch sử đăng ký...</p>
                </div>
              ) : enrollmentHistory && enrollmentHistory.length > 0 ? (
                <table className="enrollment-page__history-table">
                  <thead>
                    <tr>
                      <th>Khóa học</th>
                      <th>Ngày đăng ký</th>
                      <th>Trạng thái</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollmentHistory.map((enrollment) => (
                      <tr key={enrollment.id}>
                        <td>
                          {enrollment.course
                            ? enrollment.course.name
                            : "Khóa học đã bị xóa"}
                        </td>
                        <td>
                          {format(
                            new Date(enrollment.createdAt),
                            "dd/MM/yyyy HH:mm"
                          )}
                        </td>
                        <td>{renderStatus(enrollment.status)}</td>
                        <td>
                          {enrollment.status === "APPROVED" &&
                            enrollment.course && (
                              <Link
                                to={`/courses/${enrollment.course.id}`}
                                className="enrollment-page__history-view-button"
                              >
                                <i className="fa-solid fa-eye"></i> Xem
                              </Link>
                            )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="enrollment-page__history-empty">
                  <i className="fa-solid fa-inbox"></i>
                  <p>Bạn chưa đăng ký khóa học nào</p>
                  <Link
                    to="/all-courses"
                    className="enrollment-page__form-submit"
                  >
                    <i className="fa-solid fa-search"></i>
                    <span>Tìm khóa học</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnrollmentNew;
