import { Link } from "react-router-dom";
import AdminCourses from "../../../components/AdminCourses";
import { AuthLogin } from "../../../helpers/admin/Auth";
import "./Courses.scss";
import { useEffect, useState } from "react";
import axios from "axios";
function Courses(){
    const checkPermission = AuthLogin();
    const [courses, setCourses] = useState([]);
    const [deletedCourses, setDeletedCourses] = useState([]);
    useEffect(() => {
        const fetchApi = async() => {
            try{
                const res = await axios.get("http://localhost:3000/api/courses", {
                    withCredentials: true
                });
                const deletedRecords = await axios.get("http://localhost:3000/api/courses/getDeleted", {
                    withCredentials: true
                });
                // console.log(res.data);  
                setCourses(res.data);
                setDeletedCourses(deletedRecords.data);
            } catch(error){
                console.log("Lỗi", error);
            }
        }
        fetchApi();
    }, []);
    // console.log(courses);
    // console.log(deletedCourses.data);
    return (
        <>
            <div className="adminCourses">
                {deletedCourses?.length > 0  && 
                    <Link className="adminCourses__bin" to="/admin/courses/restore">
                        <i className="fa-solid fa-trash"></i>
                    </Link>
                }
                
                <Link className="adminCourses__create" to="/admin/courses/create">+</Link>
               
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