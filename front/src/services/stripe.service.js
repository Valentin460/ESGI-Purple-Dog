import { loadStripe } from '@stripe/stripe-js';

class StripeService {
  constructor() {
    this.stripe = null;
  }

  async initialize() {
    if (this.stripe) return this.stripe;

    // Récupérer la clé publique
    const response = await fetch('http://localhost:3000/api/stripe/config');
    const data = await response.json();
    
    this.stripe = await loadStripe(data.data.publishableKey);
    return this.stripe;
  }

  async createPaymentIntent(amount, itemId) {
    const token = localStorage.getItem('token');
    
    const response = await fetch('http://localhost:3000/api/stripe/payment-intent', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount, itemId, itemType: 'auction' })
    });
    
    return (await response.json()).data;
  }

  async confirmPayment(elements, returnUrl) {
    return await this.stripe.confirmPayment({
      elements,
      confirmParams: { return_url: returnUrl }
    });
  }
}

export default new StripeService();