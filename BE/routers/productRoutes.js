const express = require("express");
const { getAllProductsController, getFeaturedProductsController, getBannersController } = require("../Controllers/ProductController");

const router = express.Router();

// Endpoint lấy tất cả sản phẩm
router.get("/", getAllProductsController);

// Endpoint lấy sản phẩm nổi bật
router.get("/featured", getFeaturedProductsController);

// Endpoint lấy banner
router.get("/banners", getBannersController);

module.exports = router;
