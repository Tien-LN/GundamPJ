import { useEffect, useState } from "react";
import { AuthLogin } from "../../../helpers/admin/Auth";
import DashboardCard from "../../../components/admin/DashboardCard";
import axios from "axios";
import "./Dashboard.scss";

function Dashboard() {
  const checkPermission = AuthLogin();
  const { user, hasPermissions, isLoading } = checkPermission;
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalUsers: 0,
    totalStudents: 0,
    totalTeachers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real implementation, these would be actual API calls
        const [coursesRes, usersRes] = await Promise.all([
          axios.get("http://localhost:3000/api/courses", {
            withCredentials: true,
          }),
          axios.get("http://localhost:3000/api/users", {
            withCredentials: true,
          }),
        ]);

        const courses = coursesRes.data || [];
        const users = usersRes.data || [];
        const students = users.filter(
          (user) => user.role?.roleType === "STUDENT"
        );
        const teachers = users.filter(
          (user) => user.role?.roleType === "TEACHER"
        );

        setStats({
          totalCourses: courses.length,
          totalUsers: users.length,
          totalStudents: students.length,
          totalTeachers: teachers.length,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    if (!isLoading && hasPermissions) {
      fetchStats();
    }
  }, [isLoading, hasPermissions]);

  return (
    <div className="admin-dashboard">
      <div className="admin-card">
        <h1 className="admin-card__title">Dashboard</h1>
        <p className="admin-card__subtitle">
          Welcome back, {!isLoading && user.name}
        </p>
      </div>

      <div className="dashboard-stats">
        <DashboardCard
          title="Total Courses"
          value={stats.totalCourses}
          icon="fa-solid fa-book"
          color="#3f51b5"
        />
        <DashboardCard
          title="Total Users"
          value={stats.totalUsers}
          icon="fa-solid fa-users"
          color="#f50057"
        />
        <DashboardCard
          title="Students"
          value={stats.totalStudents}
          icon="fa-solid fa-user-graduate"
          color="#4caf50"
        />
        <DashboardCard
          title="Teachers"
          value={stats.totalTeachers}
          icon="fa-solid fa-chalkboard-teacher"
          color="#ff9800"
        />
      </div>

      <div className="admin-card">
        <h2 className="admin-card__title">User Information</h2>
        <div className="user-profile">
          <div className="user-profile__avatar">
            {!isLoading && user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <img
                src="/img/defaultAvatar.png"
                alt={!isLoading ? user.name : "User"}
              />
            )}
          </div>
          <div className="user-profile__info">
            {!isLoading && (
              <>
                <h3 className="user-profile__name">{user.name}</h3>
                <p className="user-profile__role">{user.role}</p>
                <p className="user-profile__description">
                  {user.description || "No description available"}
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
