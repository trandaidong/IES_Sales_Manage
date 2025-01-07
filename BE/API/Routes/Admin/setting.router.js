const express = require('express');
const router = express.Router();
const controller=require('../../Controllers/Admin/setting.controller');

router.get('/general', controller.general);

router.patch('/general', controller.generalPatch);

module.exports = router;