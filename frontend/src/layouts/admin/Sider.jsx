import { NavLink } from "react-router-dom";
import { useState } from "react";

function Sider() {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (key) => {
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: "fa-solid fa-gauge-high",
      path: "/admin",
    },
    {
      title: "Accounts",
      icon: "fa-solid fa-users",
      path: "/admin/accounts",
    },
    {
      title: "Courses",
      icon: "fa-solid fa-book",
      path: "/admin/courses",
    },
    {
      title: "Enrollment Requests",
      icon: "fa-solid fa-clipboard-list",
      path: "/admin/enrollment-requests",
    },
    {
      title: "Announcements",
      icon: "fa-solid fa-bullhorn",
      path: "/admin/announcements",
    },
    {
      title: "User Registration",
      icon: "fa-solid fa-user-plus",
      path: "/admin/registers",
      expandable: true,
      children: [
        {
          title: "Single Registration",
          path: "/admin/registers",
        },
        {
          title: "Bulk Registration",
          path: "/admin/registers/multi",
        },
      ],
    },
  ];

  return (
    <nav className="admin-sidebar-nav">
      <ul className="admin__siders">
        {menuItems.map((item, index) => (
          <li
            key={index}
            className={
              item.expandable
                ? "admin__siders-item expandable"
                : "admin__siders-item"
            }
          >
            {item.expandable ? (
              <div className="menu-item-with-children">
                <div
                  className="menu-item-header"
                  onClick={() => toggleExpand(item.title)}
                >
                  <span className="menu-item-icon">
                    <i className={item.icon}></i>
                  </span>
                  <span className="menu-item-title">{item.title}</span>
                  <span className="menu-item-arrow">
                    <i
                      className={`fa-solid ${
                        expandedItems[item.title]
                          ? "fa-chevron-down"
                          : "fa-chevron-right"
                      }`}
                    ></i>
                  </span>
                </div>

                {expandedItems[item.title] && (
                  <ul className="submenu">
                    {item.children.map((child, childIndex) => (
                      <li key={childIndex} className="admin__siders-itemChild">
                        <NavLink
                          to={child.path}
                          className={({ isActive }) =>
                            isActive ? "active" : ""
                          }
                        >
                          {child.title}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <NavLink
                to={item.path}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <span className="menu-item-icon">
                  <i className={item.icon}></i>
                </span>
                <span className="menu-item-title">{item.title}</span>
              </NavLink>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default Sider;
