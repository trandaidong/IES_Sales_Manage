const express = require('express');
const router = express.Router();
const adminController=require('../../Controllers/Admin/admin.controller');

router.get('/', adminController.register);

module.exports = router;