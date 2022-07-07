const express = require('express');
const { checkIfLoggedIn } = require('../controllers/auth-controller');
const { uploadSale, getSales } = require('../controllers/sales-controller');
const router = express.Router();

router
.route('/post-sale')
.post(uploadSale);

router
.route('/get-sales')
.get(getSales);

export default router;