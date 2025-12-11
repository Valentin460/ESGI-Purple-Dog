<script setup>
import { ref } from 'vue'
import { useForgotPassword } from '../composables/useForgotPassword'

const { 
  email, 
  showModal, 
  isLoading, 
  errorMessage, 
  successMessage, 
  resetStep, 
  requestPasswordReset, 
  resetPassword, 
  openModal, 
  closeModal 
} = useForgotPassword()

const resetCode = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const handleRequestReset = async () => {
  if (!email.value) {
    return
  }
  await requestPasswordReset(email.value)
}

const handleResetPassword = async () => {
  if (!resetCode.value || !newPassword.value || !confirmPassword.value) {
    return
  }
  const success = await resetPassword(resetCode.value, newPassword.value, confirmPassword.value)
  if (success) {
    setTimeout(() => {
      closeModal()
    }, 2000)
  }
}

const goBackToStep1 = () => {
  resetCode.value = ''
  newPassword.value = ''
  confirmPassword.value = ''
  email.value = ''
  resetStep.value = 1
  errorMessage.value = ''
  successMessage.value = ''
}

defineExpose({
  openModal,
  closeModal,
})
</script>

<template>
  <!-- Modale Mot de passe oublié -->
  <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
      <!-- Étape 1: Demande email -->
      <div v-if="resetStep === 1" class="space-y-6">
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Mot de passe oublié</h2>
          <p class="text-gray-600 text-sm">Entrez votre email pour recevoir un lien de réinitialisation</p>
        </div>

        <div class="space-y-4">
          <div>
            <label for="reset-email" class="block font-medium text-gray-700 mb-2">Adresse email :</label>
            <input
              id="reset-email"
              v-model.trim="email"
              type="email"
              placeholder="votre@email.com"
              class="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
          </div>

          <p v-if="errorMessage" class="text-red-600 text-sm bg-red-50 p-3 rounded">
            {{ errorMessage }}
          </p>
        </div>

        <div class="flex gap-3">
          <button
            type="button"
            @click="closeModal"
            class="flex-1 border border-gray-300 text-gray-700 font-semibold py-2 rounded hover:bg-gray-50 transition"
          >
            Annuler
          </button>
          <button
            type="button"
            @click="handleRequestReset"
            :disabled="!email || isLoading"
            class="flex-1 bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">Envoi...</span>
            <span v-else>Envoyer le lien</span>
          </button>
        </div>
      </div>

      <!-- Étape 2: Entrer le code et nouveau mdp -->
      <div v-if="resetStep === 2" class="space-y-6">
        <div class="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h2 class="text-2xl font-bold text-gray-800 mb-2">Email envoyé !</h2>
          <p class="text-gray-600 text-sm">Vérifiez votre boîte mail et entrez le code reçu</p>
        </div>

        <div class="space-y-4">
          <div>
            <label for="reset-code" class="block font-medium text-gray-700 mb-2">Code de réinitialisation :</label>
            <input
              id="reset-code"
              v-model.trim="resetCode"
              type="text"
              placeholder="Ex: ABC123DEF456"
              class="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
          </div>

          <div>
            <label for="new-password" class="block font-medium text-gray-700 mb-2">Nouveau mot de passe :</label>
            <input
              id="new-password"
              v-model="newPassword"
              type="password"
              placeholder="Minimum 8 caractères"
              class="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
          </div>

          <div>
            <label for="confirm-password" class="block font-medium text-gray-700 mb-2">Confirmer le mot de passe :</label>
            <input
              id="confirm-password"
              v-model="confirmPassword"
              type="password"
              placeholder="Confirmez votre mot de passe"
              class="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
          </div>

          <p v-if="errorMessage" class="text-red-600 text-sm bg-red-50 p-3 rounded">
            {{ errorMessage }}
          </p>

          <p v-if="successMessage" class="text-green-600 text-sm bg-green-50 p-3 rounded">
            {{ successMessage }}
          </p>
        </div>

        <div class="flex gap-3">
          <button
            type="button"
            @click="goBackToStep1"
            class="flex-1 border border-gray-300 text-gray-700 font-semibold py-2 rounded hover:bg-gray-50 transition"
          >
            Retour
          </button>
          <button
            type="button"
            @click="handleResetPassword"
            :disabled="!resetCode || !newPassword || !confirmPassword || isLoading"
            class="flex-1 bg-indigo-600 text-white font-semibold py-2 rounded hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading">Réinitialisation...</span>
            <span v-else>Réinitialiser</span>
          </button>
        </div>
      </div>

      <!-- Étape 3: Succès -->
      <div v-if="resetStep === 3" class="text-center space-y-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-2xl font-bold text-gray-800">Succès !</h2>
        <p class="text-gray-600">Votre mot de passe a été réinitialisé avec succès.</p>
        <p class="text-sm text-gray-500">Redirection en cours...</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
