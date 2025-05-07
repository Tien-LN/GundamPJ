import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import { AuthContext } from "../../contexts/AuthContext";
function Auth() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing again
    if (error) setError("");
  };

  const submitHandle = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!loginData.email || !loginData.password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await login(loginData);

      if (res.user) {
        console.log("User data after login:", res.user);
        if (res.user.mustChangePassword) {
          console.log("User must change password, navigating to /onboarding");
          navigate("/onboarding");
        } else if (
          res.user.role?.roleType === "STUDENT" ||
          res.user.role?.roleType === "TEACHER"
        ) {
          console.log("User is STUDENT or TEACHER, navigating to /dashboard");
          navigate("/dashboard");
        } else {
          console.log("User is ADMIN, navigating to /admin");
          navigate("/admin");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <div className="auth">
        <div className="auth__header">
          <h1 className="auth__title">PSTUDY</h1>
          <p className="auth__subtitle">Knowledge is Power</p>
        </div>
        <div className="linear"></div>
        <div className="auth-container">
          <div className="auth-form">
            <h2 className="auth-form__title">Đăng nhập</h2>
            {error && <div className="auth-form__error">{error}</div>}
            <form onSubmit={submitHandle}>
              <div className="form-group">
                <label htmlFor="email">Tài khoản</label>
                <input
                  type="text"
                  id="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Mật khẩu</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                className={isLoading ? "loading" : ""}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  "Đăng nhập"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
export default Auth;
