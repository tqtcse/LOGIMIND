const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const { getAllUser, getUserInfo, getUserIdByEmail, updateUserInfor } = require('../services/userService')

const router = express.Router();

router.get('/get-user', verifyToken, getAllUser);
router.post('/get-user-infor', verifyToken, getUserInfo);
router.post('/get-user-id', verifyToken, getUserIdByEmail);
router.post('/update-user-infor', verifyToken, updateUserInfor);


module.exports = router;