const express = require('express');
const router = express.Router();
const SubscriptionController = require('../controllers/SubscriptionController');

// 🔑 ROUTES SPÉCIFIQUES D'ABORD (avant /:id)
router.get('/user/:userId/active', SubscriptionController.getUserActiveSubscription);
router.get('/user/:userId', SubscriptionController.getUserSubscriptions);

// ROUTES CRUD DE BASE
router.post('/', SubscriptionController.createSubscription);
router.get('/', SubscriptionController.getAllSubscriptions);

// 🔑 ROUTES PARAMÉTRIQUES À LA FIN
router.get('/:id', SubscriptionController.getSubscriptionById);
router.patch('/:id/cancel', SubscriptionController.cancelSubscription);
router.patch('/:id/renew', SubscriptionController.renewSubscription);
router.patch('/:id/toggle-auto-renew', SubscriptionController.toggleAutoRenew);
router.delete('/:id', SubscriptionController.deleteSubscription);

module.exports = router;