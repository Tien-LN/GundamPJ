import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthLogin } from "../../../helpers/admin/Auth";
import DataTable from "../../../components/admin/DataTable";
import "./Accounts.scss";

function DeletedUsers() {
  const navigate = useNavigate();
  const checkPermission = AuthLogin();
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDeletedUsers = async () => {
      try {
        setIsLoading(true);
        // Fetch users with deletedAt not null
        const res = await axios.get("http://localhost:3000/api/users/deleted", {
          withCredentials: true,
        });

        setDeletedUsers(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching deleted users:", error);
        setError("Failed to load deleted users. Please try again.");
        setIsLoading(false);
      }
    };

    fetchDeletedUsers();
  }, []);

  useEffect(() => {
    if (!isLoading && deletedUsers.length === 0 && !error) {
      navigate("/admin/accounts");
    }
  }, [isLoading, deletedUsers, navigate, error]);

  const handleRestore = async (user) => {
    try {
      await axios.patch(
        "http://localhost:3000/api/users/restore",
        { userIds: [user.id] },
        {
          withCredentials: true,
        }
      );

      setDeletedUsers(deletedUsers.filter((u) => u.id !== user.id));
      alert(`User ${user.name} has been restored successfully.`);
    } catch (error) {
      console.error("Error restoring user:", error);
      setError("Failed to restore user. Please try again.");
    }
  };

  const handleDeletePermanent = async (user) => {
    if (
      !window.confirm(
        `Are you sure you want to permanently delete user ${user.name}? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await axios.delete("http://localhost:3000/api/users/hard-delete", {
        data: { userIds: [user.id] },
        withCredentials: true,
      });

      setDeletedUsers(deletedUsers.filter((u) => u.id !== user.id));
      alert(`User ${user.name} has been permanently deleted.`);
    } catch (error) {
      console.error("Error permanently deleting user:", error);
      setError("Failed to delete user permanently. Please try again.");
    }
  };

  const columns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (row) => (
        <div className="user-name">
          <div className="user-avatar">
            <img
              src={row.avatarUrl || "/img/defaultAvatar.png"}
              alt={row.name}
            />
          </div>
          <div className="user-info">
            <span className="user-info__name">{row.name}</span>
            <span className="user-info__email">{row.email}</span>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      sortable: true,
      render: (row) => (
        <span
          className={`user-role user-role--${
            row.role?.roleType?.toLowerCase() || "unknown"
          }`}
        >
          {row.role?.roleType || "No role"}
        </span>
      ),
    },
    {
      key: "phone",
      label: "Phone",
      sortable: true,
      render: (row) => row.phone || "N/A",
    },
    {
      key: "gender",
      label: "Gender",
      sortable: true,
      render: (row) => row.gender || "N/A",
    },
    {
      key: "deletedAt",
      label: "Deleted At",
      sortable: true,
      render: (row) => new Date(row.deletedAt).toLocaleString(),
    },
  ];

  const actions = [
    {
      label: "Restore",
      icon: "fa-solid fa-rotate-left",
      type: "success",
      onClick: (row) => handleRestore(row),
    },
    {
      label: "Delete Permanently",
      icon: "fa-solid fa-trash",
      type: "danger",
      onClick: (row) => handleDeletePermanent(row),
    },
  ];

  return (
    <div className="admin-accounts">
      <div className="admin-card">
        <div className="admin-card__header">
          <h1 className="admin-card__title">Deleted User Accounts</h1>
          <Link to="/admin/accounts" className="admin-btn admin-btn--secondary">
            <i className="fa-solid fa-arrow-left"></i>
            <span>Back to Accounts</span>
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
            <span>Loading deleted users...</span>
          </div>
        ) : deletedUsers.length > 0 ? (
          <>
            <p className="admin-card__subtitle">
              These users have been deleted and can be restored or permanently
              removed.
            </p>
            <DataTable
              columns={columns}
              data={deletedUsers}
              actions={actions}
              pagination={true}
              itemsPerPage={10}
            />
          </>
        ) : (
          <div className="admin-empty">
            <i className="fa-solid fa-user-slash"></i>
            <p>No deleted users found</p>
            <Link className="admin-btn admin-btn--primary" to="/admin/accounts">
              Return to Accounts
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default DeletedUsers;
