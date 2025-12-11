<template>
  <div class="payment-success">
    <div class="success-icon">✅</div>
    <h1>Paiement réussi !</h1>
    <p>Votre paiement a été traité avec succès.</p>
    <p>Vous allez recevoir un email de confirmation.</p>
    
    <div class="next-steps">
      <h3>Prochaines étapes :</h3>
      <ul>
        <li>📧 Vérifiez votre email pour la confirmation</li>
        <li>📦 Le vendeur sera notifié de votre paiement</li>
        <li>🚚 Vous recevrez les détails de livraison sous 24h</li>
      </ul>
    </div>

    <div class="actions">
      <router-link to="/my-purchases" class="button primary">
        Voir mes achats
      </router-link>
      <router-link to="/" class="button secondary">
        Retour à l'accueil
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentSuccess',
  mounted() {
    // Optionnel : Vérifier le statut du payment via l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const paymentIntent = urlParams.get('payment_intent');
    
    if (paymentIntent) {
      console.log('Payment Intent:', paymentIntent);
      // TODO: Appeler le backend pour confirmer
      // this.confirmPayment(paymentIntent);
    }
  }
};
</script>

<style scoped>
.payment-success {
  max-width: 600px;
  margin: 50px auto;
  padding: 40px;
  text-align: center;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.success-icon {
  font-size: 80px;
  margin-bottom: 20px;
}

h1 {
  color: #22c55e;
  margin-bottom: 15px;
}

.next-steps {
  margin: 30px 0;
  text-align: left;
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
}

.next-steps h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.next-steps ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.next-steps li {
  padding: 8px 0;
  color: #666;
}

.actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
}

.button {
  padding: 15px 30px;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  transition: all 0.3s;
}

.button.primary {
  background: #8B5CF6;
  color: white;
}

.button.primary:hover {
  background: #7C3AED;
}

.button.secondary {
  background: #e5e7eb;
  color: #374151;
}

.button.secondary:hover {
  background: #d1d5db;
}
</style>