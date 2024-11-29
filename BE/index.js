const express = require('express');
const cors= require('cors'); // Loại bỏ ngăn chặn giữa việc BE chặn FE lấy data
// Route
const routeAdmin = require("./API/Routes/Admin/index.route"); // no file extension
const sequelize = require("./config/database");

sequelize.sequelize;// kết nối databasse

const app = express();
const port = 3000;
app.use(cors());


routeAdmin(app);

// // Import thư viện mysql2
// const mysql = require('mysql2');

// // Tạo kết nối đến MySQL
// const connection = mysql.createConnection({
//   host: '127.0.0.1',     // Địa chỉ máy chủ MySQL (có thể là localhost hoặc địa chỉ IP của máy chủ)
//   user: 'root',          // Tên người dùng MySQL (thường là root)
//   password: '',// Mật khẩu người dùng
//   database: 'sale_manage'  // Tên cơ sở dữ liệu
// });

// // Kết nối đến MySQL
// connection.connect((err) => {
//   if (err) {
//     console.error('Lỗi kết nối MySQL:', err);
//     return;
//   }
//   console.log('Kết nối thành công đến MySQL!');
// });

// // Thực hiện một truy vấn
// connection.query('SELECT * FROM your_table', (err, results) => {
//   if (err) {
//     console.error('Lỗi truy vấn:', err);
//     return;
//   }
//   console.log('Kết quả truy vấn:', results);
// });

// // Đóng kết nối sau khi hoàn thành
// connection.end();


app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})