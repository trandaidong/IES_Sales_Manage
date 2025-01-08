// LIBRARY
const express = require('express')
const controller = require('../../Controllers/Admin/my-account.controller.js');
const router = express.Router();

// const validate = require("../../validates/admin/product.validate.js");
// CONTENT
router.get('/', controller.index);

router.get('/update', controller.update);

// router.patch('/update', 
//     upload.single('avatar'), 
//     uploadClound.upload,
//     controller.updatePatch);

module.exports = router;