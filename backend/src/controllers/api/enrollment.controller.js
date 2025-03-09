const { prisma } = require("../../config/db.js");
// [GET] /api/enrollments 
module.exports.index = (req, res) => {
    res.send("Đây là api tham gia khóa học");
}

// [POST] /api/enrollments
module.exports.createPost = async(req, res) => {
    try{
        const {userId, courseId} = req.body;

        const user = await prisma.user.findFirst({
            where: {
                id: userId
            }
        });
        if(!user){
            res.send("Không tìm thấy user!");
            return;
        }
        const course = await prisma.course.findFirst({
            where: {
                id: courseId
            }
        });
        if(!course){
            res.send("Không tìm thấy khóa học!");
        }
        await prisma.enrollment.create({
            data: req.body
        })
        res.send("Đã gửi yêu cầu tham gia");
    } catch(error) {
        if (error instanceof Prisma.PrismaClientInitializationError) {
            return res.status(500).json({ message: "database connect error!" });
        }
        res.status(500).json({ message: "server error!", error: error.message });
    }
}

// [DELETE] /api/enrollments/:id
module.exports.enrollDelete = async(req,res) => {
    try{
        const id = req.params.id;

        await prisma.enrollment.update({
            where: {id: id},
            data: {
                deleted: true
            },
        });
        // Gửi lên FrontEnd Tình trạng 
        res.send("Đã xóa thành công");
    } catch(error) {
        //Gửi lỗi lên Frontend 

        if (error.code === "P2025") {
            return res.status(404).json({ success: false, message: "Enrollment not found!" });
        }
      
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// [GET] /api/enrollments/list/:id
module.exports.list = async(req, res) => {
    try{
        const id = req.params.id;

        const enrolls = await prisma.enrollment.findMany({
            where: {
                courseId: id,
                status: "PENDING",
                deleted: false
            }
        });
        res.send(enrolls);
    } catch(error) {
        if (error.code === "P2025") {
            return res.status(404).json({ success: false, message: "Enrollment Id not found!" });
        }
      
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
    
}

// [GET] /api/enrollments/listApproved
module.exports.listApproved = async(req, res) => {
    try{
        const id = req.params.id;

        const enrolls = await prisma.enrollment.findMany({
            where: {
                courseId: id,
                status: "APPROVED",
                deleted: false
            }
        });
        res.send(enrolls);
    } catch(error) {
        if (error.code === "P2025") {
            return res.status(404).json({ success: false, message: "Enrollment Id not found!" });
        }
      
        res.status(500).json({ success: false, message: "Internal Server Error" });
    };
}

// [PATCH] /api/enrollments/reject/:id
module.exports.reject = async(req, res) => {
    try{
            const id = req.params.id;
        
            await prisma.enrollment.update({
                where: {id: id},
                data: {
                    status: "REJECTED"
                },
            });
            // Gửi lên FrontEnd Tình trạng 
            res.send("Đã từ chối tham gia thành công");
        } catch(error) {
            //Gửi lỗi lên Frontend 
        
            if (error.code === "P2025") {
                return res.status(404).json({ success: false, message: "Enrollment not found!" });
            }
        
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    
}

// [PATCH] /api/enrollments/approve/:id
module.exports.approve = async(req, res) => {
    try{
        const id = req.params.id;
    
        await prisma.enrollment.update({
            where: {id: id},
            data: {
                status: "APPROVED"
            },
        });
        // Gửi lên FrontEnd Tình trạng 
        res.send("Đã chấp nhận tham gia thành công");
    } catch(error) {
        //Gửi lỗi lên Frontend 
    
        if (error.code === "P2025") {
            return res.status(404).json({ success: false, message: "Enrollment not found!" });
        }
    
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
