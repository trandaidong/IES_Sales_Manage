const systemConfig = require("../../../config/system.js");
const Sequelize = require("sequelize");
const sequelize = require("../../../config/database.js");

//  [GET] /admin/roles
module.exports.index = async (req, res) => {
    try {
        const Records = await sequelize.query(`
            SELECT *
            FROM TROLE
            WHERE DELETED = 0
        `, {
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        res.render('admin/pages/roles/index.pug', {
            pageTitle: "Nhóm quyền",
            records: Records
        });
    }
    catch (err) {
        console.log(err)
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
}
//[GET] /admin/roles/create
module.exports.create = async (req, res) => {
    res.render("admin/pages/roles/create.pug", {
        pageTitle: "Tạo nhóm quyền",
    })
}
//[POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
    const { title, description } = req.body;
    try {
        await sequelize.query(`
            CALL INSERT_TROLE(?,?)
        `, {
            replacements: [title, description],
            type: Sequelize.QueryTypes.RAW // Để trả về kiểu select và trả về một mảng
        });
        req.flash("success", `Create successfully!`);
        res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
    catch (err) {
        req.flash("error", `Update failed!`);
        console.error('Lỗi truy vấn:', err);
        res.redirect(`back`);
    }
}
//[GET] /admin/roles/update/:id
module.exports.update = async (req, res) => {
    const id = req.params.id;
    try {
        const [role] = await sequelize.query(`
            SELECT *
            FROM TROLE
            WHERE ROLEID=:id
        `, {
            replacements: { id },
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        res.render("admin/pages/roles/update.pug", {
            pageTitle: "Sửa nhóm quyền",
            records: role
        })
    }
    catch (err) {
        req.flash("error", `Update failed!`);
        console.error('Lỗi truy vấn:', err);
        res.redirect(`back`);
    }
}
//[PATCH] /admin/roles/updatePost/:id
module.exports.updatePost = async (req, res) => {
    const { title, description } = req.body;
    const id = req.params.id
    try {
        await sequelize.query(`
            UPDATE TROLE
            SET 
                TITLE = :title,
                DESCRIPTION = :description
            WHERE ROLEID = :id
            `, {
            replacements: { title, description, id },
            type: Sequelize.QueryTypes.RAW
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
//[GET] /admin/roles/permisssion
module.exports.permission = async (req, res) => {
    try {
        const Records = await sequelize.query(`
            SELECT *
            FROM TROLE
        `, {
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        res.render("admin/pages/roles/permission.pug", {
            pageTitle: "Phân quyền",
            records: Records
        })
    }
    catch (err) {
        console.log(err)
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
}
//[PATCH] /admin/roles/permisssionPost
module.exports.permissionPost = async (req, res) => {
    const permissions = JSON.parse(req.body.permissions);

    try {
        for (let item of permissions) {
            const id = item.id;
            const _permissions = item.permissions;
            await sequelize.query(`
                UPDATE TROLE
                SET
                    PERMISSION=JSON_ARRAY(:_permissions)
                WHERE ROLEID=:id
            `, {
                replacements: { _permissions, id },
                type: Sequelize.QueryTypes.RAW // Để trả về kiểu select và trả về một mảng
            });
        }
        req.flash("success", `Update successfully!`);
    }
    catch (err) {
        console.log("Error", err)
        req.flash("error", `Update failed!`);
    }
    res.redirect(`back`);
}
//  [DELETE] /admin/products/delete
module.exports.delete = async (req, res) => {
    const id = req.params.id;
    try {
        await sequelize.query(`
            UPDATE TROLE
            SET DELETED = 1
            WHERE ROLEID=:id
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