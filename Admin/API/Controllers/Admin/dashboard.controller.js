const sequelize = require('../../../config/database');
const Sequelize = require('sequelize');
const systemConfig = require("../../../config/system");
//[GET] /admin/api/dashboard
module.exports.dashboard = async (req, res) => {
    const statistic = {
        categoryProduct: {
            total: 0,
            active: 0,
            inactive: 0
        },
        product: {
            total: 0,
            active: 0,
            inactive: 0
        },
        account: {
            total: 0,
            active: 0,
            inactive: 0
        },
        user: {
            total: 0,
            active: 0,
            inactive: 0
        }
    }
    try {
        const admin = await sequelize.query(`
            SELECT STATUS, COUNT(*) AS QUANTITY
            FROM TADMIN
            GROUP BY STATUS
        `, {
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        if (admin[0]) {
            statistic.account.active = admin[0].QUANTITY;
        }
        if (admin[1]) {
            statistic.account.inactive = admin[1].QUANTITY;
        }
        statistic.account.total = statistic.account.active + statistic.account.inactive;

        const customer = await sequelize.query(`
            SELECT STATUS, COUNT(*) AS QUANTITY
            FROM TUSER
            GROUP BY STATUS
        `, {
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        if (customer[0]) {
            statistic.user.active = customer[0].QUANTITY;
        }
        if (customer[1]) {
            statistic.user.inactive = customer[1].QUANTITY;
        }
        statistic.user.total = statistic.user.active + statistic.user.inactive;

        const product = await sequelize.query(`
            SELECT STATUS, COUNT(*) AS QUANTITY
            FROM TPRODUCT
            GROUP BY STATUS
        `, {
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        if (product[0]) {
            statistic.product.active = product[0].QUANTITY;
        }
        if (product[1]) {
            statistic.product.inactive = product[1].QUANTITY;
        }

        statistic.product.total = statistic.product.active + statistic.product.inactive;
        const categoryProduct = await sequelize.query(`
            SELECT STATUS, COUNT(*) AS QUANTITY
            FROM TCATEGORY
            GROUP BY STATUS
        `, {
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        if (categoryProduct[0]) {
            statistic.categoryProduct.active = categoryProduct[0].QUANTITY;
        }
        if (categoryProduct[1]) {
            statistic.categoryProduct.inactive = categoryProduct[1].QUANTITY;
        }
        statistic.categoryProduct.total = statistic.categoryProduct.active + statistic.categoryProduct.inactive;

        res.render('admin/pages/dashboard/index.pug', {
            pageTitle: "Trang chủ",
            statistic: statistic
        })
    }
    catch (err) {
        console.log(err)
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
    }
}