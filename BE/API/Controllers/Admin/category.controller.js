const sequelize = require('../../../config/database');
const Sequelize = require('sequelize');
const { generateSlug } = require('./util.controller');
const filterStatusHelper = require("../../../helper/filterStatus")
const systemConfig = require("../../../config/system");
const paginationHelper = require("../../../helper/pagination")

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
        sortKey=req.query.sortKey;
    }
    if(req.query.sortValue){
        sortValue=req.query.sortValue;
    }
    try {
        const filterStatus = filterStatusHelper(req.query);
        // Start pagination
        const [countCategories] = await sequelize.query(`
            SELECT COUNT(*) AS TOTAL
            FROM TCATEGORY
            WHERE DELETED=0
        `, {
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        const objectPagination = paginationHelper(
            {
                currentPage: 1,
                limitItems: 10
            },
            req.query,
            countCategories.TOTAL
        )
        // End pagination
        const products = await sequelize.query(`
            SELECT C.*, A1.FULLNAME AS CREATEDBY,  A2.FULLNAME AS UPDATEDBY
            FROM TCATEGORY C
            JOIN TADMIN A1 ON C.CREATED->>'$.CREATEDBY' = A1.ADMINID
            JOIN TADMIN A2 ON C.UPDATED->>'$.UPDATEDBY' = A2.ADMINID
            WHERE (C.TITLE LIKE :keyword OR :keyword IS NULL) AND C.DELETED=0
                AND (C.STATUS = :status OR :status IS NULL)
            ORDER BY C.${sortKey} ${sortValue}
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
        res.render('admin/pages/categories/index.pug', {
            pageTitle: "Danh mục",
            filterStatus: filterStatus,
            pagination: objectPagination,
            products: products
        });
    } catch (error) {
        console.error('Lỗi truy vấn:', error);
        res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}

//  [GET] /admin/products/detail/:id
module.exports.detail = async (req, res) => {
    const id=req.params.id;
    try {
        const [product] = await sequelize.query(`
            SELECT P.*, C.TITLE AS CATEGORY
            FROM TPRODUCT P
            JOIN TCATEGORY C ON P.CATEGORYID=C.CATEGORYID
            WHERE PRODUCTID=:id
        `, {
            replacements: { id },
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        res.render('admin/pages/products/detail.pug', {
            pageTitle: "Cập nhật sản phẩm",
            product: product,
        });
    }
    catch (err) {
        console.log(err)
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}

// [GET] /admin/api/product
module.exports.create = async (req, res) => {
    try {
        const categories = await sequelize.query(`
            SELECT *
            FROM TCATEGORY;
        `, {
            replacements: {},
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        res.render('admin/pages/products/create.pug', {
            pageTitle: "Tạo sản phẩm",
            categories: categories
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
    var { title, categoryid, featured, description, price,
        discount, quantity, thumbnail, position, status } = req.body
    price = parseInt(price);
    quantity = parseInt(quantity);
    discount = parseFloat(discount);
    position = parseInt(position);
    const slug = generateSlug(title);
    try {
        await sequelize.query(`
        CALL INSERT_TPRODUCT(?,?,?,?,?,?,?,?,?,?,?)
        `, {
            replacements: [
                categoryid, title, price, discount, thumbnail,
                position, quantity, description, status, slug, userid
            ],
            type: Sequelize.QueryTypes.RAW // Không yêu cầu kiểu SELECT
        });
        req.flash("success", `Create successfully!`);
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    } catch (error) {
        req.flash("error", `Update failed!`);
        console.error('Lỗi truy vấn:', error);
        res.redirect(`back`);
        // res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}

// [GET] /admin/api/product
module.exports.update = async (req, res) => {
    const id = req.params.id;
    try {
        const [product] = await sequelize.query(`
            SELECT *
            FROM TPRODUCT
            WHERE PRODUCTID=:id
        `, {
            replacements: { id },
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        const categories = await sequelize.query(`
            SELECT *
            FROM TCATEGORY
        `,{
            replacements: {},
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        res.render('admin/pages/products/update.pug', {
            pageTitle: "Cập nhật sản phẩm",
            product: product,
            categories: categories
        });
    } catch (error) {
        console.error('Lỗi truy vấn:', error);
        res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}

// [POST] /admin/product/create
module.exports.updatePatch = async (req, res) => {
    const user = res.locals.user;
    const userid = user.ADMINID;
    const id=req.params.id;

    var { title, categoryid, featured, description, price,
        discount, quantity, thumbnail, position, status } = req.body

    price = parseInt(price);
    quantity = parseInt(quantity);
    discount = parseInt(discount)/100;
    position = parseInt(position);

    try {
        await sequelize.query(`
            CALL UPDATE_TPRODUCT(?,?,?,?,?,?,?,?,?,?,?)
        `, {
            replacements: [
                id, categoryid, title, price, discount, thumbnail,
                position, quantity, description, status, userid
            ],
            type: Sequelize.QueryTypes.RAW // Không yêu cầu kiểu SELECT
        });
        req.flash("success", `Create successfully!`);
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
            UPDATE TPRODUCT
            SET DELETED = 1
            WHERE PRODUCTID=:id
        `, {
            replacements: {id},
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
