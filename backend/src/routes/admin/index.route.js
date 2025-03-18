const dashBoardRoute = require("./dashboard.route");
const systemConfig = require("../../config/dotenv");

module.exports = (app) => {
    app.use(systemConfig.API_route + "/admin", dashBoardRoute);
}