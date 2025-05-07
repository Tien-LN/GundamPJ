import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import "./EnrollmentRequests.scss";
import { AuthLogin } from "../../../helpers/admin/Auth";

function EnrollmentRequests() {
  const checkPermission = AuthLogin();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [enrollmentRequests, setEnrollmentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:3000/api/courses", {
          withCredentials: true,
        });
        setCourses(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch enrollment requests for selected course
  useEffect(() => {
    if (!selectedCourse) {
      setEnrollmentRequests([]);
      return;
    }

    const fetchEnrollmentRequests = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:3000/api/enrollments/list/${selectedCourse}`,
          {
            withCredentials: true,
          }
        );
        setEnrollmentRequests(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching enrollment requests:", err);
        setError("Failed to load enrollment requests. Please try again later.");
        setIsLoading(false);
      }
    };

    fetchEnrollmentRequests();
  }, [selectedCourse]);

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
    setError("");
    setSuccess("");
  };

  const handleApprove = async (id) => {
    try {
      setIsLoading(true);
      await axios.patch(
        `http://localhost:3000/api/enrollments/approve/${id}`,
        {},
        {
          withCredentials: true,
        }
      );

      // Remove the approved request from the list
      setEnrollmentRequests(enrollmentRequests.filter((req) => req.id !== id));
      setSuccess("Enrollment request approved successfully.");
      setIsLoading(false);
    } catch (err) {
      console.error("Error approving enrollment request:", err);
      setError("Failed to approve enrollment request. Please try again.");
      setIsLoading(false);
    }
  };

  const handleReject = async (id) => {
    try {
      setIsLoading(true);
      await axios.patch(
        `http://localhost:3000/api/enrollments/reject/${id}`,
        {},
        {
          withCredentials: true,
        }
      );

      // Remove the rejected request from the list
      setEnrollmentRequests(enrollmentRequests.filter((req) => req.id !== id));
      setSuccess("Enrollment request rejected successfully.");
      setIsLoading(false);
    } catch (err) {
      console.error("Error rejecting enrollment request:", err);
      setError("Failed to reject enrollment request. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-enrollment-requests">
      <div className="admin-card">
        <div className="admin-card__header">
          <h1 className="admin-card__title">Enrollment Requests Management</h1>
        </div>

        {error && (
          <div className="alert alert--error">
            <i className="fa-solid fa-circle-exclamation"></i>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert--success">
            <i className="fa-solid fa-circle-check"></i>
            <span>{success}</span>
          </div>
        )}

        <div className="admin-card__filters">
          <div className="filter-group">
            <label htmlFor="courseSelect">Select Course:</label>
            <select
              id="courseSelect"
              className="admin-form__select"
              value={selectedCourse}
              onChange={handleCourseChange}
            >
              <option value="">-- Select a course --</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="admin-loading">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <span>Loading...</span>
          </div>
        ) : !selectedCourse ? (
          <div className="admin-empty">
            <i className="fa-solid fa-clipboard-list"></i>
            <p>Please select a course to view enrollment requests</p>
          </div>
        ) : enrollmentRequests.length === 0 ? (
          <div className="admin-empty">
            <i className="fa-solid fa-clipboard-check"></i>
            <p>No pending enrollment requests for this course</p>
          </div>
        ) : (
          <div className="enrollment-requests-table">
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Request Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrollmentRequests.map((request) => (
                  <tr key={request.id}>
                    <td>{request.user?.name || "Unknown"}</td>
                    <td>{request.user?.email || "No email"}</td>
                    <td>
                      {request.createdAt
                        ? format(
                            new Date(request.createdAt),
                            "dd/MM/yyyy HH:mm"
                          )
                        : "Unknown date"}
                    </td>
                    <td className="actions-cell">
                      <button
                        className="action-btn approve-btn"
                        onClick={() => handleApprove(request.id)}
                        title="Approve"
                      >
                        <i className="fa-solid fa-check"></i>
                      </button>
                      <button
                        className="action-btn reject-btn"
                        onClick={() => handleReject(request.id)}
                        title="Reject"
                      >
                        <i className="fa-solid fa-times"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default EnrollmentRequests;
