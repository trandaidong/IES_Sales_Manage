const sequelize = require('../../../config/database');
const Sequelize = require('sequelize');
const systemConfig = require("../../../config/system.js");
var md5 = require('md5'); // thư viện mã hóa password

//[GET] /admin/m-account
module.exports.index = async (req, res) => {
    res.render("admin/pages/my-account/index.pug", {
        pageTitle: "Thông tin cá nhân",
    })
}

//[GET] /admin/my-account/update
module.exports.update = async (req, res) => {
    res.render("admin/pages/my-account/update.pug", {
        pageTitle: "Chỉnh sửa thông tin cá nhân",
    })
}   
//[PATCH] /admin/my-account/update
module.exports.updatePatch = async (req, res) => {
    console.log(req.body);
    var { fullname , email,password, phone, avatar} = req.body;
    const id= res.locals.user.ADMINID;
    try {
        await sequelize.query(`
            UPDATE TADMIN
            SET 
                FULLNAME = :fullname,
                EMAIL = :email,
                PASSWORD = :password,
                PHONE = :phone,
                AVATAR = :avatar
            WHERE ADMINID = :id
        `, {
            replacements: { fullname, email, password, phone, avatar, id },
            type: Sequelize.QueryTypes.UPDATE
        });
        req.flash("success", "Updated successfully!");
        res.redirect(`back`);
    } catch (error) {
        req.flash("error", "Update failed!");
        console.error('Lỗi truy vấn:', error);
        res.redirect(`back`);
    }
}   