const express = require("express");
const router = express.Router();
const controller=require('../../Controllers/Client/product.controller');


router.get('/', controller.index)

router.get('/detail/:id', controller.detail)

router.get('/search', controller.search)
module.exports = router;