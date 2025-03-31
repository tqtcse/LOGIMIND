const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const { getAllOrderDetail, addOrderDetail, getOrderDetailByID } = require('../services/orderService')

const router = express.Router();

router.get('/get-orderDetail', verifyToken, getAllOrderDetail);
router.post('/add-order-detail', verifyToken, addOrderDetail);
router.get('/get-order-details/:id_account', verifyToken, getOrderDetailByID);

module.exports = router;