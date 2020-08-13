const express = require('express');
const router = express.Router();
const apiController = require('../Controllers/apiController');

router.get('/webhook', apiController.getMsg);

router.post('/webhook', apiController.postMsg);
module.exports = router;