import React from "react";

function DashboardCard({ title, value, icon, color, trend, trendValue }) {
  return (
    <div className="dashboard-card" style={{ borderTop: `4px solid ${color}` }}>
      <div className="dashboard-card__icon" style={{ color }}>
        <i className={icon}></i>
      </div>
      <div className="dashboard-card__content">
        <h3 className="dashboard-card__title">{title}</h3>
        <div className="dashboard-card__value">{value}</div>
        {trend && (
          <div
            className={`dashboard-card__trend ${
              trend === "up" ? "up" : "down"
            }`}
          >
            <i
              className={`fa-solid ${
                trend === "up" ? "fa-arrow-up" : "fa-arrow-down"
              }`}
            ></i>
            <span>{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardCard;
