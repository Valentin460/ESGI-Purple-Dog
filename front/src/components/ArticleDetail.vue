<template>
  <div class="article-page">
    <div class="article-container">
      <!-- Header avec boutons d'action -->
      <div class="page-header">
        <button @click="$emit('retour')" class="btn-retour">
          <ChevronLeft :size="20" />
          Retour
        </button>
        <div class="header-actions">
          <button @click="$emit('modifier')" class="btn-modifier">
            <Edit :size="20" />
            Modifier l'annonce
          </button>
          <button @click="confirmerSuppression" class="btn-supprimer">
            <Trash2 :size="20" />
            Supprimer
          </button>
        </div>
      </div>

      <!-- Statut et badges -->
      <div class="status-bar">
        <div class="status-badge" :class="article.statut">
          {{ getStatutLabel(article.statut) }}
        </div>
        <div class="type-badge" :class="article.typeVente">
          {{ article.typeVente === 'enchere' ? 'Enchère' : 'Vente rapide' }}
        </div>
      </div>

      <!-- Statistiques -->
      <div class="stats-section">
        <div class="stat-item clickable" @click="ouvrirOffres">
          <Gavel :size="20" />
          <div class="stat-content">
            <span class="stat-value">{{ article.nombreOffres || 0 }}</span>
            <span class="stat-label">Offre{{ article.nombreOffres > 1 ? 's' : '' }}</span>
          </div>
        </div>
        <div class="stat-item clickable" @click="ouvrirMessages">
          <MessageCircle :size="20" />
          <div class="stat-content">
            <span class="stat-value">{{ article.nombreMessages || 0 }}</span>
            <span class="stat-label">Message{{ article.nombreMessages > 1 ? 's' : '' }}</span>
          </div>
        </div>
        <div class="stat-item clickable" @click="ouvrirFavoris">
          <Heart :size="20" />
          <div class="stat-content">
            <span class="stat-value">{{ article.nombreFavoris || 0 }}</span>
            <span class="stat-label">Favori{{ article.nombreFavoris > 1 ? 's' : '' }}</span>
          </div>
        </div>
      </div>

      <div class="article-content">
        <!-- Galerie photos à gauche -->
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

        <!-- Informations à droite -->
        <div class="info-section">
          <!-- Titre et catégorie -->
          <div class="title-section">
            <h1>{{ article.nom }}</h1>
            <span class="category-badge">{{ article.categorie }}</span>
          </div>

          <!-- Prix et informations de vente -->
          <div class="price-section">
            <div v-if="article.typeVente === 'enchere'" class="enchere-info">
              <div class="price-box">
                <span class="label">Prix de départ</span>
                <span class="price">{{ formatPrice(article.prixDepart) }}</span>
              </div>
              <div class="enchere-details">
                <div class="detail-item">
                  <Clock :size="18" />
                  <span>Temps restant : {{ getTempsRestant() }}</span>
                </div>
                <div class="detail-item">
                  <span :class="['status-indicator', article.statut]"></span>
                  <span>Statut : {{ getStatutLabel(article.statut) }}</span>
                </div>
              </div>
            </div>

            <div v-else class="vente-rapide-info">
              <div class="price-box">
                <span class="label">Prix</span>
                <span class="price">{{ formatPrice(article.prix) }}</span>
              </div>
              <div class="detail-item">
                <span :class="['status-indicator', article.statut]"></span>
                <span>Statut : {{ getStatutLabel(article.statut) }}</span>
              </div>
            </div>

            <!-- Bouton baisser le prix -->
            <button v-if="article.statut === 'actif'" @click="$emit('baisser-prix')" class="btn-baisser-prix">
              <TrendingDown :size="18" />
              Baisser le prix
            </button>
          </div>

          <!-- Description -->
          <div class="description-section">
            <h2>Description</h2>
            <p class="description-text">{{ article.description }}</p>
          </div>

          <!-- Caractéristiques -->
          <div class="caracteristiques-section">
            <h2>Caractéristiques</h2>
            <div class="carac-grid">
              <div class="carac-item">
                <span class="carac-icon">
                  <Ruler :size="18" />
                </span>
                <div class="carac-content">
                  <span class="carac-label">Dimensions</span>
                  <span class="carac-value">
                    {{ article.dimensions.hauteur }} × {{ article.dimensions.largeur }} ×
                    {{ article.dimensions.profondeur }} cm
                  </span>
                </div>
              </div>
              <div class="carac-item">
                <span class="carac-icon">
                  <Weight :size="18" />
                </span>
                <div class="carac-content">
                  <span class="carac-label">Poids</span>
                  <span class="carac-value">{{ article.poids }} kg</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Documents -->
          <div v-if="article.documents && article.documents.length > 0" class="documents-section">
            <h2>Documents joints</h2>
            <div class="documents-list">
              <div v-for="(doc, index) in article.documents" :key="index" class="document-item">
                <FileText :size="20" class="icon-doc" />
                <span class="doc-name">{{ doc.name }}</span>
                <button class="btn-download-doc" @click="telechargerDocument(doc)">
                  <Download :size="16" />
                  Télécharger
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lightbox pour affichage plein écran -->
    <div v-if="lightboxOpen" class="lightbox" @click="closeLightbox">
      <button class="lightbox-close" @click.stop="closeLightbox">
        <X :size="24" />
      </button>
      <button class="lightbox-prev" @click.stop="prevPhoto">
        <ChevronLeft :size="32" />
      </button>
      <button class="lightbox-next" @click.stop="nextPhoto">
        <ChevronRight :size="32" />
      </button>
      <img :src="currentPhoto" :alt="article.nom" @click.stop />
      <div class="lightbox-counter">
        {{ currentPhotoIndex + 1 }} / {{ article.photos.length }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  Clock,
  Calendar,
  Ruler,
  Weight,
  FileText,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Heart,
  MessageCircle,
  Gavel,
  TrendingDown
} from 'lucide-vue-next'

const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['retour', 'modifier', 'supprimer', 'baisser-prix', 'ouvrir-messages', 'ouvrir-offres', 'ouvrir-favoris'])

const currentPhotoIndex = ref(0)
const lightboxOpen = ref(false)

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

const getStatutLabel = (statut) => {
  const labels = {
    actif: 'Actif',
    vendu: 'Vendu',
    expire: 'Expiré'
  }
  return labels[statut] || statut
}

const getTempsRestant = () => {
  if (!props.article.dateExpiration) return 'Durée non spécifiée'

  const now = new Date()
  const expiration = new Date(props.article.dateExpiration)
  const diff = expiration - now

  if (diff <= 0) return 'Enchère terminée'

  const jours = Math.floor(diff / (1000 * 60 * 60 * 24))
  const heures = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

  if (jours > 0) return `${jours} jour${jours > 1 ? 's' : ''} et ${heures}h restantes`
  if (heures > 0) return `${heures}h restantes`
  return 'Se termine bientôt'
}

const confirmerSuppression = () => {
  if (confirm(`Êtes-vous sûr de vouloir supprimer "${props.article.nom}" ?`)) {
    emit('supprimer', props.article.id)
  }
}

const ouvrirMessages = () => {
  emit('ouvrir-messages', props.article.id)
}

const ouvrirOffres = () => {
  emit('ouvrir-offres', props.article.id)
}

const ouvrirFavoris = () => {
  emit('ouvrir-favoris', props.article.id)
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

const telechargerDocument = (doc) => {
  const link = document.createElement('a')
  link.href = doc.url || doc.preview
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
  max-width: 1400px;
  margin: 0 auto;
}

/* Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.btn-retour {
  display: flex;
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

.header-actions {
  display: flex;
  gap: 1rem;
}

.btn-modifier,
.btn-supprimer {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  transition: all 0.2s;
}

.btn-modifier {
  background: #667eea;
  color: white;
}

.btn-modifier:hover {
  background: #5568d3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.btn-supprimer {
  background: #ef4444;
  color: white;
}

.btn-supprimer:hover {
  background: #dc2626;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

/* Status Bar */
.status-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.status-badge {
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.status-badge.actif {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 2px solid #10b981;
}

.status-badge.vendu {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
  border: 2px solid #3b82f6;
}

.status-badge.expire {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 2px solid #ef4444;
}

.type-badge {
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.type-badge.enchere {
  background: rgba(122, 143, 237, 0.1);
  color: #667eea;
  border: 2px solid #7a8fed;
}

.type-badge.vente-rapide {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 2px solid #10b981;
}

/* Statistiques */
.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-item.clickable {
  cursor: pointer;
}

.stat-item.clickable:hover {
  background: #f3f4f6;
  border: 1px solid #667eea;
}

.stat-item svg {
  color: #667eea;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.status-badge.actif {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 2px solid #10b981;
}

.status-badge.vendu {
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
  border: 2px solid #3b82f6;
}

.status-badge.expire {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
  border: 2px solid #ef4444;
}

.type-badge {
  padding: 0.5rem 1.25rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.type-badge.enchere {
  background: rgba(122, 143, 237, 0.1);
  color: #667eea;
  border: 2px solid #7a8fed;
}

.type-badge.vente-rapide {
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 2px solid #10b981;
}

/* Layout */
.article-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

/* Gallery Section */
.gallery-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.main-image {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  overflow: hidden;
  background: #f3f4f6;
  cursor: pointer;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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
  font-weight: 600;
}

.thumbnails {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 0.75rem;
}

.thumbnail {
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid #e5e7eb;
  transition: all 0.2s;
}

.thumbnail:hover {
  border-color: #667eea;
  transform: scale(1.05);
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

/* Info Section */
.info-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: fit-content;
}

.title-section {
  margin-bottom: 2rem;
}

.title-section h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 1rem 0;
}

.category-badge {
  display: inline-block;
  background: #f3f4f6;
  color: #6b7280;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
}

/* Price Section */
.price-section {
  background: #f9fafb;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.price-box {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.price-box .label {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

.price-box .price {
  font-size: 2rem;
  font-weight: 700;
  color: #667eea;
}

.btn-baisser-prix {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  margin-top: 1rem;
  padding: 0.875rem 1.5rem;
  background: white;
  color: #f59e0b;
  border: 2px solid #f59e0b;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-baisser-prix:hover {
  background: #f59e0b;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
}

.enchere-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.95rem;
}

.detail-item svg {
  color: #667eea;
}

/* Indicateur de statut */
.status-indicator {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.status-indicator.actif {
  background: #10b981;
  box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
}

.status-indicator.vendu {
  background: #3b82f6;
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.5);
}

.status-indicator.expire {
  background: #ef4444;
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.5);
}

/* Description */
.description-section,
.caracteristiques-section,
.documents-section {
  margin-bottom: 2rem;
}

.description-section h2,
.caracteristiques-section h2,
.documents-section h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.description-text {
  color: #4b5563;
  line-height: 1.6;
  font-size: 1rem;
}

/* Caractéristiques */
.carac-grid {
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

.carac-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 8px;
  color: #667eea;
}

.carac-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
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
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.icon-doc {
  color: #667eea;
}

.doc-name {
  flex: 1;
  color: #374151;
  font-size: 0.95rem;
}

.btn-download-doc {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #667eea;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-download-doc:hover {
  background: #5568d3;
}

/* Responsive */
@media (max-width: 1024px) {
  .article-content {
    grid-template-columns: 1fr;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    width: 100%;
  }

  .btn-modifier,
  .btn-supprimer {
    flex: 1;
    justify-content: center;
  }
}

@media (max-width: 640px) {
  .article-page {
    padding: 1rem 0.5rem;
  }

  .gallery-section,
  .info-section {
    padding: 1rem;
  }

  .title-section h1 {
    font-size: 1.5rem;
  }

  .price-box .price {
    font-size: 1.5rem;
  }

  .status-bar {
    flex-direction: column;
  }
}
</style>
