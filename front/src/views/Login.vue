<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const formData = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')
const showPassword = ref(false)
const showRegisterModal = ref(false)

const emailError = ref('')
const passwordError = ref('')

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!formData.email) {
    emailError.value = 'L\'email est requis'
    return false
  }
  if (!emailRegex.test(formData.email)) {
    emailError.value = 'Email invalide'
    return false
  }
  emailError.value = ''
  return true
}

const validatePassword = () => {
  if (!formData.password) {
    passwordError.value = 'Le mot de passe est requis'
    return false
  }
  if (formData.password.length < 6) {
    passwordError.value = 'Le mot de passe doit contenir au moins 6 caractères'
    return false
  }
  passwordError.value = ''
  return true
}

const validateForm = () => {
  const isEmailValid = validateEmail()
  const isPasswordValid = validatePassword()
  return isEmailValid && isPasswordValid
}

const onSubmit = async () => {
  error.value = ''
  
  if (!validateForm()) {
    return
  }

  loading.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    router.push('/profile/userProfile')
  } catch (err) {
    error.value = 'Identifiants incorrects. Veuillez réessayer.'
    console.error('Erreur de connexion:', err)
  } finally {
    loading.value = false
  }
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-20 px-4">
    <div class="w-full max-w-md">
      <!-- Titre -->
      <h1 class="mb-8 text-center font-bold text-4xl bg-gradient-to-b from-green-950 to-indigo-600 bg-clip-text text-transparent">
        Connexion
      </h1>

      <!-- Message d'erreur général -->
      <div v-if="error" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {{ error }}
      </div>

      <!-- Formulaire -->
      <form @submit.prevent="onSubmit" class="bg-white p-8 rounded-2xl shadow-lg space-y-6">
        
        <!-- Champ Email -->
        <div>
          <label for="email" class="block text-gray-800 font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            v-model="formData.email"
            type="email"
            placeholder="exemple@email.com"
            class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 transition-all"
            :class="emailError ? 'border-red-500' : ''"
            @blur="validateEmail"
            @input="emailError = ''"
          />
          <p v-if="emailError" class="mt-1 text-sm text-red-600">
            {{ emailError }}
          </p>
        </div>

        <!-- Champ Mot de passe -->
        <div>
          <label for="password" class="block text-gray-800 font-medium mb-2">
            Mot de passe
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              class="w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 transition-all"
              :class="passwordError ? 'border-red-500' : ''"
              @blur="validatePassword"
              @input="passwordError = ''"
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              :aria-label="showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'"
            >
              <svg v-if="!showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd" />
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
              </svg>
            </button>
          </div>
          <p v-if="passwordError" class="mt-1 text-sm text-red-600">
            {{ passwordError }}
          </p>
        </div>

        <!-- Mot de passe oublié -->
        <div class="text-right text-sm text-indigo-600 hover:text-indigo-800 transition-colors">
          <RouterLink to="/forgot-password">
            Mot de passe oublié ?
          </RouterLink>
        </div>

        <!-- Bouton de soumission -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-gradient-to-r from-green-950 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span v-if="!loading">Se connecter</span>
          <span v-else class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connexion en cours...
          </span>
        </button>

        <!-- Lien vers l'inscription -->
        <div class="text-center pt-4 border-t border-gray-200 text-gray-600 text-sm">
          Pas encore de compte ?
          <button type="button" class="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors" @click="showRegisterModal = true">S'inscrire</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal choix inscription -->
  <div v-if="showRegisterModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="showRegisterModal = false">
    <div class="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl" @click.stop>
      <h2 class="text-3xl font-bold text-center mb-6">Choisissez votre profil</h2>
      <p class="text-gray-600 text-center mb-8">Sélectionnez le type de compte que vous souhaitez créer</p>
      
      <div class="space-y-4">
        <RouterLink 
          to="/auth/register/particulier" 
          @click="showRegisterModal = false"
          class="block w-full p-6 border-2 border-gray-300 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition text-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mx-auto mb-3 text-gray-700">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <h3 class="text-xl font-semibold mb-2 text-gray-900">Particulier</h3>
          <p class="text-sm text-gray-600">Créer un compte personnel pour acheter des œuvres d'art</p>
        </RouterLink>

        <RouterLink 
          to="/auth/register/professionnel" 
          @click="showRegisterModal = false"
          class="block w-full p-6 border-2 border-gray-300 rounded-lg hover:border-indigo-600 hover:bg-indigo-50 transition text-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12 mx-auto mb-3 text-gray-700">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
          </svg>
          <h3 class="text-xl font-semibold mb-2 text-gray-900">Professionnel</h3>
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
