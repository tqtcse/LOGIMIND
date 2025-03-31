const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const { uploadImg, getImg, deleteImg } = require('../services/imageService')

const router = express.Router();

router.post('/imgUpload', verifyToken, uploadImg);
router.get('/images/:filename', verifyToken, getImg)
router.delete('/deleteImage/:name', verifyToken, deleteImg)


module.exports = router;