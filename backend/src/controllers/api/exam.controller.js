const { prisma } = require("../../config/db");

// [GET] /api/exams/?courseId=:id
module.exports.index = async(req, res) => {
    try{
        const courseId = req.query.courseId;
        if(!courseId){
            return res.status(400).json({message: "courseId is required!"});
        }
        const course = await prisma.course.findFirst({
            where: {id: courseId},
            include: {
                exams: true
            }
        });
        if(!course){
            return res.status(400)
        }
        return res.status(200).json(course);
    } catch(error){
        return res.status(500).json({message: "Server error!", error});
    }
}

// [POST] /api/exams/create 
module.exports.createPost = async(req, res) => {
    if(req.body.questions && req.body.questions.length == 0) delete req.body.questions;
    if(req.body.UserExam && req.body.UserExam.length == 0) delete req.body.UserExam;
    
    await prisma.exam.create({
        data: req.body
    });
    res.send("Đã tạo bài thi thành công");
} 

// [POST] /api/exams/:id/createQuestion
module.exports.createQuestion = async(req, res) => {
    try{
        const id = req.params.id;
        const exam = await prisma.exam.findUnique({
            where: {id: id}
        });
        if(!exam){
            return res.status(400).json({message: "Không tìm thấy bài thi!"});
        }
        if(!req.body.QuestionType) req.body.QuestionType = "OBJECTIVE";
        if(req.body.QuestionType == "OBJECTIVE"){
            if(!req.body.questions || req.body.questions.length <= 1){
                return res.status(400).json({message: "Cần thêm câu trả lời"});
            }
            const question = await prisma.question.create({
                data: {
                    examId: id,
                    type: req.body.QuestionType,
                    content: req.body.content
                }
            });

            req.body.questions.forEach(async (item) => {
                await prisma.questionOption.create({
                    data: {
                        questionId: question.id,
                        content: item[0],
                        isCorrect: item[1]
                    }
                });
            });
            res.send("Đã tạo thành công!");
        } 

    } catch(error) {
        return res.status(400).json({message: "Lỗi j đó rồi", error});
    }
    
}


// [GET] /api/exams/:id 
module.exports.getQuestions = async(req, res) => {
    try{
        const id = req.params.id;
        const exam = await prisma.exam.findUnique({
            where: {
                id: id,
                deleted: false 
            },
            include: {
                questions: {
                    include: {
                        options: true
                    }
                }
            }
        });
        if(!exam){
            return res.status(404).json({message: "Không tìm thấy bài thi"});
        }
        res.send(exam);

    } catch(error){
        return res.status(400).json({message: "Lỗi đéo j đó", error});
    }
}