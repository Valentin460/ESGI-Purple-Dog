<template>
  <div class="modal-overlay" @click="$emit('fermer')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Favoris pour "{{ article.nom }}"</h2>
        <button class="modal-close" @click="$emit('fermer')">
          <X :size="24" />
        </button>
      </div>

      <div class="modal-body">
        <!-- Statistiques -->
        <div class="stats-box">
          <div class="stat-item">
            <Heart :size="24" />
            <div class="stat-info">
              <span class="stat-value">{{ favoris.length }}</span>
              <span class="stat-label">Personne{{ favoris.length > 1 ? 's' : '' }} intéressée{{ favoris.length > 1 ? 's'
                : '' }}</span>
            </div>
          </div>
          <div class="stat-item">
            <TrendingUp :size="24" />
            <div class="stat-info">
              <span class="stat-value">{{ tauxConversion }}%</span>
              <span class="stat-label">Taux d'intérêt</span>
            </div>
          </div>
        </div>

        <!-- Liste des personnes ayant mis en favoris -->
        <div class="favoris-liste">
          <div v-if="favoris.length === 0" class="empty-state">
            <Heart :size="48" />
            <p>Personne n'a encore ajouté cet article en favoris</p>
          </div>

          <div v-for="favori in favoris" :key="favori.id" class="favori-item">
            <div class="favori-user">
              <div class="user-avatar">
                <User :size="32" />
              </div>
              <div class="user-info">
                <span class="user-nom">{{ favori.utilisateur.nom }}</span>
                <div class="user-meta">
                  <span class="user-note">
                    <Star :size="14" />""
                    {{ favori.utilisateur.note }}/5
                  </span>
                </div>
              </div>
            </div>

            <div class="favori-date">
              <Clock :size="16" />
              <span>Ajouté {{ formatDate(favori.dateAjout) }}</span>
            </div>

            <div class="favori-actions">
              <button @click="contacterUtilisateur(favori)" class="btn-contact">
                <MessageCircle :size="18" />
                Contacter
              </button>
              <button v-if="article.typeVente === 'enchere'" @click="voirOffres(favori)" class="btn-offres"
                :disabled="!aFaitOffre(favori.utilisateur.id)">
                {{ aFaitOffre(favori.utilisateur.id) ? 'A fait une offre' : 'Pas d\'offre' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Insights -->
        <div class="insights-section">
          <h3>Statistiques</h3>
          <div class="insights-grid">
            <div class="insight-card">
              <div class="insight-icon">
                <Calendar :size="20" />
              </div>
              <div class="insight-content">
                <span class="insight-value">{{ dernierFavoriDate }}</span>
                <span class="insight-label">Dernier ajout en favoris</span>
              </div>
            </div>
            <div class="insight-card">
              <div class="insight-icon">
                <Users :size="20" />
              </div>
              <div class="insight-content">
                <span class="insight-value">{{ utilisateursActifs }}</span>
                <span class="insight-label">Utilisateur{{ utilisateursActifs > 1 ? 's' : '' }} actif{{
                  utilisateursActifs > 1 ? 's' : '' }}</span>
              </div>
            </div>
            <div class="insight-card">
              <div class="insight-icon">
                <Eye :size="20" />
              </div>
              <div class="insight-content">
                <span class="insight-value">{{ tauxEngagement }}%</span>
                <span class="insight-label">Taux d'engagement</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  X,
  Heart,
  User,
  Star,
  Clock,
  MessageCircle,
  Gavel,
  MapPin,
  TrendingUp,
  Calendar,
  Users,
  Eye
} from 'lucide-vue-next'

const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['fermer', 'contacter-utilisateur', 'voir-offres'])

// Données de test - À remplacer par un appel API
const favoris = ref([
  {
    id: 1,
    utilisateur: {
      id: 301,
      nom: 'Camille Dubois',
      note: 4.8,
      avatar: null
    },
    dateAjout: new Date(Date.now() - 2 * 60 * 60 * 1000), // Il y a 2h
    aFaitOffre: true
  },
  {
    id: 2,
    utilisateur: {
      id: 302,
      nom: 'Alexandre Martin',
      note: 4.6,
      avatar: null
    },
    dateAjout: new Date(Date.now() - 5 * 60 * 60 * 1000), // Il y a 5h
    aFaitOffre: false
  },
  {
    id: 3,
    utilisateur: {
      id: 303,
      nom: 'Julie Bernard',
      note: 4.9,
      avatar: null
    },
    dateAjout: new Date(Date.now() - 12 * 60 * 60 * 1000), // Il y a 12h
    aFaitOffre: true
  },
  {
    id: 4,
    utilisateur: {
      id: 304,
      nom: 'Nicolas Petit',
      note: 4.5,
      avatar: null
    },
    dateAjout: new Date(Date.now() - 24 * 60 * 60 * 1000), // Il y a 1 jour
    aFaitOffre: false
  },
  {
    id: 5,
    utilisateur: {
      id: 305,
      nom: 'Sophie Laurent',
      note: 5.0,
      avatar: null
    },
    dateAjout: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Il y a 2 jours
    aFaitOffre: true
  }
])

// Computed
const tauxConversion = computed(() => {
  if (favoris.value.length === 0) return 0
  const nombreOffres = favoris.value.filter(f => f.aFaitOffre).length
  return Math.round((nombreOffres / favoris.value.length) * 100)
})

const dernierFavoriDate = computed(() => {
  if (favoris.value.length === 0) return 'Aucun'
  return formatDate(favoris.value[0].dateAjout)
})

const utilisateursActifs = computed(() => {
  return favoris.value.filter(f => f.aFaitOffre).length
})

const tauxEngagement = computed(() => {
  // Simule un taux d'engagement basé sur les favoris et autres interactions
  return Math.min(Math.round((favoris.value.length / 10) * 100), 100)
})

// Méthodes
const formatDate = (date) => {
  const now = new Date()
  const diff = now - new Date(date)
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return 'à l\'instant'
  if (minutes < 60) return `il y a ${minutes} min`
  if (hours < 24) return `il y a ${hours}h`
  if (days === 1) return 'hier'
  if (days < 7) return `il y a ${days} jours`

  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short'
  })
}

const contacterUtilisateur = (favori) => {
  emit('contacter-utilisateur', {
    articleId: props.article.id,
    utilisateur: favori.utilisateur
  })
}

const voirOffres = (favori) => {
  if (favori.aFaitOffre) {
    emit('voir-offres', {
      articleId: props.article.id,
      utilisateurId: favori.utilisateur.id
    })
  }
}

const aFaitOffre = (utilisateurId) => {
  const favori = favoris.value.find(f => f.utilisateur.id === utilisateurId)
  return favori ? favori.aFaitOffre : false
}
</script>

<style scoped>
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
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
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
  border-radius: 6px;
}

.modal-close:hover {
  color: #374151;
  background: #f3f4f6;
}

.modal-body {
  padding: 1.5rem 2rem;
  overflow-y: auto;
  flex: 1;
}

/* Statistiques */
.stats-box {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
}

.stat-item svg {
  color: #f59e0b;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
}

.stat-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

/* Liste favoris */
.favoris-liste {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: #9ca3af;
  text-align: center;
}

.empty-state svg {
  margin-bottom: 1rem;
}

.favori-item {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1.5rem;
  padding: 1.25rem;
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  align-items: center;
  transition: all 0.2s;
}

.favori-item:hover {
  border-color: #fbbf24;
  box-shadow: 0 4px 12px rgba(251, 191, 36, 0.2);
}

.favori-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar {
  width: 56px;
  height: 56px;
  background: #fef3c7;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f59e0b;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.user-nom {
  font-weight: 600;
  color: #1f2937;
  font-size: 1.05rem;
}

.user-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
}

.user-note,
.user-localisation {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.user-note svg {
  color: #f59e0b;
}

.user-localisation svg {
  color: #667eea;
}

.user-separator {
  color: #d1d5db;
}

.favori-date {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  white-space: nowrap;
}

.favori-date svg {
  color: #9ca3af;
}

.favori-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn-contact,
.btn-offres {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  border: 2px solid;
}

.btn-contact {
  background: white;
  color: #667eea;
  border-color: #667eea;
}

.btn-contact:hover {
  background: #667eea;
  color: white;
}

.btn-offres {
  background: white;
  color: #f59e0b;
  border-color: #f59e0b;
}

.btn-offres:hover:not(:disabled) {
  background: #f59e0b;
  color: white;
}

.btn-offres:disabled {
  color: #9ca3af;
  border-color: #d1d5db;
  cursor: not-allowed;
}

/* Insights */
.insights-section {
  padding-top: 2rem;
  border-top: 2px solid #e5e7eb;
}

.insights-section h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.insight-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.insight-icon {
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #667eea;
  flex-shrink: 0;
}

.insight-content {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.insight-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1f2937;
}

.insight-label {
  font-size: 0.875rem;
  color: #6b7280;
}

/* Responsive */
@media (max-width: 1024px) {
  .insights-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .favori-item {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .favori-actions {
    width: 100%;
  }

  .btn-contact,
  .btn-offres {
    flex: 1;
    justify-content: center;
  }

  .stats-box {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .modal-content {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .modal-body {
    padding: 1rem;
  }
}
</style>
