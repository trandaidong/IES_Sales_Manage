// LIBRARY
const express = require('express')
const controller = require('../../Controllers/Admin/customer.controller.js');
const router = express.Router();
const validate = require("../../../validates/admin/accounts.validate.js");

// CONTENT
router.get('/', controller.index);

router.get('/detail/:id', controller.detail);

router.get('/create', controller.create);

router.post('/create', controller.createPost);

router.get('/update/:id', controller.update);

router.patch('/update/:id', validate.updatePost, controller.updatePatch);

router.delete('/delete/:id', controller.delete);

module.exports = router;