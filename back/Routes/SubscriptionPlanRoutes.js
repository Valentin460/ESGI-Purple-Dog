const express = require('express');
const router = express.Router();
const SubscriptionPlanController = require('../controllers/SubscriptionPlanController');

router.post('/', SubscriptionPlanController.createPlan);
router.get('/', SubscriptionPlanController.getAllPlans);
router.get('/active', SubscriptionPlanController.getActivePlans);
router.get('/:id', SubscriptionPlanController.getPlanById);
router.put('/:id', SubscriptionPlanController.updatePlan);
router.patch('/:id/toggle-status', SubscriptionPlanController.togglePlanStatus);
router.delete('/:id', SubscriptionPlanController.deletePlan);

module.exports = router;