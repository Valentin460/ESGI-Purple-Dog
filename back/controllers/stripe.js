const StripeService = require('../services/stripe');

class StripeController {
  
  constructor() {
    this.stripeService = new StripeService();
  }

  // POST /api/stripe/payment-intent
  // Créer un Payment Intent
  async createPaymentIntent(req, res) {
    try {
      const { amount, itemId, itemType } = req.body;
      const userId = req.user.id; // Depuis le middleware auth
      
      // Validation
      if (!amount || amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid amount'
        });
      }
      
      // Calculer les commissions
      const commissions = this.stripeService.calculateCommissions(amount, false);
      
      // Créer le Payment Intent
      const paymentIntent = await this.stripeService.createPaymentIntent({
        amount: commissions.netAmount, // Montant + commission acheteur
        currency: 'eur',
        metadata: {
          user_id: userId,
          item_id: itemId,
          item_type: itemType,
          base_amount: amount,
          buyer_commission: commissions.buyerCommission
        }
      });
      
      res.json({
        success: true,
        data: {
          clientSecret: paymentIntent.client_secret,
          paymentIntentId: paymentIntent.id,
          amount: commissions.netAmount,
          commission: commissions.buyerCommission
        }
      });
      
    } catch (error) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
  
  // GET /api/stripe/payment-intent/:id
  // Récupérer un Payment Intent
  async getPaymentIntent(req, res) {
    try {
      const { id } = req.params;
      
      const paymentIntent = await this.stripeService.getPaymentIntent(id);
      
      res.json({
        success: true,
        data: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: this.stripeService.centsToEuros(paymentIntent.amount),
          currency: paymentIntent.currency,
          metadata: paymentIntent.metadata
        }
      });
      
    } catch (error) {
      console.error('Error fetching payment intent:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
  
  // POST /api/stripe/payment-intent/:id/cancel
  // Annuler un Payment Intent
  async cancelPaymentIntent(req, res) {
    try {
      const { id } = req.params;
      
      const paymentIntent = await this.stripeService.cancelPaymentIntent(id);
      
      res.json({
        success: true,
        message: 'Payment intent cancelled',
        data: {
          id: paymentIntent.id,
          status: paymentIntent.status
        }
      });
      
    } catch (error) {
      console.error('Error cancelling payment intent:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // POST /api/stripe/customer
  // Créer un client Stripe
  async createCustomer(req, res) {
    try {
      const { email, name } = req.body;
      const userId = req.user.id;
      
      const customer = await this.stripeService.createCustomer({
        email,
        name,
        metadata: {
          user_id: userId
        }
      });
      
      // TODO: Sauvegarder customer.id dans la DB
      
      res.json({
        success: true,
        data: {
          customerId: customer.id,
          email: customer.email
        }
      });
      
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
  
  // POST /api/stripe/subscription
  // Créer un abonnement professionnel
  async createSubscription(req, res) {
    try {
      const { customerId, priceId, trialDays } = req.body;
      
      const subscription = await this.stripeService.createSubscription({
        customerId,
        priceId,
        trialDays
      });
      
      res.json({
        success: true,
        data: {
          subscriptionId: subscription.id,
          status: subscription.status,
          clientSecret: subscription.latest_invoice.payment_intent.client_secret
        }
      });
      
    } catch (error) {
      console.error('Error creating subscription:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
  
  // ==========================================
  // POST /api/stripe/refund
  // Créer un remboursement
  // ==========================================
  
  async createRefund(req, res) {
    try {
      const { paymentIntentId, amount, reason } = req.body;
      
      const refund = await this.stripeService.createRefund({
        paymentIntentId,
        amount,
        reason
      });
      
      res.json({
        success: true,
        message: 'Refund created successfully',
        data: {
          refundId: refund.id,
          status: refund.status,
          amount: this.stripeService.centsToEuros(refund.amount)
        }
      });
      
    } catch (error) {
      console.error('Error creating refund:', error);
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
  
  // POST /api/stripe/webhook
  // Gérer les webhooks Stripe
  async handleWebhook(req, res) {
    try {
      const signature = req.headers['stripe-signature'];
      
      // Vérifier la signature
      const event = this.stripeService.constructWebhookEvent(
        req.body,
        signature
      );
      
      console.log(`Webhook received: ${event.type}`);
      
      // Gérer les différents événements
      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object);
          break;
          
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object);
          break;
          
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object);
          break;
          
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object);
          break;
          
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object);
          break;
          
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
      
      res.json({ received: true });
      
    } catch (error) {
      console.error('Webhook error:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }
  
  // Handlers privés pour les webhooks
  async handlePaymentSuccess(paymentIntent) {
    console.log(`Payment succeeded: ${paymentIntent.id}`);
    
    // TODO: Mettre à jour la transaction dans la DB
    // - Marquer la transaction comme "payment_received"
    // - Envoyer une notification au vendeur
    // - Créer un record de shipment
  }
  
  async handlePaymentFailure(paymentIntent) {
    console.log(`Payment failed: ${paymentIntent.id}`);
    
    // TODO: Gérer l'échec du paiement
    // - Notifier l'acheteur
    // - Marquer la transaction comme "failed"
  }
  
  async handleSubscriptionCreated(subscription) {
    console.log(`Subscription created: ${subscription.id}`);
    
    // TODO: Sauvegarder l'abonnement dans la DB
  }
  
  async handleSubscriptionUpdated(subscription) {
    console.log(`Subscription updated: ${subscription.id}`);
    
    // TODO: Mettre à jour l'abonnement dans la DB
  }
  
  async handleSubscriptionDeleted(subscription) {
    console.log(`Subscription deleted: ${subscription.id}`);
    
    // TODO: Marquer l'abonnement comme cancelled dans la DB
  }

  // GET /api/stripe/config
  // Retourner la clé publique Stripe
  async getConfig(req, res) {
    res.json({
      success: true,
      data: {
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
      }
    });
  }
}

module.exports = new StripeController();