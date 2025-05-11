import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import renderMathInElement from "katex/dist/contrib/auto-render";
import { showDeleteNotification } from "./ShowExamUtils";
import "./ShowExam.scss";
import "./ShowExamHelpers.scss";
function ShowExam(){
    const {courseId, examId} = useParams();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});    const [timeLeft, setTimeLeft] = useState(null);
    const [isTimerReady, setIsTimerReady] = useState(false);
    const timeLimit = useRef();
    const optionsContent = useRef({});
    const questionIdType = useRef({});
    const navigate = useNavigate();
    useEffect(() => {
        const fetchApi = async () => {            try {
                const res_questions = await axios.get(`http://localhost:3000/api/exams/${courseId}/exams/${examId}/questions`, {
                    withCredentials: true
                });

                setQuestions(res_questions.data.questions);
                setTimeLeft(res_questions.data.timeLimit);
                timeLimit.current = res_questions.data.timeLimit;
                setIsTimerReady(true);
                // console.log(timeLimit.current);
            } catch(error){
                console.error("Lỗi khi lấy câu hỏi ", error);
            }
        }
        fetchApi();

        
    }, []);
    useEffect(() => {
        if(!questions || questions.length == 0) return;
        
        const renderMath = () => {
            const contentElements = document.querySelectorAll(".startExams__questions-content");
            if (contentElements && contentElements.length > 0) {
                contentElements.forEach((content) => {
                    
                    renderMathInElement(content, {
                        delimiters: [
                            { left: "$$", right: "$$", display: true },
                            { left: "\\(", right: "\\)", display: false }
                        ]
                    });
                })
                
            }
        }

        renderMath();

        const observer  = new MutationObserver(() => {
            renderMath();
        })

        const targetNode = document.querySelector(".startExams");
        if(targetNode){
            observer.observe(targetNode, {childList: true, subtree: true});
        }

        return () => observer.disconnect();
    }, [questions]);
    useEffect(()=> {
        if(!questions || questions.length == 0) return;
        let newAnswesrs = {...answers};
        if(!optionsContent.current){
            optionsContent.current = {};
        }
        if(!questionIdType.current){
            questionIdType.current = {};
        }
        questions.forEach((question, index) => {
            question.options.forEach((opt) => {
                optionsContent.current[opt.id] = opt.content;
            })
            questionIdType.current[question.id] = question.type;            if(!newAnswesrs[question.id]){
                if(question.type == "DROPDOWN" || question.type == "OBJECTIVE"){
                    newAnswesrs[question.id] = null; // Initialize without pre-selecting an answer
                } else if(question.type == "FILL") {
                    newAnswesrs[question.id] = {};
                    question.options.forEach((opt) => {
                        newAnswesrs[question.id][opt.id] = "";
                    })
                } else if(question.type == "MATCHING") {
                    newAnswesrs[question.id] = Array.from({length : question.options.length / 2}, () => ['', '']);
                    let num = Array(question.options.length/2).fill(false);
                    let index = 0;
                    question.options.forEach((opt) => {
                        if(!num[opt.num-1]){
                            num[opt.num-1] = true;
                            newAnswesrs[question.id][index++][0] = opt.id;
                        }
                    })
                } else if(question.type == "REORDERING") {
                    newAnswesrs[question.id] = question.options.map(() => "");
                }
            }
           
        })
        setAnswers(newAnswesrs);

    }, [questions]);    useEffect(() => {
        // Chỉ bắt đầu đếm ngược khi timeLeft đã được khởi tạo và không phải là null
        if (timeLeft === null) return;
        
        // Chỉ submit khi đã hết thời gian
        if (timeLeft <= 0 && isTimerReady) {
            handleSubmit(); 
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, isTimerReady]);
    const handleObjectiveChange = (questionId, optId) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optId
        }));
    }
    const handleFillChange = (questionId, optId, content) => {
        setAnswers(prev => ({
            ...prev, 
            [questionId]: {
                ...prev[questionId],
                [optId]: content
            }
        }));
    }
    const handleAddReordering = (questionId, optId) => {
        setAnswers((prevAnswers) => {
            let newAnswerOptions = [...prevAnswers[questionId]];

            let emptyIndex = newAnswerOptions.indexOf('');
            if(emptyIndex !== -1){
                newAnswerOptions[emptyIndex] = optId;
            }

            return {
                ...prevAnswers,
                [questionId]: newAnswerOptions            };
        });
    }
      const handleDeleteReordering = (questionId, opt_index) => {
        setAnswers((prevAnswers) => {
            // Kiểm tra xem phần tử có giá trị để xóa không
            if (prevAnswers[questionId][opt_index]) {
                let newAnswerOptions = [...prevAnswers[questionId]];
                const deletedValue = newAnswerOptions[opt_index];
                newAnswerOptions[opt_index] = '';
                
                // Hiển thị thông báo xóa
                setTimeout(() => showDeleteNotification(), 100);
                
                return {
                    ...prevAnswers,
                    [questionId]: newAnswerOptions
                };
            }
            return prevAnswers;
        });
    }
    const handleAddMatching = (questionId, optId) => {
        setAnswers((prevAnswers) => {
            let newAnswerOptions = [...prevAnswers[questionId]];

            let emptyIndex = newAnswerOptions.findIndex(([_,b]) => b == '');
            if(emptyIndex !== -1){
                newAnswerOptions[emptyIndex][1] = optId;
            }

            return {
                ...prevAnswers,
                [questionId]: newAnswerOptions};
        });
    };
    
    const handleDeleteMatching = (questionId, opt_index) => {
        setAnswers((prevAnswers) => {
            // Chỉ xóa khi có giá trị
            if (prevAnswers[questionId][opt_index] && prevAnswers[questionId][opt_index][1]) {
                let newAnswerOptions = [...prevAnswers[questionId]];
                newAnswerOptions[opt_index][1] = '';
                return {
                    ...prevAnswers,
                    [questionId]: newAnswerOptions
                };
            }
            return prevAnswers;
        });
    }
    const handleSubmit = () => {
        const fetchApi = async() => {
            try{
                const res = await axios.post(`http://localhost:3000/api/userExams/${examId}`, {
                    courseId: courseId,
                    timeDo: timeLimit.current - timeLeft,
                    answers: answers,
                    questionIdType: questionIdType.current
                }, {
                    withCredentials: true
                });

                console.log("Đã gửi thành công");
                console.log(res.data);
                navigate(`/courses/${courseId}/exams`);
            } catch(error) {
                console.error("Lỗi khi gửi câu hỏi", error);
            }
        }
        fetchApi();
    }
      const formatTime = (seconds) => {
        if (seconds === null) return "00:00";
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
    // console.log(questions);
    // console.log(answers);
    // console.log(questionIdType.current);
    return (
        <>
            <div className="startExams">                <h1 className="startExams__intro">Làm bài thi</h1>

                {isTimerReady && (
                  <div className="startExams__timer">
                      <i className="fa-solid fa-hourglass-half"></i> Thời gian còn lại: <b>{formatTime(timeLeft)}</b>
                  </div>
                )}
                {
                    questions && 
                questions.map((question, index) => (
                    <div className="startExams__questions-question" key={question.id}>
                        <div key={index} className="startExams__index"><b>Câu {index + 1}:</b></div>
                        <div className="startExams__questions-content">
                            <div dangerouslySetInnerHTML={{__html: question.content}} /> 
                        </div>
                        <div className="startExams__answers">
                            {                                question.type == "DROPDOWN" && 
                                <select className="startExams__answers-dropdown" value={answers[question.id] || ""} onChange={(e) => {handleObjectiveChange(question.id, e.target.value)}}>
                                    <option value="" disabled>Chọn câu trả lời</option>
                                    { 
                                        question.options && 
                                        question.options.map((opt, opt_index) => (
                                            <option key={opt.id} value={opt.id}>{opt.content}</option>
                                        ))

                                    }
                                </select>
                            }
                            {
                                question.type == "FILL" && 
                                question.options.map((opt, opt_index) => (
                                    <input 
                                        key={opt.id}
                                        className="startExams__answers-fillInput" 
                                        value={answers[question.id]?.[opt.id] ?? ""} 
                                        onChange={(e) => {handleFillChange(question.id, opt.id, e.target.value)}}
                                        placeholder="Nhập câu trả lời..."
                                    />
                                ))
                            }
                            {
                                question.type == "OBJECTIVE" && 
                                <div className="startExams__answers-objective">
                                    {
                                        question.options.map((opt) => (
                                            <div key={opt.id} className="startExams__answers-box">
                                                <input 
                                                    type="radio" 
                                                    className="startExams__answers-radio" 
                                                    id={`startExams-option-${opt.id}`} 
                                                    checked={answers[question.id] == opt.id} 
                                                    onChange={() => {handleObjectiveChange(question.id, opt.id)}}
                                                />
                                                <label htmlFor={`startExams-option-${opt.id}`}>{opt.content}</label>
                                            </div>
                                        ))
                                    }
                                </div>
                            }
                            {
                                question.type == "REORDERING" && 
                                <div className="startExams__answers-reordering">
                                    <div className="startExams__answers-reorderingBox">
                                        {
                                            answers[question.id] &&                                            answers[question.id].map((answer, answer_index) => (
                                                <div 
                                                    key={answer_index} 
                                                    className={`reordering__box ${answer ? "reordering__box--filled" : ""}`} 
                                                    onClick={() => {answer && handleDeleteReordering(question.id, answer_index)}}
                                                    title={answer ? "Nhấn để xóa" : ""}
                                                >
                                                    {answer ? (
                                                        <>
                                                            <span>{optionsContent.current[answer]}</span>
                                                            <span className="delete-icon">×</span>
                                                        </>
                                                    ) : (answer_index == answers[question.id].length - 1 ? "___" : "___ /")}
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <div className="startExams__answers-reorderingLetters">
                                    {question.options &&
                                        Array.isArray(answers[question.id]) && 
                                        question.options.map((opt, opt_index) => {
                                            if (!answers[question.id].includes(opt.id)) {
                                                return (
                                                    <button 
                                                        key={opt_index} 
                                                        className="reordering__box" 
                                                        onClick={() => {handleAddReordering(question.id, opt.id)}}
                                                        title="Nhấn để thêm vào câu trả lời"
                                                    >
                                                        {opt.content}
                                                    </button>
                                                );
                                            }
                                            return null; 
                                        })}
                                    </div>
                                </div>
                            }
                            {
                                question.type == "MATCHING" && 
                                <div className="startExams__answers-matching">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Nội dung cột 1</th>
                                                <th>Nội dung cột 2</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                answers[question.id] && 
                                                answers[question.id].map((ans, ans_index) => (                                                <tr key={ans[0] + "-" + ans[1]}>
                                                    <td>{optionsContent.current[ans[0]]}</td>
                                                    <td 
                                                        className={`matching-cell ${ans[1] ? "matching-cell--filled" : ""}`}
                                                        onClick={() => {ans[1] && handleDeleteMatching(question.id, ans_index)}}
                                                        title={ans[1] ? "Nhấn để xóa" : ""}
                                                    >
                                                        {ans[1] ? (
                                                            <>
                                                                <span>{optionsContent.current[ans[1]]}</span>
                                                                <span className="delete-icon">×</span>
                                                            </>
                                                        ) : '___'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="startExams__answers-matchingLetters">
                                        {question.options.map((opt, opt_index) => {
                                            if(!answers[question.id]) return null;
                                            let addedValues = answers[question.id].flat();
                                            if(!addedValues.includes(opt.id)){
                                                return (
                                                    <button 
                                                        key={opt_index} 
                                                        onClick={() => {handleAddMatching(question.id, opt.id)}}
                                                        title="Nhấn để thêm vào câu trả lời"
                                                    >
                                                        {opt.content}
                                                    </button>
                                                )
                                            }
                                            else return null;
                                        })}
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                ))}
                
                <button className="startExams__submit" onClick={handleSubmit}>
                    <i className="fa-solid fa-paper-plane"></i> Nộp bài làm
                </button>
                <Link to={`/courses/${courseId}/exams/${examId}/history`} className="startExams__viewHistory">
                    <i className="fa-solid fa-clock-rotate-left"></i> Xem lịch sử
                </Link>
            </div>
        </>
    )
}
export default ShowExam;