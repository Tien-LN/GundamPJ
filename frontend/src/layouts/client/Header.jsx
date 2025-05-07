import { Link, NavLink } from "react-router-dom";
import "./header.css";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../contexts/AuthContext";

function Header() {
  const { user, logout } = useContext(AuthContext);

  const [dropDown, setDropDown] = useState(false);

  const handleDropDown = () => {
    setDropDown(!dropDown);
  };

  const closeDropdown = (e) => {
    if (!e.target.closest(".dropdown-container")) {
      setDropDown(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeDropdown);
    return () => document.removeEventListener("click", closeDropdown);
  }, []);

  return (
    <header className="main-header">
      <div className="header-container">
        <Link to="" className="header-logo">
          <span className="logo-text">PSTUDY</span>
          <span className="logo-subtitle">Learning Management</span>
        </Link>

        {user ? (
          <nav className="nav-bar">
            <div className="nav-link">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive ? "nav-link-c active" : "nav-link-c"
                }
              >
                Bảng điều khiển
              </NavLink>
              <NavLink
                to="/courses"
                className={({ isActive }) =>
                  isActive ? "nav-link-c active" : "nav-link-c"
                }
              >
                Khoá học của tôi
              </NavLink>
              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  isActive ? "nav-link-c active" : "nav-link-c"
                }
              >
                Liên hệ
              </NavLink>
            </div>

            <div className="dropdown-container">
              <div className="avatar-account" onClick={handleDropDown}>
                {user?.avatar ? (
                  <img src={user.avatar} alt="User Avatar" />
                ) : (
                  <i className="fa-solid fa-user"></i>
                )}
              </div>
              {dropDown && (
                <ul className="dropdown-menu">
                  <li>
                    <NavLink to="/my-account">
                      <i className="fa-solid fa-user-circle"></i> Tài khoản của
                      tôi
                    </NavLink>
                  </li>
                  <li>
                    <NavLink onClick={handleLogout}>
                      <i className="fa-solid fa-sign-out-alt"></i> Đăng xuất
                    </NavLink>
                  </li>
                </ul>
              )}
            </div>
          </nav>
        ) : (
          <Link className="login" to="/login">
            <i className="fa-solid fa-sign-in-alt"></i> Đăng nhập ngay
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;
