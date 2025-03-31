const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const { deleteAccount } = require('../services/accountService')

const router = express.Router();

router.delete('/delete-account/:id', verifyToken, deleteAccount);



module.exports = router;