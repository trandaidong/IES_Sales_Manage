const systemConfig = require("../../../config/system.js");
var md5 = require('md5'); // thư viện mã hóa password
const Sequelize = require("sequelize");
const sequelize = require("../../../config/database.js");
const generateRandomNumberHelper = require("../../../helper/generate.js");
const sendMailHelper = require("../../../helper/sendMail.js");

//[POST] /admin/api/auth/login
module.exports.user = async (req, res) => {
    const token=req.params.token;
    try {
        const [user] = await sequelize.query(
            `SELECT * 
             FROM TUSER 
             WHERE USERID = :token AND DELETED=0 AND STATUS='Active'`,
            {
                replacements: { token }, // Đặt giá trị của biến email vào đây
                type: Sequelize.QueryTypes.SELECT
            }
        );
        if (!user) {
            res.status(400).json({ message: 'Lấy thông tin người dùng thất bại' });
            return;
        }
        const userId=user.USERID;
        const [cart] = await sequelize.query(
            `SELECT     
                COALESCE(SUM(C.QUANTITY), 0) AS TOTALQUANTITY, 
                COALESCE(SUM(C.QUANTITY * P.PRICE), 0) AS TOTALPRICE
             FROM TCART C
             JOIN TPRODUCT P ON C.PRODUCTID=P.PRODUCTID
             WHERE C.DELETED=0 AND C.USERID = :userId`,
            {
                replacements: { userId }, // Đặt giá trị của biến email vào đây
                type: Sequelize.QueryTypes.SELECT
            }
        );
        user["CART"]=cart;
        console.log(user);
        res.status(200).json({ message: 'Lấy thông tin người dùng thành công', user});
    } catch (error) {
        console.error('Lỗi truy vấn:', error);
        res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}
//[POST] /admin/api/auth/login
module.exports.loginPost = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [user] = await sequelize.query(
            `SELECT * 
             FROM TUSER 
             WHERE EMAIL = :email`,
            {
                replacements: { email }, // Đặt giá trị của biến email vào đây
                type: Sequelize.QueryTypes.SELECT
            }
        );
        if (!user) {
            res.status(401).json({ message: 'Email không đúng' });
            return;
        }
        if (md5(password) != user.PASSWORD) {
            res.status(402).json({ message: 'Mật khẩu không đúng' });
            return;
        }
        if (user.status == "Inactive") {
            res.status(403).json({ message: 'Tài khoản không hoạt động' });
            return;
        }
        const userId=user.USERID;
        const [cart] = await sequelize.query(
            `SELECT     
                COALESCE(SUM(C.QUANTITY), 0) AS TOTALQUANTITY, 
                COALESCE(SUM(C.QUANTITY * P.PRICE), 0) AS TOTALPRICE
             FROM TCART C
             JOIN TPRODUCT P ON C.PRODUCTID=P.PRODUCTID
             WHERE C.DELETED=0 AND C.USERID = :userId`,
            {
                replacements: { userId }, // Đặt giá trị của biến email vào đây
                type: Sequelize.QueryTypes.SELECT
            }
        );
        user["CART"]=cart;
        res.status(200).json({ message: 'Đăng nhập thành công', user });
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
                replacements: { email, otp }, // Đặt giá trị của biến email vào đây
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
                replacements: { email }, // Đặt giá trị của biến email vào đây
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