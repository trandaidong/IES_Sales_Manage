const express = require('express');
const router = express.Router();
const controller=require('../../Controllers/Admin/statistic.controller');

router.get('/', controller.index);

router.post('/day', controller.day);

router.post('/month', controller.month);

router.post('/year', controller.year);
module.exports = router;