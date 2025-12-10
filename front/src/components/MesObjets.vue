<template>
  <div class="mes-objets-page">
    <div class="page-container">
      <div class="page-header">
        <h1> Mes objets en vente</h1>
        <p class="subtitle">Gérez vos annonces et suivez vos ventes</p>
      </div>

      <!-- Filtres -->
      <div class="filters-section">
        <div class="filter-group">
          <label>Filtrer par type :</label>
          <select v-model="filtreType" class="filter-select">
            <option value="tous">Tous les types</option>
            <option value="enchere">Enchères</option>
            <option value="vente-rapide">Vente rapide</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Filtrer par statut :</label>
          <select v-model="filtreStatut" class="filter-select">
            <option value="tous">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="vendu">Vendu</option>
            <option value="expire">Expiré</option>
          </select>
        </div>
      </div>

      <!-- Liste des objets -->
      <div v-if="objetsFiltres.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>Aucun objet</h3>
        <button @click="$router.push('/publier')" class="btn-publier">
          Publier un objet
        </button>
      </div>

      <div v-else class="objets-grid">
        <div v-for="objet in objetsFiltres" :key="objet.id" class="objet-card" @click="voirDetails(objet)">
          <!-- Image principale -->
          <div class="objet-image">
            <img :src="imageDefault" :alt="objet.nom" />
            <div class="statut-badge" :class="objet.statut">
              {{ getStatutLabel(objet.statut) }}
            </div>
            <div v-if="objet.typeVente === 'enchere'" class="type-badge">
              Enchère
            </div>
            <div v-else class="type-badge vente-rapide">
              Vente rapide
            </div>
          </div>

          <!-- Informations -->
          <div class="objet-info">
            <h3 class="objet-nom">{{ objet.nom }}</h3>
            <p class="objet-categorie">{{ objet.categorie }}</p>

            <!-- Prix et enchères -->
            <div v-if="objet.typeVente === 'enchere'" class="prix-section">
              <div class="prix-info">
                <span class="label">Enchère actuelle</span>
                <span class="prix-actuel">{{ formatPrice(objet.enchereActuelle || objet.prixDepart) }}</span>
              </div>
              <div class="offres-info">
                <span class="icon"></span>
                <span>{{ objet.nombreOffres || 0 }} offre(s)</span>
              </div>
              <div class="temps-restant">
                <span class="icon"></span>
                <span>{{ getTempsRestant(objet) }}</span>
              </div>
            </div>

            <div v-else class="prix-section">
              <div class="prix-info">
                <span class="label">Prix</span>
                <span class="prix-actuel">{{ formatPrice(objet.prix) }}</span>
              </div>
            </div>

            <!-- Questions acheteurs -->
            <div v-if="objet.nombreQuestions > 0" class="questions-badge">
              {{ objet.nombreQuestions }} nouvelle(s) question(s)
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal : Changer type de vente -->
    <div v-if="modalChangerType" class="modal-overlay" @click="fermerModalType">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Changer le type de vente</h2>
          <button class="modal-close" @click="fermerModalType">✕</button>
        </div>
        <div class="modal-body">
          <p class="modal-info">
            <strong>{{ objetSelectionne?.nom }}</strong>
          </p>
          <p class="current-type">
            Type actuel : <strong>{{ objetSelectionne?.typeVente === 'enchere' ? 'Enchère' : 'Vente rapide' }}</strong>
          </p>

          <div class="form-group">
            <label>
              <input type="radio" v-model="nouveauType" value="enchere" />
              <span class="radio-label">
                <span class="radio-icon">🔨</span>
                <span>Enchère</span>
              </span>
            </label>
          </div>

          <div class="form-group">
            <label>
              <input type="radio" v-model="nouveauType" value="vente-rapide" />
              <span class="radio-label">
                <span class="radio-icon"></span>
                <span>Vente rapide</span>
              </span>
            </label>
          </div>

          <div v-if="nouveauType === 'enchere'" class="enchere-params">
            <div class="info-enchere">
              Les enchères durent automatiquement 7 jours
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="fermerModalType" class="btn-secondary">Annuler</button>
          <button @click="confirmerChangerType" class="btn-primary">Confirmer</button>
        </div>
      </div>
    </div>

    <!-- Modal : Baisser le prix -->
    <div v-if="modalBaisserPrix" class="modal-overlay" @click="fermerModalPrix">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Baisser le prix</h2>
          <button class="modal-close" @click="fermerModalPrix">✕</button>
        </div>
        <div class="modal-body">
          <p class="modal-info">
            <strong>{{ objetSelectionne?.nom }}</strong>
          </p>
          <p class="current-price">
            Prix actuel : <strong>{{ formatPrice(objetSelectionne?.prix) }}</strong>
          </p>

          <div class="form-group">
            <label for="nouveau-prix">Nouveau prix *</label>
            <input type="number" id="nouveau-prix" v-model="nouveauPrix" :max="objetSelectionne?.prix" step="0.01"
              class="input-field" placeholder="Entrez le nouveau prix" />
          </div>

          <div class="price-diff" v-if="nouveauPrix && nouveauPrix < objetSelectionne?.prix">
            <span class="diff-label">Réduction :</span>
            <span class="diff-value">
              -{{ formatPrice(objetSelectionne.prix - nouveauPrix) }}
              ({{ calculerPourcentageReduction() }}%)
            </span>
          </div>

          <p v-if="nouveauPrix >= objetSelectionne?.prix" class="error-message">
            Le nouveau prix doit être inférieur au prix actuel
          </p>
        </div>
        <div class="modal-footer">
          <button @click="fermerModalPrix" class="btn-secondary">Annuler</button>
          <button @click="confirmerBaisserPrix" class="btn-primary"
            :disabled="!nouveauPrix || nouveauPrix >= objetSelectionne?.prix">
            Confirmer
          </button>
        </div>
      </div>
    </div>

    <!-- Modal : Offres et Questions -->
    <div v-if="modalOffres" class="modal-overlay" @click="fermerModalOffres">
      <div class="modal-content modal-large" @click.stop>
        <div class="modal-header">
          <h2>Offres & Questions</h2>
          <button class="modal-close" @click="fermerModalOffres">✕</button>
        </div>
        <div class="modal-body">
          <p class="modal-info">
            <strong>{{ objetSelectionne?.nom }}</strong>
          </p>

          <!-- Onglets -->
          <div class="tabs">
            <button @click="ongletActif = 'offres'" :class="{ active: ongletActif === 'offres' }" class="tab-button">
              Offres ({{ objetSelectionne?.offres?.length || 0 }})
            </button>
            <button @click="ongletActif = 'questions'" :class="{ active: ongletActif === 'questions' }"
              class="tab-button">
              Questions ({{ objetSelectionne?.questions?.length || 0 }})
            </button>
          </div>

          <!-- Contenu Offres -->
          <div v-if="ongletActif === 'offres'" class="tab-content">
            <div v-if="!objetSelectionne?.offres || objetSelectionne.offres.length === 0" class="empty-tab">
              <p>Aucune offre pour le moment</p>
            </div>
            <div v-else class="offres-list">
              <div v-for="(offre, index) in objetSelectionne.offres" :key="index" class="offre-item">
                <div class="offre-header">
                  <span class="acheteur-nom">👤 {{ offre.acheteur }}</span>
                  <span class="offre-date">{{ formatDate(offre.date) }}</span>
                </div>
                <div class="offre-montant">{{ formatPrice(offre.montant) }}</div>
                <div class="offre-actions">
                  <button class="btn-accept">✓ Accepter</button>
                  <button class="btn-reject">✕ Refuser</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Contenu Questions -->
          <div v-if="ongletActif === 'questions'" class="tab-content">
            <div v-if="!objetSelectionne?.questions || objetSelectionne.questions.length === 0" class="empty-tab">
              <p>Aucune question pour le moment</p>
            </div>
            <div v-else class="questions-list">
              <div v-for="(question, index) in objetSelectionne.questions" :key="index" class="question-item">
                <div class="question-header">
                  <span class="acheteur-nom">👤 {{ question.acheteur }}</span>
                  <span class="question-date">{{ formatDate(question.date) }}</span>
                </div>
                <div class="question-text">{{ question.question }}</div>
                <div v-if="question.reponse" class="reponse-section">
                  <div class="reponse-label">Votre réponse :</div>
                  <div class="reponse-text">{{ question.reponse }}</div>
                </div>
                <div v-else class="reponse-form">
                  <textarea v-model="question.nouvelleReponse" placeholder="Écrivez votre réponse..."
                    class="reponse-textarea"></textarea>
                  <button @click="envoyerReponse(question)" class="btn-send">
                    Envoyer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="fermerModalOffres" class="btn-secondary">Fermer</button>
        </div>
      </div>
    </div>

    <!-- Modal : Détail de l'annonce -->
    <!-- Modal : Détails de l'annonce (ArticleDetail) -->
    <div v-if="modalDetail" class="modal-overlay" @click="fermerModalDetail">
      <div class="modal-content modal-article-detail" @click.stop>
        <ArticleDetail v-if="objetSelectionne" :article="objetSelectionne" @retour="fermerModalDetail"
          @modifier="modifierAnnonce" @baisser-prix="ouvrirBaisserPrixDepuisDetail" @supprimer="supprimerAnnonce" />
      </div>
    </div>

    <!-- Modal : Modifier l'annonce -->
    <div v-if="modalModifier" class="modal-overlay" @click="fermerModalModifier">
      <div class="modal-content modal-large modal-modifier" @click.stop>
        <div class="modal-header">
          <h2>Modifier l'annonce</h2>
          <button class="modal-close" @click="fermerModalModifier">✕</button>
        </div>
        <div class="modal-body modal-body-form">
          <form @submit.prevent="confirmerModification" class="form-modifier">

            <!-- Photos -->
            <div class="form-section">
              <h3>Photos</h3>
              <p class="info-text">Glissez-déposez les photos pour changer leur ordre. La première photo sera l'image
                principale.</p>
              <div class="photos-upload-zone">
                <input type="file" ref="photosInputModif" @change="handlePhotosUploadModif"
                  accept="image/jpeg,image/png,image/jpg" multiple style="display: none" />

                <div class="photos-grid">
                  <div v-for="(photo, index) in formModif.photos" :key="index" class="photo-preview" draggable="true"
                    @dragstart="handleDragStart(index)" @dragover.prevent @drop="handleDrop(index)"
                    @dragenter.prevent="handleDragEnter(index)" @dragleave="handleDragLeave"
                    :class="{ 'drag-over': dragOverIndex === index, 'is-dragging': draggedIndex === index }">
                    <img :src="photo.preview" :alt="`Photo ${index + 1}`" />
                    <button type="button" @click="removePhotoModif(index)" class="remove-photo-btn">
                      <X :size="16" />
                    </button>
                    <span class="photo-number">{{ index + 1 }}</span>
                    <span v-if="index === 0" class="main-photo-badge">Image principale</span>
                  </div>

                  <button type="button" @click="$refs.photosInputModif.click()" class="add-photo-btn"
                    :class="{ disabled: formModif.photos.length >= 20 }" :disabled="formModif.photos.length >= 20">
                    <Upload :size="24" class="icon-upload" />
                    <span>Ajouter des photos</span>
                    <small>{{ formModif.photos.length }}/20</small>
                  </button>
                </div>
              </div>
            </div>

            <!-- Informations générales -->
            <div class="form-section">
              <h3>Informations générales</h3>

              <div class="form-group">
                <label for="nom-modif">Nom de l'objet </label>
                <input type="text" id="nom-modif" v-model="formModif.nom" required class="input-field" />
              </div>

              <div class="form-group">
                <label for="categorie-modif">Catégorie </label>
                <select id="categorie-modif" v-model="formModif.categorie" required class="input-field">
                  <option value="">Sélectionnez une catégorie</option>
                  <option value="Mobilier">Mobilier</option>
                  <option value="Art">Art</option>
                  <option value="Décoration">Décoration</option>
                  <option value="Bijoux">Bijoux</option>
                  <option value="Antiquités">Antiquités</option>
                  <option value="Design">Design</option>
                  <option value="Vintage">Vintage</option>
                  <option value="Autres">Autres</option>
                </select>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="hauteur-modif">Hauteur (cm) *</label>
                  <input type="number" id="hauteur-modif" v-model.number="formModif.dimensions.hauteur" required
                    class="input-field" min="0" step="0.1" />
                </div>
                <div class="form-group">
                  <label for="largeur-modif">Largeur (cm) *</label>
                  <input type="number" id="largeur-modif" v-model.number="formModif.dimensions.largeur" required
                    class="input-field" min="0" step="0.1" />
                </div>
                <div class="form-group">
                  <label for="profondeur-modif">Profondeur (cm) *</label>
                  <input type="number" id="profondeur-modif" v-model.number="formModif.dimensions.profondeur" required
                    class="input-field" min="0" step="0.1" />
                </div>
              </div>

              <div class="form-group">
                <label for="poids-modif">Poids (kg) *</label>
                <input type="number" id="poids-modif" v-model.number="formModif.poids" required class="input-field"
                  min="0" step="0.1" />
              </div>
            </div>

            <!-- Description -->
            <div class="form-section">
              <h3>Description</h3>
              <div class="form-group">
                <label for="description-modif">Description détaillée </label>
                <textarea id="description-modif" v-model="formModif.description" required rows="6"
                  class="input-field textarea-field"></textarea>
              </div>
            </div>

            <!-- Prix et type de vente -->
            <div class="form-section">
              <h3>Prix et type de vente</h3>

              <div class="form-group">
                <label for="prix-modif">Prix souhaité (€) </label>
                <input type="number" id="prix-modif" v-model.number="formModif.prix" required class="input-field"
                  min="0" step="0.01" />
              </div>

              <div class="form-group">
                <label>Type de vente *</label>
                <div class="radio-group">
                  <label class="radio-option">
                    <input type="radio" v-model="formModif.typeVente" value="enchere" required />
                    <span> Enchère (durée: 7 jours)</span>
                  </label>
                  <label class="radio-option">
                    <input type="radio" v-model="formModif.typeVente" value="vente-rapide" required />
                    <span> Vente rapide</span>
                  </label>
                </div>
              </div>

              <div v-if="formModif.typeVente === 'enchere'" class="info-prix-enchere">
                <p>Prix de départ de l'enchère : <strong>{{ formatPrice(formModif.prix * 0.9) }}</strong>
                  (automatiquement calculé à -10%)</p>
              </div>
            </div>

          </form>
        </div>
        <div class="modal-footer">
          <button @click="fermerModalModifier" class="btn-secondary">Annuler</button>
          <button @click="confirmerModification" class="btn-primary">Enregistrer les modifications</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { X, Upload } from 'lucide-vue-next'
import imageDefault from '../assets/image.jpg'
import ArticleDetail from './ArticleDetail.vue'

const route = useRoute()
const router = useRouter()

// Données de test - À remplacer par un appel API
const mesObjets = ref([
  {
    id: 1,
    nom: 'Vase Art Déco en cristal',
    categorie: 'Décoration',
    photos: [{ preview: 'https://via.placeholder.com/300x300?text=Vase' }],
    prix: 450,
    typeVente: 'enchere',
    prixDepart: 405,
    enchereActuelle: 420,
    nombreOffres: 3,
    statut: 'actif',
    dateExpiration: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 jours
    dureeEnchere: 7,
    nombreQuestions: 2,
    offres: [
      { acheteur: 'Jean Dupont', montant: 420, date: new Date() },
      { acheteur: 'Marie Martin', montant: 415, date: new Date(Date.now() - 86400000) },
      { acheteur: 'Pierre Durand', montant: 405, date: new Date(Date.now() - 2 * 86400000) }
    ],
    questions: [
      {
        acheteur: 'Sophie Bernard',
        question: 'Le vase est-il signé ?',
        date: new Date(),
        reponse: null,
        nouvelleReponse: ''
      },
      {
        acheteur: 'Luc Moreau',
        question: 'Y a-t-il des défauts ou ébréchures ?',
        date: new Date(Date.now() - 86400000),
        reponse: 'Non, le vase est en parfait état.',
        nouvelleReponse: ''
      }
    ]
  },
  {
    id: 2,
    nom: 'Fauteuil vintage années 70',
    categorie: 'Mobilier',
    photos: [{ preview: 'https://via.placeholder.com/300x300?text=Fauteuil' }],
    prix: 280,
    typeVente: 'vente-rapide',
    statut: 'actif',
    nombreQuestions: 0,
    offres: [],
    questions: []
  },
  {
    id: 3,
    nom: 'Tableau abstrait signé',
    categorie: 'Art',
    photos: [{ preview: 'https://via.placeholder.com/300x300?text=Tableau' }],
    prix: 1200,
    typeVente: 'enchere',
    prixDepart: 1080,
    enchereActuelle: 1080,
    nombreOffres: 0,
    statut: 'actif',
    dateExpiration: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 jours
    dureeEnchere: 14,
    nombreQuestions: 1,
    offres: [],
    questions: [
      {
        acheteur: 'Anne Petit',
        question: 'Quelle est la taille exacte du tableau ?',
        date: new Date(),
        reponse: null,
        nouvelleReponse: ''
      }
    ]
  }
])

const filtreType = ref('tous')
const filtreStatut = ref('tous')
const modalChangerType = ref(false)
const modalBaisserPrix = ref(false)
const modalOffres = ref(false)
const modalDetail = ref(false)
const modalModifier = ref(false)
const objetSelectionne = ref(null)
const nouveauType = ref('')
const nouveauPrix = ref(null)
const ongletActif = ref('offres')
const indexPhotoActuelle = ref(0)
const draggedIndex = ref(null)
const dragOverIndex = ref(null)
const formModif = ref({
  nom: '',
  categorie: '',
  dimensions: {
    hauteur: null,
    largeur: null,
    profondeur: null
  },
  poids: null,
  description: '',
  prix: null,
  typeVente: '',
  photos: []
})

const photoActuelle = computed(() => {
  if (objetSelectionne.value?.photos && objetSelectionne.value.photos.length > 0) {
    return objetSelectionne.value.photos[indexPhotoActuelle.value]?.preview
  }
  return ''
})

const objetsFiltres = computed(() => {
  return mesObjets.value.filter(objet => {
    const typeMatch = filtreType.value === 'tous' || objet.typeVente === filtreType.value
    const statutMatch = filtreStatut.value === 'tous' || objet.statut === filtreStatut.value
    return typeMatch && statutMatch
  })
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const formatDate = (date) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

const getStatutLabel = (statut) => {
  const labels = {
    'actif': '✓ Actif',
    'vendu': '✓ Vendu',
    'expire': ' Expiré'
  }
  return labels[statut] || statut
}

const getTempsRestant = (objet) => {
  if (!objet.dateExpiration) return 'N/A'
  const now = new Date()
  const diff = objet.dateExpiration - now
  const jours = Math.floor(diff / (1000 * 60 * 60 * 24))
  const heures = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (jours > 0) return `${jours}j ${heures}h restantes`
  if (heures > 0) return `${heures}h restantes`
  return 'Bientôt terminé'
}

const voirDetails = (objet) => {
  router.push(`/objet/${objet.id}`)
}

const fermerModalDetail = () => {
  modalDetail.value = false
  objetSelectionne.value = null
  indexPhotoActuelle.value = 0
}

const ouvrirBaisserPrixDepuisDetail = () => {
  fermerModalDetail()
  modalBaisserPrix.value = true
  nouveauPrix.value = null
}

const ouvrirModifierType = (objet) => {
  objetSelectionne.value = objet
  nouveauType.value = objet.typeVente
  modalChangerType.value = true
}

const fermerModalType = () => {
  modalChangerType.value = false
  objetSelectionne.value = null
}

const confirmerChangerType = () => {
  if (objetSelectionne.value) {
    objetSelectionne.value.typeVente = nouveauType.value
    if (nouveauType.value === 'enchere') {
      objetSelectionne.value.dureeEnchere = '7'
      objetSelectionne.value.dateExpiration = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
    alert('Type de vente modifié avec succès !')
    fermerModalType()
  }
}

const fermerModalPrix = () => {
  modalBaisserPrix.value = false
  objetSelectionne.value = null
  nouveauPrix.value = null
}

const calculerPourcentageReduction = () => {
  if (!nouveauPrix.value || !objetSelectionne.value) return 0
  const reduction = ((objetSelectionne.value.prix - nouveauPrix.value) / objetSelectionne.value.prix) * 100
  return reduction.toFixed(1)
}

const confirmerBaisserPrix = () => {
  if (objetSelectionne.value && nouveauPrix.value < objetSelectionne.value.prix) {
    const nouveauPrixFloat = parseFloat(nouveauPrix.value)

    // Mettre à jour le prix principal
    objetSelectionne.value.prix = nouveauPrixFloat

    // Si c'est une enchère, recalculer le prix de départ (-10%)
    if (objetSelectionne.value.typeVente === 'enchere') {
      objetSelectionne.value.prixDepart = nouveauPrixFloat * 0.9

      // Si l'enchère actuelle est supérieure au nouveau prix, la réinitialiser au prix de départ
      if (objetSelectionne.value.enchereActuelle && objetSelectionne.value.enchereActuelle > nouveauPrixFloat) {
        objetSelectionne.value.enchereActuelle = objetSelectionne.value.prixDepart
      }
    }

    alert('Prix modifié avec succès !')
    fermerModalPrix()
  }
}

const fermerModalOffres = () => {
  modalOffres.value = false
  objetSelectionne.value = null
}

const modifierAnnonce = () => {
  if (objetSelectionne.value) {
    // Pré-remplir le formulaire avec les données actuelles
    formModif.value = {
      nom: objetSelectionne.value.nom,
      categorie: objetSelectionne.value.categorie,
      dimensions: {
        hauteur: objetSelectionne.value.dimensions?.hauteur || 0,
        largeur: objetSelectionne.value.dimensions?.largeur || 0,
        profondeur: objetSelectionne.value.dimensions?.profondeur || 0
      },
      poids: objetSelectionne.value.poids || 0,
      description: objetSelectionne.value.description || '',
      prix: objetSelectionne.value.prix,
      typeVente: objetSelectionne.value.typeVente,
      photos: [...(objetSelectionne.value.photos || [])]
    }

    fermerModalDetail()
    modalModifier.value = true
  }
}

const fermerModalModifier = () => {
  modalModifier.value = false
  formModif.value = {
    nom: '',
    categorie: '',
    dimensions: { hauteur: null, largeur: null, profondeur: null },
    poids: null,
    description: '',
    prix: null,
    typeVente: '',
    photos: []
  }
}

const confirmerModification = () => {
  if (objetSelectionne.value) {
    // Mettre à jour l'objet avec les nouvelles données
    objetSelectionne.value.nom = formModif.value.nom
    objetSelectionne.value.categorie = formModif.value.categorie
    objetSelectionne.value.dimensions = { ...formModif.value.dimensions }
    objetSelectionne.value.poids = formModif.value.poids
    objetSelectionne.value.description = formModif.value.description
    objetSelectionne.value.prix = formModif.value.prix
    objetSelectionne.value.typeVente = formModif.value.typeVente
    objetSelectionne.value.photos = [...formModif.value.photos]

    // Si enchère, recalculer le prix de départ
    if (formModif.value.typeVente === 'enchere') {
      objetSelectionne.value.prixDepart = formModif.value.prix * 0.9
    }

    alert('Annonce modifiée avec succès !')
    fermerModalModifier()
    objetSelectionne.value = null
  }
}

const handlePhotosUploadModif = (event) => {
  const files = Array.from(event.target.files)
  const photosRestantes = 20 - formModif.value.photos.length

  if (files.length > photosRestantes) {
    alert(`Vous ne pouvez ajouter que ${photosRestantes} photo(s) supplémentaire(s)`)
    return
  }

  files.forEach((file) => {
    if (file.size > 5 * 1024 * 1024) {
      alert(`Le fichier ${file.name} est trop volumineux (max 5 Mo)`)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      formModif.value.photos.push({
        file,
        preview: e.target.result,
        name: file.name
      })
    }
    reader.readAsDataURL(file)
  })
}

const removePhotoModif = (index) => {
  formModif.value.photos.splice(index, 1)
}

const handleDragStart = (index) => {
  draggedIndex.value = index
}

const handleDragEnter = (index) => {
  dragOverIndex.value = index
}

const handleDragLeave = () => {
  dragOverIndex.value = null
}

const handleDrop = (dropIndex) => {
  if (draggedIndex.value === null || draggedIndex.value === dropIndex) {
    draggedIndex.value = null
    dragOverIndex.value = null
    return
  }

  const photos = [...formModif.value.photos]
  const draggedPhoto = photos[draggedIndex.value]

  // Retirer la photo de sa position d'origine
  photos.splice(draggedIndex.value, 1)

  // Insérer la photo à la nouvelle position
  photos.splice(dropIndex, 0, draggedPhoto)

  formModif.value.photos = photos
  draggedIndex.value = null
  dragOverIndex.value = null
}

const envoyerReponse = (question) => {
  if (question.nouvelleReponse.trim()) {
    question.reponse = question.nouvelleReponse
    question.nouvelleReponse = ''
    alert('Réponse envoyée !')
  }
}

const supprimerAnnonce = (id) => {
  const index = mesObjets.value.findIndex(obj => obj.id === id)
  if (index !== -1) {
    mesObjets.value.splice(index, 1)
    fermerModalDetail()
    alert('Annonce supprimée avec succès !')
  }
}

// Détection du paramètre query pour ouvrir la modale de modification
onMounted(() => {
  const modifierId = route.query.modifier
  if (modifierId) {
    const objet = mesObjets.value.find(obj => obj.id === parseInt(modifierId))
    if (objet) {
      objetSelectionne.value = objet
      formModif.value = {
        nom: objet.nom || '',
        categorie: objet.categorie || '',
        dimensions: { ...objet.dimensions } || { hauteur: null, largeur: null, profondeur: null },
        poids: objet.poids,
        description: objet.description || '',
        prix: objet.prix,
        typeVente: objet.typeVente,
        photos: [...(objet.photos || [])]
      }
      modalModifier.value = true
    }
  }

  const baisserPrixId = route.query.baisserPrix
  if (baisserPrixId) {
    const objet = mesObjets.value.find(obj => obj.id === parseInt(baisserPrixId))
    if (objet) {
      objetSelectionne.value = objet
      nouveauPrix.value = objet.prix
      modalBaisserPrix.value = true
    }
  }
})
</script>

<style scoped>
.mes-objets-page {
  min-height: 100vh;
  background: #f9fafb;
  padding: 2rem 1rem;
}

.page-container {
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #6b7280;
  font-size: 1.1rem;
}

/* Filtres */
.filters-section {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
}

.filter-select {
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 200px;
}

/* Labels des formulaires */
label {
  color: #374151;
  font-weight: 500;
  font-size: 0.95rem;
  margin-bottom: 0.5rem;
  display: block;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* Empty state */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6b7280;
  margin-bottom: 2rem;
}

.btn-publier {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-publier:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

/* Grille objets */
.objets-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 2rem;
}

.objet-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  cursor: pointer;
}

.objet-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.objet-image {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: #f3f4f6;
}

.objet-image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3));
  z-index: 1;
}

.objet-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.9);
}

.statut-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  backdrop-filter: blur(10px);
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.statut-badge.actif {
  background: rgba(16, 185, 129, 0.95);
  color: white;
}

.statut-badge.vendu {
  background: rgba(59, 130, 246, 0.95);
  color: white;
}

.statut-badge.expire {
  background: rgba(239, 68, 68, 0.95);
  color: white;
}

.type-badge {
  position: absolute;
  top: 1rem;
  left: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  background: rgba(122, 143, 237, 0.95);
  color: white;
  backdrop-filter: blur(10px);
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.type-badge.vente-rapide {
  background: rgba(16, 185, 129, 0.95);
}

.objet-info {
  padding: 1.5rem;
}

.objet-nom {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.objet-categorie {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.prix-section {
  background: #f9fafb;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.prix-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.label {
  color: #6b7280;
  font-size: 0.875rem;
}

.prix-actuel {
  font-size: 1.5rem;
  font-weight: 700;
  color: #10b981;
}

.offres-info,
.temps-restant {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #374151;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.icon {
  font-size: 1rem;
}

.questions-badge {
  background: #fef3c7;
  color: #92400e;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}

.actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.75rem;
}

.btn-action {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-details {
  background: #667eea;
  color: white;
}

.btn-details:hover {
  background: #5568d3;
}

.btn-offres {
  background: #10b981;
  color: white;
}

.btn-offres:hover {
  background: #059669;
}

.btn-type {
  background: #f59e0b;
  color: white;
}

.btn-type:hover {
  background: #d97706;
}

.btn-prix {
  background: #ef4444;
  color: white;
}

.btn-prix:hover {
  background: #dc2626;
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.modal-large {
  max-width: 800px;
}

.modal-article-detail {
  max-width: 95vw;
  width: 1400px;
  max-height: 95vh;
  padding: 0;
  background: transparent;
}

.modal-article-detail .article-page {
  background: transparent;
  padding: 0;
  min-height: auto;
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
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.modal-body {
  padding: 2rem;
}

.modal-info {
  color: #374151;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.current-type,
.current-price {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  font-weight: 400;
}

.form-group input[type="radio"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
}

.radio-icon {
  font-size: 1.5rem;
}

.input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
}

.input-field:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.enchere-params {
  margin-top: 1rem;
  padding: 1rem;
  background: #eff6ff;
  border-radius: 8px;
  border-left: 3px solid #667eea;
}

.info-enchere {
  color: #1e40af;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-diff {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: #dcfce7;
  border-radius: 8px;
  margin-top: 1rem;
}

.diff-label {
  color: #166534;
  font-weight: 600;
}

.diff-value {
  color: #15803d;
  font-weight: 700;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
}

.modal-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
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
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #f9fafb;
}

/* Tabs */
.tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.tab-button {
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  border-bottom: 3px solid transparent;
  font-size: 1rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-button.active {
  color: #667eea;
  border-bottom-color: #667eea;
}

.tab-content {
  min-height: 300px;
}

.empty-tab {
  text-align: center;
  padding: 3rem;
  color: #6b7280;
}

/* Offres */
.offres-list,
.questions-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.offre-item,
.question-item {
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.offre-header,
.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.acheteur-nom {
  font-weight: 600;
  color: #1f2937;
}

.offre-date,
.question-date {
  font-size: 0.875rem;
  color: #6b7280;
}

.offre-montant {
  font-size: 1.5rem;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 1rem;
}

.offre-actions {
  display: flex;
  gap: 0.75rem;
}

.btn-accept,
.btn-reject {
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-accept {
  background: #10b981;
  color: white;
}

.btn-accept:hover {
  background: #059669;
}

.btn-reject {
  background: #ef4444;
  color: white;
}

.btn-reject:hover {
  background: #dc2626;
}

/* Questions */
.question-text {
  color: #374151;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.reponse-section {
  padding: 1rem;
  background: white;
  border-radius: 6px;
  border-left: 3px solid #667eea;
}

.reponse-label {
  font-weight: 600;
  color: #667eea;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.reponse-text {
  color: #374151;
}

.reponse-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.reponse-textarea {
  width: 100%;
  min-height: 100px;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  resize: vertical;
  font-family: inherit;
}

.reponse-textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-send {
  align-self: flex-end;
  padding: 0.75rem 1.5rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-send:hover {
  background: #5568d3;
}

/* Modal Détail Annonce */
.detail-gallery {
  margin-bottom: 2rem;
}

.main-photo {
  position: relative;
  width: 100%;
  max-height: 500px;
  background: #f3f4f6;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.main-photo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  max-height: 500px;
}

.photo-counter {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
}

.thumbnails-detail {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.75rem;
}

.thumbnail-detail {
  aspect-ratio: 1;
  border-radius: 6px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s;
}

.thumbnail-detail:hover {
  border-color: #667eea;
}

.thumbnail-detail.active {
  border-color: #667eea;
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.thumbnail-detail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.detail-info {
  margin-top: 1.5rem;
}

.detail-nom {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.detail-categorie {
  color: #6b7280;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.detail-badges {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.badge-type {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.badge-type.enchere {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.badge-type.vente {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.badge-statut {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.badge-statut.actif {
  background: #dcfce7;
  color: #166534;
}

.badge-statut.vendu {
  background: #dbeafe;
  color: #1e40af;
}

.badge-statut.expire {
  background: #fee2e2;
  color: #991b1b;
}

.detail-prix-section {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.prix-actuel-detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.label-detail {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

.montant-detail {
  font-size: 2rem;
  font-weight: 700;
  color: #10b981;
}

.prix-minimum-detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.75rem;
  border-top: 1px solid #e5e7eb;
}

.montant-mini {
  font-size: 1.25rem;
  font-weight: 600;
  color: #6b7280;
}

.temps-restant-detail {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #374151;
  font-weight: 600;
  padding: 1rem;
  background: #fef3c7;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.resume-interactions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.resume-item {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: #f3f4f6;
  border-radius: 8px;
}

.resume-icon {
  font-size: 1.5rem;
}

.resume-text {
  color: #374151;
  font-weight: 500;
}

.section-detail {
  margin-bottom: 1.5rem;
}

.section-detail h4 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.offres-list-detail,
.questions-list-detail {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.offre-detail-item,
.question-detail-item {
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.offre-user,
.question-user {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.5rem;
}

.offre-montant-small {
  font-size: 1.25rem;
  font-weight: 700;
  color: #10b981;
  margin-bottom: 0.25rem;
}

.offre-date-small {
  font-size: 0.75rem;
  color: #9ca3af;
}

.question-texte {
  color: #374151;
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.question-reponse {
  padding: 0.75rem;
  background: white;
  border-radius: 6px;
  border-left: 3px solid #667eea;
  font-size: 0.875rem;
  color: #4b5563;
}

.question-non-repondu {
  color: #f59e0b;
  font-size: 0.875rem;
  font-weight: 600;
}

.detail-action {
  margin-top: 2rem;
  display: flex;
  gap: 1rem;
}

.btn-baisser-prix-detail,
.btn-modifier-detail {
  flex: 1;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-baisser-prix-detail {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.btn-baisser-prix-detail:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(239, 68, 68, 0.3);
}

.btn-modifier-detail {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-modifier-detail:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

/* Modal Modifier */
.modal-modifier {
  max-width: 900px;
}

.modal-body-form {
  max-height: 70vh;
  overflow-y: auto;
  padding: 0.5rem;
}

.form-modifier {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-modifier .form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-modifier input[type="text"],
.form-modifier input[type="number"],
.form-modifier select,
.form-modifier textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  font-family: inherit;
  width: 100%;
  max-width: 100%;
}

.form-modifier input[type="text"]:focus,
.form-modifier input[type="number"]:focus,
.form-modifier select:focus,
.form-modifier textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.photos-upload-zone {
  margin-top: 1rem;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
}

.photo-preview {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  cursor: move;
  transition: all 0.2s;
}

.photo-preview:hover {
  border-color: #667eea;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.photo-preview.is-dragging {
  opacity: 0.5;
  transform: scale(0.95);
}

.photo-preview.drag-over {
  border-color: #667eea;
  border-width: 3px;
  background: rgba(102, 126, 234, 0.1);
}

.photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.remove-photo-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-photo-btn:hover {
  background: rgba(220, 38, 38, 1);
  transform: scale(1.1);
}

.photo-number {
  position: absolute;
  bottom: 4px;
  left: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.main-photo-badge {
  position: absolute;
  top: 4px;
  left: 4px;
  background: rgba(102, 126, 234, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.info-text {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f3f4f6;
  border-radius: 6px;
  border-left: 3px solid #667eea;
}

.add-photo-btn {
  aspect-ratio: 1;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background: #f9fafb;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  padding: 1rem;
}

.add-photo-btn:hover:not(.disabled) {
  border-color: #667eea;
  background: #f3f4f6;
}

.add-photo-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-photo-btn span {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: center;
}

.add-photo-btn small {
  font-size: 0.75rem;
  color: #9ca3af;
}

.icon-upload {
  color: #667eea;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.textarea-field {
  resize: vertical;
  min-height: 120px;
  font-family: inherit;
}

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.radio-option:hover {
  border-color: #667eea;
  background: #f9fafb;
}

.radio-option input[type="radio"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.radio-option span {
  font-weight: 500;
  color: #374151;
}

.info-prix-enchere {
  padding: 1rem;
  background: #eff6ff;
  border-radius: 8px;
  border-left: 3px solid #667eea;
}

.info-prix-enchere p {
  color: #1e40af;
  font-size: 0.875rem;
  margin: 0;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 1.75rem;
  }

  .filters-section {
    flex-direction: column;
  }

  .filter-select {
    min-width: 100%;
  }

  .objets-grid {
    grid-template-columns: 1fr;
  }

  .modal-overlay {
    padding: 0.5rem;
  }

  .modal-content {
    max-height: 95vh;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .tabs {
    overflow-x: auto;
  }

  .tab-button {
    white-space: nowrap;
  }

  .thumbnails-detail {
    grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  }

  .detail-nom {
    font-size: 1.5rem;
  }

  .montant-detail {
    font-size: 1.5rem;
  }

  .resume-interactions {
    flex-direction: column;
  }

  .detail-action {
    flex-direction: column;
  }

  .btn-baisser-prix-detail,
  .btn-modifier-detail {
    width: 100%;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal-modifier {
    max-width: 100%;
  }
}
</style>
