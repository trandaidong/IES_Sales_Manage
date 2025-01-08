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
    const emailExists = await Account.findOne({
        _id: { $ne: res.locals.user.id },
        email: req.body.email,
        deleted: false
    });
    if (emailExists) { // nếu email đã tồn tại 
        req.flash("error", `Email ${req.body.email} exists!`);
        res.redirect("back");
    }
    else {
        if (req.body.password) {
            req.body.password = md5(req.body.password);
        }
        else {
            delete req.body.password
        }
        try {
            await Account.updateOne({ _id: res.locals.user.id }, req.body);
            req.flash("success", `Update successfully!`);
        }
        catch {
            req.flash("error", `Update faild!`);
        }
        res.redirect("back");
    }
}   