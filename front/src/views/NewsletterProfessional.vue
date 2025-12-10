<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const acceptRGPD = ref(false)
const subscribed = ref(false)
const emailError = ref('')
const rgpdError = ref('')

const onSubscribe = () => {
  emailError.value = ''
  rgpdError.value = ''

  if (!email.value) {
    emailError.value = 'Veuillez entrer votre email'
    return
  }

  if (!acceptRGPD.value) {
    rgpdError.value = 'Vous devez accepter la politique de confidentialité'
    return
  }

  alert('Merci ! Un email de confirmation a été envoyé à ' + email.value)
  email.value = ''
  acceptRGPD.value = false
  subscribed.value = true
  setTimeout(() => {
    router.push('/pro/rgpd')
  }, 1500)
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold mb-2">Newsletter Professionnels</h1>
        <p class="text-gray-600">Restez informé des actualités et opportunités exclusives</p>
      </div>
      
      <form class="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md" @submit.prevent="onSubscribe">
        <div v-if="subscribed" class="p-4 bg-green-50 border border-green-200 rounded text-green-700">
          ✓ Inscription réussie !
        </div>

        <div>
          <label for="email" class="block font-medium mb-2">Adresse email professionnelle :</label>
          <input 
            id="email" 
            v-model.trim="email" 
            type="email" 
            required 
            placeholder="votre@email.com" 
            class="w-full border border-gray-300 rounded px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
          <p v-if="emailError" class="text-red-600 text-sm mt-2">{{ emailError }}</p>
        </div>

        <div class="flex items-start gap-3 bg-gray-50 p-4 rounded border border-gray-200">
          <input 
            id="accept-rgpd"
            v-model="acceptRGPD" 
            type="checkbox" 
            required 
            class="w-5 h-5 mt-1 accent-indigo-600"
          >
          <div class="flex-1">
            <label for="accept-rgpd" class="text-sm text-gray-600">
              J'accepte la <RouterLink to="/pro/rgpd" target="_blank" class="text-blue-800 hover:underline">politique de confidentialité</RouterLink> et de recevoir des communications de Purple Dog
            </label>
            <p v-if="rgpdError" class="text-red-600 text-sm mt-2">{{ rgpdError }}</p>
          </div>
        </div>

        <button type="submit" class="w-full bg-indigo-600 text-white font-semibold py-3 rounded hover:bg-indigo-700 transition cursor-pointer">
          Continuer vers RGPD
        </button>

        <div class="text-center pt-4">
          <RouterLink to="/pro/mandat" class="text-blue-800 hover:text-blue-700 font-semibold">
            ← Retour au mandat
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
</style>
