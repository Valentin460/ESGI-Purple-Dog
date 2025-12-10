<template>
  <header class="header">
    <!-- Barre de recherche à gauche -->
    <form
      class="form-seach"
      @submit.prevent="onSearch"
    >
      <label for="header-search" class="sr-only">Rechercher</label>
      <input
        id="header-search"
        v-model="query"
        type="search"
        placeholder="Rechercher"
        class="form-inputSearch"
      />
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
    </form>

    <!-- Logo au centre -->
    

    <!-- Navigation à droite -->
    <nav class="flex gap-6 items-center">
      <template v-if="isAuthenticated">
        <RouterLink to="/profile/userProfile" class="hover:text-green-700 transition">
          {{ user.name }}
        </RouterLink>
      </template>

      <template v-else>
        <RouterLink to="/auth/login" class="hover:text-black transition">Se connecter</RouterLink>
        <button @click="showRegisterModal = true" class="hover:text-black transition">S'inscrire</button>
      </template>

      <!-- Icônes -->
      <button class="hover:text-gray-600 transition" aria-label="Langue">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 0 0 8.716-6.747M12 21a9.004 9.004 0 0 1-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 0 1 7.843 4.582M12 3a8.997 8.997 0 0 0-7.843 4.582m15.686 0A11.953 11.953 0 0 1 12 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0 1 21 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0 1 12 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 0 1 3 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      </button>
      
      <div class="relative group">
        <RouterLink to="/favorites" class="favoris " aria-label="Favoris">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
          </svg>
        </RouterLink>
        
        <!-- Popup au survol -->
        <div class="absolute right-0 top-full mt-4 w-80 bg-white shadow-xl rounded-lg p-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <div class="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto mb-4 text-gray-700">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
            </svg>
            <h3 class="text-2xl font-serif mb-3">Quelque chose vous plaît ?</h3>
            <p class="text-gray-600 text-sm mb-6 leading-relaxed">
              Enregistrez les articles que vous aimez pour rester informé de leur disponibilité ! Cliquez sur l'icône en forme de cœur située juste à côté.
            </p>
            <div class="border-t border-gray-200 pt-4 mb-4"></div>
            <h4 class="font-semibold mb-2">Ne manquez rien</h4>
            <p class="text-gray-600 text-sm mb-4">
              Suivez les catégories, vendeurs et décorateurs d'intérieur pour connaître les nouveautés !
            </p>
            <RouterLink to="/categories" class="text-sm underline hover:text-gray-600">
              En savoir plus
            </RouterLink>
          </div>
        </div>
      </div>
      
      <RouterLink to="/cart" class="hover:text-gray-600 transition" aria-label="Panier">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
        </svg>
      </RouterLink>
    </nav>
  </header>

  <!-- Menu secondaire -->
  <nav class="nav-bar">
    <div class="flex gap-8 justify-center text-sm font-medium">
      <RouterLink to="/nouveautes" class="router-nav">Aux enchères</RouterLink>
      <RouterLink to="/mobilier" class="router-nav">Catégories</RouterLink>
      <RouterLink to="/luminaires" class="router-nav">LUMINAIRES</RouterLink>
      <RouterLink to="/categories" class="router-nav">CATÉGORIES</RouterLink>
      <RouterLink to="/joaillerie" class="router-nav">JOAILLERIE</RouterLink>
      <RouterLink to="/montres" class="router-nav">MONTRES</RouterLink>
      <RouterLink to="/mode" class="router-nav">MODE</RouterLink>
    </div>
  </nav>

  <!-- Modal choix inscription -->
  <div v-if="showRegisterModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-100" @click="showRegisterModal = false">
    <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl" @click.stop>
      <h2 class="text-3xl font-bold text-center mb-6">Choisissez votre profil</h2>
      <p class="text-gray-600 text-center mb-8">Sélectionnez le type de compte que vous souhaitez créer</p>
      
      <div class="space-y-4">
        <RouterLink 
          to="/auth/register/particulier" 
          @click="showRegisterModal = false"
          class="block w-full p-6 border-2 border-gray-300 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition text-center group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mx-auto mb-3 text-gray-700 group-hover:text-indigo-600">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <h3 class="text-xl font-semibold mb-2 group-hover:text-indigo-600">Particulier</h3>
          <p class="text-sm text-gray-600">Créer un compte personnel pour acheter des œuvres d'art</p>
        </RouterLink>

        <RouterLink 
          to="/auth/register/professionnel" 
          @click="showRegisterModal = false"
          class="block w-full p-6 border-2 border-gray-300 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition text-center group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mx-auto mb-3 text-gray-700 group-hover:text-indigo-600">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
          </svg>
          <h3 class="text-xl font-semibold mb-2 group-hover:text-indigo-600">Professionnel</h3>
          <p class="text-sm text-gray-600">Créer un compte professionnel avec SIRET</p>
        </RouterLink>
      </div>

      <button 
        @click="showRegisterModal = false" 
        class="mt-6 w-full py-2 text-gray-600 hover:text-gray-900 transition"
      >
        Annuler
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isAuthenticated = ref(false)
const user = ref({
  name: 'Utilisateur'
})

const showRegisterModal = ref(false)

const query = ref('')

const onSearch = () => {
  console.log('Recherche depuis le header :', query.value)
}
</script>
