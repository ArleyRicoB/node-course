const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();

router.get('/', authController.getLogin);

router.post('/', authController.postLogin);

module.exports = router;
