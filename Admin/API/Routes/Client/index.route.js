const homeRouter = require("./home.router");
const categoryRouter = require("./category.router");
const productRouters = require("./product.router");
const authRouters = require("./auth.router");
const cartRouters = require("./cart.router");
const orderRouters=require("./order.router");
const systemConfig = require("../../../config/system");
module.exports = (app) => {
    const PATH_CLIENT = systemConfig.prefixClient;

    app.use(PATH_CLIENT , homeRouter);

    app.use(PATH_CLIENT +  '/auth', authRouters);

    app.use(PATH_CLIENT +  '/products', productRouters);

    app.use(PATH_CLIENT +  '/categories', categoryRouter);

    app.use(PATH_CLIENT +  '/carts', cartRouters);

    app.use(PATH_CLIENT +  '/orders', orderRouters);
}