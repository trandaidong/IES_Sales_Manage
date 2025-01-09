const systemConfig = require('../../../config/system.js');
const Sequelize = require("sequelize");
const sequelize = require("../../../config/database.js");

module.exports.requireAuth = async (req, res, next) => {
    if (!req.cookies.token) { // nếu chưa đăng nhập thì quay về trang login
        res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
    }
    else {
        try {
            const token = req.cookies.token;
            const [user] = await sequelize.query(
                `SELECT * 
                 FROM TADMIN 
                 WHERE ADMINID = :token`,
                {
                    replacements: { token }, // Đặt giá trị của biến email vào đây
                    type: Sequelize.QueryTypes.SELECT
                }
            );
            if (!user) {
                res.redirect(`${systemConfig.prefixAdmin}/auth/login`)
            }
            else {
                const id=user.ROLEID;

                const [role] = await sequelize.query(
                    `SELECT * 
                     FROM TROLE 
                     WHERE ROLEID = :id`,
                    {
                        replacements: { id }, // Đặt giá trị của biến email vào đây
                        type: Sequelize.QueryTypes.SELECT
                    }
                );
                res.locals.user = user;
                res.locals.role = role;
                next();
            }
        } catch (error) {
            console.error('Lỗi truy vấn:', error);
            res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
        }
    }
}