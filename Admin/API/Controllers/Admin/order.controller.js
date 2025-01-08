const sequelize = require('../../../config/database');
const Sequelize = require('sequelize');
const filterStatusHelper = require("../../../helper/filterStatus")
const paginationHelper = require("../../../helper/pagination")
const systemConfig = require("../../../config/system");

// [GET] /admin/api/product
module.exports.index = async (req, res) => {
    let keyword = null;
    let status = null;
    let sortKey = "POSITION";
    let sortValue = "ASC"
    if (req.query.keyword) {
        keyword = `%${req.query.keyword}%`;
    }
    if (req.query.status) {
        status = req.query.status;
    }
    if (req.query.sortKey) {
        sortKey = req.query.sortKey;
    }
    if (req.query.sortValue) {
        sortValue = req.query.sortValue;
    }

    const filterStatus = filterStatusHelper(req.query);

    try {
        // Start pagination
        const [countOrders] = await sequelize.query(`
            SELECT count(*) AS TOTAL
            FROM TORDER O
            JOIN TUSER U ON O.USERID= U.USERID
        `, {
            replacements: {
                keyword,
                status
            },
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        const objectPagination = paginationHelper(
            {
                currentPage: 1,
                limitItems: 10
            },
            req.query,
            countOrders.TOTAL
        )
        // End pagination
        const orders = await sequelize.query(`
            SELECT O.*, U.FULLNAME
            FROM TORDER O
            JOIN TUSER U ON O.USERID= U.USERID
            LIMIT :limit OFFSET :skip
        `, {
            replacements: {
                keyword,
                status,
                limit: objectPagination.limitItems,
                skip: objectPagination.skip
            },
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        if (req.query.keyword) {
            keyword = req.query.keyword;
        }
        console.log(orders);
        // res.json(products);
        res.render('admin/pages/orders/index.pug', {
            pageTitle: "Hóa đơn",
            keyword: keyword,
            sortKey: sortKey,
            sortValue: sortValue,
            filterStatus: filterStatus,
            pagination: objectPagination,
            orders: orders
        });
    } catch (error) {
        console.error('Lỗi truy vấn:', error);
        res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}

//  [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    const id = req.params.id;
    try {
        const detailOrder = await sequelize.query(`
            SELECT D.*, P.THUMBNAIL, P.TITLE, P.DISCOUNT, P.PRICE
            FROM TDETAILORDER D
            JOIN TPRODUCT P ON P.PRODUCTID = D.PRODUCTID
            WHERE ORDERID=:id
        `, {
            replacements: { id },
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        const [order] = await sequelize.query(`
            SELECT O.*, U.FULLNAME
            FROM TORDER O
            JOIN TUSER U ON O.USERID= U.USERID
            WHERE O.ORDERID= :id
        `, {
            replacements: { id },
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        res.render('admin/pages/orders/detail.pug', {
            pageTitle: "Chi tiết hóa đơn",
            detailOrder: detailOrder,
            order: order
        });
    }
    catch (err) {
        console.log(err)
        res.redirect(`${systemConfig.prefixAdmin}/orders`);
    }
}