import axios from "axios";
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

function MultiRegister() {
  const navigate = useNavigate();
  const [rows, setRows] = useState(4);
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/roles", {
          withCredentials: true,
        });
        setRoles(res.data);
      } catch (error) {
        console.error("Error fetching roles:", error);
        setError("Failed to load roles. Please refresh the page.");
      }
    };

    fetchRoles();
  }, []);

  useEffect(() => {
    setData((prevData) => {
      let newData = [...prevData];

      while (newData.length < rows) {
        newData.push({ email: "", name: "", role: "" });
      }

      return newData.slice(0, rows);
    });
  }, [rows]);

  const handleChange = (index, event) => {
    const { name, value } = event.target;
    setData((prevData) => {
      const newData = [...prevData];
      newData[index] = { ...newData[index], [name]: value };
      return newData;
    });
  };

  const handleAddRow = () => {
    setRows((row) => row + 1);
  };

  const handleRemoveRow = () => {
    if (rows > 1) {
      setRows((row) => row - 1);
    }
  };

  const handleSubmit = async () => {
    const validUsers = data.filter(
      (user) => user.email && user.name && user.role
    );

    if (validUsers.length === 0) {
      setError("Please fill in at least one complete user record");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:3000/api/admin/register-multiple",
        { users: validUsers },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setSuccess(
        `Successfully registered ${validUsers.length} users! Temporary passwords have been sent to their emails.`
      );

      // Reset form after successful submission
      setRows(4);
      setData(Array(4).fill({ email: "", name: "", role: "" }));
    } catch (error) {
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
      setError(
        error.response?.data?.message ||
          "Failed to register users. Please check your data and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = (e) => {
      try {
        const bufferArray = e.target.result;
        const wb = XLSX.read(bufferArray, { type: "buffer" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];

        const excelData = XLSX.utils.sheet_to_json(ws);
        const roleTypes = roles.map((role) => role.roleType);
        const validRecords = excelData.filter(
          (record) => roleTypes.includes(record.role) || !record.role
        );

        if (validRecords.length === 0) {
          setError("No valid records found in the uploaded file");
          return;
        }

        setData(validRecords);
        setRows(validRecords.length);
        setSuccess(`Loaded ${validRecords.length} records from file`);
      } catch (error) {
        console.error("Error processing file:", error);
        setError("Failed to process the Excel file. Please check the format.");
      }
    };
  };

  return (
    <div className="admin-register-multi">
      <div className="admin-card">
        <div className="admin-card__header">
          <h1 className="admin-card__title">Bulk User Registration</h1>
          <div className="admin-card__actions">
            <button
              type="button"
              className="admin-btn admin-btn--secondary"
              onClick={() => navigate("/admin/registers")}
            >
              <i className="fa-solid fa-user"></i>
              Single Register
            </button>
          </div>
        </div>

        {error && (
          <div className="alert alert--error">
            <i className="fa-solid fa-circle-exclamation"></i>
            {error}
          </div>
        )}

        {success && (
          <div className="alert alert--success">
            <i className="fa-solid fa-circle-check"></i>
            {success}
          </div>
        )}

        <div className="file-upload">
          <label htmlFor="excel-upload" className="file-upload__label">
            <i className="fa-solid fa-file-excel"></i>
            Import from Excel
          </label>
          <input
            type="file"
            id="excel-upload"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            className="file-upload__input"
          />
          <span className="file-upload__help">
            Upload an Excel file with columns: name, email, and role
          </span>
        </div>

        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th width="50">#</th>
                <th>Email</th>
                <th>Name</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {data.map((user, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <input
                      type="email"
                      name="email"
                      value={user.email || ""}
                      onChange={(e) => handleChange(index, e)}
                      placeholder="Email address"
                      className="table-input"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      name="name"
                      value={user.name || ""}
                      onChange={(e) => handleChange(index, e)}
                      placeholder="Full name"
                      className="table-input"
                    />
                  </td>
                  <td>
                    <select
                      name="role"
                      value={user.role || ""}
                      onChange={(e) => handleChange(index, e)}
                      className="table-select"
                    >
                      <option value="" disabled>
                        Select role
                      </option>
                      {roles.map((role, roleIndex) => (
                        <option key={roleIndex} value={role.roleType}>
                          {role.title}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="table-actions">
          <div className="row-controls">
            <button
              type="button"
              className="admin-btn admin-btn--icon"
              onClick={handleAddRow}
              title="Add row"
            >
              <i className="fa-solid fa-plus"></i>
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--icon"
              onClick={handleRemoveRow}
              disabled={rows <= 1}
              title="Remove row"
            >
              <i className="fa-solid fa-minus"></i>
            </button>
            <span className="row-count">{rows} rows</span>
          </div>

          <button
            type="button"
            className="admin-btn admin-btn--primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i>
                Registering...
              </>
            ) : (
              <>
                <i className="fa-solid fa-user-plus"></i>
                Register All Users
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MultiRegister;
