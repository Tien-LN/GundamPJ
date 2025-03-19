const dashBoardRoute = require("./dashboard.route");
const listUserRoute = require("./list-user.route");
const systemConfig = require("../../config/dotenv");

module.exports = (app) => {
    app.use(systemConfig.API_route + "/admin", dashBoardRoute);

    app.use(systemConfig.API_route + "/admin/list-user", listUserRoute);
}