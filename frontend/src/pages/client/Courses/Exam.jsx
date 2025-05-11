import axios from "axios";
import { useEffect, useRef, useState } from "react";
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
    const didQuestion = useRef({});
    const [data, setData] = useState({
        title: "",
        description: "",
        courseId: courseId,
        startDate: "",
        endDate: "",
        timeLimit: 0
    });
    const [didQuestionReady, setDidQuestionReady] = useState(false);
    const [didExam, setDidExam] = useState([]); 
    const [openDidExam, setOpenDidExam] = useState(true);
    // console.log(data);
    useEffect(()=>{
        const fetchApi = async() => {
            try{
                const res_user = await axios.get("http://localhost:3000/api/users/getPermission", {
                    withCredentials: true
                });
                const res_did_exam = await axios.get(`http://localhost:3000/api/userExams`,{
                    withCredentials: true
                });
                setUser(res_user.data);
                if(res_did_exam.data.length > 0){}
                setDidExam(res_did_exam.data);
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
                const res_user = await axios.get("http://localhost:3000/api/users/getPermission", {
                    withCredentials: true
                });
                
                if(res_user.data.role == "TEACHER"){
                    setExams(res.data);
                }
                else {
                    const now = new Date();
                    const filterExams = res.data.filter((exam) => {
                        const startDate = new Date(exam.startDate);
                        const endDate = new Date(exam.endDate);
                        return now >= startDate && now <= endDate;
                    })
                    setExams(filterExams);
                }
                
                
                

            } catch(error){
                console.log("Lỗi", error);
            }
        }
        fetchApi();
    }, [addExam]); 
    function compareVietnameseStrings(str1, str2) {
        return str1
            .normalize("NFD") 
            .replace(/[\u0300-\u036f]/g, "") 
            .toLowerCase()
            .localeCompare(
                str2
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase(),
                "vi", 
                { sensitivity: "base" } 
            );
    }
    useEffect(() => {
        if(!didExam) return;
        if(didExam.length == 0) return;
    
        for (const exam of didExam) {
            if (!didQuestion.current[exam.id]) {
                didQuestion.current[exam.id] = {}; 
            }
            
            
            for (const userAns of exam.userAnswers) {
                  if(userAns.question.type == "OBJECTIVE" || userAns.question.type == "DROPDOWN") {
                    didQuestion.current[exam.id][userAns.questionId] = {
                        answer: userAns.questionOption ? userAns.questionOption.content : 'Không có câu trả lời',
                        isCorrect: userAns.questionOption ? userAns.questionOption.isCorrect : false
                    };                } else if(userAns.question.type == "FILL") {
                    let userRes = userAns.value || '';
                    let teacherRes = userAns.questionOption ? userAns.questionOption.content : '';
                    let isCorrect = teacherRes ? (compareVietnameseStrings(userRes, teacherRes) == 0) : false;
                    didQuestion.current[exam.id][userAns.questionId] = { answer: userRes, isCorrect };                } else if(userAns.question.type == "REORDERING") {
                    didQuestion.current[exam.id][userAns.questionId] = didQuestion.current[exam.id][userAns.questionId] || {};
                    didQuestion.current[exam.id][userAns.questionId][userAns.num] = {
                        answer: userAns.questionOption ? userAns.questionOption.content : 'Không có câu trả lời',
                        order: userAns.questionOption ? userAns.questionOption.num : 0
                    };
                } else if(userAns.question.type == "MATCHING") {
                    didQuestion.current[exam.id][userAns.questionId] = didQuestion.current[exam.id][userAns.questionId] || {};
                    if (!didQuestion.current[exam.id][userAns.questionId][userAns.num]) {
                        didQuestion.current[exam.id][userAns.questionId][userAns.num] = {};
                    }
                    if (userAns.left) {
                        didQuestion.current[exam.id][userAns.questionId][userAns.num] = {
                            ...didQuestion.current[exam.id][userAns.questionId][userAns.num],
                            left: userAns.questionOption
                        };
                    } else {
                        didQuestion.current[exam.id][userAns.questionId][userAns.num] = {
                            ...didQuestion.current[exam.id][userAns.questionId][userAns.num],
                            right: userAns.questionOption
                        };
                    }   
                }
            }
        }
        setDidQuestionReady(true);
    }, [didExam]);
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
    const handleToggle = () => {
        setOpenDidExam(prev => !prev);
    }
    const formatTime = (x) => {
        let minutes = Math.floor(x/60, 0);
        let secs = x%60;
        return `${minutes} phút ${secs} giây`
    }
    
    const getDidQuestion = (id, type, didExamId) => {
        
        if (!didQuestion.current[didExamId] || !didQuestion.current[didExamId][id]) return null;
    
        const questionData = didQuestion.current[didExamId][id];
    
        if (type == "OBJECTIVE" || type == "DROPDOWN" || type == "FILL") {
            return (
                <div className="exams__did-answer">
                    <span className="exams__did-label">Câu trả lời:</span> {questionData.answer} 
                    <span className={`exams__did-result ${questionData.isCorrect ? "correct" : "incorrect"}`}>
                        {questionData.isCorrect ? "Đúng" : "Sai"}
                    </span>
                </div>
            );
        } 
        
        else if (type == "REORDERING") {
            const entries = Object.entries(questionData);
            const sortedEntries = entries.sort((a, b) => Number(a[0]) - Number(b[0]));
            
            return (
                <div className="exams__did-reordering">
                    <div className="exams__did-label">Kết quả sắp xếp:</div>
                    <div className="exams__did-reorderingItems">
                        {sortedEntries.map(([key, { answer, order }], index) => {
                            const userOrder = Number(key);
                            const isCorrect = userOrder === order;
                            return (
                                <div key={key} className={`exams__did-reorderingItem ${isCorrect ? "correct" : "incorrect"}`}>
                                    <span className="number">{userOrder}.</span> 
                                    <span className="content">{answer}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        } 
        
        else if (type == "MATCHING") {
            const entries = Object.entries(questionData);
            return (
                <div className="exams__did-matching">
                    <div className="exams__did-label">Danh sách cặp nối:</div>
                    <div className="exams__did-matchingItems">
                        {entries.map(([key, pair]) => {
                            const isCorrect = pair.left.num === pair.right.num;
                            return (
                                <div key={key} className={`exams__did-matchingItem ${isCorrect ? "correct" : "incorrect"}`}>
                                    <span className="left">{pair.left.content}</span>
                                    <span className="connector">→</span>
                                    <span className="right">{pair.right.content}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            );
        }
    };
    
    // console.log(didExam);
    // console.log(didQuestion.current);
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
                                    <input name="title" className="exams__title" id="exams-title" onChange={handleChange} placeholder="Nhập tiêu đề đề thi"/>
                                </div>
                                <div className="exams__box">
                                    <label htmlFor="exams-description">Mô tả</label>
                                    <textarea rows="5" name="description" className="exams__description" id="exams-description" onChange={handleChange} placeholder="Mô tả nội dung đề thi"/>
                                </div>
                                <div className="exams__box">
                                    <label htmlFor="exams-startDate">Ngày bắt đầu</label>
                                    <DatePicker
                                        selected={data.startDate}
                                        onChange={(date) => handleDateChange(date, "startDate")}
                                        dateFormat="dd/MM/yyyy"
                                        placeholderText="Chọn ngày bắt đầu"
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
                                        placeholderText="Chọn ngày kết thúc"
                                        id="exams-endDate"
                                        name="endDate"
                                        className="exams__endDate"
                                        autoComplete="off"
                                    />
                                </div>
                                <div className="exams__box">
                                    <label htmlFor="exams-timeLimit">Thời gian (phút)</label>
                                    <input type="number" className="exams__timeLimit" id="exams-timeLimit" min="1" value={data.timeLimit/60} onChange={handleChangeTimeLimit} />
                                </div>                                <div className="exams__box">
                                    <button type="submit" className="exams__submit-btn">Tạo mới</button>
                                </div>
                            </form>
                        </div>
                        
                    </div>                }
                <h1 className="exams__intro">Danh sách đề thi</h1>
                
                {didExam && didExam.length > 0 && (
                    <div className="exams__actions">
                        <button className="exams__viewAll" onClick={handleToggle}>
                            <i className="fa-solid fa-clock-rotate-left"></i> 
                            {openDidExam ? "Ẩn lịch sử làm bài" : "Xem lịch sử làm bài"}
                        </button>
                    </div>
                )}
                
                {exams && 
                    exams.map((exam, index) => (
                        <div key={index} className="exams__exam">
                            {
                                user?.role == "TEACHER" && 
                                <>
                                    <Link className="exams__exam-edit" to={`edit/${exam.id}`} title="Chỉnh sửa đề thi">
                                        <i className="fa-solid fa-gear"></i>
                                    </Link>
                                    <button className="exams__exam-delete" onClick={() => {handleDeleteExam(exam.id)}} title="Xóa đề thi">
                                        <i className="fa-solid fa-trash"></i>
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

                                    <span className="exams__exam-timeLimit">                                        <b>Thời gian làm: </b>{convertTimeLimit(exam.timeLimit)}
                                    </span>
                                </div>
                            </Link>
                            <div className="exams__exam-actions">
                                <Link to={`${exam.id}`} className="exams__exam-do">
                                    <i className="fa-solid fa-pen-to-square"></i> Làm bài
                                </Link>
                                <Link to={`${exam.id}/history`} className="exams__exam-history">
                                    <i className="fa-solid fa-clock-rotate-left"></i> Lịch sử làm bài
                                </Link>
                            </div>
                        </div>
                    )
                    )                }
                {
                    didExam && didExam.length > 0 && !openDidExam && 
                    <div className="exams__toggle-container">
                        <button className="exams__didOpen" onClick={handleToggle}>
                            <i className="fa-solid fa-chevron-down"></i> Hiển thị lịch sử làm bài cũ
                        </button>
                    </div>
                }
                {
                    openDidExam && 
                    <div className="exams__did">
                        {
                            didExam.map((exam) => (
                                <div className="exams__did-show" key={exam.id}>
                                    <div className="exams__did-showTitle">{exam.exam.title}</div>
                                    <div className="exams__did-showTime"><b>Thời gian làm bài:</b> {formatTime(exam.timeDo)}</div>
                                    <div className="exams__did-showQuestion">
                                        <h3>Kết quả bài làm:</h3>
                                        {
                                            exam.exam.questions.map((question, q_index) => (
                                                <div className="exams__did-showQuestion-question" key={question.id}>
                                                    <div className="exams__did-showQuestion-title">
                                                        <b>Câu {q_index + 1}:</b><div dangerouslySetInnerHTML={{__html: question.content}} /> 
                                                    </div>
                                                    {
                                                        question.type == "OBJECTIVE" && 
                                                        <>
                                                            {getDidQuestion(question.id, question.type, exam.id)}
                                                        </>
                                                    }
                                                    {
                                                        question.type == "DROPDOWN" && 
                                                        <>
                                                            {getDidQuestion(question.id, question.type, exam.id)}
                                                        </>
                                                    }
                                                    {
                                                        question.type == "FILL" && 
                                                        <>
                                                            {getDidQuestion(question.id, question.type, exam.id)}
                                                        </>
                                                    }
                                                    {
                                                        question.type == "REORDERING" && 
                                                        <>
                                                            {getDidQuestion(question.id, question.type, exam.id)}
                                                        </>
                                                    }
                                                    {
                                                        question.type == "MATCHING" && 
                                                        <>
                                                            {getDidQuestion(question.id, question.type, exam.id)}
                                                        </>
                                                    }
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                }
            </div>
            
        </>
    )
}
export default Exam;