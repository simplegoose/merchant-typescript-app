const express = require('express');
const { checkIfLoggedIn } = require('../controllers/auth-controller');
const { uploadStock, getStock } = require('../controllers/stock-controller');
const router = express.Router();

router
.route('/post-stock')
.post(uploadStock);

router
.route('/get-stock')
.get(getStock);

export default router;