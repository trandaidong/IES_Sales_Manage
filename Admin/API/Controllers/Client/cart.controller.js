const systemConfig = require("../../../config/system.js");
var md5 = require('md5'); // thư viện mã hóa password
const Sequelize = require("sequelize");
const sequelize = require("../../../config/database.js");

//[POST] /admin/api/auth/login
module.exports.index = async (req, res) => {
    const userId = req.params.userId;
    try {
        const cart = await sequelize.query(
            `SELECT C.CARTID, C.QUANTITY, P.PRODUCTID, P.TITLE, P.PRICE, P.DISCOUNT, P.THUMBNAIL     
             FROM TCART C
             JOIN TPRODUCT P ON C.PRODUCTID=P.PRODUCTID
             WHERE C.DELETED=0 AND C.USERID = :userId`,
            {
                replacements: { userId }, // Đặt giá trị của biến email vào đây
                type: Sequelize.QueryTypes.SELECT
            }
        );
        const [generalCart] = await sequelize.query(
            `SELECT SUM(C.QUANTITY) AS TOTALQUANTITY, SUM(C.QUANTITY * P.PRICE) AS TOTALPRICE
             FROM TCART C
             JOIN TPRODUCT P ON C.PRODUCTID=P.PRODUCTID
             WHERE C.DELETED=0 AND C.USERID = :userId`,
            {
                replacements: { userId }, // Đặt giá trị của biến email vào đây
                type: Sequelize.QueryTypes.SELECT
            }
        );
        res.status(200).json({ message: 'Lấy danh sách giỏ hàng thành công', cart });
    } catch (error) {
        console.error('Lỗi truy vấn:', error);
        res.status(400).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}
module.exports.delete = async (req, res) => {
    const cartId = req.params.id;
    try {
        const [user] = await sequelize.query(
            `SELECT USERID
             FROM TCART
             WHERE CARTID = :cartId`,
            {
                replacements: { cartId },
                type: Sequelize.QueryTypes.SELECT
            }
        );
        const userId = user.USERID;
        await sequelize.query(
            `UPDATE TCART
             SET DELETED=1
             WHERE CARTID = :cartId`,
            {
                replacements: { cartId }, // Đặt giá trị của biến email vào đây
                type: Sequelize.QueryTypes.UPDATE
            }
        );
        const cart = await sequelize.query(
            `SELECT C.CARTID, C.QUANTITY, P.PRODUCTID, P.TITLE, P.PRICE, P.DISCOUNT, P.THUMBNAIL     
             FROM TCART C
             JOIN TPRODUCT P ON C.PRODUCTID=P.PRODUCTID
             WHERE C.DELETED=0 AND C.USERID = :userId`,
            {
                replacements: { userId },
                type: Sequelize.QueryTypes.SELECT
            }
        );
        res.status(200).json({ message: 'Xóa thành công', cart });
    } catch (error) {
        console.error('Lỗi truy vấn:', error);
        res.status(400).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}

//[POST] /client/carts/create
module.exports.create = async (req, res) => {
    const userId=req.body.userId;
    const productId=req.body.product.PRODUCTID;
    console.log(req.body);
    try {
        await sequelize.query(
            `CALL INSERT_TCART(:userId, :productId, 1)`,
            {
                replacements: { userId, productId }, // Đặt giá trị của biến email vào đây
                type: Sequelize.QueryTypes.RAW
            }
        );
        res.status(200).json({ message: 'Thêm giỏ hàng thành công'});
    } catch (error) {
        console.error('Lỗi truy vấn:', error);
        res.status(400).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}
//[POST] /client/carts/create
module.exports.update = async (req, res) => {
    const cartId=req.params.id;
    const quantity=req.body.quantity;
    try {
        const [user] = await sequelize.query(
            `SELECT USERID
             FROM TCART
             WHERE CARTID = :cartId`,
            {
                replacements: { cartId },
                type: Sequelize.QueryTypes.SELECT
            }
        );
        const userId = user.USERID;
        await sequelize.query(`
            UPDATE TCART
            SET QUANTITY = :quantity
            WHERE CARTID = :cartId
        `,{
                replacements: { quantity, cartId }, // Đặt giá trị của biến email vào đây
                type: Sequelize.QueryTypes.RAW
            }
        );
        const cart = await sequelize.query(
            `SELECT C.CARTID, C.QUANTITY, P.PRODUCTID, P.TITLE, P.PRICE, P.DISCOUNT, P.THUMBNAIL     
             FROM TCART C
             JOIN TPRODUCT P ON C.PRODUCTID=P.PRODUCTID
             WHERE C.DELETED=0 AND C.USERID = :userId`,
            {
                replacements: { userId },
                type: Sequelize.QueryTypes.SELECT
            }
        );
        res.status(200).json({ message: 'Cập nhật giỏ hàng thành công',cart});
    } catch (error) {
        console.error('Lỗi truy vấn:', error);
        res.status(400).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}