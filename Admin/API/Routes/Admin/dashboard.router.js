const express = require('express');
const controller = require('../../Controllers/Admin/dashboard.controller');
const router = express.Router();


router.get('/', controller.dashboard)


module.exports = router;