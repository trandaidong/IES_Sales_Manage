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
        const categories = await sequelize.query(`
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
        if (req.query.keyword) {
            keyword = req.query.keyword;
        }
        res.json(categories);
        // res.render('admin/pages/categories/index.pug', {
        //     pageTitle: "Danh mục",
        //     keyword: keyword,
        //     sortKey: sortKey,
        //     sortValue: sortValue,
        //     filterStatus: filterStatus,
        //     pagination: objectPagination,
        //     categories: categories
        // });
    } catch (error) {
        console.error('Lỗi truy vấn:', error);
        res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}

//  [GET] /admin/category/detail/:id
module.exports.detail = async (req, res) => {
    const id=req.params.id;
    try {
        const [category] = await sequelize.query(`
            SELECT *
            FROM TCATEGORY 
            WHERE SLUG=:id
        `, {
            replacements: { id },
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        res.render('admin/pages/categories/detail.pug', {
            pageTitle: category.TITLE,
            category: category,
        });
    }
    catch (err) {
        console.log(err)
        res.redirect(`${systemConfig.prefixAdmin}/products`);
    }
}

// [GET] /admin/categories/create
module.exports.create = async (req, res) => {
    try {
        res.render('admin/pages/categories/create.pug', {
            pageTitle: "Tạo danh mục",
        });
    } catch (error) {
        console.error('Lỗi truy vấn:', error);
        res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}

// [POST] /admin/categories/create
module.exports.createPost = async (req, res) => {
    const user = res.locals.user;
    const userid = user.ADMINID;
    var { title, description, thumbnail, position, status } = req.body
    position = parseInt(position);
    const slug = generateSlug(title);

    try {
        await sequelize.query(`
        CALL INSERT_TCATEGORY(?,?,?,?,?,?,?)
        `, {
            replacements: [
                title, description, thumbnail,
                position, status, slug, userid
            ],
            type: Sequelize.QueryTypes.RAW // Không yêu cầu kiểu SELECT
        });
        req.flash("success", `Create successfully!`);
        res.redirect(`${systemConfig.prefixAdmin}/categories`);
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
        const [category] = await sequelize.query(`
            SELECT *
            FROM TCATEGORY
            WHERE SLUG=:id
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
        res.render('admin/pages/categories/update.pug', {
            pageTitle: category.TITLE,
            category: category
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
    const slug=req.params.id;

    var { title, description, thumbnail, position, status } = req.body

    position = parseInt(position);

    try {
        const [category] = await sequelize.query(`
            SELECT *
            FROM TCATEGORY
            WHERE SLUG=:slug AND DELETED = 0
            `, {
            replacements: { slug },
            type: Sequelize.QueryTypes.SELECT
        });
        await sequelize.query(`
            CALL UPDATE_TCATEGORY(?,?,?,?,?,?,?)
        `, {
            replacements: [
                category.CATEGORYID, title, description, thumbnail,
                position, status, userid
            ],
            type: Sequelize.QueryTypes.RAW // Không yêu cầu kiểu SELECT
        });
        req.flash("success", `Update successfully!`);
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
            UPDATE TCATEGORY
            SET DELETED = 1
            WHERE CATEGORYID=:id
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

//  [PATCH] /admin/products/changeMulti
module.exports.changeMulti = async (req, res) => {
    const ids = req.body.ids.split(", ");
    const type = req.body.type;
    console.log(ids)
    console.log(type)
    try {
        switch (type) {
            case "Active":
                console.log("ok")
                await sequelize.query(`
                    UPDATE TCATEGORY
                    SET STATUS = "Active"
                    WHERE CATEGORYID IN (:ids)
                `, {
                    replacements: { ids },
                    type: Sequelize.QueryTypes.RAW // Không yêu cầu kiểu SELECT
                });
                req.flash("success", `Update successfully ${ids.length} products`)
                break;
            case "Inactive":
                await sequelize.query(`
                    UPDATE TCATEGORY
                    SET STATUS = "Inactive"
                    WHERE CATEGORYID IN (:ids)
                `, {
                    replacements: { ids },
                    type: Sequelize.QueryTypes.RAW // Không yêu cầu kiểu SELECT
                });
                req.flash("success", `Update successfully ${ids.length} products`)
                break;
            case "delete-all":
                await sequelize.query(`
                    UPDATE TCATEGORY
                    SET DELETED = 1
                    WHERE CATEGORYID IN (:ids)
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
                        UPDATE TCATEGORY
                        SET POSITION = :pos
                        WHERE CATEGORYID = :id
                    `, {
                        replacements: { pos, id },
                        type: Sequelize.QueryTypes.RAW // Không yêu cầu kiểu SELECT
                    });
                }
                req.flash("success", `Update position successfully ${ids.length} products`)
                break;
            default:
                console.log("khong cos")
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