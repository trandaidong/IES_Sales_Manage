const express = require("express");
const router = express.Router();
const controller=require('../../Controllers/Client/category.controller');

router.get('/products/:id', controller.products)

module.exports = router;