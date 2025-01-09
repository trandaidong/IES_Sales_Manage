const { getAllProducts, getFeaturedProducts, getBanners } = require("../models/ProductModel");

// Controller lấy tất cả sản phẩm
const getAllProductsController = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({ error: "Lỗi khi lấy danh sách sản phẩm" });
  }
};

// Controller lấy sản phẩm nổi bật
const getFeaturedProductsController = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5; // Lấy giới hạn từ query hoặc mặc định là 5
    const products = await getFeaturedProducts(limit);
    res.status(200).json({ products });
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({ error: "Lỗi khi lấy sản phẩm nổi bật" });
  }
};

// Controller lấy banner
const getBannersController = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 3; // Lấy giới hạn từ query hoặc mặc định là 3
    const banners = await getBanners(limit);
    res.status(200).json({ banners });
  } catch (error) {
    console.error("Error fetching banners:", error);
    res.status(500).json({ error: "Lỗi khi lấy banner" });
  }
};

module.exports = { getAllProductsController, getFeaturedProductsController, getBannersController };
