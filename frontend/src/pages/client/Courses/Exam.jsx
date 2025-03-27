import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "./Exam.scss";
import { format } from "date-fns";
import { convertTimeLimit } from "../../../helpers/client/Time/convertExamTimeLimit";
function Exam(){
    const {courseId} = useParams();
    
    const [user, setUser] = useState({});
    const [addExam, setAddExam] = useState(false);
    const [exams, setExams] = useState([]);
    const [data, setData] = useState({
        title: "",
        description: "",
        courseId: courseId,
        startDate: "",
        endDate: "",
        timeLimit: 0
    });
    // console.log(data);
    useEffect(()=>{
        const fetchApi = async() => {
            try{
                const res_user = await axios.get("http://localhost:3000/api/users/getPermission", {
                    withCredentials: true
                });
                setUser(res_user.data);
            } catch(error){
                console.log("Lỗi", error);
            }
        }
        fetchApi();
    }, []);
    useEffect(()=>{
        const fetchApi = async() => {
            try{
                const res = await axios.get(`http://localhost:3000/api/exams/?courseId=${courseId}`, {
                    withCredentials: true
                });
                
                const now = new Date();
                const filterExams = res.data.filter((exam) => {
                    const startDate = new Date(exam.startDate);
                    const endDate = new Date(exam.endDate);
                    return now >= startDate && now <= endDate;
                })
                setExams(filterExams);
                

            } catch(error){
                console.log("Lỗi", error);
            }
        }
        fetchApi();
    }, [addExam]);  
    const onAddExam = () => {
        setAddExam(true);
    }
    const onCloseAddExam  = () => {
        setAddExam(false);
    }
    const handleClickOutSide = (event) => {
        const modelExam = document.querySelector("#exams__model");
        // console.log(modelExam);
        if(event.target == modelExam){
            onCloseAddExam();
        }
    }
    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        });
    }
    const handleDateChange = (date, name) => {
        setData((prevData) => ({
            ...prevData,
            [name]: date
        }));
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!data.startDate || !data.endDate) {
            alert("Vui lòng chọn ngày bắt đầu và ngày kết thúc!");
            return;
        }

        if (data.endDate < data.startDate) {
            alert("Ngày kết thúc không thể sớm hơn ngày bắt đầu!");
            return;
        }
        const fetchApi = async() => {
            try{
                const res = await axios.post("http://localhost:3000/api/exams/create", data, {
                    withCredentials: true
                });

                console.log("đã tạo thành công");
                onCloseAddExam();
            } catch(error) {
                console.log("Lỗi khi tạo đề thi ", error);
            }
        }
        fetchApi();

    }
    const handleChangeTimeLimit = (event) => {
        let newTime = parseInt(event.target.value)*60;
        setData({
            ...data,
            ["timeLimit"]: newTime
        });
    }
    const handleDeleteExam = (id) => {
        const fetchApi = async() => {
            try {
                const res = await axios.delete(`http://localhost:3000/api/exams/${courseId}/exams/${id}`,
                    {withCredentials: true}
                );

                console.log(res.data);
                window.location.reload();
            } catch(error) {
                console.log("Lỗi khi xóa bài kiểm tra", error);
            }
        }
        fetchApi();
    }
    // console.log(data);
    return (
        <>
            <div className="exams">
                {
                    addExam && 
                    <div className="exams__model" id="exams__model" onClick={handleClickOutSide}>
                        <div className="exams__model-box">
                            <h2 className="exams__model-title">Tạo đề thi mới</h2>
                            <form className="exams__form" method="POST" onSubmit={handleSubmit}>
                                <div className="exams__box">
                                    <label htmlFor="exams-title">Tiêu đề</label>
                                    <input name="title" className="exams__title" id="exams-title" onChange={handleChange}/>
                                </div>
                                <div className="exams__box">
                                    <label htmlFor="exams-description">Mô tả</label>
                                    <textarea rows="5" name="description" className="exams__description" id="exams-description" onChange={handleChange}/>
                                </div>
                                <div className="exams__box">
                                    <label htmlFor="exams-startDate">Ngày bắt đầu</label>
                                    <DatePicker
                                        selected={data.startDate}
                                        onChange={(date) => handleDateChange(date, "startDate")}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Chọn ngày"
                                        id="exams-startDate"
                                        name="startDate"
                                        className="exams__startDate"
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="exams__box">
                                    <label htmlFor="exams-endDate">Ngày kết thúc</label>
                                    <DatePicker
                                        selected={data.endDate}
                                        onChange={(date) => handleDateChange(date, "endDate")}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Chọn ngày"
                                        id="exams-endDate"
                                        name="endDate"
                                        className="exams__endDate"
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="exams__box">
                                    <label htmlFor="exams-timeLimit">phút</label>
                                    <input type="number" className="exams__timeLimit" id="exams-timeLimit" min="1" value={data.timeLimit/60} onChange={handleChangeTimeLimit} />
                                </div>
                                <div className="exams__box">
                                    <button type="submit">Tạo mới</button>
                                </div>
                            </form>
                        </div>
                        
                    </div>
                }
                <h1 className="exams__intro">Trang đề thi</h1>
                {exams && 
                    exams.map((exam, index) => (
                        <div key={index} className="exams__exam">
                            {
                                user?.role == "TEACHER" && 
                                <>
                                    <Link className="exams__exam-edit" to={`edit/${exam.id}`}>
                                        <i className="fa-solid fa-gear"></i>
                                    </Link>
                                    <button className="exams__exam-delete" onClick={() => {handleDeleteExam(exam.id)}}>
                                        <i className="fa-solid fa-minus"></i>
                                    </button>
                                </>
                                
                            }
                            <Link to={`${exam.id}`}>
                                <div className="exams__exam-title">{exam.title}</div>
                                <div className="exams__exam-description">{exam.description}</div>
                                <div className="exams__exam-time">
                                    <span className="exams__exam-startDate">
                                        <b>Ngày bắt đầu: </b>{format(new Date(exam.startDate), "dd/MM/yyyy")}
                                    </span>

                                    <span className="exams__exam-endDate">
                                        <b>Ngày kết thúc: </b>{format(new Date(exam.endDate), "dd/MM/yyyy")}
                                    </span>

                                    <span className="exams__exam-timeLimit">
                                        <b>Thời gian làm: </b>{convertTimeLimit(exam.timeLimit)}
                                    </span>
                                </div>
                            </Link>
                        </div>
                    )
                    )
                }
                {user?.role == "TEACHER" &&
                <> 
                    <button className="exams__add" onClick={onAddExam   }>Tạo đề thi</button>
                </>
                }
            </div>
            
        </>
    )
}
export default Exam;