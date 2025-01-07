// const database = require('../../../config/system');
const moment = require('moment-timezone');

module.exports.index = async (req, res) => {
    // Dữ liệu mẫu cho biểu đồ
    const data = [
        { "NGAY": "2025-01-01", "TONG_SOTIEN": 5000 },
        { "NGAY": "2025-01-02", "TONG_SOTIEN": 7000 },
        { "NGAY": "2025-01-03", "TONG_SOTIEN": 4500 },
        { "NGAY": "2025-01-04", "TONG_SOTIEN": 8000 },
        { "NGAY": "2025-01-05", "TONG_SOTIEN": 3000 }
    ];

    const title = "Thống kê doanh thu hàng ngày";

    // Render file Pug và truyền dữ liệu xuống
    res.render('admin/pages/statistics/index.pug', { data, title });
};
