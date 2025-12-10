<script setup>
import { ref, computed } from 'vue'

const starRating = ref(0)
const hoverRating = ref(0)
const npsScore = ref(null)
const comments = ref('')
const isSaving = ref(false)
const successMessage = ref('')

const setStarRating = (rating) => {
  starRating.value = rating
}

const setNpsScore = (score) => {
  npsScore.value = score
}

const npsScores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const npsCategory = computed(() => {
  if (!npsScore.value) return ''
  if (npsScore.value <= 6) return 'Détracteur'
  if (npsScore.value <= 8) return 'Passif'
  return 'Promoteur'
})

const npsCategoryClass = computed(() => {
  if (!npsScore.value) return ''
  if (npsScore.value <= 6) return 'detractor'
  if (npsScore.value <= 8) return 'passive'
  return 'promoter'
})

const submitFeedback = async () => {
  if (!starRating.value || !npsScore.value) {
    alert('Veuillez remplir la note par étoiles et le score NPS')
    return
  }

  isSaving.value = true
  successMessage.value = ''

  await new Promise((resolve) => setTimeout(resolve, 1000))

  successMessage.value = 'Merci pour votre avis ! Votre retour a été enregistré avec succès.'
  isSaving.value = false

  setTimeout(() => {
    starRating.value = 0
    npsScore.value = null
    comments.value = ''
    successMessage.value = ''
  }, 3000)
}
</script>

<template>
  <div class="profile-container">
    <div class="profile-wrapper">
      <header class="profile-header">
        <h1>Donnez votre avis</h1>
        <p class="subtitle">
          Votre opinion compte pour améliorer Purple Dog
        </p>
      </header>

      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <div class="profile-content">
        <section class="profile-section">
          <h2>Évaluation globale</h2>
          <div class="form-group">
            <label>Notez votre expérience globale</label>
            <div class="star-rating">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                class="star-button"
                :class="{ active: star <= (hoverRating || starRating) }"
                @click="setStarRating(star)"
                @mouseenter="hoverRating = star"
                @mouseleave="hoverRating = 0"
                :aria-label="`${star} étoile${star > 1 ? 's' : ''}`"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="star-icon"
                >
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                  />
                </svg>
              </button>
            </div>
            <p v-if="starRating" class="rating-text">
              {{ starRating }} étoile{{ starRating > 1 ? 's' : '' }} sur 5
            </p>
          </div>
        </section>

        <section class="profile-section">
          <h2>Score NPS</h2>
          <div class="form-group">
            <label>Sur une échelle de 1 à 10, recommanderiez-vous Purple Dog ?</label>
            <div class="nps-scale">
              <button
                v-for="score in npsScores"
                :key="score"
                type="button"
                class="nps-button"
                :class="{ active: npsScore === score }"
                @click="setNpsScore(score)"
              >
                {{ score }}
              </button>
            </div>
            <div class="nps-labels">
              <span>Pas du tout probable</span>
              <span>Très probable</span>
            </div>
            <p v-if="npsScore" class="nps-category" :class="npsCategoryClass">
              {{ npsCategory }} ({{ npsScore }}/10)
            </p>
          </div>
        </section>

        <section class="profile-section">
          <h2>Commentaires et suggestions</h2>
          <div class="form-group">
            <label for="comments">Partagez vos impressions, suggestions ou remarques</label>
            <textarea
              id="comments"
              v-model="comments"
              rows="8"
              placeholder="Décrivez votre expérience, ce qui vous a plu ou ce qui pourrait être amélioré..."
            ></textarea>
            <p class="character-count">{{ comments.length }} caractères</p>
          </div>
        </section>

        <section class="profile-actions">
          <button class="btn-primary" :disabled="isSaving" @click="submitFeedback">
            {{ isSaving ? 'Envoi en cours...' : 'Envoyer mon avis' }}
          </button>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  min-height: 100vh;
  background-color: #fafafa;
  padding: 0;
}

.profile-wrapper {
  background: white;
  min-height: 100vh;
}

.profile-header {
  padding: 2rem 1.5rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  text-align: center;
}

.profile-header h1 {
  font-size: 1.5rem;
  font-weight: 400;
  margin: 0 0 0.5rem;
  color: #1a1a1a;
  letter-spacing: -0.02em;
}

.subtitle {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 1rem 2rem;
  margin: 0;
  text-align: center;
  border-bottom: 1px solid #c3e6cb;
}

.profile-content {
  padding: 2rem;
}

.profile-section {
  margin-bottom: 3rem;
}

.profile-section:last-of-type {
  margin-bottom: 2rem;
}

.profile-section h2 {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0 0 1.5rem;
  color: #1a1a1a;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  color: #444;
  margin-bottom: 0.5rem;
  font-weight: 500;
  letter-spacing: 0.02em;
}

.star-rating {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
}

.star-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.2s;
}

.star-icon {
  width: 40px;
  height: 40px;
  color: #d0d0d0;
  transition: all 0.2s;
}

.star-button:hover .star-icon,
.star-button.active .star-icon {
  color: #ffc107;
  transform: scale(1.1);
}

.rating-text {
  font-size: 0.95rem;
  color: #666;
  margin-top: 0.5rem;
}

.nps-scale {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  margin: 1rem 0;
}

.nps-button {
  padding: 0.875rem;
  border: 2px solid #d0d0d0;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
  color: #444;
}

.nps-button:hover {
  border-color: #1a1a1a;
  transform: translateY(-2px);
}

.nps-button.active {
  background-color: #1a1a1a;
  border-color: #1a1a1a;
  color: white;
}

.nps-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: #666;
  margin-top: 0.5rem;
}

.nps-category {
  font-size: 0.95rem;
  font-weight: 500;
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  display: inline-block;
}

.nps-category.detractor {
  background-color: #ffeaea;
  color: #c62828;
}

.nps-category.passive {
  background-color: #fff8e1;
  color: #f57c00;
}

.nps-category.promoter {
  background-color: #e8f5e9;
  color: #2e7d32;
}

textarea {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d0d0d0;
  border-radius: 2px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.2s;
  background-color: white;
  resize: vertical;
  line-height: 1.5;
}

textarea:focus {
  outline: none;
  border-color: #1a1a1a;
  box-shadow: 0 0 0 1px #1a1a1a;
}

.character-count {
  font-size: 0.75rem;
  color: #666;
  text-align: right;
  margin-top: 0.25rem;
}

.profile-actions {
  display: flex;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.btn-primary {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 2px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-family: inherit;
  background-color: #1a1a1a;
  color: white;
  flex: 1;
}

.btn-primary:hover:not(:disabled) {
  background-color: #000;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (min-width: 769px) {
  .profile-container {
    padding: 2rem 1rem;
  }

  .profile-wrapper {
    max-width: 900px;
    margin: 0 auto;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .profile-header {
    padding: 3rem 2rem 2rem;
  }

  .profile-header h1 {
    font-size: 2rem;
  }

  .profile-content {
    padding: 2.5rem 2rem;
  }

  .star-icon {
    width: 50px;
    height: 50px;
  }

  .nps-scale {
    grid-template-columns: repeat(10, 1fr);
  }

  .profile-actions {
    flex-direction: row;
  }

  .btn-primary {
    width: auto;
  }
}
</style>
