const express = require("express");
const cors = require("cors");
const products = require("./product.json").products; // Đọc dữ liệu từ file JSON
const categories = require("./product.json").categories; // Lấy danh mục từ JSON
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());

// API lấy danh sách tất cả sản phẩm
app.get("/api/products", (req, res) => {
  res.json({ products });
});

app.get("/api/search", (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.status(400).json({ error: "Vui lòng cung cấp từ khóa tìm kiếm." });
  }

  const filteredProducts = products.filter((product) =>
    product.TITLE.toLowerCase().includes(query.toLowerCase())
  );
  console.log(filteredProducts)
  res.json({ products: filteredProducts });
});

app.get("/api/categories", (req, res) => {
  res.json({ categories });
});
// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});