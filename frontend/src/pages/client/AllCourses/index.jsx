import axios from "axios";
import { format } from "date-fns";
import { useEffect, useState } from "react";

function AllCourses() {
    const [courses, setCourses] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [searchTeacher, setSearchTeacher] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [priceFilter, setPriceFilter] = useState("");
    const [dateFilter, setDateFilter] = useState("");

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const response = await axios.get("http://localhost:3000/api/courses", {
                    withCredentials: true
                });
                setCourses(response.data);
            } catch (error) {
                console.log("Không tìm thấy khóa học nào", error);
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
    }
    const handleChangeDateFilter = (e) => {
        setDateFilter(e.target.value);
        setCurrentPage(1);
    }
    const handleDecreasePage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            setCurrentPage(1);
        }
    }
    const handleIncreasePage = () => {
        if (currentPage < totalPage) {
            setCurrentPage(currentPage + 1);
            setCurrentPage(1);
        }
    }
    const handleChangePriceFilter = (e) => {
        setPriceFilter(e.target.value);
        setCurrentPage(1);
    }

    let filterCourses = courses
        .filter(
            (course) => {
                const matchSearchText = searchText.trim() === "" ||
                    course.name.toLowerCase().includes(searchText.toLowerCase())

                const matchSearchTeacher = searchTeacher.trim() === "" ||
                    course.teacher.name.toLowerCase().includes(searchTeacher.toLocaleLowerCase());

                const matchPriceFilter = (() => {
                    const price = course.price || 0;
                    switch (priceFilter) {
                        case "0-50000":
                            return price >= 0 && price <= 50000
                        case "50000-100000":
                            return price > 50000 && price <= 100000
                        case "100000-200000":
                            return price > 100000 && price <= 200000
                        case ">200000":
                            return price > 200000
                        default:
                            return true
                    }
                })();

                return matchSearchText && matchPriceFilter && matchSearchTeacher;
            }
        );
    if (dateFilter) {
        filterCourses = filterCourses.sort((a, b) => {
            const dateA = new Date(a.startDate).getTime();
            const dateB = new Date(b.startDate).getTime();
            return dateFilter === "newest" ? dateB - dateA : dateA - dateB;
        })
    }
    const coursesPerPage = 10;
    const totalPage = Math.ceil(filterCourses.length / coursesPerPage);

    const paginatedCourses = filterCourses.slice((currentPage - 1) * coursesPerPage, currentPage * coursesPerPage);


    return (
        <>
            <div className="filter-container">
                <label htmlFor="filter-nameCourse">Tìm kiếm theo tên khóa học</label>
                <input
                    type="text"
                    className="filter-name"
                    value={searchText}
                    onChange={handleChangeSearchText}
                />
                <label htmlFor="filter-nameTeacher">Tìm kiếm theo tên giáo viên</label>
                <input
                    type="text"
                    className="filter-name"
                    value={searchTeacher}
                    onChange={handleChangeSearchTeacher}
                />
                <select className="filter-price" value={priceFilter} onChange={handleChangePriceFilter}>
                    <option value="">Theo giá tiền</option>
                    <option value="0-50000">0 - 50000VND</option>
                    <option value="50000-100000">50000 - 100000VND</option>
                    <option value="100000-200000">100000 - 200000VND</option>
                    <option value=">200000">&gt; 200000VND</option>
                </select>
                <select className="filter-date" value={dateFilter} onChange={handleChangeDateFilter}>
                    <option value="">Theo ngày đăng</option>
                    <option value="newest">Mới nhất</option>
                    <option value="oldest">Cũ nhất</option>
                </select>
            </div>
            {paginatedCourses.length > 0 ? (
                <div className="all-courses">
                    <div className="course-list">
                        {paginatedCourses.map((course) => (
                            <div key={course.id} className="course-item">
                                <div className="ccc">
                                    <img src={course.imageUrl} alt={course.name} />
                                    <div>
                                        <div>Tên khóa học: {course.name}</div>
                                        <div>Tên giáo viên: {course.teacher?.name}</div>
                                        <div>
                                            Ngày bắt đầu:
                                            {course.startDate
                                                ? format(new Date(course.startDate), "dd/MM/yy")
                                                : ""}
                                        </div>
                                        <div>
                                            Ngày kết thúc:
                                            {course.endDate
                                                ? format(new Date(course.endDate), "dd/MM/yy")
                                                : ""}
                                        </div>
                                    </div>
                                </div>
                                <div>Giá tiền: {course.price ? course.price + "VND" : "0VND"}</div>
                            </div>
                        ))}
                    </div>
                    <div className="pagination-course">
                        <button onClick={handleDecreasePage} disabled={currentPage === 1}>Trang trước</button>
                        <span>{currentPage}</span>
                        <button onClick={handleIncreasePage} disabled={currentPage === totalPage}>Trang tiếp theo</button>
                    </div>
                </div>
            ) : (
                <div>Hiện tại chưa có khóa học nào</div>
            )}
        </>
    );
}

export default AllCourses;
