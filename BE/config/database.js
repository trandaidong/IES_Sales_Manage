const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    'sale_manage', // tên database
    'root', //username đăng nhập
    '', // mật khẩu
    {
        host: 'localhost', // đường link hosting
        dialect: 'mysql'
    }
);


sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

module.exports.sequelize = sequelize;