const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.post('/payu-webhook', orderController.handlePayUWebhook);

module.exports = router;
