const express = require('express');
const router = express.Router();
const controller=require('../../Controllers/Admin/order.controller');

router.get('/', controller.index);

router.get('/detail/:id', controller.detail)

router.post('/confirm/:id', controller.confirm);

router.post('/cancel/:id', controller.cancel);

// router.get('/create', controller.create);

// router.post('/create', controller.createPost);

// router.get('/update/:id', controller.update)

// router.patch('/update/:id', controller.updatePatch)

// router.delete('/delete/:id', controller.delete);

// router.patch('/change-multi', controller.changeMulti)

module.exports = router;