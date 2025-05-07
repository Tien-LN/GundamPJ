import Header from "./Header";
import Sider from "./Sider";
import "./Default.scss";
import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

function DefaultAdmin() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setSidebarOpen(false);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="admin-layout">
      <header className="admin__header">
        <Header
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
      </header>

      <div className="admin__container">
        <aside className={`admin__sidebar ${sidebarOpen ? "open" : "closed"}`}>
          <Sider />
        </aside>

        <main className="admin__content">
          <div className="admin__main-container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default DefaultAdmin;
