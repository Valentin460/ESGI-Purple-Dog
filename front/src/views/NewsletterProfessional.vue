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
  <div class="newsletter-shell">
    <div class="card-narrow">
      <div class="title-center">
        <h1 class="title-xl">Newsletter Professionnels</h1>
        <p class="subtitle-muted">Restez informé des actualités et opportunités exclusives</p>
      </div>
      
      <form class="newsletter-card" @submit.prevent="onSubscribe">
        <div v-if="subscribed" class="notice-success">
          ✓ Inscription réussie !
        </div>

        <div>
          <label for="email" class="field-label">Adresse email professionnelle :</label>
          <input 
            id="email" 
            v-model.trim="email" 
            type="email" 
            required 
            placeholder="votre@email.com" 
            class="field-input"
          >
          <p v-if="emailError" class="field-error">{{ emailError }}</p>
        </div>

        <div class="card-muted row-start">
          <input 
            id="accept-rgpd"
            v-model="acceptRGPD" 
            type="checkbox" 
            required 
            class="checkbox-input"
          >
          <div class="flex-grow-1">
            <label for="accept-rgpd" class="text-muted-sm">
              J'accepte la <RouterLink to="/pro/rgpd" target="_blank" class="link-underline">politique de confidentialité</RouterLink> et de recevoir des communications de Purple Dog
            </label>
            <p v-if="rgpdError" class="field-error">{{ rgpdError }}</p>
          </div>
        </div>

        <button type="submit" class="cta-secondary">
          Continuer vers RGPD
        </button>

        <div class="footer-center">
          <RouterLink to="/pro/mandat" class="link-strong">
            ← Retour au mandat
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
</style>
