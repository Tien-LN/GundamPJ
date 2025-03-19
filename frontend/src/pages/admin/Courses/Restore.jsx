import axios from "axios";
import { useEffect, useState } from "react";
import AdminCourses from "../../../components/AdminCourses";
import { AuthLogin } from "../../../helpers/admin/Auth";
import { useNavigate } from "react-router-dom";

function Restore(){
    const navigate = useNavigate();
    const checkPermission = AuthLogin();
    const [coursesDeleted, setCoursesDeleted] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    
    useEffect(()=> {
        const fetchApi = async () => {
            try{
                const res = await axios.get("http://localhost:3000/api/courses/getDeleted", {
                    withCredentials: true
                });

                setCoursesDeleted(res.data);
                setIsLoading(false);
            } catch(error){
                console.error("Lỗi", error);
                setIsLoading(false);
            }
        }
        fetchApi();
    }, []);

    useEffect(() => {
        if(!isLoading  && coursesDeleted?.length == 0){
            navigate("/admin/courses");
        }
    }, [isLoading, coursesDeleted, navigate]);
    // console.log(courseDeleted);
    return (
        <>
            <AdminCourses courses={coursesDeleted}/>
        </>
    )
}
export default Restore;