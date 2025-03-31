const express = require('express');
const verifyToken = require('../middlewares/authMiddleware');
const { getAllPackage, getPackageInforByIdUser, updatePackage, addPackage,
    deletePackage
} = require('../services/packagesService')

const router = express.Router();

router.get('/packages', verifyToken, getAllPackage);
router.post('/get-package-infor', verifyToken, getPackageInforByIdUser);
router.put('/update-package', verifyToken, updatePackage)
router.post('/add-package', verifyToken, addPackage)
router.delete('/delete-package/:id', verifyToken, deletePackage)

module.exports = router;