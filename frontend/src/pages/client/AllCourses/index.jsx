import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./allcourses.css";

function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchTeacher, setSearchTeacher] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [priceFilter, setPriceFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:3000/api/courses", {
          withCredentials: true,
        });
        setCourses(response.data);
        setIsLoading(false);
      } catch (error) {
        console.log("Không tìm thấy khóa học nào", error);
        setIsLoading(false);
      }
    };
    fetchApi();
  }, []);

  const handleChangeSearchText = (e) => {
    setSearchText(e.target.value);
    setCurrentPage(1);
  };
  const handleChangeSearchTeacher = (e) => {
    setSearchTeacher(e.target.value);
    setCurrentPage(1);
  };
  const handleChangeDateFilter = (e) => {
    setDateFilter(e.target.value);
    setCurrentPage(1);
  };
  const handleDecreasePage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleIncreasePage = () => {
    if (currentPage < totalPage) {
      setCurrentPage(currentPage + 1);
    }
  };
  const handleChangePriceFilter = (e) => {
    setPriceFilter(e.target.value);
    setCurrentPage(1);
  };

  let filterCourses = courses.filter((course) => {
    const matchSearchText =
      searchText.trim() === "" ||
      course.name.toLowerCase().includes(searchText.toLowerCase());

    const matchSearchTeacher =
      searchTeacher.trim() === "" ||
      course.teacher.name
        .toLowerCase()
        .includes(searchTeacher.toLocaleLowerCase());

    const matchPriceFilter = (() => {
      const price = course.price || 0;
      switch (priceFilter) {
        case "0-50000":
          return price >= 0 && price <= 50000;
        case "50000-100000":
          return price > 50000 && price <= 100000;
        case "100000-200000":
          return price > 100000 && price <= 200000;
        case ">200000":
          return price > 200000;
        default:
          return true;
      }
    })();

    return matchSearchText && matchPriceFilter && matchSearchTeacher;
  });
  if (dateFilter) {
    filterCourses = filterCourses.sort((a, b) => {
      const dateA = new Date(a.startDate).getTime();
      const dateB = new Date(b.startDate).getTime();
      return dateFilter === "newest" ? dateB - dateA : dateA - dateB;
    });
  }
  const coursesPerPage = 8; // Giảm số lượng khóa học mỗi trang để hiển thị đẹp hơn
  const totalPage = Math.ceil(filterCourses.length / coursesPerPage);

  const paginatedCourses = filterCourses.slice(
    (currentPage - 1) * coursesPerPage,
    currentPage * coursesPerPage
  );

  return (
    <div className="all-courses-container">
      <div className="all-courses-header">
        <h1>Khóa học hiện có</h1>
        <p>
          Dưới đây là danh sách tất cả các khóa học hiện có. Bạn có thể tìm kiếm
          và lọc theo nhu cầu của mình.
        </p>
        <p>
          Để đăng ký khóa học, hãy nhấn vào nút <strong>"Đăng ký ngay"</strong>{" "}
          bên dưới mỗi khóa học.
        </p>
      </div>

      <div className="filter-container">
        <div className="filter-group">
          <label htmlFor="filter-nameCourse">
            <i className="fa-solid fa-search"></i> Tìm kiếm theo tên khóa học
          </label>
          <input
            type="text"
            id="filter-nameCourse"
            className="filter-name"
            value={searchText}
            onChange={handleChangeSearchText}
            placeholder="Nhập tên khóa học..."
          />
        </div>

        <div className="filter-group">
          <label htmlFor="filter-nameTeacher">
            <i className="fa-solid fa-user"></i> Tìm kiếm theo tên giáo viên
          </label>
          <input
            type="text"
            id="filter-nameTeacher"
            className="filter-name"
            value={searchTeacher}
            onChange={handleChangeSearchTeacher}
            placeholder="Nhập tên giáo viên..."
          />
        </div>

        <div className="filter-group">
          <label htmlFor="filter-price">
            <i className="fa-solid fa-tag"></i> Lọc theo giá
          </label>
          <select
            id="filter-price"
            className="filter-price"
            value={priceFilter}
            onChange={handleChangePriceFilter}
          >
            <option value="">Tất cả mức giá</option>
            <option value="0-50000">0 - 50.000 VND</option>
            <option value="50000-100000">50.000 - 100.000 VND</option>
            <option value="100000-200000">100.000 - 200.000 VND</option>
            <option value=">200000">&gt; 200.000 VND</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="filter-date">
            <i className="fa-solid fa-calendar"></i> Sắp xếp theo ngày
          </label>
          <select
            id="filter-date"
            className="filter-date"
            value={dateFilter}
            onChange={handleChangeDateFilter}
          >
            <option value="">Mặc định</option>
            <option value="newest">Mới nhất</option>
            <option value="oldest">Cũ nhất</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Đang tải khóa học...</p>
        </div>
      ) : paginatedCourses.length > 0 ? (
        <div className="all-courses">
          <div className="course-list">
            {paginatedCourses.map((course) => (
              <div key={course.id} className="course-item">
                <div className="course-image">
                  <img
                    src={course.imageUrl || "/img/default-bg.jpg"}
                    alt={course.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/img/default-bg.jpg";
                    }}
                  />
                  <div className="course-price">
                    {course.price
                      ? `${course.price.toLocaleString()} VND`
                      : "Miễn phí"}
                  </div>
                </div>
                <div className="course-content">
                  <h3 className="course-title">{course.name}</h3>
                  <div className="course-teacher">
                    <i className="fa-solid fa-chalkboard-teacher"></i>{" "}
                    {course.teacher?.name}
                  </div>
                  <div className="course-dates">
                    <div>
                      <i className="fa-solid fa-calendar-day"></i> Bắt đầu:{" "}
                      {course.startDate
                        ? format(new Date(course.startDate), "dd/MM/yyyy")
                        : "Chưa xác định"}
                    </div>
                    <div>
                      <i className="fa-solid fa-calendar-check"></i> Kết thúc:{" "}
                      {course.endDate
                        ? format(new Date(course.endDate), "dd/MM/yyyy")
                        : "Chưa xác định"}
                    </div>
                  </div>
                  <div className="course-code">
                    <i className="fa-solid fa-hashtag"></i> Mã khóa học:{" "}
                    <strong>{course.id}</strong>
                  </div>
                  <div className="course-actions">
                    <Link
                      to={`/enrollments?courseId=${course.id}`}
                      className="enroll-button"
                      state={{ courseData: course }}
                    >
                      <i className="fa-solid fa-user-plus"></i> Đăng ký ngay
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pagination-course">
            <button
              onClick={handleDecreasePage}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              <i className="fa-solid fa-chevron-left"></i> Trang trước
            </button>
            <div className="pagination-info">
              <span>
                Trang {currentPage} / {totalPage || 1}
              </span>
              <span className="pagination-total">
                Tổng cộng: {filterCourses.length} khóa học
              </span>
            </div>
            <button
              onClick={handleIncreasePage}
              disabled={currentPage === totalPage || totalPage === 0}
              className="pagination-button"
            >
              Trang tiếp theo <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-courses">
          <i className="fa-solid fa-book-open"></i>
          <h3>Không tìm thấy khóa học nào</h3>
          <p>Không có khóa học nào phù hợp với tiêu chí tìm kiếm của bạn.</p>
          <button
            onClick={() => {
              setSearchText("");
              setSearchTeacher("");
              setPriceFilter("");
              setDateFilter("");
              setCurrentPage(1);
            }}
            className="reset-button"
          >
            <i className="fa-solid fa-sync"></i> Đặt lại bộ lọc
          </button>
        </div>
      )}
    </div>
  );
}

export default AllCourses;
