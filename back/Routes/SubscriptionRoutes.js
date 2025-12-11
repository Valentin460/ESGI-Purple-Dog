const express = require('express');
const router = express.Router();
const SubscriptionController = require('../controllers/SubscriptionController');

router.post('/', SubscriptionController.createSubscription);
router.get('/', SubscriptionController.getAllSubscriptions);
router.get('/:id', SubscriptionController.getSubscriptionById);
router.get('/user/:userId', SubscriptionController.getUserSubscriptions);
router.get('/user/:userId/active', SubscriptionController.getUserActiveSubscription);
router.patch('/:id/cancel', SubscriptionController.cancelSubscription);
router.patch('/:id/renew', SubscriptionController.renewSubscription);
router.patch('/:id/toggle-auto-renew', SubscriptionController.toggleAutoRenew);
router.delete('/:id', SubscriptionController.deleteSubscription);

module.exports = router;