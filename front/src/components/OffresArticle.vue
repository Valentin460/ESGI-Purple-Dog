<template>
    <div class="modal-overlay" @click="$emit('fermer')">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h2>Offres pour "{{ article.nom }}"</h2>
                <button class="modal-close" @click="$emit('fermer')">
                    <X :size="24" />
                </button>
            </div>

            <div class="modal-body">
                <!-- Informations de l'enchère -->
                <div class="enchere-info-box">
                    <div class="info-item">
                        <span class="label">Prix de départ :</span>
                        <span class="value">{{ formatPrice(article.prixDepart || article.prix) }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Offre actuelle :</span>
                        <span class="value current">{{ formatPrice(offreActuelle) }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Nombre d'offres :</span>
                        <span class="value">{{ offres.length }}</span>
                    </div>
                    <div class="info-item">
                        <span class="label">Participants :</span>
                        <span class="value">{{ nombreParticipants }}</span>
                    </div>
                </div>

                <!-- Liste des offres -->
                <div class="offres-liste">
                    <div v-if="offres.length === 0" class="empty-state">
                        <Gavel :size="48" />
                        <p>Aucune offre pour le moment</p>
                    </div>

                    <div v-for="(offre, index) in offres" :key="offre.id" class="offre-item"
                        :class="{ 'offre-gagnante': index === 0 }">
                        <div class="offre-rank">
                            <span v-if="index === 0" class="badge-gagnant">
                                <Trophy :size="16" />
                                En tête
                            </span>
                            <span v-else class="rank-number">#{{ index + 1 }}</span>
                        </div>

                        <div class="offre-user">
                            <div class="user-avatar">
                                <User :size="28" />
                            </div>
                            <div class="user-info">
                                <span class="user-nom">{{ offre.utilisateur.nom }}</span>
                                <span class="user-note">
                                    <Star :size="14" />
                                    {{ offre.utilisateur.note }}/5
                                </span>
                            </div>
                        </div>

                        <div class="offre-montant">
                            <span class="montant">{{ formatPrice(offre.montant) }}</span>
                            <span v-if="index === 0 && offres.length > 1" class="difference">
                                +{{ formatPrice(offre.montant - offres[1].montant) }}
                            </span>
                        </div>

                        <div class="offre-date">
                            <Clock :size="16" />
                            <span>{{ formatDate(offre.date) }}</span>
                        </div>

                        <div class="offre-actions">
                            <button @click="contacterOffreur(offre)" class="btn-contact">
                                <MessageCircle :size="18" />
                                Contacter
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Historique des offres du même utilisateur -->
                <div v-if="offreSelectionnee" class="offre-detail">
                    <h3>Historique des offres de {{ offreSelectionnee.utilisateur.nom }}</h3>
                    <div class="historique-offres">
                        <div v-for="offre in getHistoriqueUtilisateur(offreSelectionnee.utilisateur.id)" :key="offre.id"
                            class="historique-item">
                            <span class="historique-montant">{{ formatPrice(offre.montant) }}</span>
                            <span class="historique-date">{{ formatDate(offre.date) }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { X, Gavel, User, Star, Clock, MessageCircle, Trophy } from 'lucide-vue-next'

const props = defineProps({
    article: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['fermer', 'contacter-offreur'])

const offreSelectionnee = ref(null)

// Données de test - À remplacer par un appel API
const offres = ref([
    {
        id: 1,
        utilisateur: {
            id: 201,
            nom: 'Thomas Bernard',
            note: 4.9,
            avatar: null
        },
        montant: 525,
        date: new Date(Date.now() - 30 * 60 * 1000) // Il y a 30 min
    },
    {
        id: 2,
        utilisateur: {
            id: 202,
            nom: 'Emma Rousseau',
            note: 4.7,
            avatar: null
        },
        montant: 500,
        date: new Date(Date.now() - 2 * 60 * 60 * 1000) // Il y a 2h
    },
    {
        id: 3,
        utilisateur: {
            id: 201,
            nom: 'Thomas Bernard',
            note: 4.9,
            avatar: null
        },
        montant: 480,
        date: new Date(Date.now() - 4 * 60 * 60 * 1000) // Il y a 4h
    },
    {
        id: 4,
        utilisateur: {
            id: 203,
            nom: 'Lucas Petit',
            note: 4.5,
            avatar: null
        },
        montant: 460,
        date: new Date(Date.now() - 6 * 60 * 60 * 1000) // Il y a 6h
    },
    {
        id: 5,
        utilisateur: {
            id: 202,
            nom: 'Emma Rousseau',
            note: 4.7,
            avatar: null
        },
        montant: 450,
        date: new Date(Date.now() - 8 * 60 * 60 * 1000) // Il y a 8h
    }
])

// Computed
const offreActuelle = computed(() => {
    const prixDepart = props.article.prixDepart || props.article.prix || 0
    if (offres.value.length > 0) {
        // L'offre actuelle est le maximum entre la plus haute offre et le prix de départ
        return Math.max(offres.value[0].montant, prixDepart)
    }
    return prixDepart
})

const nombreParticipants = computed(() => {
    const utilisateursUniques = new Set(offres.value.map(o => o.utilisateur.id))
    return utilisateursUniques.size
})

// Méthodes
const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(price)
}

const formatDate = (date) => {
    const now = new Date()
    const diff = now - new Date(date)
    const minutes = Math.floor(diff / (1000 * 60))
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (minutes < 1) return 'À l\'instant'
    if (minutes < 60) return `Il y a ${minutes} min`
    if (hours < 24) return `Il y a ${hours}h`
    if (days === 1) return 'Hier'
    if (days < 7) return `Il y a ${days} jours`

    return new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    })
}

const contacterOffreur = (offre) => {
    emit('contacter-offreur', {
        articleId: props.article.id,
        utilisateur: offre.utilisateur
    })
    // TODO: Ouvrir la messagerie avec cet utilisateur
}

const getHistoriqueUtilisateur = (utilisateurId) => {
    return offres.value.filter(o => o.utilisateur.id === utilisateurId)
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

/* Informations enchère */
.enchere-info-box {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1rem;
    padding: 1.5rem;
    background: #f9fafb;
    border-radius: 12px;
    margin-bottom: 2rem;
}

.info-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.info-item .label {
    font-size: 0.875rem;
    color: #6b7280;
    font-weight: 500;
}

.info-item .value {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1f2937;
}

.info-item .value.current {
    color: #667eea;
    font-size: 1.5rem;
}

/* Liste des offres */
.offres-liste {
    display: flex;
    flex-direction: column;
    gap: 1rem;
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

.offre-item {
    display: grid;
    grid-template-columns: auto 1fr auto auto auto;
    gap: 1.5rem;
    padding: 1.25rem;
    background: white;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    align-items: center;
    transition: all 0.2s;
}

.offre-item:hover {
    border-color: #d1d5db;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.offre-item.offre-gagnante {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border-color: #fbbf24;
}

.offre-rank {
    display: flex;
    align-items: center;
    justify-content: center;
}

.badge-gagnant {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #f59e0b;
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.875rem;
    font-weight: 700;
    white-space: nowrap;
}

.rank-number {
    font-size: 1.25rem;
    font-weight: 700;
    color: #9ca3af;
    min-width: 40px;
    text-align: center;
}

.offre-user {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.user-avatar {
    width: 48px;
    height: 48px;
    background: #e5e7eb;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    flex-shrink: 0;
}

.offre-gagnante .user-avatar {
    background: white;
    color: #f59e0b;
}

.user-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.user-nom {
    font-weight: 600;
    color: #1f2937;
    font-size: 1rem;
}

.user-note {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    color: #6b7280;
}

.user-note svg {
    color: #f59e0b;
}

.offre-montant {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.25rem;
}

.montant {
    font-size: 1.5rem;
    font-weight: 700;
    color: #667eea;
}

.difference {
    font-size: 0.875rem;
    color: #10b981;
    font-weight: 600;
}

.offre-date {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #6b7280;
    font-size: 0.875rem;
    white-space: nowrap;
}

.offre-date svg {
    color: #9ca3af;
}

.offre-actions {
    display: flex;
    gap: 0.5rem;
}

.btn-contact {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: white;
    color: #667eea;
    border: 2px solid #667eea;
    padding: 0.625rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
}

.btn-contact:hover {
    background: #667eea;
    color: white;
}

/* Historique */
.offre-detail {
    margin-top: 2rem;
    padding-top: 2rem;
    border-top: 2px solid #e5e7eb;
}

.offre-detail h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin-bottom: 1rem;
}

.historique-offres {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.historique-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: #f9fafb;
    border-radius: 8px;
}

.historique-montant {
    font-weight: 600;
    color: #1f2937;
}

.historique-date {
    font-size: 0.875rem;
    color: #6b7280;
}

/* Responsive */
@media (max-width: 1024px) {
    .enchere-info-box {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (max-width: 768px) {
    .offre-item {
        grid-template-columns: 1fr;
        gap: 1rem;
    }

    .offre-rank,
    .offre-montant,
    .offre-date {
        justify-self: flex-start;
    }

    .offre-actions {
        width: 100%;
    }

    .btn-contact {
        width: 100%;
        justify-content: center;
    }

    .enchere-info-box {
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
