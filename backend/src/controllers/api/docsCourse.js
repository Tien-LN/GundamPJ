const { prisma } = require("../../config/db");

// [GET] /api/docsCourse/:courseId 
module.exports.getDocs = async(req, res) => {
    try{
        const courseId = req.params.courseId;
        
        const course = await prisma.course.findFirst({
            where: {
                id: courseId,
                deleted: false
            },
            include: {
                docsCourse: true
            }
        });
        if(!course) return res.status(404).json({message: "course not found!"});
        res.send(course);
    } catch(error){
        return res.status(500).json({message : "server error"});
    }
}

// [GET] /api/docsCourse/:courseId/:docsId
module.exports.getDoc = async(req, res) => {
    try{
        const courseId = req.params.courseId;
        const docsId = req.params.docsId;
        const docs = await prisma.docsOfCourse.findFirst({
            where: {
                id: docsId,
                courseId: courseId
            }
        });
        if(!docs) return res.status(404).json({message: "docs not found!"});
        res.send(docs);
    } catch(error){
        return res.status(500).json({message : "server error"});
    }
}

// [POST] /api/docsCourse/:courseId/addDocs 
module.exports.createPost = async(req, res) => {
    try{
        const teacherId = req.user.id;
        const {courseId} = req.body;
        
        const course = await prisma.course.findUnique({
            where: {
                teacherId: teacherId,
                id: courseId,
                deleted: false
            }
        });
        
        if(!course){
            return res.status(404).json({message: "course not found!!!"});
        }
        await prisma.docsOfCourse.create({
            data: req.body
        });
        res.send("Đã tạo thành công!!");
    } catch(error) {
        return res.status(500).json({message: "Error server!!!"});
    }
}