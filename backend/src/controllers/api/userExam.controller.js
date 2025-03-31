const { prisma } = require("../../config/db");

// [GET] /api/userExams 
module.exports.index = async(req, res) => {
    res.send("OK");
}

// [POST] /api/userExams/:examId 
module.exports.sendExam = async(req, res) => {
    try {
        const examId = req.params.examId;
        const userId = req.user.id;
        const {timeDo, answers, questionIdType} = req.body;

        const userExam = await prisma.userExam.create({
            data: {
                userId: userId,
                examId: examId,
                ...(timeDo && {timeDo : timeDo}) 
            }
        })
        // return res.send(userExam);
        const promises = [];
        
        for (const questionId in questionIdType) {
            
            const type = questionIdType[questionId];
            if(type == "OBJECTIVE" || type == "DROPDOWN") {
                promises.push(
                    prisma.userAnswer.create({
                        data: {
                            userExamId: userExam.id,
                            questionId: questionId,
                            questionOptionId: answers[questionId],
                            userId: userId
                        }
                    })
                )
                
            } else if(type == "FILL") {
                for (const optionKey in answers[questionId]) {
                   promises.push(
                    prisma.userAnswer.create({
                        data: {
                            userExamId: userExam.id,
                            questionId: questionId,
                            questionOptionId: optionKey,
                            userId: userId,
                            value: answers[questionId][optionKey]
                        }
                    })
                   )
                }
            } else if(type == "MATCHING") {
                let num = 0;
                for (const matchValue of answers[questionId]) {
                    ++num;
                    promises.push(
                        prisma.userAnswer.create({
                            data: {
                                userExamId: userExam.id,
                                questionId: questionId,
                                questionOptionId: matchValue[0],
                                userId: userId,
                                num: num,
                                left: true 
                            }
                        })
                    )
                    promises.push(
                        prisma.userAnswer.create({
                            data: {
                                userExamId: userExam.id,
                                questionId: questionId,
                                questionOptionId: matchValue[1],
                                userId: userId,
                                num: num,
                                left: false 
                            }
                        })
                    )
                }
            } else if(type == "REORDERING") {
                let num = 0;
                for (const reorderValue of answers[questionId]) {
                    ++num;
                    promises.push(
                        await prisma.userAnswer.create({
                            data: {
                                userExamId: userExam.id,
                                questionId: questionId,
                                questionOptionId: reorderValue,
                                userId: userId,
                                num: num,
                            }
                        })
                    )
                }
            }
        }
        await Promise.all(promises);
        return res.send("Đã gửi bài thành công");
    } catch(error) {
        return res.status(500).json({message: "server Error!!"});
    }
}

