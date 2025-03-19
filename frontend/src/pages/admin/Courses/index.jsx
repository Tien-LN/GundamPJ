import { Link } from "react-router-dom";
import AdminCourses from "../../../components/AdminCourses";
import { AuthLogin } from "../../../helpers/admin/Auth";
import "./Courses.scss";
import { useEffect, useState } from "react";
import axios from "axios";
function Courses(){
    const checkPermission = AuthLogin();
    const [courses, setCourses] = useState([]);
    useEffect(() => {
        const fetchApi = async() => {
            try{
                const res = await axios.get("http://localhost:3000/api/courses", {
                    withCredentials: true
                });
                // console.log(res.data);
                setCourses(res.data);
            } catch(error){
                console.log("Lỗi", error);
            }
        }
        fetchApi();
    }, []);

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