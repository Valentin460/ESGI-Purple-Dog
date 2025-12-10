<template>
  <div class="publier-objet-container">
    <!-- Affichage de l'article après publication -->
    <ArticleDetail v-if="articlePublie" :article="articlePublie" @retour="retourFormulaire" />

    <!-- Formulaire de publication -->
    <div v-else class="publier-objet-card">
      <h1>Publier un objet</h1>
      <p class="subtitle">Mettez en vente votre objet d'exception</p>

      <form @submit.prevent="handleSubmit" class="publier-form">
        <!-- Informations générales -->
        <div class="form-section">
          <h2>Informations générales</h2>

          <div class="form-group">
            <label for="nom">Nom de l'objet </label>
            <input type="text" id="nom" v-model="formData.nom" required placeholder="Ex: Vase Art Déco en cristal" />
          </div>

          <div class="form-group">
            <label for="categorie">Catégorie </label>
            <select id="categorie" v-model="formData.categorie" required>
              <option value="" disabled>Sélectionnez une catégorie</option>
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
              <label for="hauteur">Hauteur (cm) *</label>
              <input type="number" id="hauteur" v-model.number="formData.dimensions.hauteur" required placeholder="0"
                min="0" step="0.1" />
            </div>

            <div class="form-group">
              <label for="largeur">Largeur (cm) *</label>
              <input type="number" id="largeur" v-model.number="formData.dimensions.largeur" required placeholder="0"
                min="0" step="0.1" />
            </div>

            <div class="form-group">
              <label for="profondeur">Profondeur (cm) *</label>
              <input type="number" id="profondeur" v-model.number="formData.dimensions.profondeur" required
                placeholder="0" min="0" step="0.1" />
            </div>
          </div>

          <div class="form-group">
            <label for="poids">Poids (kg) *</label>
            <input type="number" id="poids" v-model.number="formData.poids" required placeholder="0" min="0"
              step="0.1" />
          </div>

          <div class="form-group">
            <label for="description">Description </label>
            <textarea id="description" v-model="formData.description" required
              placeholder="Décrivez votre objet en détail : époque, matériaux, état, provenance..." rows="6"></textarea>
            <span class="char-count">{{ formData.description.length }} caractères</span>
          </div>
        </div>

        <!-- Photos -->
        <div class="form-section">
          <h2>Photos </h2>
          <p class="section-info">
            <InfoIcon :size="20" class="icon-info" />
            Minimum 10 photos requises - Format JPG, PNG - Maximum 5 Mo par photo
          </p>

          <div class="photos-upload-zone">
            <input type="file" ref="photosInput" @change="handlePhotosUpload" accept="image/jpeg,image/png,image/jpg"
              multiple style="display: none" />

            <div class="photos-grid">
              <div v-for="(photo, index) in formData.photos" :key="index" class="photo-preview">
                <img :src="photo.preview" :alt="`Photo ${index + 1}`" />
                <button type="button" @click="removePhoto(index)" class="remove-photo-btn">
                  <XIcon :size="16" />
                </button>
                <span class="photo-number">{{ index + 1 }}</span>
              </div>

              <button type="button" @click="$refs.photosInput.click()" class="add-photo-btn"
                :class="{ disabled: formData.photos.length >= 20 }" :disabled="formData.photos.length >= 20">
                <UploadIcon :size="32" class="icon-upload" />
                <span>Ajouter des photos</span>
                <small>{{ formData.photos.length }}/20</small>
              </button>
            </div>

            <span v-if="photosError" class="error-text">{{ photosError }}</span>
          </div>
        </div>

        <!-- Documents -->
        <div class="form-section">
          <h2>Documents</h2>
          <p class="section-info">
            <InfoIcon :size="20" class="icon-info" />
            Certificat d'authenticité, facture, expertise... (Optionnel mais recommandé)
          </p>

          <div class="documents-upload-zone">
            <input type="file" ref="documentsInput" @change="handleDocumentsUpload" accept=".pdf,.jpg,.jpeg,.png"
              multiple style="display: none" />

            <div class="documents-list">
              <div v-for="(doc, index) in formData.documents" :key="index" class="document-item">
                <FileTextIcon :size="20" class="icon-file" />
                <span class="document-name">{{ doc.name }}</span>
                <span class="document-size">{{ formatFileSize(doc.size) }}</span>
                <button type="button" @click="removeDocument(index)" class="remove-doc-btn">
                  <XIcon :size="16" />
                </button>
              </div>

              <button type="button" @click="$refs.documentsInput.click()" class="add-document-btn">
                <UploadIcon :size="18" class="icon-upload-small" />
                <span>Ajouter un document</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Prix et type de vente -->
        <div class="form-section">
          <h2>Prix et type de vente</h2>

          <div class="form-group">
            <label for="prix">Prix souhaité (€) </label>
            <input type="number" id="prix" v-model.number="formData.prix" required placeholder="0" min="0"
              step="0.01" />
          </div>

          <div class="form-group">
            <label>Type de vente </label>
            <div class="radio-group">
              <label class="radio-label">
                <input type="radio" v-model="formData.typeVente" value="enchere" required />
                <div class="radio-content">
                  <HammerIcon :size="20" class="icon-gavel" />
                  <div>
                    <strong>Enchère</strong>
                    <p>Mettez votre objet aux enchères</p>
                  </div>
                </div>
              </label>

              <label class="radio-label">
                <input type="radio" v-model="formData.typeVente" value="vente-rapide" required />
                <div class="radio-content">
                  <ZapIcon :size="20" class="icon-zap" />
                  <div>
                    <strong>Vente rapide</strong>
                    <p>Vendez directement au prix fixé</p>
                  </div>
                </div>
              </label>
            </div>
          </div>

          <!-- Options spécifiques aux enchères -->
          <div v-if="formData.typeVente === 'enchere'" class="enchere-options">
            <div class="info-enchere">
              <InfoIcon :size="20" class="icon-info" />
              <div>
                <p><strong>Fonctionnement des enchères :</strong></p>
                <ul>
                  <li>Votre prix souhaité devient automatiquement le prix minimum de vente</li>
                  <li>Le prix de départ est calculé automatiquement à -10% du prix souhaité</li>
                  <li>L'objet ne sera vendu que si les enchères atteignent le prix minimum</li>
                  <li>Durée par défaut : 7 jours</li>
                </ul>
              </div>
            </div>

            <div class="form-group">
              <label>Prix minimum de vente :
                {{ formData.prix ? formData.prix.toFixed(2) : '0.00' }} €</label>
              <p class="info-text">
                Correspond à votre prix souhaité. L'objet ne sera pas vendu en dessous de ce prix.
              </p>
            </div>

            <div class="form-group">
              <label>Prix de départ de l'enchère : {{ prixDepartRecommande }} € (-10%
                automatique)</label>
              <p class="info-text">Calculé automatiquement à partir de votre prix souhaité</p>
            </div>
          </div>
        </div>

        <!-- Messages d'erreur et succès -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <div v-if="success" class="success-message">
          <div class="success-icon">
            <CheckIcon :size="24" />
          </div>
          <div>
            <strong>Objet publié avec succès !</strong>
            <p>Votre objet est maintenant en ligne et visible par nos acheteurs.</p>
          </div>
        </div>

        <!-- Boutons -->
        <div class="form-actions">
          <button type="button" class="btn-cancel" @click="handleCancel">Annuler</button>
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Publication en cours...' : "Publier l'objet" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
  InfoIcon,
  UploadIcon,
  XIcon,
  FileTextIcon,
  HammerIcon,
  ZapIcon,
  CheckIcon,
} from 'lucide-vue-next'
import ArticleDetail from './ArticleDetail.vue'

const formData = ref({
  nom: '',
  categorie: '',
  dimensions: {
    hauteur: null,
    largeur: null,
    profondeur: null,
  },
  poids: null,
  description: '',
  photos: [],
  documents: [],
  prix: null,
  typeVente: '',
  prixDepart: null,
  dureeEnchere: '7',
})

const photosInput = ref(null)
const documentsInput = ref(null)
const isSubmitting = ref(false)
const error = ref('')
const success = ref(false)
const photosError = ref('')
const articlePublie = ref(null)

// Calculer le prix de départ automatiquement (-10% du prix souhaité)
const prixDepartRecommande = computed(() => {
  if (formData.value.prix) {
    return (formData.value.prix * 0.9).toFixed(2)
  }
  return '0.00'
})

// Surveiller les changements du prix souhaité pour mettre à jour automatiquement le prix de départ
watch(
  () => formData.value.prix,
  (newPrix) => {
    if (newPrix) {
      // Mettre à jour automatiquement le prix de départ à -10%
      formData.value.prixDepart = parseFloat((newPrix * 0.9).toFixed(2))
    }
  },
)

const handlePhotosUpload = (event) => {
  const files = Array.from(event.target.files)
  photosError.value = ''

  // Vérifier le nombre total de photos
  if (formData.value.photos.length + files.length > 20) {
    photosError.value = 'Vous ne pouvez pas ajouter plus de 20 photos'
    return
  }

  files.forEach((file) => {
    // Vérifier la taille du fichier (5 Mo max)
    if (file.size > 5 * 1024 * 1024) {
      photosError.value = `La photo "${file.name}" dépasse 5 Mo`
      return
    }

    // Créer une prévisualisation
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.value.photos.push({
        file: file,
        preview: e.target.result,
        name: file.name,
      })
    }
    reader.readAsDataURL(file)
  })

  // Réinitialiser l'input
  event.target.value = ''
}

const removePhoto = (index) => {
  formData.value.photos.splice(index, 1)
  photosError.value = ''
}

const handleDocumentsUpload = (event) => {
  const files = Array.from(event.target.files)

  files.forEach((file) => {
    // Vérifier la taille du fichier (10 Mo max)
    if (file.size > 10 * 1024 * 1024) {
      error.value = `Le document "${file.name}" dépasse 10 Mo`
      return
    }

    formData.value.documents.push(file)
  })

  // Réinitialiser l'input
  event.target.value = ''
}

const removeDocument = (index) => {
  formData.value.documents.splice(index, 1)
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const handleCancel = () => {
  if (confirm('Êtes-vous sûr de vouloir annuler ? Toutes les données seront perdues.')) {
    // Réinitialiser le formulaire
    formData.value = {
      nom: '',
      categorie: '',
      dimensions: {
        hauteur: null,
        largeur: null,
        profondeur: null,
      },
      poids: null,
      description: '',
      photos: [],
      documents: [],
      prix: null,
      typeVente: '',
      prixDepart: null,
      dureeEnchere: '7',
    }
    photosError.value = ''
    error.value = ''
    success.value = false
  }
}

const retourFormulaire = () => {
  articlePublie.value = null
  handleCancel()
}

const handleSubmit = async () => {
  error.value = ''
  photosError.value = ''

  // Validation des photos (minimum 10)
  if (formData.value.photos.length < 10) {
    photosError.value = 'Vous devez télécharger au moins 10 photos'
    error.value = 'Veuillez corriger les erreurs du formulaire'
    return
  }

  // Validation pour les enchères
  if (formData.value.typeVente === 'enchere') {
    if (!formData.value.prix) {
      error.value = 'Le prix souhaité est requis pour une enchère'
      return
    }
    // Le prix de départ est calculé automatiquement, pas besoin de validation supplémentaire
    if (!formData.value.dureeEnchere) {
      error.value = "La durée de l'enchère est requise"
      return
    }
  }

  isSubmitting.value = true

  try {
    // Simulation de l'envoi du formulaire
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Ici, vous enverriez les données au backend
    console.log("Données de l'objet:", formData.value)

    // Afficher l'article publié
    articlePublie.value = { ...formData.value }
    success.value = true
  } catch {
    error.value = 'Une erreur est survenue lors de la publication. Veuillez réessayer.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
/* Styles pour les icônes SVG */
.icon-info,
.icon-file,
.icon-gavel,
.icon-zap {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.icon-upload {
  width: 32px;
  height: 32px;
}

.icon-upload-small {
  width: 18px;
  height: 18px;
}

.remove-photo-btn svg,
.remove-doc-btn svg {
  width: 16px;
  height: 16px;
}

.success-icon svg {
  width: 24px;
  height: 24px;
}

.section-info,
.radio-content,
.document-item,
.info-enchere {
  display: flex;
  align-items: center;
  gap: 8px;
}

.publier-objet-container {
  min-height: 100vh;
  background: #f9fafb;
  padding: 2rem 1rem;
}

.publier-objet-card {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 2.5rem;
}

h1 {
  color: #1f2937;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #6b7280;
  margin-bottom: 2rem;
}

.publier-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 2rem;
}

.form-section:last-of-type {
  border-bottom: none;
}

.form-section h2 {
  color: #374151;
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.section-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: #f3f4f6;
  border-radius: 6px;
}

.icon-info,
.icon-file,
.icon-upload,
.icon-upload-small,
.icon-gavel,
.icon-zap {
  font-size: 1.2rem;
}

.icon-upload {
  font-size: 2rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  color: #374151;
  font-weight: 500;
  font-size: 0.95rem;
}

input[type='text'],
input[type='number'],
select,
textarea {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  font-family: inherit;
  width: 100%;
  max-width: 100%;
}

input[type='text']:focus,
input[type='number']:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

textarea {
  resize: vertical;
}

.char-count {
  font-size: 0.875rem;
  color: #6b7280;
  text-align: right;
}

/* Photos */
.photos-upload-zone {
  margin-top: 1rem;
}

.photos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
}

.photo-preview {
  position: relative;
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e5e7eb;
}

.photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-photo-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
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
  background: #dc2626;
  transform: scale(1.1);
}

.photo-number {
  position: absolute;
  bottom: 0.5rem;
  left: 0.5rem;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}

.add-photo-btn {
  aspect-ratio: 1;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background: #f9fafb;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #6b7280;
}

.add-photo-btn:hover:not(.disabled) {
  border-color: #667eea;
  background: #f3f4f6;
  color: #667eea;
}

.add-photo-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.add-photo-btn small {
  font-size: 0.75rem;
}

.error-text {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: block;
}

/* Documents */
.documents-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.document-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
}

.document-name {
  flex: 1;
  color: #374151;
  font-weight: 500;
}

.document-size {
  color: #6b7280;
  font-size: 0.875rem;
}

.remove-doc-btn {
  background: transparent;
  color: #ef4444;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  transition: all 0.2s;
}

.remove-doc-btn:hover {
  color: #dc2626;
  transform: scale(1.1);
}

.add-document-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px dashed #d1d5db;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
  width: 100%;
  justify-content: center;
}

.add-document-btn:hover {
  border-color: #667eea;
  color: #667eea;
  background: #f9fafb;
}

/* Radio buttons */
.radio-group {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.radio-label {
  cursor: pointer;
}

.radio-label input[type='radio'] {
  display: none;
}

.radio-content {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  transition: all 0.2s;
}

.radio-label input[type='radio']:checked+.radio-content {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.05);
}

.radio-content:hover {
  border-color: #667eea;
}

.radio-content strong {
  display: block;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.radio-content p {
  color: #6b7280;
  font-size: 0.875rem;
  margin: 0;
}

.enchere-options {
  margin-top: 1rem;
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-enchere {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.info-enchere ul {
  margin: 0.5rem 0 0 0;
  padding-left: 1.5rem;
  color: #1e40af;
}

.info-enchere li {
  margin: 0.25rem 0;
  font-size: 0.875rem;
}

.info-enchere p {
  margin: 0;
  color: #1e40af;
}

.help-text {
  font-size: 0.875rem;
  color: #6b7280;
  font-style: italic;
}

.info-text {
  font-size: 0.875rem;
  color: #059669;
  margin-top: 0.25rem;
  font-weight: 500;
}

/* Messages */
.error-message {
  background-color: #fef2f2;
  color: #991b1b;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #ef4444;
}

.success-message {
  background-color: #f0fdf4;
  color: #166534;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #10b981;
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.success-icon {
  background: #10b981;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.success-message p {
  margin-top: 0.5rem;
  color: #166534;
}

/* Boutons d'action */
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1rem;
}

.btn-cancel {
  background: transparent;
  color: #6b7280;
  padding: 1rem 2rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background: #f9fafb;
  color: #374151;
}

.btn-submit {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .publier-objet-card {
    padding: 1.5rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .radio-group {
    grid-template-columns: 1fr;
  }

  .photos-grid {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }

  .form-actions {
    flex-direction: column;
  }

  .btn-cancel,
  .btn-submit {
    width: 100%;
  }

  /* Amélioration des selects sur mobile */
  select {
    font-size: 16px;
    /* Évite le zoom automatique sur iOS */
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23333' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    padding-right: 2.5rem;
  }

  input[type='text'],
  input[type='number'],
  textarea {
    font-size: 16px;
    /* Évite le zoom automatique sur iOS */
  }
}
</style>
