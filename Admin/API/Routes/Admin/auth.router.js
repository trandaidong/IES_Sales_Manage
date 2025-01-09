// LIBRARY
const express = require('express')
const controller = require('../../Controllers/Admin/auth.controller');
const router = express.Router();
const validate=require('../../../validates/admin/accounts.validate')

// [GET] admin/api/auth/login
router.get('/login', controller.login);

router.post('/login' ,
    controller.loginPost);

router.get('/logout', controller.logout);

router.get('/password/forgot', controller.forgotPassword);

router.post('/password/forgot', controller.forgotPasswordPost);

router.get('/password/otp', controller.otpPassword);

router.post('/password/otp', controller.otpPasswordPost);

router.get('/password/reset', controller.resetPassword);

router.post('/password/reset', validate.resetPasswordPost, controller.resetPasswordPost);
module.exports = router;