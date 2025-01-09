const moment = require('moment-timezone');
const sequelize = require('../../../config/database');
const Sequelize = require('sequelize');

module.exports.index = async (req, res) => {
    // Dữ liệu mẫu cho biểu đồ
    // Render file Pug và truyền dữ liệu xuống
    res.render('admin/pages/statistics/index.pug', {
        pageTitle: "Doanh thu",
        // data:[],
        search : ["","",""]
    });
};
module.exports.day = async (req, res) => {
    const period = req.body.period;
    var startDates = req.body.start_date.filter(date => date.trim() !== '')[0]; // Loại bỏ giá trị rỗng hoặc chuỗi trống
    var endDates = req.body.end_date.filter(date => date.trim() !== '')[0];     // Loại bỏ giá trị rỗng hoặc chuỗi trống
    try {
        const statistics = await sequelize.query(`
                SELECT CREATEDAT AS NGAY, SUM(TOTALAMOUNT) AS TONG_SOTIEN
                FROM TORDER  
                WHERE CREATEDAT BETWEEN :startDates AND :endDates
                GROUP BY CREATEDAT
                ORDER BY CREATEDAT ASC;
            `, {
            replacements: { startDates, endDates },
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        if (!statistics) {
            return res.status(404).json({ message: 'Nhân viên không tồn tại!' });
        }
        statistics.forEach(row => {
            row.NGAY = moment(row.NGAY).format('YYYY-MM-DD'); // Đảm bảo chỉ lấy phần ngày
        });
        console.log(statistics);    
        res.render('admin/pages/statistics/index.pug', {
            pageTitle: "Quản lý doanh thu",
            data: statistics,
            search: [period, startDates, endDates]
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin:', error);
        res.status(500).json({ message: 'Lỗi server!' });
    }
}

module.exports.month = async (req, res) => {
    const period = req.body.period;
    var startDates = req.body.start_date.filter(date => date.trim() !== '')[0]; // Loại bỏ giá trị rỗng hoặc chuỗi trống
    var endDates = req.body.end_date.filter(date => date.trim() !== '')[0];     // Loại bỏ giá trị rỗng hoặc chuỗi trống
    try {
        const statistics = await sequelize.query(`
                SELECT DATE_FORMAT(CREATEDAT, '%Y-%m') AS NGAY, SUM(TOTALAMOUNT) AS TONG_SOTIEN
                FROM TORDER  
                WHERE DATE_FORMAT(CREATEDAT, '%Y-%m') BETWEEN :startDates AND :endDates
                GROUP BY DATE_FORMAT(CREATEDAT, '%Y-%m') 
                ORDER BY DATE_FORMAT(CREATEDAT, '%Y-%m')  ASC;
            `, {
            replacements: { startDates, endDates },
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        console.log(statistics);    
        if (!statistics) {
            return res.status(404).json({ message: 'Nhân viên không tồn tại!' });
        }
        statistics.forEach(row => {
            row.NGAY = moment(row.NGAY).format('YYYY-MM'); // Đảm bảo chỉ lấy phần ngày
        });
        console.log(period)
        res.render('admin/pages/statistics/index.pug', {
            pageTitle: "Quản lý doanh thu",
            data: statistics,
            search: [period, startDates, endDates]
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin:', error);
        res.status(500).json({ message: 'Lỗi server!' });
    }
}
module.exports.year = async (req, res) => {
    const period = req.body.period;
    var startDates = req.body.start_date.filter(date => date.trim() !== '')[0]; // Loại bỏ giá trị rỗng hoặc chuỗi trống
    var endDates = req.body.end_date.filter(date => date.trim() !== '')[0];     // Loại bỏ giá trị rỗng hoặc chuỗi trống
    try {
        const statistics = await sequelize.query(`
                SELECT YEAR(CREATEDAT) AS NGAY, SUM(TOTALAMOUNT) AS TONG_SOTIEN
                FROM TORDER  
                WHERE YEAR(CREATEDAT) BETWEEN :startDates AND :endDates
                GROUP BY YEAR(CREATEDAT)
                ORDER BY YEAR(CREATEDAT) ASC;
            `, {
            replacements: { startDates, endDates },
            type: Sequelize.QueryTypes.SELECT // Để trả về kiểu select và trả về một mảng
        });
        if (!statistics) {
            return res.status(404).json({ message: 'Nhân viên không tồn tại!' });
        }
        console.log(statistics);    
        res.render('admin/pages/statistics/index.pug', {
            pageTitle: "Quản lý doanh thu",
            data: statistics,
            search: [period, startDates, endDates]
        });
    } catch (error) {
        console.error('Lỗi khi lấy thông tin:', error);
        res.status(500).json({ message: 'Lỗi server!' });
    }
}