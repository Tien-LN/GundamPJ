import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { handlePriceFormat } from "../../../helpers/admin/priceFormat";
import { AuthLogin } from "../../../helpers/admin/Auth";
import "./CreateCourse.scss"; // Sử dụng lại CSS của CreateCourse

function EditCourse() {
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy ID khóa học từ URL
  const checkPermission = AuthLogin();
  const [teachers, setTeachers] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [data, setData] = useState({
    name: "",
    description: "",
    startDate: null,
    endDate: null,
    teacherId: "",
    price: "",
  });

  // Fetch course data
  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `http://localhost:3000/api/courses/${id}`,
          {
            withCredentials: true,
          }
        );

        const courseData = response.data;
        setData({
          name: courseData.name || "",
          description: courseData.description || "",
          startDate: courseData.startDate
            ? new Date(courseData.startDate)
            : null,
          endDate: courseData.endDate ? new Date(courseData.endDate) : null,
          teacherId: courseData.teacher?.id || "",
          price: courseData.price?.toString() || "",
        });

        if (courseData.imageUrl) {
          setPreview(courseData.imageUrl);
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching course data:", error);
        setError("Failed to load course data. Please try again.");
        setIsLoading(false);
      }
    };

    fetchCourseData();
  }, [id]);

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date, name) => {
    setData((prevData) => ({
      ...prevData,
      [name]: date,
    }));
  };

  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const res = await axios("http://localhost:3000/api/users", {
          withCredentials: true,
        });

        const teachersList = res.data.filter(
          (item) => item.role?.roleType === "TEACHER"
        );
        setTeachers(teachersList);
      } catch (error) {
        console.error("Error fetching teachers:", error);
        setError("Failed to load teachers. Please try again.");
      }
    };

    fetchTeachers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!data.name) {
      setError("Please enter a course name");
      return;
    }

    if (!data.teacherId) {
      setError("Please select a teacher");
      return;
    }

    if (!data.startDate || !data.endDate) {
      setError("Please select both start and end dates");
      return;
    }

    if (data.endDate < data.startDate) {
      setError("End date cannot be earlier than start date");
      return;
    }

    if (!data.price) {
      setError("Please enter a price");
      return;
    }

    try {
      setIsLoading(true);
      const course = {
        name: data.name,
        description: data.description,
        price: data.price,
        startDate: data.startDate,
        endDate: data.endDate,
        teacherId: data.teacherId,
      };

      // Update course data
      await axios.patch(`http://localhost:3000/api/courses/${id}`, course, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      // Update course image if a new one is selected
      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("type", "course");
        formData.append("courseId", id);

        await axios.post(
          `http://localhost:3000/api/courses/${id}/image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
      }

      setSuccess("Course updated successfully!");
      setTimeout(() => {
        navigate("/admin/courses");
      }, 1500);
    } catch (error) {
      console.error("Error updating course:", error);
      setError("Failed to update course. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="admin-create-course">
      <div className="admin-card">
        <div className="admin-card__header">
          <h1 className="admin-card__title">Edit Course</h1>
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

        {success && (
          <div className="alert alert--success">
            <i className="fa-solid fa-circle-check"></i>
            <span>{success}</span>
          </div>
        )}

        {isLoading ? (
          <div className="admin-loading">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <span>Loading course data...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Course Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="admin-form__input"
                  value={data.name}
                  onChange={handleChange}
                  placeholder="Enter course name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="teacherId">Teacher</label>
                <select
                  id="teacherId"
                  name="teacherId"
                  className="admin-form__select"
                  value={data.teacherId}
                  onChange={handleChange}
                >
                  <option value="">Select a teacher</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="startDate">Start Date</label>
                <DatePicker
                  selected={data.startDate}
                  onChange={(date) => handleDateChange(date, "startDate")}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select start date"
                  className="admin-form__input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="endDate">End Date</label>
                <DatePicker
                  selected={data.endDate}
                  onChange={(date) => handleDateChange(date, "endDate")}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Select end date"
                  className="admin-form__input"
                  minDate={data.startDate}
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price (VND)</label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    id="price"
                    name="price"
                    className="admin-form__input"
                    value={data.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                    min="0"
                  />
                  {data.price && (
                    <span className="price-display">
                      {handlePriceFormat(data.price)}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-group form-group--full">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  className="admin-form__textarea"
                  value={data.description}
                  onChange={handleChange}
                  placeholder="Enter course description"
                ></textarea>
              </div>

              <div className="form-group form-group--full">
                <label>Course Image</label>
                <div className="file-upload">
                  <label htmlFor="image" className="file-upload__label">
                    <i className="fa-solid fa-upload"></i>
                    <span>Choose Image</span>
                  </label>
                  <input
                    type="file"
                    id="image"
                    className="file-upload__input"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {preview && (
                    <img
                      src={preview}
                      alt="Course preview"
                      className="file-upload__preview"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <Link
                to="/admin/courses"
                className="admin-btn admin-btn--secondary"
              >
                Cancel
              </Link>
              <button
                type="submit"
                className="admin-btn admin-btn--primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <i className="fa-solid fa-spinner fa-spin"></i>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-save"></i>
                    <span>Update Course</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default EditCourse;
