import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ShowExam(){
    const {courseId, examId} = useParams();
    const [questions, setQuestions] = useState([]);

    useEffect(() => {
        const fetchApi = async () => {
            try {
                const res_questions = await axios.get(`http://localhost:3000/api/exams/${courseId}/exams/${examId}/questions`, {
                    withCredentials: true
                })

                console.log(res_questions.data);
            } catch(error){
                console.error("Lỗi khi lấy câu hỏi ", error);
            }
        }
        fetchApi();
    }, []);
    return (
        <>
            <div className="startExams">
                <h1 className="startExams__intro">Làm đề thi</h1>
                
            </div>
        </>
    )
}
export default ShowExam;