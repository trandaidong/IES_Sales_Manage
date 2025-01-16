const sequelize = require('../../../config/database');
const Sequelize = require('sequelize');

//[GET] /
module.exports.products = async (req, res) => {
    const id=req.params.id;
    console.log(id);
    try {
        const products = await sequelize.query(`
            SELECT *
            FROM TPRODUCT
            WHERE DELETED = 0 AND STATUS = "Active" AND CATEGORYID = '${id}';
        `, {
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });

        if (req.query.keyword) {
            keyword = req.query.keyword;
        }
        res.json({
            products
        });
    } catch (error) {
        console.error('Lỗi truy vấn:', error);
        res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}