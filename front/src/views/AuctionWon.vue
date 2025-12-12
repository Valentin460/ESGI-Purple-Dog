<template>
    <div class="auction-won">
      <h1>Félicitations ! Vous avez remporté l'enchère</h1>
      
      <div class="item-info">
        <h2>{{ item.name }}</h2>
        <p>Prix final : {{ item.finalPrice }}€</p>
      </div>
  
      <PaymentForm 
        :amount="item.finalPrice"
        :itemId="item.id"
        itemType="auction"
      />
    </div>
  </template>
  
  <script>
  import PaymentForm from '@/components/PaymentForm.vue';
  
  export default {
    name: 'AuctionWon',
    components: {
      PaymentForm
    },
    data() {
      return {
        item: {
          id: 1,
          name: 'Montre Rolex Submariner Vintage 1960',
          finalPrice: 6500
        }
      };
    }
  };
  </script>