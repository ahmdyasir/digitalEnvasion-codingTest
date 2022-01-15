const path = require('path');

const express = require('express');

const userController = require('../controllers/user');
const ResponseMiddleware = require('../middlewares/ResponseMiddleware');

const router = express.Router();

router.get('/add-user', userController.getAddUser, ResponseMiddleware);

router.get('/', userController.getUsers, ResponseMiddleware);

router.post('/add-user', userController.postAddUser, ResponseMiddleware);

router.get('/edit-user/:userId', userController.getEditUser, ResponseMiddleware);

router.post('/edit-user', userController.postEditUser);

module.exports = router;
