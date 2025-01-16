const sequelize = require('../../../config/database');
const Sequelize = require('sequelize');

//[GET] /
module.exports.detail = async (req, res) => {
    const id=req.params.id;
    try {
        const [product] = await sequelize.query(`
            SELECT *
            FROM TPRODUCT
            WHERE DELETED = 0 AND STATUS = "Active" AND PRODUCTID = '${id}';
        `, {
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        const products = await sequelize.query(`
            SELECT *
            FROM TPRODUCT
            WHERE DELETED = 0 AND STATUS = "Active" AND CATEGORYID = '${product.CATEGORYID}';
        `, {
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        res.json({product, products});
    } catch (error) {
        console.error('Lỗi truy vấn:', error);
        res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}
//[GET] /
module.exports.index = async (req, res) => {
    try {
        const product = await sequelize.query(`
            SELECT *
            FROM TPRODUCT
            WHERE DELETED = 0 AND STATUS = "Active";
        `, {
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        res.json(product);
    } catch (error) {
        console.error('Lỗi truy vấn:', error);
        res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}

module.exports.search = async (req, res) => {
    const keyword=req.query.keyword;
    try {
        const products = await sequelize.query(`
            SELECT *
            FROM TPRODUCT
            WHERE DELETED = 0 AND STATUS = "Active" AND TITLE LIKE '%${keyword}%';
        `, {
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        res.status(200).json({ message: 'Lấy thành công', products });
    } catch (error) {
        console.error('Lỗi truy vấn:', error);
        res.status(500).send("Lỗi lấy dữ liệu từ cơ sở dữ liệu.");
    }
}