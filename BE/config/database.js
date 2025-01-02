const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    'sale_manage', // tên database
    'root', //username đăng nhập
    '', // mật khẩu
    {
        host: 'localhost', // đường link hosting
        dialect: 'mysql',
        timezone: '+07:00', // Đặt múi giờ của bạn (UTC+7)
        dialectOptions: {
            timezone: '+07:00', // Đồng bộ múi giờ với MySQL
        },
        logging: false // Tắt chế độ in câu SQL
    }
);


sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});
module.exports = sequelize;