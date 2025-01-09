const sequelize = require('../../../config/database');
const Sequelize = require('sequelize');
//[GET] /
module.exports.index = async (req, res) => { // đặt tên hàm là index

    // DS Sản phẩn nổi bật
    const productFeatured = await Product.find({
        status: "active",
        deleted: false,
        featured: "1"
    }).limit(3).sort({position: "desc"})
    const newProducts = productsHelper.newPriceProducts(productFeatured);
    //End DS Sản phẩn nổi bật

    // DS Sản phẩm mới nhất
    const latestProducts=await Product.find({
        status: "active",
        deleted: false
    }).sort({position: "desc"}).limit(6);
    const newLatestProducts = productsHelper.newPriceProducts(latestProducts);
    // End DS Sản phẩm mới nhất

    res.render('client/pages/home/index.pug', {
        pageTitle: "Trang chủ",
        productsFeatured: newProducts,
        latestProducts: newLatestProducts
    })
}