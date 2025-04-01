import { Link, useParams } from "react-router-dom";
import "./Section.scss";
import { useEffect, useState } from "react";
import axios from "axios";
function Section(){
    const [course, setCourse] = useState({});
    const {courseId} = useParams();
    const [user, setUser] = useState({});
    const [docs, setDocs] = useState([]);
    const [enrollment, setEnrollment] = useState([]);
    useEffect(() => { 
        const fetchApi = async() => {
            try{
                const res = await axios.get(`http://localhost:3000/api/courses/${courseId}`, {
                    withCredentials: true
                });
                const res_user = await axios.get(`http://localhost:3000/api/users/getPermission`, {
                    withCredentials: true
                });
                const res_docs = await axios.get(`http://localhost:3000/api/docsCourse/${courseId}`, {
                    withCredentials: true
                });
                
                const docsCourse = res_docs.data.docsCourse.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                setDocs(docsCourse);
                setCourse(res.data);
                setUser(res_user.data);
                if(res_user.data.role == "TEACHER"){
                    const enrollments  = await axios.get(`http://localhost:3000/api/enrollments/list/${courseId}`, {
                        withCredentials: true
                    });
                    setEnrollment(enrollments.data);
                }
                
            } catch(error) {
                console.error("Lỗi khi lấy khóa học: ", error);
            }
        }
        fetchApi();
    }, []);
    const handleDeleteDocs = (id) => {
        const fetchApi = async() => {
            try{
                const res = await axios.delete(`http://localhost:3000/api/docsCourse/${courseId}/${id}`, {
                    withCredentials: true
                });

                console.log(res.data);
                window.location.reload();
            } catch(error) {
                console.log("Lỗi khi xóa bài giảng", error);
            }
        }
        fetchApi();
    }
    const handleApproval = (id) => {
        const fetchApi = async() => {
            try{
                const res = await axios.patch(`http://localhost:3000/api/enrollments/approve/${id}`, {},{
                    withCredentials: true
                })
                console.log(res.data);
                window.location.reload();
            } catch(error) {   
                console.error("Lỗi khi chấp nhận học viên", error);
            }
        }
        fetchApi();
    }
    const handleReject = (id) => {
        const fetchApi = async() => {
            try{
                const res = await axios.patch(`http://localhost:3000/api/enrollments/reject/${id}`, {},{
                    withCredentials: true
                })
                console.log(res.data);
                window.location.reload();
                
            } catch(error) {   
                console.error("Lỗi khi từ chối học viên", error);
            }
        }
        fetchApi();
    }
    console.log(enrollment);
    return (
        <>
            <div className="lessons">
                {user.role == "TEACHER" && 
                    <Link to={`/courses/${course.id}/AddDocs`} className="lessons__add"><i className="fa-solid fa-plus"></i></Link>
                }

                
                
                <div className="lessons__containnerImg">

                    {course.imageUrl ? 
                        <img className="lessons__image" src={course.imageUrl} alt="ảnh"/>
                        :
                        <img className="lessons__image" src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" alt="ảnh"/>
                    }
                    
                </div>

                {user.role == "TEACHER" && 
                    <div className="lessons__enrollments">
                        <div className="lessons__enrollments-title">Đang chờ tham gia: </div>
                        <div className="lessons__enrollments-box">
                            {
                                enrollment?.length > 0 ? (
                                    enrollment.map((enroll, enroll_index) => (
                                        <div className="lessons__enrollments-user" key={enroll.id}>
                                            <div className="lessons__enrollments-userWait">
                                                <div className="lessons__enrollments-userWait-name">{enroll.user.name}</div>
                                                <button className="lessons__enrollments-userWait-approve" onClick={() => {handleApproval(enroll.id)}}><i className="fa-solid fa-thumbs-up"></i></button>
                                                <button className="lessons__enrollments-userWait-reject" onClick={() => {handleReject(enroll.id)}}><i className="fa-solid fa-thumbs-down"></i></button>
                                                
                                            </div>
                                        </div>
                                    ))
                                )
                                : 
                                (
                                    <div>Chưa có</div>
                                )
                                
                            }
                        </div>
                        
                    </div>
                }
                
                <ul className="lessons__units">
                    <div className="lessons__units-hr"></div>
                    <li className="lessons__unit">
                        <h2 className="lessons__unit-title">Khóa học : {course.name}</h2>
                        <ul className="lessons__lessons">
                            {
                                docs && 
                                docs.map((item, index) => (
                                    <li key={index} className="lessons__lessons-item">
                                        <Link to={item.id} className="lessons__lessons-link">{`Lessons ${index+1}: ${item.title}`}</Link>
                                        { user.role == "TEACHER" && 
                                            <button className="lessons__lessons-delete" onClick={() => {handleDeleteDocs(item.id)}}><i className="fa-solid fa-minus"></i></button>
                                        }
                                    </li>
                                ))
                            }
                            
                            
                        </ul>
                    </li>
                </ul>
            </div>
        </>
    )
}
export default Section;