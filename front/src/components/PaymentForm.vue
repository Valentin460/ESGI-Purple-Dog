<template>
    <div class="payment-form">
      <h2>Paiement</h2>
      
      <div class="payment-summary">
        <p>Montant de l'enchère : {{ baseAmount }}€</p>
        <p>Commission acheteur (3%) : {{ commission }}€</p>
        <p class="total">Total à payer : {{ totalAmount }}€</p>
      </div>
  
      <div v-if="loading" class="loading">
        Chargement du formulaire de paiement...
      </div>
  
      <div v-else>
        <!-- Stripe Payment Element sera monté ici -->
        <div id="payment-element"></div>
  
        <button 
          @click="handlePayment" 
          :disabled="processing"
          class="pay-button"
        >
          {{ processing ? 'Traitement...' : `Payer ${totalAmount}€` }}
        </button>
  
        <div v-if="error" class="error">
          {{ error }}
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import stripeService from '@/services/stripe.service';
  
  export default {
    name: 'PaymentForm',
    props: {
      amount: {
        type: Number,
        required: true
      },
      itemId: {
        type: Number,
        required: true
      },
      itemType: {
        type: String,
        default: 'auction'
      }
    },
    data() {
      return {
        loading: true,
        processing: false,
        error: null,
        elements: null,
        baseAmount: this.amount,
        commission: 0,
        totalAmount: 0
      };
    },
    async mounted() {
      try {
        // 1. Initialiser Stripe
        const stripe = await stripeService.initialize();
  
        // 2. Créer un Payment Intent
        const paymentData = await stripeService.createPaymentIntent(
          this.amount,
          this.itemId,
          this.itemType
        );
  
        this.totalAmount = paymentData.amount;
        this.commission = paymentData.commission;
  
        // 3. Créer les elements Stripe
        this.elements = stripe.elements({
          clientSecret: paymentData.clientSecret,
          appearance: {
            theme: 'stripe',
            variables: {
              colorPrimary: '#8B5CF6', // Purple Dog color
            }
          }
        });
  
        // 4. Monter le Payment Element
        const paymentElement = this.elements.create('payment');
        paymentElement.mount('#payment-element');
  
        this.loading = false;
      } catch (err) {
        console.error('Payment initialization error:', err);
        this.error = 'Erreur lors du chargement du formulaire de paiement';
        this.loading = false;
      }
    },
    methods: {
      async handlePayment() {
        this.processing = true;
        this.error = null;
  
        try {
          await stripeService.confirmPayment(
            this.elements,
            `${window.location.origin}/payment-success`
          );
        } catch (err) {
          console.error('Payment error:', err);
          this.error = err.message || 'Erreur lors du paiement';
        } finally {
          this.processing = false;
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .payment-form {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
  }
  
  .payment-summary {
    background: #f8f9fa;
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  .payment-summary p {
    margin: 8px 0;
  }
  
  .payment-summary .total {
    font-weight: bold;
    font-size: 1.2em;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 2px solid #dee2e6;
  }
  
  #payment-element {
    margin: 20px 0;
  }
  
  .pay-button {
    width: 100%;
    padding: 15px;
    background: #8B5CF6;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s;
  }
  
  .pay-button:hover:not(:disabled) {
    background: #7C3AED;
  }
  
  .pay-button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  .loading,
  .error {
    padding: 15px;
    text-align: center;
    border-radius: 8px;
  }
  
  .loading {
    background: #e3f2fd;
    color: #1976d2;
  }
  
  .error {
    background: #ffebee;
    color: #c62828;
    margin-top: 15px;
  }
  </style>