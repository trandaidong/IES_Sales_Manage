const db = require("../../Admin/config/database");

// Hàm lấy tất cả sản phẩm
const getAllProducts = async () => {
  const query = "SELECT * FROM products"; // Query SQL
  const [rows] = await db.execute(query); // db.execute là phương thức chạy query
  return rows;
};

// Hàm lấy sản phẩm nổi bật
const getFeaturedProducts = async (limit) => {
  const query = `SELECT * FROM products ORDER BY created_at DESC LIMIT ?`;
  const [rows] = await db.execute(query, [limit]);
  return rows;
};

// Hàm lấy banner
const getBanners = async (limit) => {
  const query = `SELECT * FROM banners ORDER BY created_at DESC LIMIT ?`;
  const [rows] = await db.execute(query, [limit]);
  return rows;
};

module.exports = { getAllProducts, getFeaturedProducts, getBanners };
