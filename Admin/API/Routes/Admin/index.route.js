const systemConfig = require("../../../config/system");

const authMiddleware = require('../../middlewares/admin/auth.middleware');

const authRouters = require("./auth.router");
const dashboardRoutes = require("./dashboard.router");
const productRoutes = require("./product.route");
const categoryRouters = require("./category.router");
const customerRouters = require("./customer.router");
const accountRouters = require("./account.router");
const statisticRouters = require("./statistic.router");
const settingRouters = require("./setting.router");
const myAccountRouters = require("./my-account.router");
const orderRouters = require("./order.router");
const roleRouters = require("./roles.router");

module.exports = (app) => {

    const PATH_ADMIN = systemConfig.prefixAdmin;

    app.use(PATH_ADMIN + `/auth`, authRouters);

    app.use(PATH_ADMIN + '/dashboard', authMiddleware.requireAuth, dashboardRoutes);

    app.use(PATH_ADMIN + `/products`, authMiddleware.requireAuth, productRoutes);

    app.use(PATH_ADMIN + `/categories`, authMiddleware.requireAuth, categoryRouters);

    app.use(PATH_ADMIN + `/customers`, authMiddleware.requireAuth, customerRouters)

    app.use(PATH_ADMIN + `/accounts`, authMiddleware.requireAuth, accountRouters);

    app.use(PATH_ADMIN + `/statistics`, authMiddleware.requireAuth, statisticRouters);

    app.use(PATH_ADMIN + `/settings`, authMiddleware.requireAuth, settingRouters);

    app.use(PATH_ADMIN + `/my-account`, authMiddleware.requireAuth, myAccountRouters);

    app.use(PATH_ADMIN + `/orders`, authMiddleware.requireAuth, orderRouters);

    app.use(PATH_ADMIN + `/roles`, authMiddleware.requireAuth, roleRouters);
}