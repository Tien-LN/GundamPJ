import { useState, useContext } from "react";
import "./myaccount.css";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import { AuthContext } from "../../../contexts/AuthContext";

function MyAccount() {
  const { user, updateUser } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [date, setDate] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [changeName, setChangeName] = useState(false);
  const [changeAddress, setChangeAddress] = useState(false);
  const [changePhone, setChangePhone] = useState(false);
  const [changeGender, setChangeGender] = useState(false);
  const [changeDate, setChangeDate] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [changeAvatar, setChangeAvatar] = useState(false);

  const handleChangeName = (e) => {
    const value = e.target.value;
    setName(value);
    validateForm("name", value);
  };
  const onChangeName = () => {
    setChangeName(!changeName);
  };
  const handleChangePhone = (e) => {
    const value = e.target.value;
    setPhone(value);
    validateForm("phone", value);
  };
  const onChangePhone = () => {
    setChangePhone(!changePhone);
  };
  const handleChangeAddress = (e) => {
    setAddress(e.target.value);
  };
  const onChangeAddress = () => {
    setChangeAddress(!changeAddress);
  };
  const handleChangeDate = (date) => {
    setDate(date);
  };
  const onChangeDate = () => {
    setChangeDate(!changeDate);
  };
  const onChangeGender = () => {
    setChangeGender(!changeGender);
  };
  const handleChangeGender = (e) => {
    setGender(e.target.value);
  };

  const onChangePassword = () => {
    setChangePassword(!changePassword);
  };

  const handleChangeCurrentPassword = (e) => {
    const value = e.target.value;
    setCurrentPassword(value);
    validateForm("currentPassword", value);
  };

  const handleChangeNewPassword = (e) => {
    const value = e.target.value;
    setNewPassword(value);
    validateForm("newPassword", value);
  };

  const handleChangeConfirmPassword = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    validateForm("confirmPassword", value);
  };

  const onChangeAvatar = () => {
    setChangeAvatar(!changeAvatar);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveAvatar = async () => {
    if (!avatarFile) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);

    const formData = new FormData();
    formData.append("avatar", avatarFile);

    try {
      const res = await axios.patch(
        "http://localhost:3000/api/users/updateAvatar",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setChangeAvatar(false);
      updateUser({ ...user, avatar: res.data.avatar });
      setSubmitSuccess(true);
      setAvatarFile(null);
    } catch (error) {
      console.error("Error updating avatar:", error);
      setErrors({
        ...errors,
        avatar: "Không thể cập nhật ảnh đại diện. Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSavePassword = async () => {
    // Validate password fields
    let isValid = true;
    isValid = validateForm("currentPassword", currentPassword) && isValid;
    isValid = validateForm("newPassword", newPassword) && isValid;
    isValid = validateForm("confirmPassword", confirmPassword) && isValid;

    if (!isValid) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      await axios.put(
        "http://localhost:3000/api/users/me/password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            "Content-type": "application/json",
          },
          withCredentials: true,
        }
      );

      setChangePassword(false);
      setSubmitSuccess(true);

      // Reset password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Error updating password:", error);
      if (error.response && error.response.status === 401) {
        setErrors({
          ...errors,
          currentPassword: "Mật khẩu hiện tại không đúng",
        });
      } else {
        setErrors({
          ...errors,
          submit: "Không thể cập nhật mật khẩu. Vui lòng thử lại sau.",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleSave = async () => {
    // Validate all fields
    let isValid = true;
    if (name) isValid = validateForm("name", name) && isValid;
    if (phone) isValid = validateForm("phone", phone) && isValid;

    if (!isValid) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);

    const updateData = {
      name: name || user?.name,
      address: address || user?.address,
      gender: gender || user?.gender,
      phone: phone || user?.phone,
      dateOfBirth: date || user?.dateOfBirth,
    };

    try {
      const res = await axios.put(
        "http://localhost:3000/api/users/me/update",
        updateData,
        {
          headers: {
            "Content-type": "application/json",
          },
          withCredentials: true,
        }
      );

      setChangeName(false);
      setChangeAddress(false);
      setChangeDate(false);
      setChangeGender(false);
      setChangePhone(false);
      updateUser(updateData);
      setSubmitSuccess(true);

      // Reset form fields
      setName("");
      setAddress("");
      setPhone("");
      setGender("");
      setDate(null);
    } catch (error) {
      console.error("Error updating user:", error);
      setErrors({
        ...errors,
        submit: "Không thể cập nhật thông tin. Vui lòng thử lại sau.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  // Form validation
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = (field, value) => {
    let newErrors = { ...errors };

    switch (field) {
      case "phone":
        if (value && !/^[0-9]{10,11}$/.test(value)) {
          newErrors.phone = "Số điện thoại phải có 10-11 chữ số";
        } else {
          delete newErrors.phone;
        }
        break;
      case "name":
        if (value && value.length < 2) {
          newErrors.name = "Tên phải có ít nhất 2 ký tự";
        } else {
          delete newErrors.name;
        }
        break;
      case "currentPassword":
        if (value && value.length < 6) {
          newErrors.currentPassword = "Mật khẩu phải có ít nhất 6 ký tự";
        } else {
          delete newErrors.currentPassword;
        }
        break;
      case "newPassword":
        if (value && value.length < 6) {
          newErrors.newPassword = "Mật khẩu mới phải có ít nhất 6 ký tự";
        } else {
          delete newErrors.newPassword;
        }
        break;
      case "confirmPassword":
        if (value !== newPassword) {
          newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
        } else {
          delete newErrors.confirmPassword;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // User data is already provided by AuthContext

  return (
    <>
      <div className="myaccount__container">
        <div className="myaccount__box">
          <div className="myaccount__box-heading-container">
            <div className="myaccount__box-heading">ACCOUNT</div>
            <div className="myaccount__box-avatar-container">
              <img
                className="myaccount__box-avatar"
                src={avatarPreview || user?.avatarUrl || "./img/Account.png"}
                alt="Profile avatar"
              />
              <div
                className="myaccount__box-info--name-change avatar-edit"
                onClick={onChangeAvatar}
              >
                <i className="fa-solid fa-camera"></i>
              </div>
            </div>
          </div>
          {submitSuccess && (
            <div className="success-message">
              Thông tin đã được cập nhật thành công!
            </div>
          )}

          {errors.submit && (
            <div className="error-message global-error">{errors.submit}</div>
          )}

          <div className="myaccount__box-info">
            <div className="myaccount__box-info--name">
              <div className="myaccount__box-info--name-box">
                <div>Name</div>
                {changeName ? (
                  <div>
                    <input
                      placeholder={user?.name ? user.name : "Nhập tên của bạn"}
                      id="name"
                      type="text"
                      value={name}
                      onChange={handleChangeName}
                    />
                    {errors.name && (
                      <div className="error-message">{errors.name}</div>
                    )}
                    <button onClick={handleSave} disabled={isSubmitting}>
                      {isSubmitting ? "Đang lưu..." : "Lưu"}
                    </button>
                  </div>
                ) : (
                  <div>{user?.name ? user.name : "Loading"}</div>
                )}
              </div>
              <div
                className="myaccount__box-info--name-change"
                onClick={onChangeName}
              >
                <i className="fa-solid fa-pencil"></i>
              </div>
            </div>
            <div className="myaccount__box-info--date">
              <div className="myaccount__box-info--date-box">
                <div>Date of birth</div>
                {changeDate ? (
                  <div>
                    <DatePicker
                      selected={date}
                      onChange={(date) => handleChangeDate(date)}
                      dateFormat="dd/MM/yyyy"
                      placeholderText={
                        user?.dateOfBirth
                          ? format(new Date(user.dateOfBirth), "dd/MM/yyyy")
                          : "Nhập ngày"
                      }
                      id="date"
                      name="dateOfBirth"
                      className=""
                    />
                    <button onClick={handleSave} disabled={isSubmitting}>
                      {isSubmitting ? "Đang lưu..." : "Lưu"}
                    </button>
                  </div>
                ) : (
                  <div className="myaccount__box-info--descript">
                    {user?.dateOfBirth
                      ? format(new Date(user.dateOfBirth), "dd/MM/yyyy")
                      : "Loading..."}
                  </div>
                )}
              </div>
              <div
                className="myaccount__box-info--name-change"
                onClick={onChangeDate}
              >
                <i className="fa-solid fa-pencil"></i>
              </div>
            </div>
            <div className="myaccount__box-info--phone">
              <div className="myaccount__box-info--phone-box">
                <div>Phone number</div>
                {changePhone ? (
                  <div>
                    <input
                      placeholder={
                        user?.phone ? user.phone : "Nhập số điện thoại"
                      }
                      type="text"
                      value={phone}
                      onChange={handleChangePhone}
                    />
                    {errors.phone && (
                      <div className="error-message">{errors.phone}</div>
                    )}
                    <button onClick={handleSave} disabled={isSubmitting}>
                      {isSubmitting ? "Đang lưu..." : "Lưu"}
                    </button>
                  </div>
                ) : (
                  <div>{user?.phone ? user.phone : "Loading"}</div>
                )}
              </div>
              <div
                className="myaccount__box-info--name-change"
                onClick={onChangePhone}
              >
                <i className="fa-solid fa-pencil"></i>
              </div>
            </div>
            <div className="myaccount__box-info--gender">
              <div>
                <div>Gender</div>
                {changeGender ? (
                  <div>
                    <select
                      name="gender"
                      value={gender}
                      onChange={handleChangeGender}
                    >
                      <option value="" disabled>
                        Chọn giới tính
                      </option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                    <button onClick={handleSave} disabled={isSubmitting}>
                      {isSubmitting ? "Đang lưu..." : "Lưu"}
                    </button>
                  </div>
                ) : (
                  <div className="myaccount__box-info--descript">
                    {user?.gender || "Loading..."}
                  </div>
                )}
              </div>
              <div
                className="myaccount__box-info--name-change"
                onClick={onChangeGender}
              >
                <i className="fa-solid fa-pencil"></i>
              </div>
            </div>
            <div className="myaccount__box-info--address">
              <div className="myaccount__box-info--address-box">
                <div>Address</div>
                {changeAddress ? (
                  <div>
                    <input
                      placeholder={
                        user?.address ? user.address : "Nhập địa chỉ"
                      }
                      type="text"
                      value={address}
                      onChange={handleChangeAddress}
                    />
                    <button onClick={handleSave} disabled={isSubmitting}>
                      {isSubmitting ? "Đang lưu..." : "Lưu"}
                    </button>
                  </div>
                ) : (
                  <div>{user?.address ? user.address : "Loading"}</div>
                )}
              </div>
              <div
                className="myaccount__box-info--name-change"
                onClick={onChangeAddress}
              >
                <i className="fa-solid fa-pencil"></i>
              </div>
            </div>
            <div className="myaccount__box-info--password">
              <div className="myaccount__box-info--password-box">
                <div>Password</div>
                {changePassword ? (
                  <div>
                    <div className="password-fields">
                      <input
                        type="password"
                        placeholder="Mật khẩu hiện tại"
                        value={currentPassword}
                        onChange={handleChangeCurrentPassword}
                      />
                      {errors.currentPassword && (
                        <div className="error-message">
                          {errors.currentPassword}
                        </div>
                      )}

                      <input
                        type="password"
                        placeholder="Mật khẩu mới"
                        value={newPassword}
                        onChange={handleChangeNewPassword}
                      />
                      {errors.newPassword && (
                        <div className="error-message">
                          {errors.newPassword}
                        </div>
                      )}

                      <input
                        type="password"
                        placeholder="Xác nhận mật khẩu mới"
                        value={confirmPassword}
                        onChange={handleChangeConfirmPassword}
                      />
                      {errors.confirmPassword && (
                        <div className="error-message">
                          {errors.confirmPassword}
                        </div>
                      )}
                    </div>
                    <button
                      onClick={handleSavePassword}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Đang lưu..." : "Lưu"}
                    </button>
                  </div>
                ) : (
                  <div className="myaccount__box-info--descript">********</div>
                )}
              </div>
              <div
                className="myaccount__box-info--name-change"
                onClick={onChangePassword}
              >
                <i className="fa-solid fa-pencil"></i>
              </div>
            </div>
          </div>

          {changeAvatar && (
            <div className="avatar-upload-container">
              <h3>Cập nhật ảnh đại diện</h3>
              <div className="avatar-upload">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  id="avatar-upload"
                />
                <label htmlFor="avatar-upload" className="upload-button">
                  <i className="fa-solid fa-upload"></i> Chọn ảnh
                </label>
                {avatarPreview && (
                  <div className="avatar-preview-container">
                    <img
                      src={avatarPreview}
                      alt="Preview"
                      className="avatar-preview"
                    />
                  </div>
                )}
                {errors.avatar && (
                  <div className="error-message">{errors.avatar}</div>
                )}
                <div className="avatar-actions">
                  <button
                    onClick={handleSaveAvatar}
                    disabled={!avatarFile || isSubmitting}
                    className="save-avatar-btn"
                  >
                    {isSubmitting ? "Đang lưu..." : "Lưu ảnh đại diện"}
                  </button>
                  <button
                    onClick={() => {
                      setChangeAvatar(false);
                      setAvatarFile(null);
                      setAvatarPreview(null);
                    }}
                    className="cancel-btn"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default MyAccount;
