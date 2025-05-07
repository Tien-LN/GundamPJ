import { Link } from "react-router-dom";
import Logout from "../../components/Logout";
import { useState, useEffect } from "react";

function Header({ sidebarOpen, toggleSidebar }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  const formattedDate = currentTime.toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  return (
    <div className="admin__header-inner">
      <div className="admin__header-container">
        <div className="admin__header-left">
          <button
            className="admin__header-toggle"
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            <i
              className={`fa-solid ${sidebarOpen ? "fa-times" : "fa-bars"}`}
            ></i>
          </button>
          <div className="admin__header-logo">
            <Link to="/admin">
              <span className="admin__header-title">PSTUDY</span>
              <span className="admin__header-subtitle">Learning Management</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="admin__header-right">
        <div className="admin__header-datetime">
          <div className="datetime-time">{formattedTime}</div>
          <div className="datetime-date">{formattedDate}</div>
        </div>

        <div className="admin__header-search">
          <input type="text" placeholder="Search..." />
          <button aria-label="Search">
            <i className="fa-solid fa-search"></i>
          </button>
        </div>

        <div className="admin__header-actions">
          <button
            className="admin__header-notification"
            aria-label="Notifications"
          >
            <i className="fa-solid fa-bell"></i>
            <span className="notification-badge">3</span>
          </button>

          <div className="admin__header-user">
            <Link to="/admin/my-account" className="user-profile">
              <div className="user-avatar">
                <i className="fa-solid fa-user"></i>
              </div>
              <span className="user-name">Admin</span>
            </Link>
            <Logout />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;
