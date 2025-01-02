const express = require('express');
const cors= require('cors'); // Loại bỏ ngăn chặn giữa việc BE chặn FE lấy data
// Route
const routeAdmin = require("./API/Routes/Admin/index.route"); // no file extension
const sequelize = require("./config/database");
const systemConfig =require("./config/system");

const methodOverride = require('method-override')// thư viện ghi đè method các phương thức PATH..
const bodyParser = require('body-parser')// thư viện chuyển đổi data trong req.body có thể usable
const moment = require('moment'); // thư viện chuyển đổi time timestamp-> time

const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');

require('dotenv').config();


sequelize;// kết nối databasse

const app = express();
const port = 3000;
app.use(cors());

app.set('views', `views`);
app.set("view engine", 'pug');

app.use(methodOverride('_method')) // override
app.use(bodyParser.urlencoded({ extended: false }))// encode chuyển đổi res.body => dữ liệu

app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.use(express.static(`${__dirname}/public`));
app.locals.moment = moment;

// Flash
app.use(cookieParser('123456789_ABC'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// End flash

routeAdmin(app);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
})