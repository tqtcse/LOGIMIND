const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const { getFiles, uploadFiles, deleteFiles, downloadFiles } = require('../services/fileService')

const router = express.Router();

router.get('/files', verifyToken, getFiles);
router.post('/upload', verifyToken, uploadFiles);
router.delete('/files/:filename', verifyToken, deleteFiles);
router.get('/download/:filename', verifyToken, downloadFiles)

module.exports = router;