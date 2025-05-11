import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ExamHistory.scss";
import { format } from "date-fns";
import { convertTimeLimit } from "../../../helpers/client/Time/convertExamTimeLimit";

function ExamHistory() {
  const { courseId, examId } = useParams();
  const [loading, setLoading] = useState(true);
  const [examAttempts, setExamAttempts] = useState([]);
  const [exam, setExam] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExamHistory = async () => {
      try {
        setLoading(true);
        // Fetch all user exam attempts
        const response = await axios.get("http://localhost:3000/api/userExams", {
          withCredentials: true
        });

        // Filter attempts for the current exam
        const filteredAttempts = response.data.filter(attempt => attempt.examId === examId);
        setExamAttempts(filteredAttempts);

        // Fetch exam details if we have attempts
        if (filteredAttempts.length > 0) {
          setExam(filteredAttempts[0].exam);
        } else {
          // If no attempts, fetch the exam details separately
          const examResponse = await axios.get(`http://localhost:3000/api/exams/${courseId}/exams/${examId}/questions`, {
            withCredentials: true
          });
          setExam(examResponse.data);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching exam history:", error);
        setError("Không thể tải lịch sử làm bài. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchExamHistory();
  }, [examId, courseId]);

  // Calculate and format the score for an attempt
  const calculateScore = (attempt) => {
    if (!attempt || !attempt.userAnswers || !attempt.exam || !attempt.exam.questions) {
      return "N/A";
    }

    let correctAnswers = 0;
    const totalQuestions = attempt.exam.questions.length;

    // For each question in the exam
    attempt.exam.questions.forEach(question => {
      const userAnswersForQuestion = attempt.userAnswers.filter(
        answer => answer.questionId === question.id
      );

      // Check if the answer is correct based on question type
      let isCorrectAnswer = false;

      switch (question.type) {
        case "OBJECTIVE":
        case "DROPDOWN":
          // For objective questions, check if the selected option is correct
          const userAnswer = userAnswersForQuestion[0];
          if (userAnswer && userAnswer.questionOption.isCorrect) {
            isCorrectAnswer = true;
          }
          break;

        case "FILL":
          // For fill-in-the-blank, check if all fields are correctly filled
          const correctOptions = question.options.map(option => option.content.toLowerCase().trim());
          isCorrectAnswer = userAnswersForQuestion.every(answer => 
            correctOptions.includes(answer.value?.toLowerCase().trim())
          );
          break;

        case "MATCHING":
          // For matching, check if all pairs are correctly matched
          // Group answers by num to check pairs
          const pairs = {};
          userAnswersForQuestion.forEach(answer => {
            if (!pairs[answer.num]) {
              pairs[answer.num] = { left: null, right: null };
            }
            if (answer.left) {
              pairs[answer.num].left = answer.questionOption.id;
            } else {
              pairs[answer.num].right = answer.questionOption.id;
            }
          });

          // Check if all pairs match the correct options
          const allPairsCorrect = Object.values(pairs).every(pair => {
            const leftOption = question.options.find(opt => opt.id === pair.left);
            const rightOption = question.options.find(opt => opt.id === pair.right);
            return leftOption && rightOption && leftOption.num === rightOption.num;
          });
          
          isCorrectAnswer = allPairsCorrect;
          break;

        case "REORDERING":
          // For reordering, check if the sequence is correct
          const orderedAnswers = userAnswersForQuestion.sort((a, b) => a.num - b.num);
          isCorrectAnswer = orderedAnswers.every((answer, index) => {
            const option = question.options.find(opt => opt.id === answer.questionOptionId);
            return option && option.num === index + 1;
          });
          break;

        default:
          break;
      }

      if (isCorrectAnswer) {
        correctAnswers++;
      }
    });

    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 10) : 0;
    return `${score}/10 (${correctAnswers}/${totalQuestions})`;
  };

  // Format the date for display
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm");
    } catch (error) {
      return "N/A";
    }
  };

  return (
    <div className="examHistory">
      <div className="examHistory__header">
        <h1 className="examHistory__title">Lịch sử làm bài</h1>
        <Link to={`/courses/${courseId}/exams/${examId}`} className="examHistory__back-button">
          Quay lại đề thi
        </Link>
      </div>

      {loading ? (
        <div className="examHistory__loading">
          <i className="fa-solid fa-spinner fa-spin"></i> Đang tải dữ liệu...
        </div>
      ) : error ? (
        <div className="examHistory__error">{error}</div>
      ) : (
        <>
          {exam && (
            <div className="examHistory__exam-details">
              <h2>{exam.title}</h2>
              <p className="examHistory__exam-description">{exam.description}</p>
              <div className="examHistory__exam-info">
                <div className="examHistory__exam-time">
                  <strong>Thời gian làm bài:</strong> {convertTimeLimit(exam.timeLimit)}
                </div>
                <div className="examHistory__exam-dates">
                  <div><strong>Ngày bắt đầu:</strong> {formatDate(exam.startDate)}</div>
                  <div><strong>Ngày kết thúc:</strong> {formatDate(exam.endDate)}</div>
                </div>
              </div>
            </div>
          )}

          {examAttempts.length === 0 ? (
            <div className="examHistory__no-attempts">
              Bạn chưa có lần làm bài nào cho đề thi này.
            </div>
          ) : (
            <div className="examHistory__attempts-list">
              <h3>Các lần làm bài ({examAttempts.length})</h3>
              <table className="examHistory__table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Ngày làm bài</th>
                    <th>Thời gian làm</th>
                    <th>Điểm số</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {examAttempts.map((attempt, index) => (
                    <tr key={attempt.id}>
                      <td>{index + 1}</td>
                      <td>{formatDate(attempt.createdAt)}</td>
                      <td>{attempt.timeDo ? convertTimeLimit(attempt.timeDo) : "N/A"}</td>
                      <td className="examHistory__score">{calculateScore(attempt)}</td>
                      <td>
                        <Link 
                          to={`/courses/${courseId}/exams/${examId}/attempts/${attempt.id}`} 
                          className="examHistory__view-button"
                        >
                          Xem chi tiết
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ExamHistory;
