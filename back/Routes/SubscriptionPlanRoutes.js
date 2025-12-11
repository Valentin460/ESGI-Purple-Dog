const express = require('express');
const router = express.Router();
const SubscriptionPlanController = require('../controllers/SubscriptionPlanController');

// 🔑 ROUTES SPÉCIFIQUES D'ABORD (avant /:id)
router.get('/active', SubscriptionPlanController.getActivePlans);

// ROUTES CRUD DE BASE
router.post('/', SubscriptionPlanController.createPlan);
router.get('/', SubscriptionPlanController.getAllPlans);

// 🔑 ROUTES PARAMÉTRIQUES À LA FIN
router.get('/:id', SubscriptionPlanController.getPlanById);
router.put('/:id', SubscriptionPlanController.updatePlan);
router.patch('/:id/toggle-status', SubscriptionPlanController.togglePlanStatus);
router.delete('/:id', SubscriptionPlanController.deletePlan);

module.exports = router;