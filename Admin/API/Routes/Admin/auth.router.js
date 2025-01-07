// LIBRARY
const express = require('express')
const controller = require('../../Controllers/Admin/auth.controller');
const router = express.Router();
//const validate=require('../../validates/admin/login.validate.js')

// [GET] admin/api/auth/login
router.get('/login', controller.login);

router.post('/login' ,
    controller.loginPost);

router.get('/logout', controller.logout);

module.exports = router;