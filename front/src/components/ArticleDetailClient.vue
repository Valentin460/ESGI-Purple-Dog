<template>
  <div class="article-client-page">
    <div class="article-client-container">
      <!-- Breadcrumb / Navigation -->
      <div class="breadcrumb">
        <button @click="$emit('retour')" class="btn-retour">
          <ChevronLeft :size="20" />
          Retour aux annonces
        </button>
      </div>

      <div class="article-layout">
        <!-- Galerie photos - Gauche -->
        <div class="gallery-section">
          <div class="main-image-wrapper" @click="openLightbox">
            <img :src="currentPhoto" :alt="article.nom" class="main-image" />
            <button class="btn-zoom">
              <ZoomIn :size="20" />
              Agrandir
            </button>
            <div class="photo-counter">
              {{ currentPhotoIndex + 1 }} / {{ article.photos.length }}
            </div>
          </div>

          <div class="thumbnails-section">
            <button v-if="currentPhotoIndex > 0" @click="prevPhoto" class="thumbnail-nav prev">
              <ChevronLeft :size="20" />
            </button>

            <div class="thumbnails-scroll">
              <div v-for="(photo, index) in article.photos" :key="index" class="thumbnail"
                :class="{ active: index === currentPhotoIndex }" @click="currentPhotoIndex = index">
                <img :src="photo.preview" :alt="`Photo ${index + 1}`" />
              </div>
            </div>

            <button v-if="currentPhotoIndex < article.photos.length - 1" @click="nextPhoto" class="thumbnail-nav next">
              <ChevronRight :size="20" />
            </button>
          </div>
        </div>

        <!-- Informations - Droite -->
        <div class="info-section">
          <!-- En-tête avec favoris -->
          <div class="article-header">
            <div>
              <span class="category-tag">{{ article.categorie }}</span>
              <h1 class="article-title">{{ article.nom }}</h1>
            </div>
            <button @click="toggleFavoris" class="btn-favoris" :class="{ active: isFavoris }">
              <Heart :size="24" :fill="isFavoris ? 'currentColor' : 'none'" />
            </button>
          </div>

          <!-- Prix et enchère -->
          <div class="price-section">
            <div v-if="article.typeVente === 'enchere'" class="enchere-section">
              <div class="current-price">
                <span class="price-label">Enchère actuelle</span>
                <span class="price-amount">{{ formatPrice(enchereActuelle) }}</span>
              </div>

              <div class="enchere-info">
                <div class="info-item">
                  <Gavel :size="18" />
                  <span>{{ article.nombreOffres || 0 }} offre(s)</span>
                </div>
                <div class="info-item">
                  <Users :size="18" />
                  <span>{{ article.nombreParticipants || 0 }} participant(s)</span>
                </div>
              </div>

              <!-- Chronomètre -->
              <div class="countdown-section">
                <div class="countdown-header">
                  <Clock :size="18" />
                  <span>Temps restant</span>
                </div>
                <div class="countdown-timer">
                  <div class="time-block">
                    <span class="time-value">{{ countdown.jours }}</span>
                    <span class="time-label">jours</span>
                  </div>
                  <span class="time-separator">:</span>
                  <div class="time-block">
                    <span class="time-value">{{ countdown.heures }}</span>
                    <span class="time-label">heures</span>
                  </div>
                  <span class="time-separator">:</span>
                  <div class="time-block">
                    <span class="time-value">{{ countdown.minutes }}</span>
                    <span class="time-label">min</span>
                  </div>
                  <span class="time-separator">:</span>
                  <div class="time-block">
                    <span class="time-value">{{ countdown.secondes }}</span>
                    <span class="time-label">sec</span>
                  </div>
                </div>
              </div>

              <!-- Formulaire enchère -->
              <div class="bid-form">
                <label>Vos enchères</label>

                <!-- Boutons d'enchères rapides -->
                <div class="quick-bid-buttons">
                  <button v-for="palier in paliersRapides" :key="palier" @click="montantOffre = palier"
                    class="btn-quick-bid" :class="{ active: montantOffre === palier }">
                    {{ formatPrice(palier) }}
                  </button>
                </div>

                <div class="bid-input-group">
                  <input v-model.number="montantOffre" type="number" :min="enchereMinimale" :step="palierEnchere"
                    class="bid-input" placeholder="Ou entrez votre offre" />
                  <span class="currency">€</span>
                </div>

                <!-- Enchère automatique -->
                <div class="auto-bid-section">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="enchereAutomatique" />
                    Enchère automatique jusqu'à {{ formatPrice(montantOffre || enchereMinimale) }}
                  </label>
                  <p class="auto-bid-info">
                    <AlertCircle :size="16" />
                    Nous enchérirons automatiquement par paliers de {{ formatPrice(palierEnchere) }} pour vous maintenir
                    en tête
                  </p>
                </div>

                <p class="bid-hint">Enchère minimale : {{ formatPrice(enchereMinimale) }} (palier : {{
                  formatPrice(palierEnchere) }})</p>
                <p v-if="montantOffre && montantOffre < enchereMinimale" class="error-hint">
                  ⚠️ Votre offre doit être au minimum {{ formatPrice(enchereMinimale) }}
                </p>
                <button @click="ouvrirModalEnchere" class="btn-bid" :disabled="!montantOffreValide">
                  <Gavel :size="20" />
                  {{ enchereAutomatique ? 'Placer une enchère automatique' : 'Placer une offre' }}
                </button>
              </div>
            </div>

            <!-- Vente rapide -->
            <div v-else class="vente-rapide-section">
              <div class="current-price">
                <span class="price-label">Prix</span>
                <span class="price-amount">{{ formatPrice(article.prix) }}</span>
              </div>

              <div class="statut-vente">
                <Package :size="18" />
                <span>{{ article.statut === 'actif' ? 'Disponible' : 'Non disponible' }}</span>
              </div>

              <button @click="acheter" class="btn-acheter" :disabled="article.statut !== 'actif'">
                <ShoppingCart :size="20" />
                Acheter maintenant
              </button>
            </div>
          </div>

          <!-- Bouton message -->
          <button @click="ouvrirMessages" class="btn-message">
            <MessageCircle :size="20" />
            Contacter le vendeur
          </button>

          <!-- Description -->
          <div class="description-section">
            <h3>Description</h3>
            <p class="description-text">{{ article.description }}</p>
          </div>

          <!-- Caractéristiques -->
          <div class="caracteristiques-section">
            <h3>Caractéristiques</h3>
            <div class="carac-list">
              <div class="carac-item">
                <Ruler :size="18" />
                <div>
                  <span class="carac-label">Dimensions</span>
                  <span class="carac-value">
                    {{ article.dimensions.hauteur }} × {{ article.dimensions.largeur }} × {{
                      article.dimensions.profondeur }} cm
                  </span>
                </div>
              </div>
              <div class="carac-item">
                <Weight :size="18" />
                <div>
                  <span class="carac-label">Poids</span>
                  <span class="carac-value">{{ article.poids }} kg</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Informations vendeur -->
          <div class="vendeur-section">
            <h3>Vendeur</h3>
            <div class="vendeur-info">
              <div class="vendeur-avatar">
                <User :size="32" />
              </div>
              <div class="vendeur-details">
                <p class="vendeur-nom">{{ article.vendeur?.nom || 'Vendeur particulier' }}</p>
                <div class="vendeur-stats">
                  <span>
                    <Star :size="14" /> {{ article.vendeur?.note || 4.5 }}/5
                  </span>
                  <span>{{ article.vendeur?.ventes || 12 }} vente(s)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox -->
    <div v-if="lightboxOpen" class="lightbox" @click="closeLightbox">
      <button class="lightbox-close" @click.stop="closeLightbox">
        <X :size="32" />
      </button>
      <button class="lightbox-prev" @click.stop="prevPhoto">
        <ChevronLeft :size="40" />
      </button>
      <button class="lightbox-next" @click.stop="nextPhoto">
        <ChevronRight :size="40" />
      </button>
      <div class="lightbox-content" @click.stop>
        <img :src="currentPhoto" :alt="article.nom" />
        <div class="lightbox-counter">
          {{ currentPhotoIndex + 1 }} / {{ article.photos.length }}
        </div>
      </div>
    </div>

    <!-- Modal Messages -->
    <div v-if="modalMessages" class="modal-overlay" @click="fermerMessages">
      <div class="modal-content modal-messages" @click.stop>
        <div class="modal-header">
          <h2>Contacter le vendeur</h2>
          <button class="modal-close" @click="fermerMessages">
            <X :size="24" />
          </button>
        </div>
        <div class="modal-body">
          <div class="message-form">
            <label>Votre message</label>
            <textarea v-model="messageTexte" placeholder="Posez votre question au vendeur..." rows="6"
              class="message-input"></textarea>
            <p class="message-hint">Le vendeur vous répondra dans les 24 heures</p>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="fermerMessages" class="btn-secondary">Annuler</button>
          <button @click="envoyerMessage" class="btn-primary">
            <Send :size="18" />
            Envoyer
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Enchère - Formulaire complet -->
    <div v-if="modalEnchere" class="modal-overlay" @click="fermerModalEnchere">
      <div class="modal-content modal-enchere" @click.stop>
        <div class="modal-header">
          <h2>Placer une offre</h2>
          <button class="modal-close" @click="fermerModalEnchere">
            <X :size="24" />
          </button>
        </div>
        <div class="modal-body">
          <!-- Étape 1: Récapitulatif offre -->
          <div v-if="etapeEnchere === 1" class="enchere-step">
            <div class="offre-recapitulatif">
              <div class="recap-item">
                <span class="recap-label">Article :</span>
                <span class="recap-value">{{ article.nom }}</span>
              </div>
              <div class="recap-item">
                <span class="recap-label">Enchère actuelle :</span>
                <span class="recap-value">{{ formatPrice(enchereActuelle) }}</span>
              </div>
              <div class="recap-item highlight">
                <span class="recap-label">Votre offre {{ enchereAutomatique ? 'maximale' : '' }} :</span>
                <span class="recap-value">{{ formatPrice(montantOffre) }}</span>
              </div>
              <div v-if="enchereAutomatique" class="recap-item">
                <span class="recap-label">Enchère automatique :</span>
                <span class="recap-value">Activée (palier : {{ formatPrice(palierEnchere) }})</span>
              </div>
            </div>

            <div class="alert-info">
              <AlertCircle :size="20" />
              <div>
                <p class="alert-title">Informations importantes</p>
                <ul class="alert-list">
                  <li>Votre offre doit être supérieure à l'enchère actuelle</li>
                  <li>En cas de victoire, vous serez automatiquement débité du montant de votre offre</li>
                  <li>Le débit sera effectué à la fin de l'enchère si vous êtes le plus offrant</li>
                  <li>Vos informations de paiement et de livraison sont requises</li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Étape 2: Adresse de livraison -->
          <div v-if="etapeEnchere === 2" class="enchere-step">
            <h3 class="step-title">Adresse de livraison</h3>
            <div class="form-grid">
              <div class="form-group full">
                <label>Nom complet *</label>
                <input v-model="formEnchere.nomComplet" type="text" placeholder="Jean Dupont" required />
              </div>
              <div class="form-group full">
                <label>Adresse *</label>
                <input v-model="formEnchere.adresse" type="text" placeholder="123 Rue de la Paix" required />
              </div>
              <div class="form-group">
                <label>Code postal *</label>
                <input v-model="formEnchere.codePostal" type="text" placeholder="75001" required />
              </div>
              <div class="form-group">
                <label>Ville *</label>
                <input v-model="formEnchere.ville" type="text" placeholder="Paris" required />
              </div>
              <div class="form-group full">
                <label>Pays *</label>
                <input v-model="formEnchere.pays" type="text" placeholder="France" required />
              </div>
              <div class="form-group full">
                <label>Téléphone *</label>
                <input v-model="formEnchere.telephone" type="tel" placeholder="06 12 34 56 78" required />
              </div>
            </div>
          </div>

          <!-- Étape 3: Coordonnées bancaires -->
          <div v-if="etapeEnchere === 3" class="enchere-step">
            <h3 class="step-title">Coordonnées bancaires</h3>
            <div class="alert-warning">
              <CreditCard :size="20" />
              <p>Vos informations bancaires sont sécurisées et cryptées. Vous ne serez débité que si vous remportez
                l'enchère.</p>
            </div>
            <div class="form-grid">
              <div class="form-group full">
                <label>Numéro de carte *</label>
                <input v-model="formEnchere.numeroCarte" type="text" placeholder="1234 5678 9012 3456" maxlength="19"
                  required />
              </div>
              <div class="form-group">
                <label>Date d'expiration *</label>
                <input v-model="formEnchere.dateExpiration" type="text" placeholder="MM/AA" maxlength="5" required />
              </div>
              <div class="form-group">
                <label>CVV *</label>
                <input v-model="formEnchere.cvv" type="text" placeholder="123" maxlength="3" required />
              </div>
              <div class="form-group full">
                <label>Nom sur la carte *</label>
                <input v-model="formEnchere.nomCarte" type="text" placeholder="JEAN DUPONT" required />
              </div>
            </div>
          </div>

          <!-- Étape 4: Confirmation finale -->
          <div v-if="etapeEnchere === 4" class="enchere-step">
            <h3 class="step-title">Confirmation de l'offre</h3>

            <div class="confirmation-summary">
              <div class="summary-section">
                <h4>Article</h4>
                <p>{{ article.nom }}</p>
              </div>
              <div class="summary-section">
                <h4>Montant de l'offre</h4>
                <p class="amount-highlight">{{ formatPrice(montantOffre) }}</p>
              </div>
              <div class="summary-section">
                <h4>Adresse de livraison</h4>
                <p>{{ formEnchere.nomComplet }}</p>
                <p>{{ formEnchere.adresse }}</p>
                <p>{{ formEnchere.codePostal }} {{ formEnchere.ville }}</p>
                <p>{{ formEnchere.pays }}</p>
                <p>Tel: {{ formEnchere.telephone }}</p>
              </div>
              <div class="summary-section">
                <h4>Moyen de paiement</h4>
                <p>Carte bancaire se terminant par {{ formEnchere.numeroCarte.slice(-4) }}</p>
              </div>
            </div>

            <div class="alert-danger">
              <AlertTriangle :size="24" />
              <div>
                <p class="alert-title"> IMPORTANT - Engagement de paiement</p>
                <ul class="alert-list">
                  <li><strong>Si vous remportez cette enchère, votre carte bancaire sera automatiquement débitée de {{
                    formatPrice(montantOffre) }}</strong></li>
                  <li>Le débit sera effectué dès la fin de l'enchère si vous êtes le plus offrant</li>
                  <li>En confirmant, vous acceptez ces conditions de débit automatique</li>
                </ul>
              </div>
            </div>

            <div class="checkbox-group">
              <input v-model="confirmationLue" type="checkbox" id="confirmation" />
              <label for="confirmation">
                J'ai lu et j'accepte les conditions. Je comprends que je serai débité automatiquement si je remporte
                l'enchère.
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button v-if="etapeEnchere > 1" @click="etapePrecedente" class="btn-secondary">
            <ChevronLeft :size="18" />
            Précédent
          </button>
          <button @click="fermerModalEnchere" class="btn-secondary">Annuler</button>
          <button v-if="etapeEnchere < 4" @click="etapeSuivante" class="btn-primary" :disabled="!etapeValide">
            Suivant
            <ChevronRight :size="18" />
          </button>
          <button v-else @click="confirmerOffre" class="btn-primary btn-danger" :disabled="!confirmationLue">
            <Gavel :size="18" />
            Confirmer l'offre
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  ChevronLeft,
  ChevronRight,
  Heart,
  ZoomIn,
  X,
  Gavel,
  Users,
  Clock,
  ShoppingCart,
  MessageCircle,
  Ruler,
  Weight,
  User,
  Star,
  Package,
  Send,
  AlertCircle,
  AlertTriangle,
  CreditCard
} from 'lucide-vue-next'

const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['retour', 'acheter', 'placer-offre', 'envoyer-message'])

// État
const currentPhotoIndex = ref(0)
const lightboxOpen = ref(false)
const isFavoris = ref(false)
const modalMessages = ref(false)
const messageTexte = ref('')
const montantOffre = ref(null)
const enchereActuelle = ref(props.article.enchereActuelle || props.article.prixDepart || 0)
const countdown = ref({ jours: 0, heures: 0, minutes: 0, secondes: 0 })
let countdownInterval = null

// État modal enchère
const modalEnchere = ref(false)
const etapeEnchere = ref(1)
const confirmationLue = ref(false)
const enchereAutomatique = ref(false)
const formEnchere = ref({
  nomComplet: '',
  adresse: '',
  codePostal: '',
  ville: '',
  pays: 'France',
  telephone: '',
  numeroCarte: '',
  dateExpiration: '',
  cvv: '',
  nomCarte: ''
})

// Computed
const currentPhoto = computed(() => {
  if (props.article.photos && props.article.photos.length > 0) {
    return props.article.photos[currentPhotoIndex.value].preview
  }
  return ''
})

// Palier d'enchères selon les règles métier
const palierEnchere = computed(() => {
  const prix = enchereActuelle.value
  if (prix < 100) return 10
  if (prix < 500) return 50
  if (prix < 1000) return 100
  if (prix < 5000) return 200
  if (prix < 10000) return 500
  return 1000
})

const enchereMinimale = computed(() => {
  return enchereActuelle.value + palierEnchere.value
})

// Génération des boutons d'enchères rapides (3 paliers au-dessus du minimum)
const paliersRapides = computed(() => {
  const paliers = []
  const min = enchereMinimale.value
  const increment = palierEnchere.value

  for (let i = 0; i < 3; i++) {
    paliers.push(min + (increment * i))
  }

  return paliers
})

const montantOffreValide = computed(() => {
  return montantOffre.value >= enchereMinimale.value
})

const etapeValide = computed(() => {
  if (etapeEnchere.value === 1) return true
  if (etapeEnchere.value === 2) {
    return formEnchere.value.nomComplet &&
      formEnchere.value.adresse &&
      formEnchere.value.codePostal &&
      formEnchere.value.ville &&
      formEnchere.value.pays &&
      formEnchere.value.telephone
  }
  if (etapeEnchere.value === 3) {
    return formEnchere.value.numeroCarte &&
      formEnchere.value.dateExpiration &&
      formEnchere.value.cvv &&
      formEnchere.value.nomCarte
  }
  return true
})

// Méthodes
const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const updateCountdown = () => {
  if (!props.article.dateExpiration) return

  const now = new Date()
  const expiration = new Date(props.article.dateExpiration)
  const diff = expiration - now

  if (diff <= 0) {
    countdown.value = { jours: 0, heures: 0, minutes: 0, secondes: 0 }
    if (countdownInterval) {
      clearInterval(countdownInterval)
    }
    return
  }

  countdown.value = {
    jours: Math.floor(diff / (1000 * 60 * 60 * 24)),
    heures: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    secondes: Math.floor((diff % (1000 * 60)) / 1000)
  }
}

const toggleFavoris = () => {
  isFavoris.value = !isFavoris.value
  // TODO: Appel API pour ajouter/retirer des favoris
}

const nextPhoto = () => {
  if (currentPhotoIndex.value < props.article.photos.length - 1) {
    currentPhotoIndex.value++
  } else {
    currentPhotoIndex.value = 0
  }
}

const prevPhoto = () => {
  if (currentPhotoIndex.value > 0) {
    currentPhotoIndex.value--
  } else {
    currentPhotoIndex.value = props.article.photos.length - 1
  }
}

const openLightbox = () => {
  lightboxOpen.value = true
}

const closeLightbox = () => {
  lightboxOpen.value = false
}

const ouvrirMessages = () => {
  modalMessages.value = true
}

const fermerMessages = () => {
  modalMessages.value = false
  messageTexte.value = ''
}

const envoyerMessage = () => {
  if (messageTexte.value.trim()) {
    emit('envoyer-message', {
      articleId: props.article.id,
      message: messageTexte.value
    })
    fermerMessages()
    alert('Message envoyé au vendeur !')
  }
}

const ouvrirModalEnchere = () => {
  if (montantOffreValide.value) {
    modalEnchere.value = true
    etapeEnchere.value = 1
    confirmationLue.value = false
  }
}

const fermerModalEnchere = () => {
  modalEnchere.value = false
  etapeEnchere.value = 1
  confirmationLue.value = false
  // Ne pas réinitialiser le formulaire pour permettre à l'utilisateur de revenir
}

const etapeSuivante = () => {
  if (etapeValide.value && etapeEnchere.value < 4) {
    etapeEnchere.value++
  }
}

const etapePrecedente = () => {
  if (etapeEnchere.value > 1) {
    etapeEnchere.value--
  }
}

const confirmerOffre = () => {
  if (confirmationLue.value && montantOffreValide.value) {
    emit('placer-offre', {
      articleId: props.article.id,
      montant: montantOffre.value,
      montantMaxAuto: enchereAutomatique.value ? montantOffre.value : null,
      enchereAutomatique: enchereAutomatique.value,
      informations: formEnchere.value
    })
    // Si enchère automatique, l'enchère actuelle est juste le minimum, sinon c'est le montant complet
    enchereActuelle.value = enchereAutomatique.value ? enchereMinimale.value : montantOffre.value
    const montantOffreActuel = montantOffre.value
    montantOffre.value = null
    enchereAutomatique.value = false
    fermerModalEnchere()
    // Réinitialiser le formulaire
    formEnchere.value = {
      nomComplet: '',
      adresse: '',
      codePostal: '',
      ville: '',
      pays: 'France',
      telephone: '',
      numeroCarte: '',
      dateExpiration: '',
      cvv: '',
      nomCarte: ''
    }
    alert(`Offre de ${formatPrice(montantOffreActuel)} placée avec succès !\n\nVous serez automatiquement débité si vous remportez l'enchère.`)
  }
}

const acheter = () => {
  if (props.article.statut === 'actif') {
    emit('acheter', props.article.id)
    alert('Article ajouté au panier !')
  }
}

// Lifecycle
onMounted(() => {
  if (props.article.typeVente === 'enchere' && props.article.dateExpiration) {
    updateCountdown()
    countdownInterval = setInterval(updateCountdown, 1000)
  }
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>

<style scoped>
.article-client-page {
  min-height: 100vh;
  background: #f9fafb;
  padding: 2rem 1rem;
}

.article-client-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Breadcrumb */
.breadcrumb {
  margin-bottom: 2rem;
}

.btn-retour {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid #d1d5db;
  color: #6b7280;
  padding: 0.75rem 1.25rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-retour:hover {
  background: #f9fafb;
  color: #374151;
  border-color: #9ca3af;
}

/* Layout */
.article-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 2rem;
}

/* Galerie */
.gallery-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.main-image-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  margin-bottom: 1.5rem;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.main-image-wrapper:hover .main-image {
  transform: scale(1.05);
}

.btn-zoom {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border: none;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-zoom:hover {
  background: rgba(0, 0, 0, 0.85);
}

.photo-counter {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.thumbnails-section {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.thumbnail-nav {
  flex-shrink: 0;
  background: white;
  border: 1px solid #e5e7eb;
  color: #6b7280;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.thumbnail-nav:hover {
  background: #f3f4f6;
  color: #374151;
  border-color: #9ca3af;
}

.thumbnails-scroll {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 0.25rem;
}

.thumbnails-scroll::-webkit-scrollbar {
  height: 6px;
}

.thumbnails-scroll::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 3px;
}

.thumbnails-scroll::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.thumbnail {
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.thumbnail:hover {
  border-color: #667eea;
}

.thumbnail.active {
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Info section */
.info-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.category-tag {
  display: inline-block;
  background: #f3f4f6;
  color: #6b7280;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.article-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.btn-favoris {
  background: white;
  border: 2px solid #e5e7eb;
  color: #6b7280;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-favoris:hover {
  border-color: #ef4444;
  color: #ef4444;
}

.btn-favoris.active {
  background: #fef2f2;
  border-color: #ef4444;
  color: #ef4444;
}

/* Prix et enchère */
.price-section {
  background: #f9fafb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.current-price {
  margin-bottom: 1rem;
}

.price-label {
  display: block;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.price-amount {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: #667eea;
}

.enchere-info {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.95rem;
}

.info-item svg {
  color: #667eea;
}

/* Chronomètre */
.countdown-section {
  margin-bottom: 1.5rem;
}

.countdown-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-weight: 600;
  margin-bottom: 1rem;
}

.countdown-header svg {
  color: #ef4444;
}

.countdown-timer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.time-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  min-width: 60px;
}

.time-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
}

.time-label {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  margin-top: 0.25rem;
}

.time-separator {
  font-size: 1.5rem;
  font-weight: 700;
  color: #9ca3af;
}

/* Formulaire enchère */
.bid-form {
  margin-top: 1.5rem;
}

.bid-form label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

/* Boutons d'enchères rapides */
.quick-bid-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.btn-quick-bid {
  padding: 0.875rem 1rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-quick-bid:hover {
  border-color: #667eea;
  background: #f3f4f6;
}

.btn-quick-bid.active {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

/* Enchère automatique */
.auto-bid-section {
  margin: 1rem 0;
  padding: 1rem;
  background: #fef3c7;
  border-radius: 8px;
  border: 1px solid #fde68a;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #92400e;
  cursor: pointer;
  margin-bottom: 0.5rem;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.auto-bid-info {
  display: flex;
  align-items: start;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #92400e;
  margin: 0;
}

.auto-bid-info svg {
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.bid-input-group {
  position: relative;
  margin-bottom: 0.5rem;
}

.bid-input {
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1.25rem;
  font-weight: 600;
  color: #1a1a1a;
  transition: all 0.2s;
}

.bid-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.currency {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.25rem;
  font-weight: 600;
  color: #6b7280;
}

.bid-hint {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 1rem;
}

.btn-bid {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-bid:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-bid:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

/* Vente rapide */
.statut-vente {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #10b981;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.btn-acheter {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: #10b981;
  color: white;
  border: none;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-acheter:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

.btn-acheter:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

/* Bouton message */
.btn-message {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 2rem;
}

.btn-message:hover {
  background: #667eea;
  color: white;
}

/* Description et caractéristiques */
.description-section,
.caracteristiques-section,
.vendeur-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.description-section:last-child,
.caracteristiques-section:last-child,
.vendeur-section:last-child {
  border-bottom: none;
}

.description-section h3,
.caracteristiques-section h3,
.vendeur-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.description-text {
  color: #4b5563;
  line-height: 1.8;
  white-space: pre-wrap;
}

.carac-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.carac-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.carac-item svg {
  color: #667eea;
  flex-shrink: 0;
}

.carac-item>div {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.carac-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.carac-value {
  font-size: 1rem;
  color: #1f2937;
  font-weight: 600;
}

/* Vendeur */
.vendeur-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
}

.vendeur-avatar {
  width: 60px;
  height: 60px;
  background: #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.vendeur-nom {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.vendeur-stats {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.vendeur-stats span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.vendeur-stats svg {
  color: #f59e0b;
}

/* Lightbox */
.lightbox {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-content {
  max-width: 90vw;
  max-height: 90vh;
  position: relative;
}

.lightbox-content img {
  max-width: 100%;
  max-height: 90vh;
  object-fit: contain;
}

.lightbox-close {
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
}

.lightbox-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}

.lightbox-prev,
.lightbox-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 2px solid white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.lightbox-prev {
  left: 2rem;
}

.lightbox-next {
  right: 2rem;
}

.lightbox-prev:hover,
.lightbox-next:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-50%) scale(1.1);
}

.lightbox-counter {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 30px;
  font-size: 1rem;
  font-weight: 600;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.modal-close {
  background: transparent;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 0.5rem;
  transition: all 0.2s;
}

.modal-close:hover {
  color: #374151;
}

.modal-body {
  padding: 2rem;
  overflow-y: auto;
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.message-form label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.message-input {
  width: 100%;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  transition: all 0.2s;
}

.message-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.message-hint {
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;
}

.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5568d3;
}

.btn-secondary {
  background: white;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #f9fafb;
}

/* Responsive */
@media (max-width: 1024px) {
  .article-layout {
    grid-template-columns: 1fr;
  }

  .countdown-timer {
    flex-wrap: wrap;
  }

  .time-block {
    min-width: 50px;
    padding: 0.5rem 0.75rem;
  }

  .time-value {
    font-size: 1.5rem;
  }
}

@media (max-width: 640px) {
  .article-client-page {
    padding: 1rem 0.5rem;
  }

  .article-title {
    font-size: 1.5rem;
  }

  .price-amount {
    font-size: 2rem;
  }

  .gallery-section,
  .info-section {
    padding: 1rem;
  }

  .lightbox-prev {
    left: 1rem;
  }

  .lightbox-next {
    right: 1rem;
  }

  .lightbox-close {
    top: 1rem;
    right: 1rem;
  }
}

/* Styles Modal Enchère */
.modal-enchere {
  max-width: 700px;
}

.enchere-step {
  min-height: 400px;
}

.step-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #667eea;
}

.offre-recapitulatif {
  background: #f9fafb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.recap-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.recap-item:last-child {
  border-bottom: none;
}

.recap-item.highlight {
  background: #eff6ff;
  margin: 0 -1rem;
  padding: 1rem 1rem;
  border-radius: 8px;
  border: none;
}

.recap-label {
  font-weight: 500;
  color: #6b7280;
}

.recap-value {
  font-weight: 700;
  color: #1f2937;
  font-size: 1.1rem;
}

.recap-item.highlight .recap-value {
  color: #667eea;
  font-size: 1.5rem;
}

/* Alerts */
.alert-info,
.alert-warning,
.alert-danger {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.alert-info {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  color: #1e40af;
}

.alert-warning {
  background: #fffbeb;
  border: 1px solid #fcd34d;
  color: #92400e;
}

.alert-danger {
  background: #fef2f2;
  border: 2px solid #fca5a5;
  color: #991b1b;
}

.alert-info svg,
.alert-warning svg,
.alert-danger svg {
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.alert-title {
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.alert-list {
  margin: 0;
  padding-left: 1.25rem;
  line-height: 1.8;
}

.alert-list li {
  margin-bottom: 0.5rem;
}

/* Form Grid */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.form-group input {
  padding: 0.75rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 1rem;
  color: #1a1a1a;
  transition: all 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Confirmation Summary */
.confirmation-summary {
  background: #f9fafb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.summary-section {
  padding: 1rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.summary-section:last-child {
  border-bottom: none;
}

.summary-section h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.summary-section p {
  color: #1f2937;
  margin: 0.25rem 0;
}

.amount-highlight {
  font-size: 1.75rem;
  font-weight: 700;
  color: #667eea !important;
}

/* Checkbox Group */
.checkbox-group {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.checkbox-group input[type="checkbox"] {
  margin-top: 0.25rem;
  width: 20px;
  height: 20px;
  cursor: pointer;
  flex-shrink: 0;
}

.checkbox-group label {
  font-size: 0.95rem;
  color: #374151;
  cursor: pointer;
  line-height: 1.6;
}

/* Buttons enchère */
.btn-danger {
  background: #ef4444 !important;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626 !important;
}

/* Hint messages */
.error-hint {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  font-weight: 600;
}

/* Responsive modal */
@media (max-width: 640px) {
  .modal-enchere {
    max-width: 100%;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full {
    grid-column: 1;
  }

  .modal-footer {
    flex-direction: column;
  }

  .modal-footer button {
    width: 100%;
  }
}
</style>
