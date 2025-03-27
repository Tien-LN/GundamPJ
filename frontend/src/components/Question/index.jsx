function Question({answers, fnUp, fnDown, type, handleChange}){
    // console.log(answers);
    // console.log(type);
    return (
        <>
            <div className="editExams__questions">
                {
                    answers && 
                    <>
                        <table className="editExams__table">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Nội dung 1</th>
                                    { type=="MATCHING" &&
                                        <th>Nội dung 2</th>
                                    }
                                    <th>Đáp án đúng</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    type=="OBJECTIVE" &&
                                    answers.map((answer, index) => (
                                        <tr key={index}>
                                            <td>{index+1}</td>
                                            <td>
                                                <input name="question-title" value={answer[0]} type="text" data-index={index} onChange={handleChange}/>
                                            </td>
                                            <td>
                                                <input name="question-answer" value={answer[1]} type="radio" data-index={index} onChange={handleChange}/>
                                            </td>
                                        </tr>
                                    ))
                                        
                                }
                                {
                                    type=="FILL" &&
                                    answers.map((answer, index) => (
                                        <tr key={index}>
                                            <td>{index+1}</td>
                                            <td>
                                                <input name="question-fill" value={answer} type="text" data-index={index} onChange={handleChange}/>
                                            </td>
                                            <td>
                                                <div className="question__corect">Đúng</div>
                                            </td>
                                        </tr>
                                    ))
                                }
                                {
                                    type=="MATCHING" &&
                                    answers.map((answer, index) => (
                                        <tr key={index}>
                                            <td>{index+1}</td>
                                            <td>
                                                <input name="question-matching-0" value={answer[0]} type="text" data-index={index} onChange={handleChange}/>
                                            </td>
                                            <td>
                                                <input name="question-matching-1" value={answer[1]} type="text" data-index={index} onChange={handleChange}/>
                                            </td>
                                            <td>
                                                <div className="question__corect">Đúng</div>
                                            </td>
                                        </tr>
                                    ))
                                }
                                {
                                    type=="REORDERING" &&
                                    answers.map((answer, index) => (
                                        <tr key={index}>
                                            <td>{index+1}</td>
                                            <td>
                                                <input name="question-reordering" value={answer} type="text" data-index={index} onChange={handleChange}/>
                                            </td>
                                            <td>
                                                <div className="question__corect">Đúng</div>
                                            </td>
                                        </tr>
                                    ))
                                }
                                {
                                    type=="DROPDOWN" &&
                                    answers.map((answer, index) => (
                                        <tr key={index}>
                                            <td>{index+1}</td>
                                            <td>
                                                <input name="question-title" value={answer[0]} type="text" data-index={index} onChange={handleChange}/>
                                            </td>
                                            <td>
                                                <input name="question-answer" value={answer[1]} type="radio" data-index={index} onChange={handleChange}/>
                                            </td>
                                        </tr>
                                    ))
                                        
                                }
                            </tbody>
                        </table>
                        
                        
                    </>
                    
                }
                <div className="editExams__questions-action">
                    <button type="button" className="editExams__questions-up" onClick={fnUp}>
                        <i className="fa-solid fa-plus"></i>
                    </button>
                    <button type="button" className="editExams__questions-down" onClick={fnDown}>
                        <i className="fa-solid fa-minus"></i>
                    </button>
                </div>
            </div>
        </>
    )
}
export default Question;