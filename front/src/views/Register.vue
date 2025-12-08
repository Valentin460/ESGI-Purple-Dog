<script lang="ts" setup>
import { ref } from 'vue';

const user = ref({
  firstname: '',
  lastname: '',
  phone: '',
  email: '',
  password: '',
});

const onSubmit = () => {
  alert('Formulaire soumis avec succès !');
  user.value={
  firstname: '',
  lastname: '',
  phone: '',
  email: '',
  password: '',
}
};

</script>

<template>
  <div>
    <h1 class="text-center font-bold text-4xl bg-linear-to-t from-green-950 to-indigo-600 bg-clip-text text-transparent">
      Créer votre espace membre
    </h1>
  </div>
  <div class="flex flex-wrap p-2 items-center ">
    <form class="inputChamps" @submit.prevent="onSubmit()"> 
      <div>
        <div class="grid grid-cols-2 gap-4 p-2">
          <label for="firstname">Prénom :</label>
          <input id="firstname" v-model.trim="user.firstname" type="text" required placeholder="Votre prénom">
        </div>
        <div class="grid grid-cols-2 gap-4 p-2">
          <label for="lastname">Nom de famille :</label>
          <input id="lastname" v-model.trim="user.lastname" type="text" required placeholder="Votre nom de famille">
        </div>
        <div class="grid grid-cols-2 gap-4 p-2">
          <label for="phone">Téléphone :</label>
          <input id="phone" v-model.number.trim="user.phone" type="text" required placeholder="Votre téléphone">
        </div>
        <div class="grid grid-cols-2 gap-4 p-2">
          <label for="email">Email :</label>
          <input id="email" v-model.trim="user.email" type="email" required placeholder="Votre mail">
        </div>
        <div class="grid grid-cols-2 gap-4 p-2">
          <label for="password">Mot de passe :</label>
          <input id="password" v-model.trim="user.password" type="password" required placeholder="Votre mot de passe">
        </div>
        <div>
          <input type="checkbox" required> <p>En cochant cette case, vous acceptez nos conditions.</p>
        </div>
        <div>
          <input type="submit" value="Valider">
        </div>
        <div>
          <NuxtLink to="/auth/login" class="hover:text-blue-700 text-blue-800 font-bold transition">
            <i><u>Vous avez déjà un compte ?</u></i>
          </NuxtLink>
        </div>
      </div>
    </form>
  </div>
</template>

<style>
</style>