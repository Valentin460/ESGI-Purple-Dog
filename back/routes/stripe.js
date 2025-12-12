const express = require('express');
const router = express.Router();
const StripeController = require('../controllers/stripe');
const { authenticate } = require('../middleware/auth');

// ==========================================
// Routes publiques
// ==========================================

// GET /api/stripe/config - Obtenir la clé publique Stripe
router.get('/config', StripeController.getConfig.bind(StripeController));

// POST /api/stripe/webhook - Webhooks Stripe (pas d'auth)
// Note: Cette route doit utiliser express.raw() pour le body
router.post('/webhook', express.raw({ type: 'application/json' }), StripeController.handleWebhook.bind(StripeController));

// ==========================================
// Routes protégées (nécessitent auth)
// ==========================================

// POST /api/stripe/payment-intent - Créer un Payment Intent
router.post('/payment-intent', authenticate, StripeController.createPaymentIntent.bind(StripeController));

// GET /api/stripe/payment-intent/:id - Récupérer un Payment Intent
router.get('/payment-intent/:id', authenticate, StripeController.getPaymentIntent.bind(StripeController));

// POST /api/stripe/payment-intent/:id/cancel - Annuler un Payment Intent
router.post('/payment-intent/:id/cancel', authenticate, StripeController.cancelPaymentIntent.bind(StripeController));

// POST /api/stripe/customer - Créer un client Stripe
router.post('/customer', authenticate, StripeController.createCustomer.bind(StripeController));

// POST /api/stripe/subscription - Créer un abonnement
router.post('/subscription', authenticate, StripeController.createSubscription.bind(StripeController));

// POST /api/stripe/refund - Créer un remboursement
router.post('/refund', authenticate, StripeController.createRefund.bind(StripeController));

module.exports = router;