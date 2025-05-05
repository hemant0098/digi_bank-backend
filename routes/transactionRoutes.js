// routes/transactionRoutes.js

const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleWare/authMiddleWare');


// Protected Routes
router.post('/send', authMiddleware, transactionController.sendMoney);
router.get('/history', authMiddleware, transactionController.getTransaction);

module.exports = router;
