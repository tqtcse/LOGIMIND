const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const { chatAI, deleteFile } = require('../services/modelService')

const router = express.Router();

router.post('/chat', verifyToken, chatAI);
router.post('/delete', verifyToken, deleteFile);

module.exports = router;