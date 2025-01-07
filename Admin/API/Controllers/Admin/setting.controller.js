const sequelize = require('../../../config/database');
const Sequelize = require('sequelize');
const systemConfig = require("../../../config/system.js");

//[GET] /admin/settings/general
module.exports.general = async (req, res) => {
    try {
        const [settingGeneral] = await sequelize.query(`
            SELECT *
            FROM TSETTING
            WHERE SETTINGID="SETTING"
        `, {
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        res.render('admin/pages/settings/general.pug', {
            pageTitle: "Cài đặt chung",
            settingGeneral: settingGeneral
        });
    } catch (error) {
        console.error('Lỗi truy vấn:', error);
        res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}

//[PATCH] /admin/settings/general
module.exports.generalPatch = async (req, res) => {
    console.log(req.body)
    var { websiteName, logo, phone, email, address, copyright} = req.body;
    try {
        await sequelize.query(`
            CALL UPDATE_TSETTING(?,?,?,?,?,?)
        `, {
            replacements: [
                websiteName, logo, phone, email, address, copyright
            ],
            type: Sequelize.QueryTypes.RAW // Không yêu cầu kiểu SELECT
        });
        req.flash("success", `Setting successfully!`);
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    } catch (error) {
        req.flash("error", `Setting failed!`);
        console.error('Lỗi truy vấn:', error);
        res.redirect(`back`);
        // res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}