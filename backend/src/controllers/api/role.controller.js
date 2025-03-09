const { prisma } = require("../../config/db.js");
// [GET] /api/roles
module.exports.index = async(req, res) => {
    const roles = await prisma.roles.findMany({
        where: {
            deleted : false
        },
        select: {
            id: true,
            title: true,
            description: true,
            permissions: true,
            deleted: false
        }
    })
    res.send(roles);
}

// [POST] /api/roles/create 
module.exports.createPost = async(req, res) => {
    if(req.body.permissions && req.body.permissions.length == 0) delete req.body.permissions;
    
    await prisma.roles.create({
        data: req.body,
    });
    // Trả về FrontEnd 
    res.send("Đã tạo thành công");
}

// [DELETE] /api/roles/:id 
module.exports.roleDelete = async(req,res) => {
    try {
        const id = req.params.id;

        await prisma.roles.update({
            where: {id : id},
            data: {
                deleted : true
            },
        });

        // Gửi cho FrontEnd 
        res.send("Đã xóa thành công");

    } catch(error){
        //Gửi lỗi lên Frontend 

        if (error.code === "P2025") {
            return res.status(404).json({ success: false, message: "roles not found!" });
        }
      
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
} 

// [PATCH] /api/roles/:id 
module.exports.rolePatch = async(req,res) => {
    try {
        const id = req.params.id;

        if(req.body.permissions && req.body.permissions.length == 0) delete req.body.permissions;

        await prisma.roles.update({
            where: {id : id},
            data: req.body
        });

        // Gửi cho FrontEnd 
        res.send("Đã sửa thành công");

    } catch(error){
        //Gửi lỗi lên Frontend 

        if (error.code === "P2025") {
            return res.status(404).json({ success: false, message: "roles not found!" });
        }
      
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}