import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import renderMathInElement from "katex/dist/contrib/auto-render";
function ShowExam(){
    const {courseId, examId} = useParams();
    const [questions, setQuestions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [answers, setAnswers] = useState({});
    const optionsContent = useRef({});
    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res_questions = await axios.get(`http://localhost:3000/api/exams/${courseId}/exams/${examId}/questions`, {
                    withCredentials: true
                })


                setQuestions(res_questions.data);
            } catch(error){
                console.error("Lỗi khi lấy câu hỏi ", error);
            }
        }
        fetchApi();

        
    }, []);
    useEffect(() => {
        if(!questions || questions.length == 0) return;
        setIsLoading(false);
        setTimeout(() => {
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
        }, 100);
    }, [questions, isLoading]);
    useEffect(()=> {
        if(!questions || questions.length == 0) return;
        let newAnswesrs = {...answers};
        if(!optionsContent.current){
            optionsContent.current = {};
        }
        questions.forEach((question, index) => {
            question.options.forEach((opt) => {
                optionsContent.current[opt.id] = opt.content;
            })
            if(!newAnswesrs[question.id]){
                if(question.type == "DROPDOWN" || question.type == "OBJECTIVE"){
                    newAnswesrs[question.id] = question.options[0]?.id || null;
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

    }, [questions]);
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
                [questionId]: newAnswerOptions
            };
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
                [questionId]: newAnswerOptions
            };
        })
    }
    console.log(questions);
    console.log(answers);
    return (
        <>
            <div className="startExams">
                <h1 className="startExams__intro">Làm đề thi</h1>
                {
                    questions && 
                questions.map((question, index) => (
                    <div className="startExams__questions-question" key={index}>
                        <div key={index} className="startExams__index"><b>Câu {index + 1} : </b></div>
                        <div className="startExams__questions-content">
                            <div dangerouslySetInnerHTML={{__html: question.content}} /> 
                        </div>
                        <div className="startExams__answers">
                            {
                                question.type == "DROPDOWN" && 
                                <select className="startExams__answers-dropdown" value={answers[question.id] ?? ""} onChange={(e) => {handleObjectiveChange(question.id, e.target.value)}}>
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
                                    <input className="startExams__answers-fillInput" value={answers[question.id]?.[opt.id] ?? ""} onChange={(e) => {handleFillChange(question.id, opt.id, e.target.value)}}/>
                                ))
                            }
                            {
                                question.type == "OBJECTIVE" && 
                                question.options.map((opt) => (
                                    <div key={opt.id} className="startExams__answers-box">
                                        <input type="radio" className="startExams__answers-objective" id={`startExams-option-${opt.id}`} checked={answers[question.id] == opt.id} onChange={() => {handleObjectiveChange(question.id, opt.id)}}/>
                                        <label htmlFor={`startExams-option-${opt.id}`}>{opt.content}</label>
                                    </div>
                                ))
                            }
                            {
                                question.type == "REORDERING" && 
                                <div className="startExams__answers-reordering">
                                    <div className="startExams__answers-reorderingBox">
                                        {
                                            answers[question.id] && 
                                            answers[question.id].map((answer, answer_index) => (
                                                <div key={answer_index} className="reordering__box">
                                                    {optionsContent.current[answer]}
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
                                                    <button key={opt_index} className="reordering__box" onClick={() => {handleAddReordering(question.id, opt.id)}}>
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
                                                answers[question.id].map((ans, ans_index) => (
                                                <tr key={ans_index}>
                                                    <td>{optionsContent.current[ans[0]]}</td>
                                                    <td>{ans[1] ? optionsContent.current[ans[1]] : '___'}</td>
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
                                                    <button key={opt_index} onClick={() => {handleAddMatching(question.id, opt.id)}}>{opt.content}</button>
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
                
                <button className="startExams__submit">
                    Gửi bài làm
                </button>
            </div>
        </>
    )
}
export default ShowExam;