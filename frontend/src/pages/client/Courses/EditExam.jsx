import { useEffect, useState } from "react";
import TinyEditor from "../../../components/TinyEditor";
import axios from "axios";
import Question from "../../../components/Question";
import {useParams} from "react-router-dom";
import QuestionMatching from "../../../components/QuestionMatching";
import "./EditExam.scss";
import renderMathInElement from "katex/dist/contrib/auto-render";
function EditExam(){
    const {courseId, examId} = useParams();
    const [user, setUser] = useState({});   
    const [questions, setQuestions] = useState([]);
    const [addQuestion, setAddQuestion] = useState({
        QuestionType: "OBJECTIVE",
        content: "",
        answers: [],
        courseId: courseId
    });
    const [rows, setRows] = useState(0);
    useEffect(()=>{
        const fetchApi = async() => {
            try{
                const res_user = await axios.get("http://localhost:3000/api/users/getPermission", {
                    withCredentials: true
                });
                const res = await axios.get(`http://localhost:3000/api/exams/${courseId}/exams/${examId}/questions`, {
                    withCredentials: true
                })
                setUser(res_user.data);
                setQuestions(res.data.questions);

                setTimeout(() => {
                    const contentElement = document.querySelectorAll(".editExams__question-content");
                    
                    if (contentElement) {
                        contentElement.forEach((item) => {
                            renderMathInElement(item, {
                                delimiters: [
                                    { left: "$$", right: "$$", display: true },
                                    { left: "\\(", right: "\\)", display: false }
                                ]
                            });
                        })
                        
                    }
                }, 100)
            } catch(error){
                console.log("Lỗi", error);
            }
        }
        fetchApi();
    }, []);
    const handleContentChange = (event) => {
        setAddQuestion({
            ...addQuestion,
            ["content"]: event
        });
    }
    const handleChange = (event) => {
        setAddQuestion({
            ...addQuestion,
            [event.target.name]: event.target.value
        });
    }
    const changeAnswers = (data) => {
        setAddQuestion({
            ...addQuestion,
            ["answers"]: data
        });
    }
    useEffect(() => {
        switch(addQuestion.QuestionType){
            case "OBJECTIVE": 
            setRows(4);
            changeAnswers([
                ["A", "true"],
                ["B", "false"],
                ["C", "false"],
                ["D", "false"],
            ]);
            break;
            case "FILL": 
            setRows(1);
            changeAnswers([
                "answers"
            ]);
            break;
            case "MATCHING":
            setRows(3);
            changeAnswers([
                ["One", "Một"],
                ["Two", "Hai"],
                ["Three", "Ba"]
            ]);
            break;
            case "REORDERING":
            setRows(3);
            changeAnswers([
                "A",
                "B",
                "C"
            ]);
            break;
            case "DROPDOWN":
            setRows(4);
            changeAnswers([
                ["Hà Nội", "true"],
                ["Hồ Chí Minh", "false"],
                ["Qui Nhơn", "false"],
                ["Đà Nẵng", "false"]
            ]);
            break;
            default: 
            setRows(0);
            changeAnswers([]);
        }
    }, [addQuestion.QuestionType]);
    useEffect(() => {
        let newAnswers = [...addQuestion.answers];
        while(newAnswers.length < rows){
            switch(addQuestion.QuestionType){
                case "OBJECTIVE": 
                if(newAnswers.length == 0) newAnswers.push(["A", "true"]);
                else newAnswers.push(["A", "false"]);
                break;
                case "FILL": 
                newAnswers.push("A");
                break;
                case "MATCHING":
                newAnswers.push(["A", "A"]);
                break;
                case "REORDERING":
                newAnswers.push("A");
                break;
                case "DROPDOWN":
                if(newAnswers.length == 0) newAnswers.push(["A", "true"]);
                else newAnswers.push(["A", "false"]);
                break;
                default: 
                break;
            }
        }
        newAnswers = newAnswers.slice(0, rows);
        
        setAddQuestion({
            ...addQuestion,
            "answers": newAnswers
        });
    }, [rows]);

    const fnRowsUp = () => {
        setRows(x => x + 1);
    }
    const fnRowsDown = () => {
        if(rows > 1) setRows(x => x - 1);
    }
    const handleQuestionChange = (event) => {
        const element = event.target;
        const index = parseInt(element.getAttribute("data-index"));
       
        setAddQuestion((prevState) => {
            const updatedAnswers = [...prevState.answers]; 
            if (element.name === "question-title") {
                updatedAnswers[index] = [element.value, prevState.answers[index][1]]; 
            } 
            if(element.name === "question-answer") {
                for (const answer of updatedAnswers) {
                    answer[1] = "false";
                }
                updatedAnswers[index] = [ prevState.answers[index][0], "true"]; 
            }
            if(element.name === "question-fill"){
                updatedAnswers[index] = element.value;
            }
            if (element.name === "question-matching-0") {
                updatedAnswers[index] = [element.value, prevState.answers[index][1]]; 
            } 
            if (element.name === "question-matching-1") {
                updatedAnswers[index] = [prevState.answers[index][0], element.value]; 
            } 
            if (element.name === "question-reordering") {
                updatedAnswers[index] = element.value; 
            } 
            return {
                ...prevState,
                answers: updatedAnswers, 
            };
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault();

        const fetchApi = async() => {
            try{
                const res = await axios.post(`http://localhost:3000/api/exams/${examId}/createQuestion`, addQuestion, {
                    withCredentials: true
                });
                console.log(res.data);
                window.location.reload();
            } catch(error) {
                console.log("Lỗi khi tạo câu hỏi", error);
            }
        }
        fetchApi();
    }
    const deleteQuestion = (questionID) => {
        // console.log(questionID);
        const fetchApi = async() => {
            try {
                const res = await axios.delete(`http://localhost:3000/api/exams/${courseId}/exams/${examId}/${questionID}`, {
                    withCredentials: true
                });
                // console.log(res.data);
                console.log("Xóa câu hỏi thành công");
            } catch(error) {
                console.log("Lỗi khi xóa câu hỏi", error);
            }
        }
        fetchApi();
    }
    // console.log(addQuestion);
    // console.log(questions);
    return (            
        <>
            <div className="editExams">
                {
                    questions  && 
                    questions.map((question, index ) => (
                        <div key={index} className="editExams__question">
                            <h2 className="editExams__question-index">Câu hỏi {index+1} : </h2>
                            <button className="editExams__question-delete" onClick={() => {deleteQuestion(question.id)}}><i className="fa-solid fa-trash"></i></button>
                            <div className="editExams__question-content" >
                                Câu hỏi : <div dangerouslySetInnerHTML={{__html: question.content}} /> 
                            </div>
                            
                            {
                                question.type == "DROPDOWN" && 
                                <select data-question-id={question.id} defaultValue={true}>
                                    {
                                        question.options.map((option, opt__index) => (
                                            <option key={opt__index} value={option.isCorrect}>{option.content}</option>
                                        ))
                                    }
                                </select>
                            }
                            {
                                question.type == "OBJECTIVE" && 
                                question.options.map((option, opt__index) => (
                                    <div key={opt__index} className="editExams__question-opt">
                                        <input type="radio" name={question.id} id={option.id} checked={option.isCorrect}/>
                                        <label htmlFor={option.id}>{option.content}</label>
                                    </div>
                                ))
                            }
                            {
                                question.type == "FILL" && 
                                question.options.map((option, opt__index) => (
                                    <div key={opt__index} className="editExams__question-opt">
                                        <p className="editExams__question-opt-content">Đáp án {opt__index+1} : {option.content}</p>
                                    </div>
                                ))
                            }
                            {
                                question.type == "MATCHING" && 
                                
                                <div className="editExams__question-opt">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>STT</th>
                                                <th>Từ 1</th>
                                                <th>Từ 2</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <QuestionMatching options={question.options}/>
                                        </tbody>
                                    </table>
                                </div>
                                
                            }
                            {
                                question.type == "REORDERING" && 
                                <div className="editExams__question-reordering">
                                   {
                                     question.options.map((option, opt__index) => (
                                        <div key={opt__index} className="editExams__question-opt-content">
                                            {opt__index + 1} : {option.content}
                                        </div>
                                     ))
                                   }
                                </div>
                                
                            }
                        </div>
                    ))
                }
                <div className="editExams__add">
                    <h2 className="editExams__add-intro">Tạo mới một câu hỏi</h2>
                    <form className="editExams__form" method="POST" onSubmit={handleSubmit}>
                        <div className="editExams__box">
                            <label>Nội dung câu hỏi</label>
                            <TinyEditor initialValue="" onChange={handleContentChange}/>
                        </div>
                        <div className="editExams__box">
                            <select className="editExams__questionType" defaultValue={addQuestion.QuestionType} name="QuestionType" onChange={handleChange}>
                                <option value="OBJECTIVE">trắc nghiệm</option>
                                <option value="FILL">điền ô (dấu ... thay ô cần điền)</option>
                                <option value="MATCHING">nối</option>
                                <option value="REORDERING">sắp xếp</option>
                                <option value="DROPDOWN">chọn đáp án</option>
                            </select>
                        </div>
                        <div className="editExams__box">
                            <Question answers={addQuestion.answers} fnUp={fnRowsUp} fnDown={fnRowsDown} type={addQuestion.QuestionType} handleChange={handleQuestionChange}/>
                        </div>
                        <div className="editExams__box">
                            <button type="submit" className="editExams__submit">Tạo mới</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
export default EditExam;