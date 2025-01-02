// LIBRARY
const express = require('express')
const controller = require('../../controller/admin/accounts.controller');
const router = express.Router();
const validate = require("../../validates/admin/accounts.validate.js");

// CONTENT
router.get('/', controller.index);

// router.get('/create', controller.create);

// router.post('/create', controller.createPost);

// router.get('/update/:id', controller.update);

// router.patch('/update/:id', validate.updatePost, controller.updatePost);

module.exports = router;