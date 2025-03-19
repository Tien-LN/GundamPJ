import { Link } from "react-router-dom";
import AdminCourses from "../../../components/AdminCourses";
import { AuthLogin } from "../../../helpers/admin/Auth";
import "./Courses.scss";
function Courses(){
    const checkPermission = AuthLogin();
    const courses = [
        {
            name: "Lập trình 1",
            description: "Khóa học lập trình 1",
            startDate: "2025-07-05T00:00:00Z",
            endDate: "2025-09-10T00:00:00Z",
            imageUrl: "https://vtiacademy.edu.vn/upload/images/lap-trinh-1(1).jfif"
        },
        {
            name: "Lập trình 1",
            description: "Khóa học lập trình 1",
            startDate: "2025-07-05T00:00:00Z",
            endDate: "2025-09-10T00:00:00Z",
            imageUrl: "https://vtiacademy.edu.vn/upload/images/lap-trinh-1(1).jfif"
        },
        {
            name: "Lập trình 1",
            description: "Khóa học lập trình 1",
            startDate: "2025-07-05T00:00:00Z",
            endDate: "2025-09-10T00:00:00Z",
            imageUrl: "https://vtiacademy.edu.vn/upload/images/lap-trinh-1(1).jfif"
        },
        {
            name: "Lập trình 1",
            description: "Khóa học lập trình 1",
            startDate: "2025-07-05T00:00:00Z",
            endDate: "2025-09-10T00:00:00Z",
            imageUrl: "https://vtiacademy.edu.vn/upload/images/lap-trinh-1(1).jfif"
        },
        {
            name: "Lập trình 1",
            description: "Khóa học lập trình 1",
            startDate: "2025-07-05T00:00:00Z",
            endDate: "2025-09-10T00:00:00Z",
            imageUrl: "https://vtiacademy.edu.vn/upload/images/lap-trinh-1(1).jfif"
        },
    ]
    return (
        <>
            <div className="adminCourses">
                <Link className="adminCourses__create" to="/admin/courses/create">+</Link>
                <div className="adminCourses__charts">
                    Chart - Dũng
                    Làm cái đéo thống kê đường cho cái khóa học tạo theo thời gian ấy, trục x : thời gian, y : số lượng khóa
                </div>
                <div className="adminCourses__sort">
                    <select className="adminCourses__sortOptions">
                        <option value="default">Mặc định</option>
                        <option value="numAsc">Số lượng tăng dần</option>
                        <option value="numDesc">Số lượng giảm dần</option>
                        <option value="CreateNew">Mới tạo</option>
                        <option value="CreateOld">Tạo lâu</option>
                    </select>
                </div>
                <AdminCourses courses={courses}/>
            </div>
        </>
    )
}
export default Courses;