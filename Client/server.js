const express = require("express");
const cors = require("cors");
const products = require("./product.json").products; // Đọc dữ liệu từ file JSON
const categories = require("./product.json").categories; // Lấy danh mục từ JSON
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Để xử lý body JSON

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

let cart = []; // Lưu trữ giỏ hàng trong bộ nhớ tạm

// Lấy giỏ hàng
app.get("/api/cart", (req, res) => {
  res.json(cart);
});

// Thêm sản phẩm vào giỏ hàng
app.post("/api/cart", (req, res) => {
  const product = req.body;
  const existingProductIndex = cart.findIndex(
    (item) => item.PRODUCTID === product.PRODUCTID
  );

  if (existingProductIndex > -1) {
    // Nếu sản phẩm đã tồn tại, tăng số lượng
    cart[existingProductIndex].quantity += 1;
  } else {
    // Nếu sản phẩm chưa có, thêm mới
    cart.push({ ...product, quantity: 1 });
  }

  res.json(cart); // Trả lại giỏ hàng cập nhật
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server đang chạy tại http://localhost:${PORT}`);
});