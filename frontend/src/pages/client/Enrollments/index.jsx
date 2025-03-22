import { useState } from "react";
import axios from "axios";
import "./Enrollments.scss";
function Enrollments(){
    const [data, setData] = useState({
        courseId: ""
    });
    const handleChange = (event) => {
        setData({
            ...data,
            [event.target.name]: event.target.value
        });
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const fetchApi = async () => {
            try{
                const res = await axios.post("http://localhost:3000/api/enrollments", data, {
                    withCredentials: true
                });
                console.log(res.data);
            } catch(error){
                console.log("Lỗi khi gửi yêu cầu", error.response);
            }
        }
        fetchApi();
    }
    return (
        <>
            <div className="enrollments">
                <div className="enrollments__box">
                    <h2 className="enrollments__box-title">Nhập mã lớp học</h2>
                    <p className="enrollments__box-example">Ví dụ : KEH-JSI-KML</p>
                    <form className="enrollments__box-form" onSubmit={handleSubmit} method="POST">
                        <div className="enrollments__box-formElements">
                            <label htmlFor="enroll_courseId">Mã môn học</label>
                            <input className="enrollments__box-courseId" name="courseId" value={data.courseId} onChange={handleChange}/>
                        </div>
                        <div className="enrollments__box-formElements">
                         <button type="submit" className="enrollments__box-submit">Gửi đi</button>
                        </div>
                        
                        
                    </form>
                </div>
            </div>
        </>
    )
}
export default Enrollments;