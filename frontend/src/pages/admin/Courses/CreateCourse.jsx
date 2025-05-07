import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { handlePriceFormat } from "../../../helpers/admin/priceFormat";
import { AuthLogin } from "../../../helpers/admin/Auth";
import "./CreateCourse.scss";

function CreateCourse() {
  const navigate = useNavigate();
  const checkPermission = AuthLogin();
  const [teachers, setTeachers] = useState([]);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
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
        setIsLoading(true);
        const res = await axios("http://localhost:3000/api/users", {
          withCredentials: true,
        });

        const teachersList = res.data.filter(
          (item) => item.role?.roleType === "TEACHER"
        );
        setTeachers(teachersList);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching teachers:", error);
        setError("Failed to load teachers. Please try again.");
        setIsLoading(false);
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

      const res = await axios.post(
        "http://localhost:3000/api/courses/create",
        course,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (image) {
        const formData = new FormData();
        formData.append("file", image);
        formData.append("type", "course");
        formData.append("courseId", res.data.id);

        await axios.post(
          `http://localhost:3000/api/courses/${res.data.id}/image`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
            withCredentials: true,
          }
        );
      }

      setSuccess("Course created successfully!");
      setTimeout(() => {
        navigate("/admin/courses");
      }, 1500);
    } catch (error) {
      console.error("Error creating course:", error);
      setError("Failed to create course. Please try again.");
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
          <h1 className="admin-card__title">Create New Course</h1>
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
                <option value="" disabled>
                  Select a teacher
                </option>
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
                id="startDate"
                name="startDate"
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
                id="endDate"
                name="endDate"
                className="admin-form__input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="price">Price</label>
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
                rows="5"
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
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file-upload__input"
                />
                <span className="file-upload__help">
                  Recommended size: 800x600 pixels, max 2MB
                </span>
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
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-plus"></i>
                  <span>Create Course</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCourse;
