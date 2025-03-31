const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const { createPayment, triggerWebhook } = require('../services/paymentService')

const router = express.Router();

router.post('/create-payment', verifyToken, createPayment);
router.post('/webhook', verifyToken, triggerWebhook);


module.exports = router;