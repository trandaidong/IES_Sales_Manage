const taskRoutes = require("./task.route");

module.exports = (app) => {
    app.use("/api/task", taskRoutes)
}