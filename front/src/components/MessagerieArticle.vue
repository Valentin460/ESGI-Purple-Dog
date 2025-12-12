<template>
    <div class="modal-overlay" @click="$emit('fermer')">
        <div class="modal-content" @click.stop>
            <div class="modal-header">
                <h2>Messages pour "{{ article.nom }}"</h2>
                <button class="modal-close" @click="$emit('fermer')">
                    <X :size="24" />
                </button>
            </div>

            <div class="modal-body">
                <!-- Liste des conversations -->
                <div v-if="!conversationSelectionnee" class="conversations-liste">
                    <div v-if="conversations.length === 0" class="empty-state">
                        <MessageCircle :size="48" />
                        <p>Aucun message pour cet article</p>
                    </div>

                    <div v-for="conversation in conversations" :key="conversation.id" class="conversation-item"
                        @click="ouvrirConversation(conversation)">
                        <div class="conversation-avatar">
                            <User :size="32" />
                        </div>
                        <div class="conversation-info">
                            <div class="conversation-header">
                                <span class="conversation-nom">{{ conversation.expediteur.nom }}</span>
                                <span class="conversation-date">{{ formatDate(conversation.dernierMessage.date)
                                }}</span>
                            </div>
                            <p class="conversation-message">{{ conversation.dernierMessage.texte }}</p>
                            <span v-if="conversation.nonLu > 0" class="badge-non-lu">{{ conversation.nonLu }}</span>
                        </div>
                    </div>
                </div>

                <!-- Vue conversation détaillée -->
                <div v-else class="conversation-detail">
                    <div class="conversation-detail-header">
                        <button @click="fermerConversation" class="btn-retour-conv">
                            <ChevronLeft :size="20" />
                            Retour aux messages
                        </button>
                        <div class="conversation-destinataire">
                            <User :size="24" />
                            <span>{{ conversationSelectionnee.expediteur.nom }}</span>
                        </div>
                    </div>

                    <!-- Messages -->
                    <div class="messages-container" ref="messagesContainer">
                        <div v-for="message in conversationSelectionnee.messages" :key="message.id" class="message-item"
                            :class="{ 'message-proprio': message.expediteur === 'proprio' }">
                            <div class="message-avatar">
                                <User :size="24" />
                            </div>
                            <div class="message-content">
                                <div class="message-header">
                                    <span class="message-nom">{{ message.expediteur === 'proprio' ? 'Vous' :
                                        conversationSelectionnee.expediteur.nom }}</span>
                                    <span class="message-heure">{{ formatHeure(message.date) }}</span>
                                </div>
                                <p class="message-texte">{{ message.texte }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Formulaire réponse -->
                    <div class="reponse-form">
                        <textarea v-model="nouvelleReponse" placeholder="Tapez votre réponse..." rows="3"
                            @keydown.enter.ctrl="envoyerReponse"></textarea>
                        <button @click="envoyerReponse" class="btn-envoyer" :disabled="!nouvelleReponse.trim()">
                            <Send :size="20" />
                            Envoyer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { X, MessageCircle, User, ChevronLeft, Send } from 'lucide-vue-next'

const props = defineProps({
    article: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['fermer'])

// État
const conversationSelectionnee = ref(null)
const nouvelleReponse = ref('')
const messagesContainer = ref(null)

// Données de test - À remplacer par un appel API
const conversations = ref([
    {
        id: 1,
        expediteur: {
            id: 101,
            nom: 'Marie Dupont',
            avatar: null
        },
        dernierMessage: {
            texte: 'Bonjour, est-ce que l\'objet est toujours disponible ?',
            date: new Date(Date.now() - 2 * 60 * 60 * 1000) // Il y a 2h
        },
        nonLu: 1,
        messages: [
            {
                id: 1,
                expediteur: 'client',
                texte: 'Bonjour, est-ce que l\'objet est toujours disponible ?',
                date: new Date(Date.now() - 2 * 60 * 60 * 1000)
            }
        ]
    },
    {
        id: 2,
        expediteur: {
            id: 102,
            nom: 'Jean Martin',
            avatar: null
        },
        dernierMessage: {
            texte: 'Merci pour votre réponse !',
            date: new Date(Date.now() - 5 * 60 * 60 * 1000) // Il y a 5h
        },
        nonLu: 0,
        messages: [
            {
                id: 1,
                expediteur: 'client',
                texte: 'Peut-on venir le récupérer en main propre ?',
                date: new Date(Date.now() - 6 * 60 * 60 * 1000)
            },
            {
                id: 2,
                expediteur: 'proprio',
                texte: 'Oui bien sûr, nous pouvons convenir d\'un rendez-vous.',
                date: new Date(Date.now() - 5.5 * 60 * 60 * 1000)
            },
            {
                id: 3,
                expediteur: 'client',
                texte: 'Merci pour votre réponse !',
                date: new Date(Date.now() - 5 * 60 * 60 * 1000)
            }
        ]
    },
    {
        id: 3,
        expediteur: {
            id: 103,
            nom: 'Sophie Laurent',
            avatar: null
        },
        dernierMessage: {
            texte: 'Quel est l\'état exact de l\'objet ?',
            date: new Date(Date.now() - 24 * 60 * 60 * 1000) // Il y a 1 jour
        },
        nonLu: 2,
        messages: [
            {
                id: 1,
                expediteur: 'client',
                texte: 'Bonjour, l\'objet a-t-il des défauts ?',
                date: new Date(Date.now() - 25 * 60 * 60 * 1000)
            },
            {
                id: 2,
                expediteur: 'client',
                texte: 'Quel est l\'état exact de l\'objet ?',
                date: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
        ]
    }
])

// Méthodes
const formatDate = (date) => {
    const now = new Date()
    const diff = now - new Date(date)
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (hours < 1) return 'À l\'instant'
    if (hours < 24) return `Il y a ${hours}h`
    if (days === 1) return 'Hier'
    if (days < 7) return `Il y a ${days} jours`

    return new Date(date).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'short'
    })
}

const formatHeure = (date) => {
    return new Date(date).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    })
}

const ouvrirConversation = (conversation) => {
    conversationSelectionnee.value = conversation
    // Marquer comme lu
    conversation.nonLu = 0

    // Scroll vers le bas après un court délai
    nextTick(() => {
        if (messagesContainer.value) {
            messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
        }
    })
}

const fermerConversation = () => {
    conversationSelectionnee.value = null
    nouvelleReponse.value = ''
}

const envoyerReponse = () => {
    if (nouvelleReponse.value.trim() && conversationSelectionnee.value) {
        const nouveauMessage = {
            id: Date.now(),
            expediteur: 'proprio',
            texte: nouvelleReponse.value,
            date: new Date()
        }

        conversationSelectionnee.value.messages.push(nouveauMessage)
        conversationSelectionnee.value.dernierMessage = {
            texte: nouvelleReponse.value,
            date: new Date()
        }

        nouvelleReponse.value = ''

        // Scroll vers le bas
        nextTick(() => {
            if (messagesContainer.value) {
                messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
            }
        })

        // TODO: Appel API pour envoyer le message
        console.log('Message envoyé:', nouveauMessage)
    }
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
    max-width: 800px;
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
    padding: 0;
    overflow-y: auto;
    flex: 1;
}

/* Liste des conversations */
.conversations-liste {
    padding: 1rem;
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

.conversation-item {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    border: 1px solid transparent;
    position: relative;
}

.conversation-item:hover {
    background: #f9fafb;
    border-color: #e5e7eb;
}

.conversation-avatar {
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

.conversation-info {
    flex: 1;
    min-width: 0;
    padding-right: 2.5rem;
    position: relative;
}

.conversation-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.25rem;
    gap: 0.5rem;
}

.conversation-nom {
    font-weight: 600;
    color: #1f2937;
    font-size: 1rem;
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.conversation-date {
    font-size: 0.875rem;
    color: #9ca3af;
    flex-shrink: 0;
    white-space: nowrap;
}

.conversation-message {
    color: #6b7280;
    font-size: 0.95rem;
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.badge-non-lu {
    position: absolute;
    top: 0;
    right: 0;
    background: #667eea;
    color: white;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    min-width: 20px;
    text-align: center;
}

/* Conversation détaillée */
.conversation-detail {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.conversation-detail-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    gap: 1rem;
}

.btn-retour-conv {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: transparent;
    border: none;
    color: #6b7280;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 6px;
    transition: all 0.2s;
}

.btn-retour-conv:hover {
    background: #f3f4f6;
    color: #374151;
}

.conversation-destinataire {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-weight: 600;
    color: #1f2937;
}

.conversation-destinataire svg {
    color: #667eea;
}

/* Messages */
.messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: #f9fafb;
}

.message-item {
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
}

.message-item.message-proprio {
    flex-direction: row-reverse;
}

.message-avatar {
    width: 36px;
    height: 36px;
    background: #e5e7eb;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #6b7280;
    flex-shrink: 0;
}

.message-proprio .message-avatar {
    background: #dbeafe;
    color: #667eea;
}

.message-content {
    flex: 1;
    max-width: 70%;
}

.message-proprio .message-content {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
}

.message-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.25rem;
}

.message-proprio .message-header {
    flex-direction: row-reverse;
}

.message-nom {
    font-size: 0.875rem;
    font-weight: 600;
    color: #6b7280;
}

.message-heure {
    font-size: 0.75rem;
    color: #9ca3af;
}

.message-texte {
    background: white;
    padding: 0.75rem 1rem;
    border-radius: 12px;
    color: #1f2937;
    margin: 0;
    line-height: 1.6;
    border: 1px solid #e5e7eb;
}

.message-proprio .message-texte {
    background: #667eea;
    color: white;
    border-color: #667eea;
}

/* Formulaire réponse */
.reponse-form {
    padding: 1rem 1.5rem;
    border-top: 1px solid #e5e7eb;
    background: white;
    display: flex;
    gap: 1rem;
    align-items: flex-end;
}

.reponse-form textarea {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-family: inherit;
    font-size: 0.95rem;
    resize: vertical;
    transition: all 0.2s;
    min-height: 60px;
}

.reponse-form textarea:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.btn-envoyer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #667eea;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
}

.btn-envoyer:hover:not(:disabled) {
    background: #5568d3;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-envoyer:disabled {
    background: #d1d5db;
    cursor: not-allowed;
    transform: none;
}

/* Responsive */
@media (max-width: 640px) {
    .modal-content {
        max-width: 100%;
        max-height: 100vh;
        border-radius: 0;
    }

    .message-content {
        max-width: 85%;
    }

    .reponse-form {
        flex-direction: column;
        align-items: stretch;
    }

    .btn-envoyer {
        width: 100%;
        justify-content: center;
    }
}
</style>
