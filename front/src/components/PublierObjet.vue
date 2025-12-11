<template>
  <div class="min-h-screen bg-gray-50 py-8 px-4 w-full flex flex-col justify-center items-center">
    <!-- Affichage de l'article après publication -->
    <ArticleDetail v-if="articlePublie" :article="articlePublie" @retour="retourFormulaire" />

    <!-- Formulaire de publication -->
    <div v-else class="max-w-4xl w-full mx-auto rounded-lg p-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Publier un objet</h1>
      <p class="text-gray-600 mb-8">Mettez en vente votre objet d'exception</p>

      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Informations générales -->
        <div class="border-b border-gray-200 pb-8">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Informations générales</h2>

          <div class="space-y-4">
            <div>
              <label for="nom" class="block text-sm font-medium text-gray-700 mb-1">
                Nom de l'objet
              </label>
              <input
                type="text"
                id="nom"
                v-model="formData.nom"
                required
                placeholder="Ex: Vase Art Déco en cristal"
                class="input"
              />
            </div>

            <div>
              <label for="categorie" class="block text-sm font-medium text-gray-700 mb-1">
                Catégorie
              </label>
              <select id="categorie" v-model="formData.categorie" required class="input">
                <option value="" disabled>Sélectionnez une catégorie</option>
                <option value="Bijoux & montres">Bijoux & montres</option>
                <option value="Meubles anciens">Meubles anciens</option>
                <option value="Objets d'art & tableaux">Objets d'art & tableaux</option>
                <option value="Objets de collection">
                  Objets de collection Objets de collection (jouets, timbres, monnaies…)
                </option>
                <option value="Vins & spiritueux de collection">
                  Vins & spiritueux de collection
                </option>
                <option value="Instruments de musique">Instruments de musique</option>
                <option value="Livres anciens & manuscrits">Livres anciens & manuscrits</option>
                <option value="Mode & accessoires de luxe">
                  Mode & accessoires de luxe (sacs, chaussures, vêtements de marque, etc.)
                </option>
                <option value="Horlogerie & pendules anciennes">
                  Horlogerie & pendules anciennes
                </option>
                <option value="Photographies anciennes & appareils vintage">
                  Photographies anciennes & appareils vintage
                </option>
                <option value="Vaisselle & argenterie & cristallerie">
                  Vaisselle & argenterie & cristallerie
                </option>
                <option value="Sculptures & objets décoratifs">
                  Sculptures & objets décoratifs
                </option>
                <option value="Véhicules de collection">Véhicules de collection</option>
                <option value="Véhicules de collection">
                  Véhicules de collection (auto, moto, nautisme, etc.)
                </option>
              </select>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label for="hauteur" class="block text-sm font-medium text-gray-700 mb-1">
                  Hauteur (cm) *
                </label>
                <input
                  type="number"
                  id="hauteur"
                  v-model.number="formData.dimensions.hauteur"
                  required
                  placeholder="0"
                  min="0"
                  step="0.1"
                  class="input"
                />
              </div>

              <div>
                <label for="largeur" class="block text-sm font-medium text-gray-700 mb-1">
                  Largeur (cm) *
                </label>
                <input
                  type="number"
                  id="largeur"
                  v-model.number="formData.dimensions.largeur"
                  required
                  placeholder="0"
                  min="0"
                  step="0.1"
                  class="input"
                />
              </div>

              <div>
                <label for="profondeur" class="block text-sm font-medium text-gray-700 mb-1">
                  Profondeur (cm) *
                </label>
                <input
                  type="number"
                  id="profondeur"
                  v-model.number="formData.dimensions.profondeur"
                  required
                  placeholder="0"
                  min="0"
                  step="0.1"
                  class="input"
                />
              </div>
            </div>

            <div>
              <label for="poids" class="block text-sm font-medium text-gray-700 mb-1">
                Poids (kg) *
              </label>
              <input
                type="number"
                id="poids"
                v-model.number="formData.poids"
                required
                placeholder="0"
                min="0"
                step="0.1"
                class="input"
              />
            </div>

            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                v-model="formData.description"
                required
                placeholder="Décrivez votre objet en détail : époque, matériaux, état, provenance..."
                rows="6"
                class="input resize-y"
              ></textarea>
              <span class="text-sm text-gray-500 text-right block mt-1">
                {{ formData.description.length }} caractères
              </span>
            </div>
          </div>
        </div>

        <!-- Photos -->
        <div class="border-b border-gray-200 pb-8">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Photos</h2>
          <div class="flex items-start gap-2 text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-md">
            <InfoIcon :size="20" class="shrink-0 mt-0.5" />
            <p>Minimum 10 photos requises - Format JPG, PNG - Maximum 5 Mo par photo</p>
          </div>

          <div>
            <input
              type="file"
              ref="photosInput"
              @change="handlePhotosUpload"
              accept="image/jpeg,image/png,image/jpg"
              multiple
              class="hidden"
            />

            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              <div
                v-for="(photo, index) in formData.photos"
                :key="index"
                class="relative aspect-square border-2 border-gray-200 rounded-lg overflow-hidden"
              >
                <img
                  :src="photo.preview"
                  :alt="`Photo ${index + 1}`"
                  class="w-full h-full object-cover"
                />
                <button
                  type="button"
                  @click="removePhoto(index)"
                  class="absolute top-2 right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <XIcon :size="16" />
                </button>
                <span
                  class="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs font-semibold"
                >
                  {{ index + 1 }}
                </span>
              </div>

              <button
                type="button"
                @click="$refs.photosInput.click()"
                :disabled="formData.photos.length >= 20"
                :class="[
                  'aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center gap-2 transition-colors',
                  formData.photos.length >= 20
                    ? 'border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'border-gray-300 bg-gray-50 text-gray-600 hover:border-primary hover:bg-gray-100 hover:text-primary cursor-pointer',
                ]"
              >
                <UploadIcon :size="32" />
                <span class="text-sm font-medium">Ajouter des photos</span>
                <small class="text-xs">{{ formData.photos.length }}/20</small>
              </button>
            </div>

            <span v-if="photosError" class="text-red-600 text-sm mt-2 block">{{
              photosError
            }}</span>
          </div>
        </div>

        <!-- Documents -->
        <div class="border-b border-gray-200 pb-8">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Documents</h2>
          <div class="flex items-start gap-2 text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-md">
            <InfoIcon :size="20" class="shrink-0 mt-0.5" />
            <p>Certificat d'authenticité, facture, expertise... (Optionnel mais recommandé)</p>
          </div>

          <div class="space-y-3">
            <input
              type="file"
              ref="documentsInput"
              @change="handleDocumentsUpload"
              accept=".pdf,.jpg,.jpeg,.png"
              multiple
              class="hidden"
            />

            <div
              v-for="(doc, index) in formData.documents"
              :key="index"
              class="flex items-center gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              <FileTextIcon :size="20" class="text-gray-600 shrink-0" />
              <span class="flex-1 text-gray-800 font-medium truncate">{{ doc.name }}</span>
              <span class="text-gray-500 text-sm">{{ formatFileSize(doc.size) }}</span>
              <button
                type="button"
                @click="removeDocument(index)"
                class="text-red-500 hover:text-red-600 transition-colors p-1"
              >
                <XIcon :size="16" />
              </button>
            </div>

            <button
              type="button"
              @click="$refs.documentsInput.click()"
              class="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-gray-300 rounded-lg bg-white text-gray-600 hover:border-primary hover:text-primary hover:bg-gray-50 transition-colors"
            >
              <UploadIcon :size="18" />
              <span class="font-medium">Ajouter un document</span>
            </button>
          </div>
        </div>

        <!-- Prix et type de vente -->
        <div class="border-b border-gray-200 pb-8">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Prix et type de vente</h2>

          <div class="space-y-4">
            <div>
              <label for="prix" class="block text-sm font-medium text-gray-700 mb-1">
                Prix souhaité (€)
              </label>
              <input
                type="number"
                id="prix"
                v-model.number="formData.prix"
                required
                placeholder="0"
                min="0"
                step="0.01"
                class="input"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Type de vente</label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label class="cursor-pointer">
                  <input
                    type="radio"
                    v-model="formData.typeVente"
                    value="enchere"
                    required
                    class="hidden peer"
                  />
                  <div
                    class="flex items-center gap-3 p-6 border-2 border-gray-200 rounded-lg peer-checked:border-primary peer-checked:bg-primary hover:border-primary transition-colors"
                  >
                    <HammerIcon :size="24" class="text-gray-600 shrink-0" />
                    <div>
                      <strong class="block text-gray-900 mb-1">Enchère</strong>
                      <p class="text-sm text-gray-600">Mettez votre objet aux enchères</p>
                    </div>
                  </div>
                </label>

                <label class="cursor-pointer">
                  <input
                    type="radio"
                    v-model="formData.typeVente"
                    value="vente-rapide"
                    required
                    class="hidden peer"
                  />
                  <div
                    class="flex items-center gap-3 p-6 border-2 border-gray-200 rounded-lg peer-checked:border-primary peer-checked:bg-primary/5 hover:border-primary transition-colors"
                  >
                    <ZapIcon :size="24" class="text-gray-600 shrink-0" />
                    <div>
                      <strong class="block text-gray-900 mb-1">Vente rapide</strong>
                      <p class="text-sm text-gray-600">Vendez directement au prix fixé</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <!-- Options spécifiques aux enchères -->
            <div
              v-if="formData.typeVente === 'enchere'"
              class="bg-gray-50 rounded-lg p-6 space-y-4"
            >
              <div class="flex gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <InfoIcon :size="20" class="text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <p class="font-medium text-blue-900 mb-2">Fonctionnement des enchères :</p>
                  <ul class="text-sm text-blue-800 space-y-1 pl-5 list-disc">
                    <li>Votre prix souhaité devient automatiquement le prix minimum de vente</li>
                    <li>Le prix de départ est calculé automatiquement à -10% du prix souhaité</li>
                    <li>L'objet ne sera vendu que si les enchères atteignent le prix minimum</li>
                    <li>Durée par défaut : 7 jours</li>
                  </ul>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Prix minimum de vente : {{ formData.prix ? formData.prix.toFixed(2) : '0.00' }} €
                </label>
                <p class="text-sm text-green-600 font-medium">
                  Correspond à votre prix souhaité. L'objet ne sera pas vendu en dessous de ce prix.
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Prix de départ de l'enchère : {{ prixDepartRecommande }} € (-10% automatique)
                </label>
                <p class="text-sm text-green-600 font-medium">
                  Calculé automatiquement à partir de votre prix souhaité
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Messages d'erreur et succès -->
        <div v-if="error" class="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded">
          {{ error }}
        </div>

        <div
          v-if="success"
          class="flex gap-4 items-start bg-green-50 border-l-4 border-green-500 p-4 rounded"
        >
          <div
            class="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0"
          >
            <CheckIcon :size="20" />
          </div>
          <div>
            <strong class="block text-green-900 mb-1">Objet publié avec succès !</strong>
            <p class="text-green-800">
              Votre objet est maintenant en ligne et visible par nos acheteurs.
            </p>
          </div>
        </div>

        <!-- Boutons d'action -->
        <div class="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-4">
          <button
            type="button"
            @click="handleCancel"
            :disabled="isLoading"
            class="px-6 py-3 border border-gray-300 text-gray-700 rounded-md font-semibold hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="px-6 py-3 bg-primary text-white rounded-md font-semibold hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Loader2Icon v-if="isLoading" class="inline-block animate-spin" />
            {{ isLoading ? 'Publication en cours...' : "Publier l'objet" }}
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
  Loader2Icon,
} from 'lucide-vue-next'
import ArticleDetail from './ArticleDetail.vue'
import { useItemPublishing } from '../composables/useItemPublishing'

const { publishItem, isLoading } = useItemPublishing()

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
const error = ref('')
const success = ref(false)
const photosError = ref('')
const articlePublie = ref(null)

// Récupérer l'ID du vendeur depuis le localStorage ou le store
const getSellerId = () => {
  const user = localStorage.getItem('user')
  if (user) {
    try {
      const userData = JSON.parse(user)
      return userData.id
    } catch (e) {
      console.error('Erreur parsing user:', e)
    }
  }
  // Utiliser 1 comme fallback pour tester
  return 1
}

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

  try {
    const sellerId = getSellerId()

    const result = await publishItem(formData.value, sellerId)

    if (result.success) {
      // Afficher l'article publié
      articlePublie.value = {
        ...formData.value,
        ...result.data,
      }
      success.value = true
    } else {
      error.value = result.message || 'Erreur lors de la publication'
    }
  } catch (err) {
    error.value =
      err.message || 'Une erreur est survenue lors de la publication. Veuillez réessayer.'
    console.error('Erreur publication:', err)
  }
}
</script>
