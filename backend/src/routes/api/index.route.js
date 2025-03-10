const announRoutes = require('./announ.route');
const authRoutes = require('./auth.route');
const courseRoutes = require('./course.route');
const docRoutes = require('./doc.route');
const enrollmentRoutes = require('./enrollment.route');
const examRoutes = require('./exam.route');
const userRoutes = require('./user.route');
const statisticRoutes = require('./statistics.route');
const systemConfig = require("../../config/dotenv");
const roleRoutes = require("./role.route");

module.exports = (app) => {
    app.use(systemConfig.API_route + "/announcements", announRoutes);

    app.use(systemConfig.API_route + "/docs", docRoutes);

    app.use(systemConfig.API_route + "/auth", authRoutes);

    app.use(systemConfig.API_route + "/users", userRoutes);

    app.use(systemConfig.API_route + "/courses", courseRoutes);

    app.use(systemConfig.API_route + "/enrollments", enrollmentRoutes);

    app.use(systemConfig.API_route + "/exams", examRoutes);

    app.use(systemConfig.API_route + "/statistics", statisticRoutes);

    app.use(systemConfig.API_route + "/roles", roleRoutes);

}