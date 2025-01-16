const sequelize = require('../../../config/database');
const Sequelize = require('sequelize');

//[GET] /
module.exports.create = async (req, res) => {
    const id = req.params.userId;
    const total = parseInt(req.body.total);
    const { fullName, address, phone, note } = req.body.customerInfo;
    try {
        await sequelize.query(`
            CALL INSERT_TORDER(:id, :total, :phone, :address, :fullName, :note, @ORDERID);
        `, {
            replacements: { id, total, phone, address, fullName, note },
            type: Sequelize.QueryTypes.RAW // Để trả về kiểu select và trả về một mảng
        });

        // Truy vấn để lấy giá trị của biến OUT `@ORDERID`
        const [orderId] = await sequelize.query(`SELECT @ORDERID AS ORDERID;`, {
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        const idOrder=orderId.ORDERID;
        for (let item of req.body.cartItems) {
            console.log(item);
            await sequelize.query(`
                INSERT INTO TDETAILORDER (ORDERID, PRODUCTID, QUANTITY)
                VALUES (:orderId, :productId, :quantity);
            `, {
                replacements: {
                    orderId: idOrder,
                    productId: item.PRODUCTID,
                    quantity: item.QUANTITY
                },
                type: Sequelize.QueryTypes.INSERT
            });
            await sequelize.query(`
                UPDATE TCART
                SET DELETED =1
                WHERE CARTID= :cartId
            `, {
                replacements: {
                    cartId: item.CARTID
                },
                type: Sequelize.QueryTypes.UPDATE
            });
            await sequelize.query(`
                UPDATE TPRODUCT
                SET QUANTITY = QUANTITY - :quantityNew
                WHERE PRODUCTID= :productId
            `, {
                replacements: {
                    quantityNew: item.QUANTITY,
                    productId: item.PRODUCTID
                },
                type: Sequelize.QueryTypes.UPDATE
            });
        }
        res.status(200).send("Đặt hàng thành công");
    } catch (error) {
        console.error('Lỗi truy vấn:', error);
        res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}