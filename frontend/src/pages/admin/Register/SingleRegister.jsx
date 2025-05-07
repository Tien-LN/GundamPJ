import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SingleRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "STUDENT",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/admin/register",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setSuccess(
        "User registered successfully! A temporary password has been sent to their email."
      );
      setFormData({
        name: "",
        email: "",
        role: "STUDENT",
      });
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      setError(
        error.response?.data?.message ||
          "Failed to register user. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-register-single">
      <div className="admin-card">
        <div className="admin-card__header">
          <h1 className="admin-card__title">Register New User</h1>
        </div>

        {error && (
          <div className="alert alert--error">
            <i className="fa-solid fa-circle-exclamation"></i>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert--success">
            <i className="fa-solid fa-circle-check"></i>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter user's full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter user's email address"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="admin-btn admin-btn--secondary"
              onClick={() => navigate("/admin/registers/multi")}
            >
              <i className="fa-solid fa-users"></i>
              Bulk Register
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn--primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Registering...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-user-plus"></i>
                  Register User
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SingleRegister;
