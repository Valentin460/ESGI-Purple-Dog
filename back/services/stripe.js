const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class StripeService {
  
  // ==========================================
  // CUSTOMERS
  // ==========================================
  
  /**
   * Créer un client Stripe
   */
  async createCustomer({ email, name, metadata = {} }) {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata
      });
      
      return customer;
    } catch (error) {
      throw new Error(`Stripe customer creation failed: ${error.message}`);
    }
  }
  
  /**
   * Récupérer un client Stripe
   */
  async getCustomer(customerId) {
    try {
      return await stripe.customers.retrieve(customerId);
    } catch (error) {
      throw new Error(`Stripe customer retrieval failed: ${error.message}`);
    }
  }
  
  /**
   * Supprimer un client Stripe
   */
  async deleteCustomer(customerId) {
    try {
      return await stripe.customers.del(customerId);
    } catch (error) {
      throw new Error(`Stripe customer deletion failed: ${error.message}`);
    }
  }
  
  // ==========================================
  // PAYMENT INTENTS (Paiements)
  // ==========================================
  
  /**
   * Créer un Payment Intent (pour enchère gagnée ou vente rapide)
   */
  async createPaymentIntent({ amount, currency = 'eur', customerId, metadata = {} }) {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convertir en centimes
        currency,
        customer: customerId,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          ...metadata,
          platform: 'purple_dog'
        }
      });
      
      return paymentIntent;
    } catch (error) {
      throw new Error(`Payment Intent creation failed: ${error.message}`);
    }
  }
  
  /**
   * Confirmer un Payment Intent
   */
  async confirmPaymentIntent(paymentIntentId, paymentMethodId) {
    try {
      return await stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: paymentMethodId
      });
    } catch (error) {
      throw new Error(`Payment Intent confirmation failed: ${error.message}`);
    }
  }
  
  /**
   * Annuler un Payment Intent
   */
  async cancelPaymentIntent(paymentIntentId) {
    try {
      return await stripe.paymentIntents.cancel(paymentIntentId);
    } catch (error) {
      throw new Error(`Payment Intent cancellation failed: ${error.message}`);
    }
  }
  
  /**
   * Récupérer un Payment Intent
   */
  async getPaymentIntent(paymentIntentId) {
    try {
      return await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch (error) {
      throw new Error(`Payment Intent retrieval failed: ${error.message}`);
    }
  }
  
  // ==========================================
  // SUBSCRIPTIONS (Abonnements professionnels)
  // ==========================================
  
  /**
   * Créer un abonnement pour un professionnel
   */
  async createSubscription({ customerId, priceId, trialDays = 30 }) {
    try {
      const subscription = await stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        trial_period_days: trialDays,
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent']
      });
      
      return subscription;
    } catch (error) {
      throw new Error(`Subscription creation failed: ${error.message}`);
    }
  }
  
  /**
   * Annuler un abonnement
   */
  async cancelSubscription(subscriptionId, cancelAtPeriodEnd = false) {
    try {
      if (cancelAtPeriodEnd) {
        return await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: true
        });
      } else {
        return await stripe.subscriptions.cancel(subscriptionId);
      }
    } catch (error) {
      throw new Error(`Subscription cancellation failed: ${error.message}`);
    }
  }
  
  /**
   * Récupérer un abonnement
   */
  async getSubscription(subscriptionId) {
    try {
      return await stripe.subscriptions.retrieve(subscriptionId);
    } catch (error) {
      throw new Error(`Subscription retrieval failed: ${error.message}`);
    }
  }
  
  // ==========================================
  // PRICES & PRODUCTS
  // ==========================================
  
  /**
   * Créer un produit (plan d'abonnement)
   */
  async createProduct({ name, description }) {
    try {
      return await stripe.products.create({
        name,
        description
      });
    } catch (error) {
      throw new Error(`Product creation failed: ${error.message}`);
    }
  }
  
  /**
   * Créer un prix pour un produit
   */
  async createPrice({ productId, amount, currency = 'eur', interval = 'month' }) {
    try {
      return await stripe.prices.create({
        product: productId,
        unit_amount: Math.round(amount * 100),
        currency,
        recurring: { interval }
      });
    } catch (error) {
      throw new Error(`Price creation failed: ${error.message}`);
    }
  }
  
  // ==========================================
  // REFUNDS
  // ==========================================
  
  /**
   * Créer un remboursement
   */
  async createRefund({ paymentIntentId, amount = null, reason = 'requested_by_customer' }) {
    try {
      const refundData = {
        payment_intent: paymentIntentId,
        reason
      };
      
      if (amount) {
        refundData.amount = Math.round(amount * 100);
      }
      
      return await stripe.refunds.create(refundData);
    } catch (error) {
      throw new Error(`Refund creation failed: ${error.message}`);
    }
  }
  
  // ==========================================
  // PAYMENT METHODS
  // ==========================================
  
  /**
   * Attacher une méthode de paiement à un client
   */
  async attachPaymentMethod(paymentMethodId, customerId) {
    try {
      return await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId
      });
    } catch (error) {
      throw new Error(`Payment method attachment failed: ${error.message}`);
    }
  }
  
  /**
   * Définir une méthode de paiement par défaut
   */
  async setDefaultPaymentMethod(customerId, paymentMethodId) {
    try {
      return await stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });
    } catch (error) {
      throw new Error(`Default payment method update failed: ${error.message}`);
    }
  }
  
  /**
   * Lister les méthodes de paiement d'un client
   */
  async listPaymentMethods(customerId, type = 'card') {
    try {
      return await stripe.paymentMethods.list({
        customer: customerId,
        type
      });
    } catch (error) {
      throw new Error(`Payment methods listing failed: ${error.message}`);
    }
  }
  
  // ==========================================
  // WEBHOOKS
  // ==========================================
  
  /**
   * Vérifier la signature d'un webhook Stripe
   */
  constructWebhookEvent(payload, signature) {
    try {
      return stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      throw new Error(`Webhook signature verification failed: ${error.message}`);
    }
  }
  
  // ==========================================
  // UTILITIES
  // ==========================================
  
  /**
   * Calculer les commissions Purple Dog
   */
  calculateCommissions(amount, isSeller = true) {
    const sellerCommission = amount * 0.02; // 2%
    const buyerCommission = amount * 0.03; // 3%
    
    return {
      sellerCommission: Math.round(sellerCommission * 100) / 100,
      buyerCommission: Math.round(buyerCommission * 100) / 100,
      totalCommission: Math.round((sellerCommission + buyerCommission) * 100) / 100,
      netAmount: isSeller 
        ? Math.round((amount - sellerCommission) * 100) / 100
        : Math.round((amount + buyerCommission) * 100) / 100
    };
  }
  
  /**
   * Convertir des euros en centimes
   */
  eurosToCents(euros) {
    return Math.round(euros * 100);
  }
  
  /**
   * Convertir des centimes en euros
   */
  centsToEuros(cents) {
    return Math.round(cents) / 100;
  }
}

module.exports = StripeService;