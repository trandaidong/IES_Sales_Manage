const sequelize = require('../../../config/database');
const Sequelize = require('sequelize');
const md5 =require('md5');
const { generateSlug } = require('./util.controller');
const filterStatusHelper = require("../../../helper/filterStatus")
const paginationHelper = require("../../../helper/pagination")
const systemConfig = require("../../../config/system");

// [GET] /admin/api/product
module.exports.index = async (req, res) => {
    let keyword = null;
    let status = null;
    let sortKey = "FULLNAME";
    let sortValue = "ASC"
    if (req.query.keyword) {
        keyword = `%${req.query.keyword}%`;
    }
    if (req.query.status) {
        status = req.query.status;
    }
    // MẶC ĐỊNH CÁI NÀY CHỈ CÓ FULLNAME
    // if (req.query.sortKey) {
    //     sortKey = req.query.sortKey;
    // }
    if (req.query.sortValue) {
        sortValue = req.query.sortValue;
    }

    const filterStatus = filterStatusHelper(req.query);

    try {
        // Start pagination
        const [countProducts] = await sequelize.query(`
            SELECT COUNT(*) AS TOTAL
            FROM TUSER 
            WHERE (FULLNAME LIKE :keyword OR :keyword IS NULL) AND DELETED = 0
                AND (STATUS = :status OR :status IS NULL)
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
            countProducts.TOTAL
        )
        // End pagination
        const customers = await sequelize.query(`
            SELECT *
            FROM TUSER U
            WHERE (FULLNAME LIKE :keyword OR :keyword IS NULL) AND DELETED=0
                AND (STATUS = :status OR :status IS NULL)
            ORDER BY ${sortKey} ${sortValue}
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
        res.render('admin/pages/customers/index.pug', {
            pageTitle: "Sản phẩm",
            keyword: keyword,
            sortKey: sortKey,
            sortValue: sortValue,
            filterStatus: filterStatus,
            pagination: objectPagination,
            customers: customers
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
        const [customer] = await sequelize.query(`
            SELECT *
            FROM TUSER
            WHERE USERID=:id
        `, {
            replacements: { id },
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        res.render('admin/pages/customers/detail.pug', {
            pageTitle: "Cập nhật khách hàng",
            customer: customer,
        });
    }
    catch (err) {
        console.log(err)
        res.redirect(`${systemConfig.prefixAdmin}/customers`);
    }
}
// [GET] /admin/api/product
module.exports.create = async (req, res) => {
    try {
        res.render('admin/pages/customers/create.pug', {
            pageTitle: "Tạo sản khách hàng"
        });
    } catch (error) {
        console.error('Lỗi truy vấn:', error);
        res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}
// [POST] /admin/product/create
module.exports.createPost = async (req, res) => {
    const user = res.locals.user;
    const userid = user.ADMINID;
    var { fullname, email, phone, thumbnail, password} = req.body;
    try {
        await sequelize.query(`
        CALL INSERT_TUSER(?,?,?,?,?,?)
        `, {
            replacements: [
                fullname, email, phone, thumbnail, md5(password), "Active"
            ],
            type: Sequelize.QueryTypes.RAW // Không yêu cầu kiểu SELECT
        });
        req.flash("success", `Create successfully!`);
        res.redirect(`${systemConfig.prefixAdmin}/customers`);
    } catch (error) {
        req.flash("error", `Create failed!`);
        console.error('Lỗi truy vấn:', error);
        res.redirect(`back`);
        // res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}
// [GET] /admin/api/product
module.exports.update = async (req, res) => {
    const id = req.params.id;
    try {
        const [customer] = await sequelize.query(`
            SELECT *
            FROM TUSER
            WHERE USERID=:id
        `, {
            replacements: { id },
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        res.render('admin/pages/customers/update.pug', {
            pageTitle: "Cập nhật khách hàng",
            customer: customer
        });
    } catch (error) {
        console.error('Lỗi truy vấn:', error);
        res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}

// [POST] /admin/product/create
module.exports.updatePatch = async (req, res) => {
    const user = res.locals.user;
    const id = req.params.id;

    var { fullname, email, sdt, avatar, password, status} = req.body;
    console.log(req.body)
    try {
        await sequelize.query(`
            CALL UPDATE_TUSER(?,?,?,?,?,?,?)
        `, {
            replacements: [
                id, fullname, email, sdt, avatar, password, status
            ],
            type: Sequelize.QueryTypes.RAW // Không yêu cầu kiểu SELECT
        });
        req.flash("success", `Updated successfully!`);
        res.redirect(`back`);
    } catch (error) {
        req.flash("error", `Update failed!`);
        console.error('Lỗi truy vấn:', error);
        res.redirect(`back`);
        // res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}

//  [DELETE] /admin/products/delete
module.exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        await sequelize.query(`
            UPDATE TUSER
            SET DELETED = 1
            WHERE USERID=:id
        `, {
            replacements: { id },
            type: Sequelize.QueryTypes.RAW // Không yêu cầu kiểu SELECT
        });
        req.flash("success", `Delete successfully`)
        res.redirect("back");
    } catch (error) {
        req.flash("error", `Delete failed!`);
        console.error('Lỗi truy vấn:', error);
        res.redirect(`back`);
        // res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}