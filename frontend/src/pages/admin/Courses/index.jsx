import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthLogin } from "../../../helpers/admin/Auth";
import DataTable from "../../../components/admin/DataTable";
import { format } from "date-fns";
import { handlePriceFormat } from "../../../helpers/admin/priceFormat";
import "./Courses.scss";

function Courses() {
  const navigate = useNavigate();
  const checkPermission = AuthLogin();
  const [courses, setCourses] = useState([]);
  const [deletedCourses, setDeletedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortOption, setSortOption] = useState("default");

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setIsLoading(true);
        const [coursesRes, deletedCoursesRes] = await Promise.all([
          axios.get("http://localhost:3000/api/courses", {
            withCredentials: true,
          }),
          axios.get("http://localhost:3000/api/courses/getDeleted", {
            withCredentials: true,
          }),
        ]);

        setCourses(coursesRes.data);
        setDeletedCourses(deletedCoursesRes.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setIsLoading(false);
      }
    };
    fetchApi();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/courses/${id}`, {
        withCredentials: true,
      });
      setCourses(courses.filter((course) => course.id !== id));
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const columns = [
    {
      key: "name",
      label: "Course Name",
      sortable: true,
      render: (row) => (
        <div className="course-name">
          <div className="course-image">
            <img src={row.imageUrl || "/img/default-bg.jpg"} alt={row.name} />
          </div>
          <span>{row.name}</span>
        </div>
      ),
    },
    {
      key: "teacher",
      label: "Teacher",
      sortable: true,
      render: (row) => row.teacher?.name || "No teacher assigned",
    },
    {
      key: "startDate",
      label: "Start Date",
      sortable: true,
      render: (row) => format(new Date(row.startDate), "dd/MM/yyyy"),
    },
    {
      key: "endDate",
      label: "End Date",
      sortable: true,
      render: (row) => format(new Date(row.endDate), "dd/MM/yyyy"),
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      render: (row) => handlePriceFormat(row.price),
    },
  ];

  const actions = [
    {
      label: "Edit",
      icon: "fa-solid fa-edit",
      type: "edit",
      onClick: (row) => navigate(`/admin/courses/edit/${row.id}`),
    },
    {
      label: "Delete",
      icon: "fa-solid fa-trash",
      type: "delete",
      onClick: (row) => handleDelete(row.id),
    },
  ];

  return (
    <div className="admin-courses">
      <div className="admin-card">
        <div className="admin-card__header">
          <h1 className="admin-card__title">Course Management</h1>
          <div className="admin-card__actions">
            {deletedCourses?.length > 0 && (
              <Link
                className="admin-btn admin-btn--secondary"
                to="/admin/courses/restore"
              >
                <i className="fa-solid fa-trash-restore"></i>
                <span>Restore Courses</span>
              </Link>
            )}
            <Link
              className="admin-btn admin-btn--primary"
              to="/admin/courses/create"
            >
              <i className="fa-solid fa-plus"></i>
              <span>Create Course</span>
            </Link>
          </div>
        </div>

        <div className="admin-card__filters">
          <select
            className="admin-form__input"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="default">Default Sorting</option>
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
            <option value="date_new">Newest First</option>
            <option value="date_old">Oldest First</option>
            <option value="price_high">Price (High to Low)</option>
            <option value="price_low">Price (Low to High)</option>
          </select>
        </div>

        {isLoading ? (
          <div className="admin-loading">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <span>Loading courses...</span>
          </div>
        ) : courses.length > 0 ? (
          <DataTable
            columns={columns}
            data={courses}
            actions={actions}
            pagination={true}
            itemsPerPage={10}
          />
        ) : (
          <div className="admin-empty">
            <i className="fa-solid fa-book"></i>
            <p>No courses found</p>
            <Link
              className="admin-btn admin-btn--primary"
              to="/admin/courses/create"
            >
              Create your first course
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Courses;
