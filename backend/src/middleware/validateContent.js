
const validateContent = (req, res, next) => {
    if (req.body.title && req.body.title.length == 0 || req.body.content && req.body.content.length == 0) {
        res.send("Tiêu đề và nội dung không được để trống");
    }
    else next();
}
module.exports = validateContent;