import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./auth.css";
import axios from "axios";
import { useDispatch } from "react-redux";
function Auth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };
  const submitHandle = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:3000/api/auth/login",
        loginData,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log("OK", res.data.user);
      dispatch({ type: "SET_USER", payload: res.data.user });
      // console.log("Đăng nhập thành công ", res);
      if (res.data) {
        if (res.data.user.role.roleType === "STUDENT" || res.data.user.role.roleType === "TEACHER") navigate("/");
        else navigate("/admin");
      }
    } catch (error) {
      console.log("Lỗi đăng nhập", error);
    }
  };
  return (
    <>
      <div className="auth">
        <div className="auth__header">
          <img src="/img/logo.png" className="logo" />
        </div>
        <div className="linear"></div>
        <div className="auth-container">
          <div className="auth-form">
            <h2 className="auth-form__title">Đăng nhập</h2>
            <form onSubmit={submitHandle}>
              <label htmlFor="email">Tài khoản</label>
              <br />
              <input
                type="text"
                id="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
              />
              <br />
              <label htmlFor="password">Mật khẩu</label>
              <br />
              <input
                type="password"
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
              />
              <br />
              <button type="submit">Đăng nhập</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
export default Auth;
