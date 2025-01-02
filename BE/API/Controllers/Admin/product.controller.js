const sequelize = require('../../../config/database');
const Sequelize = require('sequelize');
const { generateSlug } = require('./util.controller');
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
        const [countProducts] = await sequelize.query(`
            SELECT COUNT(*) AS TOTAL
            FROM TPRODUCT 
            WHERE (TITLE LIKE :keyword OR :keyword IS NULL) AND DELETED = 0
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
        const products = await sequelize.query(`
            SELECT P.*, A1.FULLNAME AS CREATEDBY,  A2.FULLNAME AS UPDATEDBY
            FROM TPRODUCT P
            JOIN TADMIN A1 ON P.CREATED->>'$.CREATEDBY' = A1.ADMINID
            JOIN TADMIN A2 ON P.UPDATED->>'$.UPDATEDBY' = A2.ADMINID
            WHERE (P.TITLE LIKE :keyword OR :keyword IS NULL) AND P.DELETED=0
                AND (P.STATUS = :status OR :status IS NULL)
            ORDER BY P.${sortKey} ${sortValue}
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
        console.log(filterStatus);
        res.render('admin/pages/products/index.pug', {
            pageTitle: "Sản phẩm",
            keyword: keyword,
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
    const slug = req.params.id;
    try {
        const [product] = await sequelize.query(`
            SELECT P.*, C.TITLE AS CATEGORY
            FROM TPRODUCT P
            JOIN TCATEGORY C ON P.CATEGORYID=C.CATEGORYID
            WHERE P.SLUG=:slug
        `, {
            replacements: { slug },
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
    discount = parseFloat(discount) / 100;
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
    const slug = req.params.id;
    try {
        const [product] = await sequelize.query(`
            SELECT *
            FROM TPRODUCT
            WHERE SLUG=:slug
        `, {
            replacements: { slug },
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        const categories = await sequelize.query(`
            SELECT *
            FROM TCATEGORY
        `, {
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
    const slug = req.params.id;

    var { title, categoryid, featured, description, price,
        discount, quantity, thumbnail, position, status } = req.body

    price = parseInt(price);
    quantity = parseInt(quantity);
    discount = parseInt(discount) / 100;
    position = parseInt(position);

    try {
        const [product] = await sequelize.query(`
            SELECT *
            FROM TPRODUCT
            WHERE SLUG=:slug AND DELETED = 0
            `, {
            replacements: { slug },
            type: Sequelize.QueryTypes.SELECT
        });
        await sequelize.query(`
            CALL UPDATE_TPRODUCT(?,?,?,?,?,?,?,?,?,?,?)
        `, {
            replacements: [
                product.PRODUCTID, categoryid, title, price, discount, thumbnail,
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
//  [PATCH] /admin/products/changeMulti
module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(", ");
    const type = req.body.type;
    console.log(type)
    console.log(ids)
    try {
        switch (type) {
            case "Active":
                await sequelize.query(`
                    UPDATE TPRODUCT
                    SET STATUS = "Active"
                    WHERE PRODUCTID IN (:ids)
                `, {
                    replacements: { ids },
                    type: Sequelize.QueryTypes.RAW // Không yêu cầu kiểu SELECT
                });
                req.flash("success", `Update successfully ${ids.length} products`)
                break;
            case "Inactive":
                await sequelize.query(`
                    UPDATE TPRODUCT
                    SET STATUS = "Inactive"
                    WHERE PRODUCTID IN (:ids)
                `, {
                    replacements: { ids },
                    type: Sequelize.QueryTypes.RAW // Không yêu cầu kiểu SELECT
                });
                req.flash("success", `Update successfully ${ids.length} products`)
                break;
            case "delete-all":
                await sequelize.query(`
                    UPDATE TPRODUCT
                    SET DELETED = 1
                    WHERE PRODUCTID IN (:ids)
                `, {
                    replacements: { ids },
                    type: Sequelize.QueryTypes.RAW // Không yêu cầu kiểu SELECT
                });
                req.flash("success", `Delete successfully ${ids.length} products`)
                break;
            case "change-position":
                for (let item of ids) {
                    let [id, pos] = item.split("-");
                    pos = parseInt(pos);
                    await sequelize.query(`
                        UPDATE TPRODUCT
                        SET POSITION = :pos
                        WHERE PRODUCTID = :id
                    `, {
                        replacements: { pos, id },
                        type: Sequelize.QueryTypes.RAW // Không yêu cầu kiểu SELECT
                    });
                }
                req.flash("success", `Update position successfully ${ids.length} products`)
                break;
            default:
                break;
        }
        res.redirect("back");
    } catch (error) {
        req.flash("error", `Change failed!`);
        console.error('Lỗi truy vấn:', error);
        res.redirect(`back`);
        // res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}