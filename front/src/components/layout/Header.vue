<template>
  <header class="header">
    <nav class="flex gap-6 text-center">
      <RouterLink to="/" class="hover:text-green-700 transition">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
          <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
          <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
        </svg>
      </RouterLink>

      <template v-if="isAuthenticated">
        <RouterLink to="/profile/userProfile" class="hover:text-green-700 transition">
          Bienvenue, {{ user.name }}
        </RouterLink>
        <RouterLink to="/auth/logout" class="hover:text-green-700 transition">Déconnexion</RouterLink>
      </template>

      <template v-else>
        <RouterLink to="/auth/login" class="hover:text-green-700 transition">Connexion</RouterLink>
        <RouterLink to="/auth/register" class="hover:text-green-700 transition">Inscription</RouterLink>
      </template>

      <RouterLink to="/categories" class="hover:text-green-700 transition">Categories d'art</RouterLink>
    </nav>
  </header>
</template>

<script setup>
import { ref } from 'vue'

// Composable simplifié pour l'authentification
const isAuthenticated = ref(false)
const user = ref({
  name: 'Utilisateur'
})

// TODO: Remplacer par votre composable useAuth réel
// import { useAuth } from '@/composables/useAuth';
// const { isAuthenticated, user } = useAuth();
</script>
