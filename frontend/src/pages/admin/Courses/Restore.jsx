import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthLogin } from "../../../helpers/admin/Auth";
import DataTable from "../../../components/admin/DataTable";
import { format } from "date-fns";
import { handlePriceFormat } from "../../../helpers/admin/priceFormat";

function Restore() {
  const navigate = useNavigate();
  const checkPermission = AuthLogin();
  const [deletedCourses, setDeletedCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDeletedCourses = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(
          "http://localhost:3000/api/courses/getDeleted",
          {
            withCredentials: true,
          }
        );

        setDeletedCourses(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching deleted courses:", error);
        setError("Failed to load deleted courses. Please try again.");
        setIsLoading(false);
      }
    };

    fetchDeletedCourses();
  }, []);

  useEffect(() => {
    if (!isLoading && deletedCourses.length === 0 && !error) {
      navigate("/admin/courses");
    }
  }, [isLoading, deletedCourses, navigate, error]);

  const handleRestore = async (id) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/courses/restore/${id}`,
        {},
        {
          withCredentials: true,
        }
      );

      setDeletedCourses(deletedCourses.filter((course) => course.id !== id));
    } catch (error) {
      console.error("Error restoring course:", error);
      setError("Failed to restore course. Please try again.");
    }
  };

  const handleDeletePermanent = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this course? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:3000/api/courses/delete/permanent/${id}`,
        {
          withCredentials: true,
        }
      );

      setDeletedCourses(deletedCourses.filter((course) => course.id !== id));
    } catch (error) {
      console.error("Error permanently deleting course:", error);
      setError("Failed to delete course permanently. Please try again.");
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
      label: "Restore",
      icon: "fa-solid fa-rotate-left",
      type: "success",
      onClick: (row) => handleRestore(row.id),
    },
    {
      label: "Delete Permanently",
      icon: "fa-solid fa-trash",
      type: "danger",
      onClick: (row) => handleDeletePermanent(row.id),
    },
  ];

  return (
    <div className="admin-courses">
      <div className="admin-card">
        <div className="admin-card__header">
          <h1 className="admin-card__title">Restore Deleted Courses</h1>
          <Link to="/admin/courses" className="admin-btn admin-btn--secondary">
            <i className="fa-solid fa-arrow-left"></i>
            <span>Back to Courses</span>
          </Link>
        </div>

        {error && (
          <div className="alert alert--error">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="admin-loading">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <span>Loading deleted courses...</span>
          </div>
        ) : deletedCourses.length > 0 ? (
          <>
            <p className="admin-card__subtitle">
              These courses have been deleted and can be restored or permanently
              removed.
            </p>
            <DataTable
              columns={columns}
              data={deletedCourses}
              actions={actions}
              pagination={true}
              itemsPerPage={10}
            />
          </>
        ) : (
          <div className="admin-empty">
            <i className="fa-solid fa-trash-restore"></i>
            <p>No deleted courses found</p>
            <Link className="admin-btn admin-btn--primary" to="/admin/courses">
              Return to Courses
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default Restore;
