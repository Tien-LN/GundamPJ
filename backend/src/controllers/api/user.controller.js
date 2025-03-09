const { prisma } = require("../../config/db.js");
const md5 = require('md5');
const generateUtil = require("../../utils/generate.js");
// get all users
// [GET] /api/users 
module.exports.getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: {
          select: {
            id: true,
            title: true,
            description: true,
            permissions: true,
            deleted: false
          }
        }
      }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "server error" });
  }
};

// [POST] /api/users/create
module.exports.createPost = async(req, res) => {
  const emailExist = await prisma.user.findFirst({
   where: { 
      email: req.body.email,
      deleted: false
    }
  });

  if(emailExist){
    res.send("Đã có email rồi");
    // res.redirect('back');
  }
  else {
    req.body.password = md5(req.body.password);
    if(req.body.enrollments && req.body.enrollments.length == 0) delete req.body.enrollments;
    if(req.body.userAnswers && req.body.userAnswers.length == 0) delete req.body.userAnswers;
    if(req.body.userExams && req.body.userExams.length==0) delete req.body.userExams;
    if(req.body.Announcement && req.body.Announcement.length == 0) delete req.body.Announcement;

    req.body.token = generateUtil.generateRandomString(30);
    await prisma.user.create({
      data: req.body
    });
    res.send("Đã tạo thành công");
  }

  
}

// [DELETE] /api/users/:id
module.exports.userDelete = async(req,res) => {
  try{
    const id = req.params.id;

    await prisma.user.update({
      where: {id: id},
      data: {
        deleted: true
      }
    });
    // Frontend
    res.send("Đã xóa user thành công");
  } catch(error){
    //Gửi lỗi lên Frontend 

    if (error.code === "P2025") {
        return res.status(404).json({ success: false, message: "roles not found!" });
    }

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

// [PATCH] /api/users/lock/:id
module.exports.userLock = async(req,res) => {
  try{
    const id = req.params.id;

    await prisma.user.update({
      where: {id: id},
      data: {
        status: "inactive"
      }
    });
    // Frontend
    res.send("Đã khóa user thành công");
  } catch(error){
    //Gửi lỗi lên Frontend 

    if (error.code === "P2025") {
        return res.status(404).json({ success: false, message: "roles not found!" });
    }

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

// [PATCH] /api/users/unlock/:id
module.exports.userUnLock = async(req,res) => {
  try{
    const id = req.params.id;

    await prisma.user.update({
      where: {id: id},
      data: {
        status: "active"
      }
    });
    // Frontend
    res.send("Đã mở khóa user thành công");
  } catch(error){
    //Gửi lỗi lên Frontend 

    if (error.code === "P2025") {
        return res.status(404).json({ success: false, message: "roles not found!" });
    }

    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

// [PATCH] /api/users/:id
module.exports.userUpdate = async(req, res) => {
  try{
    const id = req.params.id;
    const emailExist = await prisma.user.findFirst({
    where: { 
        id: { not : id},
        email: req.body.email,
        deleted: false
      }
    });

    if(emailExist){
      res.send("Đã có email rồi");
      // res.redirect('back');
    }
    else {
      if(req.body.password){
        req.body.password = md5(req.body.password);
      }
      if(req.body.enrollments && req.body.enrollments.length == 0) delete req.body.enrollments;
      if(req.body.userAnswers && req.body.userAnswers.length == 0) delete req.body.userAnswers;
      if(req.body.userExams && req.body.userExams.length==0) delete req.body.userExams;
      if(req.body.Announcement && req.body.Announcement.length == 0) delete req.body.Announcement;

      req.body.token = generateUtil.generateRandomString(30);
      await prisma.user.update({
        where: {
          id: id,
          deleted: false
        },
        data: req.body
      });
      res.send("Đã sửa thành công");
    }
  } catch(error){

  }

  
}
