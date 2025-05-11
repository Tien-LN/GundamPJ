import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "./ExamAttemptDetail.scss";

function ExamAttemptDetail() {
  const { courseId, examId, attemptId } = useParams();
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAttemptDetails = async () => {
      try {
        setLoading(true);
        // Get all user exam attempts
        const response = await axios.get("http://localhost:3000/api/userExams", {
          withCredentials: true
        });

        // Find the specific attempt
        const foundAttempt = response.data.find(attempt => attempt.id === attemptId);
        
        if (!foundAttempt) {
          setError("Không tìm thấy bài làm này.");
          setLoading(false);
          return;
        }

        setAttempt(foundAttempt);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching attempt details:", error);
        setError("Không thể tải chi tiết bài làm. Vui lòng thử lại sau.");
        setLoading(false);
      }
    };

    fetchAttemptDetails();
  }, [attemptId]);

  // Group user answers by question
  const getUserAnswersByQuestion = () => {
    if (!attempt || !attempt.userAnswers || !attempt.exam || !attempt.exam.questions) {
      return [];
    }

    return attempt.exam.questions.map(question => {
      const userAnswers = attempt.userAnswers.filter(
        answer => answer.questionId === question.id
      );

      // Calculate if the answer is correct based on question type
      let isCorrect = false;
      let userAnswer = null;

      switch (question.type) {
        case "OBJECTIVE":
        case "DROPDOWN":
          // For objective questions, check if the selected option is correct
          userAnswer = userAnswers[0];
          isCorrect = userAnswer && userAnswer.questionOption.isCorrect;
          break;

        case "FILL":
          // For fill-in-the-blank, check if all fields are correctly filled
          const correctOptions = question.options.map(option => option.content.toLowerCase().trim());
          
          userAnswer = userAnswers.map(answer => ({
            value: answer.value,
            optionId: answer.questionOptionId
          }));
          
          isCorrect = userAnswers.every(answer => 
            correctOptions.includes(answer.value?.toLowerCase().trim())
          );
          break;

        case "MATCHING":
          // For matching, group by pairs
          const pairs = {};
          userAnswers.forEach(answer => {
            if (!pairs[answer.num]) {
              pairs[answer.num] = { left: null, right: null };
            }
            if (answer.left) {
              pairs[answer.num].left = answer.questionOption;
            } else {
              pairs[answer.num].right = answer.questionOption;
            }
          });
          
          userAnswer = Object.values(pairs);
          
          // Check if all pairs are correct
          isCorrect = Object.values(pairs).every(pair => {
            return pair.left && pair.right && pair.left.num === pair.right.num;
          });
          break;

        case "REORDERING":
          // For reordering, get the sequence
          userAnswer = userAnswers
            .sort((a, b) => a.num - b.num)
            .map(answer => answer.questionOption);
          
          // Check if sequence is correct
          isCorrect = userAnswer.every((option, index) => 
            option.num === index + 1
          );
          break;

        default:
          break;
      }

      return {
        question,
        userAnswers,
        isCorrect,
        userAnswer
      };
    });
  };

  // Calculate the total score
  const calculateTotalScore = () => {
    const questionResults = getUserAnswersByQuestion();
    if (questionResults.length === 0) return "0/10";
    
    const correctCount = questionResults.filter(result => result.isCorrect).length;
    const totalQuestions = questionResults.length;
    
    const score = Math.round((correctCount / totalQuestions) * 10);
    return `${score}/10 (${correctCount}/${totalQuestions})`;
  };

  return (
    <div className="examAttemptDetail">
      <div className="examAttemptDetail__header">
        <h1 className="examAttemptDetail__title">Chi tiết bài làm</h1>
        <Link to={`/courses/${courseId}/exams/${examId}/history`} className="examAttemptDetail__back-button">
          Quay lại lịch sử làm bài
        </Link>
      </div>

      {loading ? (
        <div className="examAttemptDetail__loading">
          <i className="fa-solid fa-spinner fa-spin"></i> Đang tải dữ liệu...
        </div>
      ) : error ? (
        <div className="examAttemptDetail__error">{error}</div>
      ) : attempt ? (
        <>
          <div className="examAttemptDetail__result-summary">
            <div className="examAttemptDetail__exam-name">
              <h2>{attempt.exam.title}</h2>
            </div>
            <div className="examAttemptDetail__score-card">
              <div className="examAttemptDetail__score">
                <span className="examAttemptDetail__score-label">Điểm số:</span>
                <span className="examAttemptDetail__score-value">{calculateTotalScore()}</span>
              </div>
              <div className="examAttemptDetail__time">
                <span>Thời gian làm bài: {attempt.timeDo ? `${Math.floor(attempt.timeDo / 60)} phút ${attempt.timeDo % 60} giây` : "N/A"}</span>
              </div>
            </div>
          </div>

          <div className="examAttemptDetail__questions">
            {getUserAnswersByQuestion().map((result, index) => (
              <div 
                key={result.question.id} 
                className={`examAttemptDetail__question ${result.isCorrect ? 'examAttemptDetail__question--correct' : 'examAttemptDetail__question--incorrect'}`}
              >
                <div className="examAttemptDetail__question-header">
                  <h3 className="examAttemptDetail__question-number">Câu hỏi {index + 1}</h3>
                  <div className="examAttemptDetail__question-result">
                    {result.isCorrect ? (
                      <span className="examAttemptDetail__correct">Đúng</span>
                    ) : (
                      <span className="examAttemptDetail__incorrect">Sai</span>
                    )}
                  </div>
                </div>

                <div 
                  className="examAttemptDetail__question-content"
                  dangerouslySetInnerHTML={{ __html: result.question.content }}
                />

                <div className="examAttemptDetail__answers">
                  {result.question.type === "OBJECTIVE" && (
                    <div className="examAttemptDetail__objective-answers">
                      {result.question.options.map(option => {
                        const isUserSelection = result.userAnswer && result.userAnswer.questionOptionId === option.id;
                        const isCorrectOption = option.isCorrect;
                        
                        let className = "examAttemptDetail__option";
                        if (isUserSelection) {
                          className += isCorrectOption 
                            ? " examAttemptDetail__option--correct-selected" 
                            : " examAttemptDetail__option--incorrect-selected";
                        } else if (isCorrectOption) {
                          className += " examAttemptDetail__option--correct";
                        }
                        
                        return (
                          <div key={option.id} className={className}>
                            <span className="examAttemptDetail__option-marker">
                              {isUserSelection ? "✓" : ""}
                            </span>
                            <span className="examAttemptDetail__option-content">{option.content}</span>
                            {isCorrectOption && !isUserSelection && (
                              <span className="examAttemptDetail__correct-answer">(Đáp án đúng)</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {result.question.type === "DROPDOWN" && (
                    <div className="examAttemptDetail__dropdown-answer">
                      <p>Bạn đã chọn: <strong>{result.userAnswer ? result.userAnswer.questionOption.content : "Không có câu trả lời"}</strong></p>
                      <p>Đáp án đúng: <strong>{result.question.options.find(o => o.isCorrect)?.content || "N/A"}</strong></p>
                    </div>
                  )}

                  {result.question.type === "FILL" && (
                    <div className="examAttemptDetail__fill-answer">
                      <div className="examAttemptDetail__fill-user-answer">
                        <h4>Câu trả lời của bạn:</h4>
                        <ul>
                          {result.userAnswer && result.userAnswer.length > 0 ? 
                            result.userAnswer.map((ans, i) => (
                              <li key={i}>{ans.value || "Không có câu trả lời"}</li>
                            )) : 
                            <li>Không có câu trả lời</li>
                          }
                        </ul>
                      </div>
                      <div className="examAttemptDetail__fill-correct-answer">
                        <h4>Đáp án đúng:</h4>
                        <ul>
                          {result.question.options.map(option => (
                            <li key={option.id}>{option.content}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {result.question.type === "MATCHING" && (
                    <div className="examAttemptDetail__matching-answer">
                      <h4>Bài làm của bạn:</h4>
                      <table className="examAttemptDetail__matching-table">
                        <thead>
                          <tr>
                            <th>STT</th>
                            <th>Bên trái</th>
                            <th>Bên phải</th>
                            <th>Kết quả</th>
                          </tr>
                        </thead>
                        <tbody>
                          {result.userAnswer && result.userAnswer.map((pair, index) => {
                            const isCorrectPair = pair.left && pair.right && pair.left.num === pair.right.num;
                            return (
                              <tr key={index} className={isCorrectPair ? "examAttemptDetail__pair--correct" : "examAttemptDetail__pair--incorrect"}>
                                <td>{index + 1}</td>
                                <td>{pair.left ? pair.left.content : "N/A"}</td>
                                <td>{pair.right ? pair.right.content : "N/A"}</td>
                                <td>{isCorrectPair ? "Đúng" : "Sai"}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>

                      <h4>Đáp án đúng:</h4>
                      <table className="examAttemptDetail__matching-table">
                        <thead>
                          <tr>
                            <th>STT</th>
                            <th>Bên trái</th>
                            <th>Bên phải</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(() => {
                            // Group options by num
                            const pairsByNum = {};
                            result.question.options.forEach(option => {
                              if (!pairsByNum[option.num]) {
                                pairsByNum[option.num] = { left: null, right: null };
                              }
                              
                              if (option.content) {
                                const side = result.question.options
                                  .filter(o => o.num === option.num)
                                  .indexOf(option) === 0 ? 'left' : 'right';
                                pairsByNum[option.num][side] = option;
                              }
                            });

                            return Object.entries(pairsByNum).map(([num, pair], index) => (
                              <tr key={num}>
                                <td>{index + 1}</td>
                                <td>{pair.left ? pair.left.content : "N/A"}</td>
                                <td>{pair.right ? pair.right.content : "N/A"}</td>
                              </tr>
                            ));
                          })()}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {result.question.type === "REORDERING" && (
                    <div className="examAttemptDetail__reordering-answer">
                      <div className="examAttemptDetail__reordering-user">
                        <h4>Thứ tự của bạn:</h4>
                        <ol>
                          {result.userAnswer && result.userAnswer.map((option, index) => (
                            <li key={index} className={option.num === index + 1 ? "correct" : "incorrect"}>
                              {option.content} 
                              {option.num !== index + 1 && (
                                <span className="examAttemptDetail__reordering-position">
                                  (Vị trí đúng: {option.num})
                                </span>
                              )}
                            </li>
                          ))}
                        </ol>
                      </div>
                      
                      <div className="examAttemptDetail__reordering-correct">
                        <h4>Thứ tự đúng:</h4>
                        <ol>
                          {result.question.options
                            .slice()
                            .sort((a, b) => a.num - b.num)
                            .map((option, index) => (
                              <li key={index}>{option.content}</li>
                            ))
                          }
                        </ol>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="examAttemptDetail__error">Không tìm thấy dữ liệu bài làm.</div>
      )}
    </div>
  );
}

export default ExamAttemptDetail;
