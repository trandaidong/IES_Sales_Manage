const systemConfig = require("../../../config/system.js");
var md5 = require('md5'); // thư viện mã hóa password
const Sequelize = require("sequelize");
const sequelize = require("../../../config/database.js");

//[GET] /admin/auth/login
module.exports.login = async (req, res) => {
    if (req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`)
    }
    else {
        res.render("admin/pages/auth/login.pug", {
            pageTitle: "Đăng nhập"
        })
    }
}
//[POST] /admin/api/auth/login
module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [user] = await sequelize.query(
            `SELECT * 
             FROM TADMIN 
             WHERE EMAIL = :email`,
            {
                replacements: { email }, // Đặt giá trị của biến email vào đây
                type: Sequelize.QueryTypes.SELECT
            }
        );
        if (!user) {
            req.flash("error", "Email not exists!");
            res.redirect('back');
            return;
        }
        if (md5(password) != user.PASSWORD) {
            req.flash("error", "Invalid password!");
            res.redirect('back');
            return;
        }
        if (user.status == "Inactive") {
            req.flash("error", "Inactive account!");
            res.redirect('back');
            return;
        }
        res.cookie('token', user.ADMINID);
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    } catch (error) {
        console.error('Lỗi truy vấn:', error);
        res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}

//[GET] /admin/auth/logout
module.exports.logout = (req, res) => {
    res.clearCookie('token');
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);
}