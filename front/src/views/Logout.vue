<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="text-center p-8 bg-white rounded-lg shadow-lg">
      <div class="mb-4">
        <svg class="animate-spin h-12 w-12 mx-auto text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <h1 class="text-2xl font-bold text-gray-800 mb-2">Déconnexion en cours...</h1>
      <p class="text-gray-600">Vous allez être redirigé dans un instant</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import authService from '@/services/auth.service'

const router = useRouter()

onMounted(async () => {
  try {
    // Appeler la méthode de déconnexion
    await authService.logout()

    // Attendre un court instant pour que l'événement se propage
    setTimeout(() => {
      // Rediriger vers la page de connexion
      router.push('/auth/login')
    }, 500)
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
    // Rediriger quand même vers la page de connexion
    router.push('/auth/login')
  }
})
</script>

<style scoped>
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
