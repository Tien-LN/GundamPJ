const { prisma } = require("../../config/db.js");
// [GET] /api/courses
module.exports.index = async (req, res) => {
    const courses = await prisma.course.findMany({
        where: { deleted: false },
        select: {
            id: false,
            name: true,
            description: true,
            startDate: true,
            endDate: true,
            deleted: false
        }
    });
    // Đợi gửi dữ liệu lên frontend  
    res.send(courses);
}

// [POST] /api/courses/create 
module.exports.createPost = async (req, res) => {
    if (req.body.enrollments && req.body.enrollments.length == 0) delete req.body.enrollments;
    if (req.body.exams && req.body.exams.length == 0) delete req.body.exams;

    await prisma.course.create({
        data: req.body
    });
    res.send("OK");
}

// [DELETE] /api/courses/:id 
module.exports.deleteCourse = async (req, res) => {
    try {
        const id = req.params.id;

        await prisma.course.update({
            where: { id: id },
            data: {
                deleted: true
            },
        });
        // Gửi lên FrontEnd Tình trạng 
        res.send("Đã xóa thành công");
    } catch (error) {
        //Gửi lỗi lên Frontend 

        if (error.code === "P2025") {
            return res.status(404).json({ success: false, message: "Course not found!" });
        }

        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// [PATCH] /api/courses/:id 
module.exports.coursePatch = async (req, res) => {
    try {
        const id = req.params.id;

        if (req.body.enrollments && req.body.enrollments.length == 0) delete req.body.enrollments;
        if (req.body.exams && req.body.exams.length == 0) delete req.body.exams;

        await prisma.course.update({
            where: {
                id: id,
                deleted: false
            },
            data: req.body
        });
        // Gửi lên FrontEnd Tình trạng 
        res.send("Đã sửa thành công!");
    } catch (error) {
        //Gửi lỗi lên Frontend 

        if (error.code === "P2025") {
            return res.status(404).json({ success: false, message: "Course not found!" });
        }

        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

// [GET] /api/courses/:id/enrollments 
module.exports.enrollGet = async (req, res) => {
    try {
        const id = req.params.id;
        const course = await prisma.course.findUnique({
            where: {
                id: id,
                deleted: false
            },
            include: {
                enrollments: {
                    where: {
                        status: "APPROVED"
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        if (!course) {
            return res.status(404).json({ message: "course not found!" });
        }
        var users = course.enrollments.map(enrollment => enrollment.user);
        res.send(users);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
}

// [POST] /api/courses/:id/doc/create 
module.exports.docCreatePost = async (req, res) => {
    try {
        const courseId = req.params.id;

        const courseExist = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!courseExist) {
            res.send("khóa học không tồn tại");
        } else {
            req.body.courseId = courseId;
            await prisma.doc.create({
                data: req.body
            });
            res.send("Đã thêm bài giảng");
        }
    } catch (error) {
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }

}
