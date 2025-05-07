import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "./Enrollments.scss";
import ModalEnrollment from "../../../components/ModalEnrollment";
function Enrollments() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const courseIdFromQuery = queryParams.get("courseId");
  const courseData = location.state?.courseData;

  const [data, setData] = useState({
    courseId: courseIdFromQuery || "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [courseDetails, setCourseDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const handleChange = (event) => {
    setData({
      ...data,
      [event.target.name]: event.target.value,
    });
  };

  useEffect(() => {
    // If we have courseData from state, use it directly
    if (courseData) {
      setCourseDetails(courseData);
      return;
    }

    // Otherwise, if we have a courseId, fetch the course details
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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.courseId) {
      setMessage({ text: "Vui lòng nhập mã khóa học", type: "error" });
      return;
    }

    // If we already have course details, show confirmation
    if (courseDetails) {
      setShowConfirmation(true);
    } else {
      // Otherwise, try to fetch course details first
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

  const confirmEnrollment = async () => {
    try {
      setIsLoading(true);
      const res = await axios.post(
        "http://localhost:3000/api/enrollments",
        data,
        {
          withCredentials: true,
        }
      );
      setMessage({
        text: "Đã gửi yêu cầu tham gia thành công. Vui lòng chờ quản trị viên phê duyệt.",
        type: "success",
      });
      setShowConfirmation(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Lỗi khi gửi yêu cầu", error.response);
      setMessage({
        text: error.response?.data?.message || "Có lỗi xảy ra khi gửi yêu cầu",
        type: "error",
      });
      setIsLoading(false);
    }
  };

  const cancelEnrollment = () => {
    setShowConfirmation(false);
  };
  const fnOpen = () => {
    setIsOpen(true);
  };
  const fnClose = () => {
    setIsOpen(false);
  };
  return (
    <>
      <div className="enrollments">
        {isOpen ? (
          <>
            <ModalEnrollment fnClose={fnClose} />
          </>
        ) : (
          <>
            <button className="enrollments__showItem" onClick={fnOpen}>
              <span className="enrollments__showItem-title">
                Yêu cầu đã gửi{" "}
              </span>
              <i className="fa-solid fa-eye"></i>
            </button>
          </>
        )}

        {showConfirmation ? (
          <div className="enrollments__confirmation">
            <h2 className="enrollments__confirmation-title">
              Xác nhận đăng ký khóa học
            </h2>
            {courseDetails && (
              <div className="enrollments__confirmation-details">
                <div className="course-image">
                  <img
                    src={courseDetails.imageUrl || "/img/default-bg.jpg"}
                    alt={courseDetails.name}
                  />
                </div>
                <h3>{courseDetails.name}</h3>
                <p>
                  <strong>Giáo viên:</strong>{" "}
                  {courseDetails.teacher?.name || "Chưa có thông tin"}
                </p>
                <p>
                  <strong>Thời gian:</strong>{" "}
                  {courseDetails.startDate
                    ? new Date(courseDetails.startDate).toLocaleDateString()
                    : ""}{" "}
                  -{" "}
                  {courseDetails.endDate
                    ? new Date(courseDetails.endDate).toLocaleDateString()
                    : ""}
                </p>
                <p>
                  <strong>Giá:</strong>{" "}
                  {courseDetails.price
                    ? courseDetails.price + " VND"
                    : "Miễn phí"}
                </p>
                <p>
                  <strong>Mô tả:</strong>{" "}
                  {courseDetails.description || "Không có mô tả"}
                </p>
              </div>
            )}
            <p className="enrollments__confirmation-message">
              Bạn có chắc chắn muốn đăng ký khóa học này không?
            </p>
            <div className="enrollments__confirmation-actions">
              <button
                className="enrollments__confirmation-confirm"
                onClick={confirmEnrollment}
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Xác nhận đăng ký"}
              </button>
              <button
                className="enrollments__confirmation-cancel"
                onClick={cancelEnrollment}
                disabled={isLoading}
              >
                Hủy
              </button>
            </div>
          </div>
        ) : (
          <div className="enrollments__box">
            <h2 className="enrollments__box-title">Nhập mã lớp học</h2>
            <p className="enrollments__box-example">Ví dụ : KEH-JSI-KML</p>

            {message.text && (
              <div className={`enrollments__message ${message.type}`}>
                {message.type === "error" ? (
                  <i className="fa-solid fa-circle-exclamation"></i>
                ) : (
                  <i className="fa-solid fa-circle-check"></i>
                )}
                <span>{message.text}</span>
              </div>
            )}

            <form
              className="enrollments__box-form"
              onSubmit={handleSubmit}
              method="POST"
            >
              <div className="enrollments__box-formElements">
                <label htmlFor="enroll_courseId">Mã môn học</label>
                <input
                  className="enrollments__box-courseId"
                  name="courseId"
                  value={data.courseId}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <div className="enrollments__box-formElements">
                <button
                  type="submit"
                  className="enrollments__box-submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Đang xử lý..." : "Tiếp tục"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
export default Enrollments;
