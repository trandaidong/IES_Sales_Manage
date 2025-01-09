const sequelize = require('../../../config/database');
const Sequelize = require('sequelize');
const md5=require('md5');
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
        const [countAdmin] = await sequelize.query(`
            SELECT COUNT(*) AS TOTAL
            FROM TADMIN
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
            countAdmin.TOTAL
        )
        // End pagination
        const accounts = await sequelize.query(`
            SELECT A.*, R.TITLE AS ROLE
            FROM TADMIN A
            JOIN TROLE R ON R.ROLEID=A.ROLEID
            WHERE (A.FULLNAME LIKE :keyword OR :keyword IS NULL) AND A.DELETED=0
                AND (A.STATUS = :status OR :status IS NULL)
            ORDER BY A.${sortKey} ${sortValue}
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
        res.render('admin/pages/accounts/index.pug', {
            pageTitle: "Quản lý",
            keyword: keyword,
            sortKey: sortKey,
            sortValue: sortValue,
            filterStatus: filterStatus,
            pagination: objectPagination,
            accounts: accounts
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
        const [account] = await sequelize.query(`
            SELECT *
            FROM TADMIN
            WHERE ADMINID=:id
        `, {
            replacements: { id },
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        res.render('admin/pages/accounts/detail.pug', {
            pageTitle: account.FULLNAME,
            account: account,
        });
    }
    catch (err) {
        console.log(err)
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
}
// [GET] /admin/api/product
module.exports.create = async (req, res) => {
    try {
        const roles = await sequelize.query(`
            SELECT *
            FROM TROLE
        `, {
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        res.render('admin/pages/accounts/create.pug', {
            pageTitle: "Thêm mới quản lý",
            roles
        });
    } catch (error) {
        console.error('Lỗi truy vấn:', error);
        res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}
// [POST] /admin/product/create
module.exports.createPost = async (req, res) => {
    console.log(req.body)
    const user = res.locals.user;
    var { fullname, roleid, email, phone, thumbnail, password} = req.body;
    try {
        await sequelize.query(`
        CALL INSERT_TADMIN(?,?,?,?,?,?,?)
        `, {
            replacements: [
                fullname, md5(password),phone,"Active",email,thumbnail,roleid
            ],
            type: Sequelize.QueryTypes.RAW // Không yêu cầu kiểu SELECT
        });
        req.flash("success", `Create successfully!`);
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
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
        const [account] = await sequelize.query(`
            SELECT *
            FROM TADMIN
            WHERE ADMINID=:id
        `, {
            replacements: { id },
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        const roles = await sequelize.query(`
            SELECT *
            FROM TROLE
        `, {
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        res.render('admin/pages/accounts/update.pug', {
            pageTitle: "Cập nhật " + account.FULLNAME,
            account: account,
            roles
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

    var { fullname,roleid , email, sdt, avatar, password, status} = req.body;
    console.log(req.body)
    try {
        await sequelize.query(`
            CALL UPDATE_TADMIN(?,?,?,?,?,?,?,?)
        `, {
            replacements: [
                id, fullname, email, sdt, avatar, password, status,roleid
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
            UPDATE TADMIN
            SET DELETED = 1
            WHERE ADMINID=:id
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