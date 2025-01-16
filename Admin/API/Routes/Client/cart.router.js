// LIBRARY
const express = require('express')
const controller = require('../../Controllers/Client/cart.controller');
const router = express.Router();

// // [GET] admin/api/auth/login
router.get('/index/:userId', controller.index);

router.get('/delete/:id', controller.delete);

router.post('/create', controller.create);

router.post('/update/:id', controller.update);
module.exports = router;