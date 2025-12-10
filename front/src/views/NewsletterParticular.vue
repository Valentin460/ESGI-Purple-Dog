<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const subscribed = ref(false)
const emailError = ref('')

const onSubscribe = () => {
  emailError.value = ''

  if (!email.value) {
    emailError.value = 'Veuillez entrer votre email'
    return
  }

  alert('Merci ! Un email de confirmation a été envoyé à ' + email.value)
  email.value = ''
  subscribed.value = true
  setTimeout(() => {
    router.push('/rgpd')
  }, 1500)
}
</script>

<template>
  <div class="newsletter-shell">
    <div class="card-narrow">
      <div class="title-center">
        <h1 class="title-xl">Newsletter Particuliers</h1>
        <p class="subtitle-muted">Recevez les meilleures sélections d'œuvres d'art</p>
      </div>
      
      <form class="newsletter-card" @submit.prevent="onSubscribe">
        <div v-if="subscribed" class="notice-success">
          ✓ Inscription réussie !
        </div>

        <div>
          <label for="email" class="field-label">Adresse email :</label>
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

        <div class="card-muted stack-gap-3">
          <div class="checkbox-line">
            <input 
              id="newsletter-interest"
              type="checkbox" 
              class="checkbox-input"
            >
            <label for="newsletter-interest" class="text-muted-sm">
              Je souhaite recevoir les actualités et les sélections d'œuvres d'art
            </label>
          </div>

          <div class="checkbox-line">
            <input 
              id="newsletter-offers"
              type="checkbox" 
              class="checkbox-input"
            >
            <label for="newsletter-offers" class="text-muted-sm">
              Je souhaite recevoir les offres spéciales et promotions
            </label>
          </div>

          <div class="checkbox-line">
            <input 
              id="newsletter-rgpd"
              type="checkbox" 
              required
              class="checkbox-input"
            >
            <label for="newsletter-rgpd" class="text-muted-sm">
              J'accepte la <RouterLink to="/rgpd" target="_blank" class="link-underline-strong">politique de confidentialité</RouterLink>
            </label>
          </div>
        </div>

        <button type="submit" class="cta-secondary">
          Continuer vers RGPD
        </button>

        <div class="footer-center">
          <RouterLink to="/" class="link-strong">
            ← Retour à l'accueil
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
</style>
