<template>
  <div class="article-page">
    <div class="article-container">
      <!-- Navigation retour -->
      <button @click="$emit('retour')" class="btn-retour">
        ← Retour
      </button>

      <!-- Galerie photos -->
      <div class="gallery-section">
        <div class="main-image">
          <img :src="currentPhoto" :alt="article.nom" @click="openLightbox" />
          <div class="photo-counter">
            {{ currentPhotoIndex + 1 }} / {{ article.photos.length }}
          </div>
        </div>

        <div class="thumbnails">
          <div v-for="(photo, index) in article.photos" :key="index" class="thumbnail"
            :class="{ active: index === currentPhotoIndex }" @click="currentPhotoIndex = index">
            <img :src="photo.preview" :alt="`Photo ${index + 1}`" />
          </div>
        </div>
      </div>

      <!-- Informations article -->
      <div class="article-info">
        <div class="article-header">
          <h1>{{ article.nom }}</h1>
          <div class="category-badge">{{ article.categorie }}</div>
        </div>

        <!-- Prix et type de vente -->
        <div class="price-section">
          <div v-if="article.typeVente === 'enchere'" class="enchere-info">
            <div class="current-price">
              <span class="label">Prix de départ</span>
              <span class="price">{{ formatPrice(article.prixDepart) }}</span>
            </div>

            <div class="enchere-duration">
              <span class="icon">🕐</span>
              Enchère de {{ article.dureeEnchere }} jours
            </div>
          </div>

          <div v-else class="vente-rapide-info">
            <div class="current-price">
              <span class="label">Prix</span>
              <span class="price">{{ formatPrice(article.prix) }}</span>
            </div>
            <button class="btn-acheter">
              ⚡ Acheter maintenant
            </button>
          </div>
        </div>

        <!-- Description -->
        <div class="description-section">
          <h2>Description</h2>
          <p class="description-text">{{ article.description }}</p>
        </div>

        <!-- Caractéristiques -->
        <div class="caracteristiques-section">
          <h2>Caractéristiques</h2>
          <div class="caracteristiques-grid">
            <div class="carac-item">
              <span class="carac-label">Dimensions</span>
              <span class="carac-value">
                {{ article.dimensions.hauteur }} × {{ article.dimensions.largeur }} × {{ article.dimensions.profondeur
                }} cm
              </span>
            </div>
            <div class="carac-item">
              <span class="carac-label">Poids</span>
              <span class="carac-value">{{ article.poids }} kg</span>
            </div>
            <div class="carac-item">
              <span class="carac-label">Catégorie</span>
              <span class="carac-value">{{ article.categorie }}</span>
            </div>
          </div>
        </div>

        <!-- Documents -->
        <div v-if="article.documents && article.documents.length > 0" class="documents-section">
          <h2>Documents</h2>
          <div class="documents-list">
            <div v-for="(doc, index) in article.documents" :key="index" class="document-item">
              <span class="icon-doc">📄</span>
              <span class="doc-name">{{ doc.name }}</span>
              <div class="doc-actions">
                <button class="btn-visualiser" @click="visualiserDocument(doc)">
                  👁️ Visualiser
                </button>
                <button class="btn-download" @click="telechargerDocument(doc)">
                  ⬇️ Télécharger
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="actions-section">
          <button v-if="article.typeVente === 'enchere'" class="btn-primary">
            🔨 Placer une enchère
          </button>
          <button class="btn-secondary">
            ❤️ Ajouter aux favoris
          </button>
        </div>
      </div>
    </div>

    <!-- Lightbox pour affichage plein écran -->
    <div v-if="lightboxOpen" class="lightbox" @click="closeLightbox">
      <button class="lightbox-close" @click.stop="closeLightbox">✕</button>
      <button class="lightbox-prev" @click.stop="prevPhoto">‹</button>
      <button class="lightbox-next" @click.stop="nextPhoto">›</button>
      <img :src="currentPhoto" :alt="article.nom" @click.stop />
      <div class="lightbox-counter">
        {{ currentPhotoIndex + 1 }} / {{ article.photos.length }}
      </div>
    </div>

    <!-- Modal de visualisation des documents -->
    <div v-if="documentViewerOpen" class="document-viewer" @click="closeDocumentViewer">
      <div class="document-viewer-container" @click.stop>
        <button class="viewer-close" @click="closeDocumentViewer">✕</button>
        <div class="document-header">
          <h3>{{ currentDocument?.name }}</h3>
        </div>
        <div class="document-content">
          <!-- Affichage pour les images -->
          <img v-if="currentDocument && isImage(currentDocument.name)"
            :src="currentDocument.preview || currentDocument.url" :alt="currentDocument.name" class="document-image" />
          <!-- Affichage pour les PDFs -->
          <iframe v-else-if="currentDocument && isPDF(currentDocument.name)" :src="getDocumentUrl(currentDocument)"
            frameborder="0" class="document-iframe"></iframe>
          <!-- Fallback pour autres types -->
          <div v-else class="document-fallback">
            <div class="fallback-icon">📄</div>
            <p>Prévisualisation non disponible pour ce type de fichier</p>
            <button @click="telechargerDocument(currentDocument)" class="btn-download-fallback">
              Télécharger le document
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})

defineEmits(['retour'])

const currentPhotoIndex = ref(0)
const lightboxOpen = ref(false)
const documentViewerOpen = ref(false)
const currentDocument = ref(null)

const currentPhoto = computed(() => {
  if (props.article.photos && props.article.photos.length > 0) {
    return props.article.photos[currentPhotoIndex.value].preview
  }
  return ''
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR'
  }).format(price)
}

const openLightbox = () => {
  lightboxOpen.value = true
}

const closeLightbox = () => {
  lightboxOpen.value = false
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

const visualiserDocument = (doc) => {
  console.log('Document à visualiser:', doc)
  currentDocument.value = doc
  documentViewerOpen.value = true
}

const closeDocumentViewer = () => {
  documentViewerOpen.value = false
  currentDocument.value = null
}

const isImage = (filename) => {
  if (!filename) return false
  const ext = filename.toLowerCase().split('.').pop()
  return ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)
}

const isPDF = (filename) => {
  if (!filename) return false
  return filename.toLowerCase().endsWith('.pdf')
}

const getDocumentUrl = (doc) => {
  const url = doc.preview || doc.url
  console.log('URL du document:', url)
  return url
}

const telechargerDocument = (doc) => {
  // Créer un lien de téléchargement
  const link = document.createElement('a')
  link.href = doc.preview
  link.download = doc.name
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
</script>

<style scoped>
.article-page {
  min-height: 100vh;
  background: #f9fafb;
  padding: 2rem 1rem;
}

.article-container {
  max-width: 1200px;
  margin: 0 auto;
}

.btn-retour {
  background: transparent;
  border: 1px solid #d1d5db;
  color: #6b7280;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.95rem;
  cursor: pointer;
  margin-bottom: 2rem;
  transition: all 0.2s;
}

.btn-retour:hover {
  background: #f9fafb;
  color: #374151;
  border-color: #9ca3af;
}

.gallery-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.main-image {
  position: relative;
  width: 100%;
  max-height: 600px;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  overflow: hidden;
  background: #f3f4f6;
  cursor: pointer;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  max-height: 600px;
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

.thumbnails {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 1rem;
}

.thumbnail {
  aspect-ratio: 1;
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
  box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.2);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-info {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.article-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.article-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.category-badge {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.price-section {
  padding: 2rem;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.enchere-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.current-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

.price {
  font-size: 2rem;
  font-weight: 700;
  color: #10b981;
}

.price-min {
  font-size: 1.25rem;
  font-weight: 600;
  color: #6b7280;
}

.enchere-duration {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #374151;
  font-weight: 500;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}

.vente-rapide-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.btn-acheter {
  background: #10b981;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-acheter:hover {
  background: #059669;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.description-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.description-section h2,
.caracteristiques-section h2,
.documents-section h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.description-text {
  color: #374151;
  line-height: 1.8;
  white-space: pre-wrap;
}

.caracteristiques-section {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e5e7eb;
}

.caracteristiques-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.carac-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.carac-label {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

.carac-value {
  color: #1f2937;
  font-size: 1rem;
  font-weight: 600;
}

.documents-section {
  margin-bottom: 2rem;
}

.documents-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.document-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.icon-doc {
  font-size: 1.5rem;
}

.doc-name {
  flex: 1;
  color: #374151;
  font-weight: 500;
}

.doc-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-visualiser,
.btn-download {
  background: transparent;
  color: #667eea;
  border: 1px solid #667eea;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-visualiser {
  color: #10b981;
  border-color: #10b981;
}

.btn-visualiser:hover {
  background: #10b981;
  color: white;
}

.btn-download:hover {
  background: #667eea;
  color: white;
}

.actions-section {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  min-width: 200px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: white;
  color: #667eea;
  padding: 1rem 2rem;
  border: 2px solid #667eea;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  min-width: 200px;
}

.btn-secondary:hover {
  background: #f3f4f6;
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
  padding: 2rem;
}

.lightbox img {
  max-width: 90%;
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
  width: 50px;
  height: 50px;
  border-radius: 50%;
  font-size: 2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
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
  font-size: 2.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
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

/* Document Viewer Modal */
.document-viewer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 1001;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.document-viewer-container {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 1200px;
  height: 90vh;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
}

.viewer-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.1);
  color: #374151;
  border: 2px solid #d1d5db;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 10;
}

.viewer-close:hover {
  background: rgba(0, 0, 0, 0.2);
  transform: scale(1.1);
}

.document-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.document-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
}

.document-content {
  flex: 1;
  overflow: hidden;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
}

.document-iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.document-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.document-fallback {
  text-align: center;
  padding: 2rem;
}

.fallback-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.document-fallback p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.btn-download-fallback {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-download-fallback:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

@media (max-width: 768px) {
  .article-page {
    padding: 1rem 0.5rem;
  }

  .gallery-section,
  .article-info {
    padding: 1rem;
  }

  .article-header h1 {
    font-size: 1.5rem;
  }

  .price {
    font-size: 1.5rem;
  }

  .thumbnails {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 0.5rem;
  }

  .actions-section {
    flex-direction: column;
  }

  .btn-primary,
  .btn-secondary {
    min-width: 100%;
  }

  .doc-actions {
    flex-direction: column;
    width: 100%;
  }

  .btn-visualiser,
  .btn-download {
    width: 100%;
  }

  .document-viewer {
    padding: 0.5rem;
  }

  .document-viewer-container {
    width: 100%;
    height: 95vh;
    border-radius: 8px;
  }

  .document-header {
    padding: 1rem;
  }

  .document-header h3 {
    font-size: 1rem;
    padding-right: 3rem;
  }

  .viewer-close {
    top: 0.5rem;
    right: 0.5rem;
    width: 35px;
    height: 35px;
  }

  .lightbox-prev {
    left: 1rem;
  }

  .lightbox-next {
    right: 1rem;
  }

  .lightbox-prev,
  .lightbox-next {
    width: 50px;
    height: 50px;
    font-size: 2rem;
  }
}
</style>
