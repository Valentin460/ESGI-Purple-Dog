const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/TransactionController');

// 🔑 ROUTES SPÉCIFIQUES D'ABORD (avant /:id)
router.get('/user/:userId', TransactionController.getUserTransactions);
router.get('/buyer/:buyerId', TransactionController.getBuyerTransactions);
router.get('/seller/:sellerId/revenue', TransactionController.getSellerRevenue);
router.get('/seller/:sellerId', TransactionController.getSellerTransactions);

// ROUTES CRUD DE BASE
router.post('/', TransactionController.createTransaction);
router.get('/', TransactionController.getAllTransactions);

// 🔑 ROUTES PARAMÉTRIQUES À LA FIN
router.get('/:id', TransactionController.getTransactionById);
router.patch('/:id/payment-status', TransactionController.updatePaymentStatus);
router.patch('/:id/status', TransactionController.updateTransactionStatus);
router.patch('/:id/tracking', TransactionController.addTrackingNumber);
router.patch('/:id/cancel', TransactionController.cancelTransaction);
router.delete('/:id', TransactionController.deleteTransaction);

module.exports = router;