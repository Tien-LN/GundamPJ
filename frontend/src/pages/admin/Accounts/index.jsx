import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AuthLogin } from "../../../helpers/admin/Auth";
import DataTable from "../../../components/admin/DataTable";
import "./Accounts.scss";

function Accounts() {
  const checkPermission = AuthLogin();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("ALL");

  const [deletedUsersCount, setDeletedUsersCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch active users
        const activeUsersRes = await axios.get(
          "http://localhost:3000/api/users",
          {
            withCredentials: true,
          }
        );

        // Check if there are any deleted users
        const deletedUsersRes = await axios.get(
          "http://localhost:3000/api/users/deleted",
          {
            withCredentials: true,
          }
        );

        setUsers(activeUsersRes.data);
        setDeletedUsersCount(deletedUsersRes.data.length);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStatusChange = async (userId, isActive) => {
    try {
      // This would be an actual API call in a real implementation
      console.log(
        `Changing status for user ${userId} to ${
          isActive ? "active" : "inactive"
        }`
      );

      // Update local state
      setUsers(
        users.map((user) => (user.id === userId ? { ...user, isActive } : user))
      );
    } catch (error) {
      console.error("Error changing user status:", error);
    }
  };

  const filteredUsers =
    roleFilter === "ALL"
      ? users
      : users.filter((user) => user.role?.roleType === roleFilter);

  const columns = [
    {
      key: "name",
      label: "Name",
      sortable: true,
      render: (row) => (
        <div className="user-name">
          <div className="user-avatar">
            <img src={row.avatar || "/img/defaultAvatar.png"} alt={row.name} />
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
      key: "isActive",
      label: "Status",
      sortable: true,
      render: (row) => (
        <span
          className={`user-status ${
            row.isActive ? "user-status--active" : "user-status--inactive"
          }`}
          onClick={() => handleStatusChange(row.id, !row.isActive)}
        >
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
  ];

  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    phone: "",
    gender: "",
    address: "",
  });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name || "",
      phone: user.phone || "",
      gender: user.gender || "",
      address: user.address || "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    if (!editingUser) return;

    try {
      await axios.put(`http://localhost:3000/api/users/me/update`, editForm, {
        withCredentials: true,
      });

      setUsers(
        users.map((user) =>
          user.id === editingUser.id ? { ...user, ...editForm } : user
        )
      );

      setIsEditModalOpen(false);
      setEditingUser(null);
      alert("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user. Please try again.");
    }
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
    setEditingUser(null);
  };

  const handleDelete = async (user) => {
    if (
      !window.confirm(
        `Are you sure you want to delete user ${user.name}? They can be restored later.`
      )
    ) {
      return;
    }

    try {
      // Using the soft-delete endpoint from the backend API
      await axios.patch(
        "http://localhost:3000/api/users/soft-delete",
        { userIds: [user.id] },
        { withCredentials: true }
      );

      // Update local state to remove the deleted user
      setUsers(users.filter((u) => u.id !== user.id));
      // Update deleted users count
      setDeletedUsersCount((prevCount) => prevCount + 1);
      alert(`User ${user.name} has been moved to deleted users.`);
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user. Please try again.");
    }
  };

  const actions = [
    {
      label: "Edit",
      icon: "fa-solid fa-edit",
      type: "edit",
      onClick: (row) => handleEdit(row),
    },
    {
      label: "Delete",
      icon: "fa-solid fa-trash",
      type: "delete",
      onClick: (row) => handleDelete(row),
    },
  ];

  return (
    <div className="admin-accounts">
      <div className="admin-card">
        <div className="admin-card__header">
          <h1 className="admin-card__title">User Accounts</h1>
          <div className="admin-card__actions">
            {deletedUsersCount > 0 && (
              <Link
                className="admin-btn admin-btn--secondary"
                to="/admin/accounts/deleted"
              >
                <i className="fa-solid fa-trash-restore"></i>
                <span>Restore Users ({deletedUsersCount})</span>
              </Link>
            )}
          </div>
        </div>

        <div className="admin-card__filters">
          <div className="role-filters">
            <button
              className={`role-filter ${roleFilter === "ALL" ? "active" : ""}`}
              onClick={() => setRoleFilter("ALL")}
            >
              All Users
            </button>
            <button
              className={`role-filter ${
                roleFilter === "STUDENT" ? "active" : ""
              }`}
              onClick={() => setRoleFilter("STUDENT")}
            >
              Students
            </button>
            <button
              className={`role-filter ${
                roleFilter === "TEACHER" ? "active" : ""
              }`}
              onClick={() => setRoleFilter("TEACHER")}
            >
              Teachers
            </button>
            <button
              className={`role-filter ${
                roleFilter === "ADMIN" ? "active" : ""
              }`}
              onClick={() => setRoleFilter("ADMIN")}
            >
              Admins
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="admin-loading">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <span>Loading users...</span>
          </div>
        ) : filteredUsers.length > 0 ? (
          <DataTable
            columns={columns}
            data={filteredUsers}
            actions={actions}
            pagination={true}
            itemsPerPage={10}
          />
        ) : (
          <div className="admin-empty">
            <i className="fa-solid fa-users"></i>
            <p>No users found</p>
          </div>
        )}

        {/* Edit User Modal */}
        {isEditModalOpen && (
          <div className="admin-modal">
            <div className="admin-modal__content">
              <div className="admin-modal__header">
                <h2 className="admin-modal__title">Edit User</h2>
                <button
                  className="admin-modal__close"
                  onClick={handleEditCancel}
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="admin-form">
                <div className="admin-form__group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditFormChange}
                    className="admin-form__input"
                    required
                  />
                </div>
                <div className="admin-form__group">
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleEditFormChange}
                    className="admin-form__input"
                  />
                </div>
                <div className="admin-form__group">
                  <label htmlFor="gender">Gender</label>
                  <select
                    id="gender"
                    name="gender"
                    value={editForm.gender}
                    onChange={handleEditFormChange}
                    className="admin-form__input"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="admin-form__group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={editForm.address}
                    onChange={handleEditFormChange}
                    className="admin-form__input"
                  />
                </div>
                <div className="admin-form__actions">
                  <button
                    type="button"
                    className="admin-btn admin-btn--secondary"
                    onClick={handleEditCancel}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="admin-btn admin-btn--primary"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Accounts;
