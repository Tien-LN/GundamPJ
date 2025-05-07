import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./UserOnboarding.scss";
import { AuthContext } from "../../../contexts/AuthContext";

function UserOnboarding() {
  const navigate = useNavigate();
  const { user, updateUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    gender: user?.gender || "",
    address: user?.address || "",
    dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth) : null,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // If user is not logged in, redirect to login
    if (!user) {
      navigate("/login");
      return;
    }

    // If user already has all required profile fields, redirect to dashboard
    if (
      user.name &&
      user.phone &&
      user.gender &&
      user.address &&
      user.dateOfBirth
    ) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when field is being edited
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      dateOfBirth: date,
    }));

    // Clear error when field is being edited
    if (errors.dateOfBirth) {
      setErrors((prev) => ({
        ...prev,
        dateOfBirth: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Họ tên không được để trống";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!/^\d{10,11}$/.test(formData.phone.trim())) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.gender) {
      newErrors.gender = "Vui lòng chọn giới tính";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Địa chỉ không được để trống";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Ngày sinh không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(
        "http://localhost:3000/api/users/me/update",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // Update user in context
      updateUser(response.data);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating user profile:", error);
      setErrors({
        submit: "Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="onboarding-container">
      <div className="onboarding-card">
        <div className="onboarding-header">
          <h1>Hoàn thành hồ sơ của bạn</h1>
          <p>
            Vui lòng cung cấp thông tin cá nhân để tiếp tục sử dụng hệ thống
          </p>
        </div>

        {errors.submit && (
          <div className="error-message global-error">{errors.submit}</div>
        )}

        <form onSubmit={handleSubmit} className="onboarding-form">
          <div className="form-group">
            <label htmlFor="name">Họ và tên</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              className={errors.name ? "error" : ""}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
              className={errors.phone ? "error" : ""}
            />
            {errors.phone && (
              <div className="error-message">{errors.phone}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="gender">Giới tính</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={errors.gender ? "error" : ""}
            >
              <option value="" disabled>
                Chọn giới tính
              </option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
            {errors.gender && (
              <div className="error-message">{errors.gender}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="dateOfBirth">Ngày sinh</label>
            <DatePicker
              selected={formData.dateOfBirth}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày sinh"
              id="dateOfBirth"
              name="dateOfBirth"
              className={errors.dateOfBirth ? "error" : ""}
              showYearDropdown
              scrollableYearDropdown
              yearDropdownItemNumber={100}
            />
            {errors.dateOfBirth && (
              <div className="error-message">{errors.dateOfBirth}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="address">Địa chỉ</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Nhập địa chỉ"
              className={errors.address ? "error" : ""}
              rows="3"
            ></textarea>
            {errors.address && (
              <div className="error-message">{errors.address}</div>
            )}
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Đang xử lý...
              </>
            ) : (
              "Hoàn thành"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UserOnboarding;
