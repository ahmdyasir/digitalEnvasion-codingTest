const path = require('path');

const express = require('express');

const adminController = require('../controllers/user');
const ResponseMiddleware = require('../middlewares/ResponseMiddleware');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-user', adminController.getAddProduct, ResponseMiddleware);

// /admin/products => GET
router.get('/', adminController.getUsers, ResponseMiddleware);

// /admin/add-product => POST
router.post('/add-user', adminController.postAddProduct, ResponseMiddleware);

router.get('/edit-user/:userId', adminController.getEditProduct, ResponseMiddleware);

router.post('/edit-user', adminController.postEditProduct);

module.exports = router;
