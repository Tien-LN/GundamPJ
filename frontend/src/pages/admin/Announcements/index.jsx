import axios from "axios";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useSearchParams } from "react-router-dom";
import { AuthLogin } from "../../../helpers/admin/Auth";
import "./Announcements.scss";

function Announcements() {
  const checkPermission = AuthLogin();
  const [mapCourses, setMapCourses] = useState({});
  const [roles, setRoles] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    roleVisibility: "",
    courseIds: [],
  });

  // Modal handlers
  const closeModal = () => setIsModalOpen(false);
  const openModal = () => setIsModalOpen(true);

  // Click outside modal to close
  useEffect(() => {
    const modalElement = document.querySelector("#modalChooseCourses");
    const handleClickOutside = (event) => {
      if (event.target === modalElement) {
        closeModal();
      }
    };

    if (modalElement) {
      modalElement.addEventListener("click", handleClickOutside);
      return () =>
        modalElement.removeEventListener("click", handleClickOutside);
    }
  }, [isModalOpen]);

  // Fetch roles and courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [rolesResponse, coursesResponse] = await Promise.all([
          axios.get("http://localhost:3000/api/roles", {
            withCredentials: true,
          }),
          axios.get("http://localhost:3000/api/courses", {
            withCredentials: true,
          }),
        ]);

        setRoles(rolesResponse.data);
        setCourses(coursesResponse.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true);
        const queryString = searchParams.toString();
        const response = await axios.get(
          `http://localhost:3000/api/announcements?${queryString}`,
          {
            withCredentials: true,
          }
        );

        setAnnouncements(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, [searchParams]);

  // Create course name map
  useEffect(() => {
    if (courses && courses.length > 0) {
      const newMap = {};
      for (const course of courses) {
        newMap[course.id] = course.name;
      }
      setMapCourses(newMap);
    }
  }, [courses]);

  // Form handlers
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilterChange = (e) => {
    const selectedValue = e.target.value;
    const selectedName = e.target.name;

    if (selectedValue) {
      searchParams.set(selectedName, selectedValue);
    } else {
      searchParams.delete(selectedName);
    }

    setSearchParams(searchParams);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const dataToSubmit = {
        ...formData,
        authorId: checkPermission.user.id,
      };

      await axios.post(
        "http://localhost:3000/api/announcements/create",
        dataToSubmit,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      // Reset form and refresh announcements
      setFormData({
        title: "",
        content: "",
        roleVisibility: "",
        courseIds: [],
      });

      // Refresh announcements list
      const queryString = searchParams.toString();
      const response = await axios.get(
        `http://localhost:3000/api/announcements?${queryString}`,
        {
          withCredentials: true,
        }
      );

      setAnnouncements(response.data);
      alert("Announcement created successfully!");
    } catch (error) {
      console.error("Error creating announcement:", error);
      alert("Failed to create announcement");
    }
  };

  const handleCourseSelection = () => {
    const modalElement = document.querySelector("#modalChooseCourses");
    if (modalElement) {
      const courseCheckboxes = modalElement.querySelectorAll("[data-pick]");
      const selectedCourseIds = [];

      for (const checkbox of courseCheckboxes) {
        if (checkbox.checked) {
          selectedCourseIds.push(checkbox.value);
        }
      }

      setFormData({
        ...formData,
        courseIds: selectedCourseIds,
      });

      closeModal();
    }
  };

  const handleDeleteAnnouncement = async (id) => {
    if (window.confirm("Are you sure you want to delete this announcement?")) {
      try {
        await axios.delete(`http://localhost:3000/api/announcements/${id}`, {
          withCredentials: true,
        });

        // Remove the deleted announcement from state
        setAnnouncements(announcements.filter((item) => item.id !== id));
      } catch (error) {
        console.error("Error deleting announcement:", error);
        alert("Failed to delete announcement");
      }
    }
  };

  const getCoursesName = (courseIds) => {
    if (!courseIds || courseIds.length === 0) return "All courses";

    let result = courseIds
      .map((courseId) => mapCourses[courseId])
      .filter(Boolean)
      .join(", ");

    if (result.length > 30) result = result.slice(0, 30) + "...";
    return result;
  };

  return (
    <div className="admin-announcements">
      {/* Course Selection Modal */}
      {isModalOpen && (
        <div className="admin-modal" id="modalChooseCourses">
          <div className="admin-modal__content">
            <h2 className="admin-modal__title">Select Courses</h2>

            <div className="admin-modal__body">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>Course Name</th>
                    <th>Teacher</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td>
                        <input
                          type="checkbox"
                          data-pick
                          value={course.id}
                          defaultChecked={formData.courseIds.includes(
                            course.id
                          )}
                        />
                      </td>
                      <td>{course.name}</td>
                      <td>{course.teacher?.name || "No teacher assigned"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="admin-modal__actions">
              <button
                className="admin-btn admin-btn--secondary"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                className="admin-btn admin-btn--primary"
                onClick={handleCourseSelection}
              >
                Confirm Selection
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card__header">
          <h1 className="admin-card__title">Announcements</h1>
        </div>

        <div className="admin-announcements__container">
          {/* Announcements List */}
          <div className="admin-announcements__list">
            <div className="admin-announcements__filters">
              <div className="filter-group">
                <label>Filter by Role:</label>
                <select
                  name="roleVisibility"
                  onChange={handleFilterChange}
                  value={searchParams.get("roleVisibility") || ""}
                >
                  <option value="">All Roles</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.roleType}>
                      {role.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Sort by:</label>
                <select
                  name="createdAt"
                  onChange={handleFilterChange}
                  value={searchParams.get("createdAt") || ""}
                >
                  <option value="">Default</option>
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="admin-loading">
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>Loading announcements...</span>
              </div>
            ) : announcements.length > 0 ? (
              <div className="announcement-items">
                {announcements.map((announcement) => (
                  <div className="announcement-item" key={announcement.id}>
                    <div className="announcement-item__header">
                      <h3 className="announcement-item__title">
                        {announcement.title}
                      </h3>
                      <div className="announcement-item__meta">
                        <span className="announcement-item__date">
                          {format(
                            new Date(announcement.createdAt),
                            "MMM dd, yyyy"
                          )}
                        </span>
                        <span className="announcement-item__author">
                          by {announcement.author?.name}
                        </span>
                      </div>
                    </div>

                    <div className="announcement-item__content">
                      {announcement.content}
                    </div>

                    <div className="announcement-item__footer">
                      <div className="announcement-item__courses">
                        <i className="fa-solid fa-book"></i>
                        {getCoursesName(announcement.courseIds)}
                      </div>

                      <div className="announcement-item__actions">
                        <button
                          className="admin-btn admin-btn--danger admin-btn--sm"
                          onClick={() =>
                            handleDeleteAnnouncement(announcement.id)
                          }
                        >
                          <i className="fa-solid fa-trash"></i>
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="admin-empty">
                <i className="fa-solid fa-bullhorn"></i>
                <p>No announcements found</p>
              </div>
            )}
          </div>

          {/* Create Announcement Form */}
          <div className="admin-announcements__form">
            <h2 className="admin-announcements__form-title">
              Create New Announcement
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Announcement title"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="content">Content</label>
                <textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  placeholder="Announcement content"
                  rows="6"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label htmlFor="roleVisibility">Visible to</label>
                <select
                  id="roleVisibility"
                  name="roleVisibility"
                  value={formData.roleVisibility}
                  onChange={handleInputChange}
                >
                  <option value="">All Roles</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.roleType}>
                      {role.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Courses</label>
                <div className="course-selector">
                  <div className="course-selector__display">
                    {formData.courseIds.length > 0
                      ? getCoursesName(formData.courseIds)
                      : "No courses selected"}
                  </div>
                  <button
                    type="button"
                    className="admin-btn admin-btn--secondary"
                    onClick={openModal}
                  >
                    <i className="fa-solid fa-list"></i>
                    Select Courses
                  </button>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn--secondary"
                  onClick={() =>
                    setFormData({
                      title: "",
                      content: "",
                      roleVisibility: "",
                      courseIds: [],
                    })
                  }
                >
                  <i className="fa-solid fa-times"></i>
                  Clear
                </button>
                <button type="submit" className="admin-btn admin-btn--primary">
                  <i className="fa-solid fa-paper-plane"></i>
                  Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Announcements;
