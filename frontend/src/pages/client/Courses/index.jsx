import { useEffect, useState } from "react";
import "./Courses.scss";
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from "date-fns";
function Courses(){
    const [courses, setCourses] = useState([]);
    const [user, setUser] = useState({});
    useEffect(() => {
        const fetchApi = async() => {
            try{
                const res = await axios.get("http://localhost:3000/api/enrollments/listApproved", {
                    withCredentials: true
                });
                const res_user = await axios.get("http://localhost:3000/api/users/getPermission", {
                    withCredentials: true
                });
                
                setUser(res_user.data);
                setCourses(res.data);

            } catch(error){
                console.log("Lỗi", error);
            }
        }
        fetchApi();
    }, []);
    console.log(courses);
    return (
        <>
            <div className="courses">
                {user.role == "TEACHER"
                ?  
                <>
                    <h1 className="courses__header">Khóa học đang dạy</h1>
                    <ul className="courses__type">
                    {
                        courses && 
                        courses.map((item, index) => 
                            <li className="subject">
                            <h2 className="courses__type-title">Khóa học : {item.name}</h2>

                            <div className="subject__containner">
                                <div className="subject__time">
                                    <span className="subject__startDate">
                                        <b>Ngày bắt đầu: </b> {format(new Date(item.startDate), "dd/MM/yyyy")}
                                    </span>
                                    <span className="subject__endDate">
                                    <b>Ngày kết thúc: </b> {format(new Date(item.endDate), "dd/MM/yyyy")}
                                    </span>
                                </div>
                                <div className="subject__description">
                                    {item.description}
                                </div>         
                                <div className="subject__actions">
                                    <Link to={`/courses/${item.id}`}><i className="fa-solid fa-arrow-right-to-bracket"></i></Link>
                                </div>
                            </div>
                        </li>
                        )

                    }
                    </ul>
                </>
                :
                <>
    
                    <h1 className="courses__header">Khóa học đã đăng ký</h1>
                    <ul className="courses__type">
                    {
                        courses && 
                        courses.map((item, index) => 
                            <li key={index} className="subject">
                            <Link to={`/courses/${item.course.id}`}>
                                <h2 className="courses__type-title">Khóa học : {item.course.name}</h2>
                            </Link>
                            

                            <div className="subject__containner">
                                {item.course.docsCourse &&
                                    item.course.docsCourse.map((docs, docs__index) => (
                                        <Link to={`/courses/${item.course.id}/${docs.id}`}>Lesson {docs__index + 1} : {docs.title}</Link>
                                    ))
                            
                                }
                            </div>
                        </li>
                        )
                    }
                    </ul>
                    <Link to="/enrollments">Tham gia khóa học</Link>
                </>
                }
                
            </div>
        </> 
    )
}
export default Courses;