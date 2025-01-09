const systemConfig = require("../../../config/system.js");
var md5 = require('md5'); // thư viện mã hóa password
const Sequelize = require("sequelize");
const sequelize = require("../../../config/database.js");
const generateRandomNumberHelper = require("../../../helper/generate.js");
const sendMailHelper = require("../../../helper/sendMail.js");
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
//forgotPassword
module.exports.forgotPassword = async (req, res) => {
    res.render("admin/pages/auth/forgot-password.pug", {
        pageTitle: "lấy lại mật khẩu"
    })
}
// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
    const email = req.body.email;
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
        //B1: Create OTP code
        const otp = generateRandomNumberHelper.generateRandomNumber(8);
        await sequelize.query(`
            INSERT INTO TFORGETPASSWORD(EMAIL, OTP)
            VALUES(:email, :otp);
            `, {
            replacements: { email, otp }, // Đặt giá trị của biến email vào đây
            type: Sequelize.QueryTypes.RAW
        }
        );
        //B2: Send OTP to email of user
        const subject = "Mã OTP xác minh lấy lại mật khẩu";
        const html = `Mã OTP xác minh lấy lại mật khẩu là <b>${otp}</b>
                        Thời hạn sử dụng là 3 phút. Lưu ý không được để lộ mã OTP`;

        sendMailHelper.sendMail(email, subject, html);

        res.redirect(`/admin/auth/password/otp?email=${email}`);
    } catch (error) {
        console.error('Lỗi truy vấn:', error);
        res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}
// [GET] /user/password/otp
module.exports.otpPassword = async (req, res) => {
    res.render("admin/pages/auth/otp-password.pug", {
        pageTitle: "Nhập mã OTP",
        email: req.query.email
    })
}
// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    console.log(req.body)
    try {
        const [result] = await sequelize.query(
            `SELECT * 
             FROM TFORGETPASSWORD 
             WHERE EMAIL = :email AND OTP =:otp`,
            {
                replacements: { email, otp}, // Đặt giá trị của biến email vào đây
                type: Sequelize.QueryTypes.SELECT
            }
        );
        if (!result) {
            req.flash("error", "Invalid OTP!");
            res.redirect("back");
            return;
        }
        const [user] = await sequelize.query(
            `SELECT * 
             FROM TADMIN 
             WHERE EMAIL = :email`,
            {
                replacements: { email}, // Đặt giá trị của biến email vào đây
                type: Sequelize.QueryTypes.SELECT
            }
        );
        res.cookie("token", user.ADMINID);
        res.redirect(`/admin/auth/password/reset`);
    } catch (error) {
        console.error('Lỗi truy vấn:', error);
        res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}
// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
    res.render("admin/pages/auth/reset-password.pug", {
        pageTitle: "Đổi mật khẩu",
    })
}
// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
    const id = req.cookies.token;
    const password = req.body.password;
    try {
        await sequelize.query(`
            UPDATE TADMIN
            SET PASSWORD = :password
            WHERE ADMINID = :id
        `, {
            replacements: { password: md5(password), id },
            type: Sequelize.QueryTypes.UPDATE
        });
        req.flash("success", "Change password successfully!");
        res.redirect("/admin/dashboard");
    } catch (error) {
        console.error('Lỗi truy vấn:', error);
        req.flash("error", "Change password failed!");
        res.redirect("back");
    }
};