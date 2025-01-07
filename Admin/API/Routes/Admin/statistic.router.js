const express = require('express');
const router = express.Router();
const controller=require('../../Controllers/Admin/statistic.controller');

router.get('/', controller.index);

module.exports = router;