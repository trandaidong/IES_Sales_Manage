const express = require("express");
const router = express.Router();
const controller=require('../../Controllers/Client/order.controller');


router.post('/create/:userId', controller.create)

module.exports = router;