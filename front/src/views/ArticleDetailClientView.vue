<template>
    <div class="article-detail-client-view">
        <ArticleDetailClient v-if="article" :article="article" @retour="retourListe" @acheter="acheterArticle"
            @placer-offre="placerOffre" @envoyer-message="envoyerMessage" />
        <div v-else class="loading">
            <p>Chargement...</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ArticleDetailClient from '../components/ArticleDetailClient.vue'

const route = useRoute()
const router = useRouter()

// Données de test - À remplacer par un appel API
const mesArticles = ref([
    {
        id: 1,
        nom: 'Vase en porcelaine ancienne',
        description: 'Magnifique vase en porcelaine de la fin du XIXe siècle. Pièce authentique en excellent état de conservation. Décorations florales peintes à la main avec une finition dorée. Idéal pour collectionneurs ou amateurs d\'antiquités.',
        categorie: 'Antiquités',
        typeVente: 'enchere',
        prixDepart: 150,
        enchereActuelle: 285,
        nombreOffres: 12,
        nombreParticipants: 8,
        dateExpiration: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(), // 2 jours 5h
        statut: 'actif',
        dimensions: { hauteur: 30, largeur: 15, profondeur: 15 },
        poids: 1.2,
        photos: [
            { preview: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800' },
            { preview: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800' },
            { preview: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800' }
        ],
        vendeur: {
            nom: 'Marie Dubois',
            note: 4.8,
            ventes: 45
        }
    },
    {
        id: 2,
        nom: 'Fauteuil vintage scandinave',
        description: 'Superbe fauteuil vintage de style scandinave des années 1960. Structure en bois de teck massif, assise et dossier rembourrés avec tissu d\'origine en très bon état. Design intemporel qui s\'adapte parfaitement aux intérieurs modernes et contemporains.',
        categorie: 'Mobilier',
        typeVente: 'rapide',
        prix: 450,
        statut: 'actif',
        dimensions: { hauteur: 85, largeur: 70, profondeur: 75 },
        poids: 12.5,
        photos: [
            { preview: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800' },
            { preview: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800' }
        ],
        vendeur: {
            nom: 'Pierre Martin',
            note: 4.9,
            ventes: 78
        }
    },
    {
        id: 3,
        nom: 'Tableau abstrait contemporain',
        description: 'Œuvre originale d\'un artiste émergent. Peinture acrylique sur toile représentant une composition abstraite aux couleurs vives et dynamiques. Signée au dos par l\'artiste. Parfait pour apporter une touche moderne et colorée à votre intérieur.',
        categorie: 'Art',
        typeVente: 'enchere',
        prixDepart: 200,
        enchereActuelle: 320,
        nombreOffres: 7,
        nombreParticipants: 5,
        dateExpiration: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 jours
        statut: 'actif',
        dimensions: { hauteur: 80, largeur: 60, profondeur: 3 },
        poids: 2.8,
        photos: [
            { preview: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800' },
            { preview: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=800' },
            { preview: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800' }
        ],
        vendeur: {
            nom: 'Sophie Laurent',
            note: 5.0,
            ventes: 23
        }
    }
])

const article = ref(null)

onMounted(() => {
    const articleId = parseInt(route.params.id)
    article.value = mesArticles.value.find(a => a.id === articleId)

    if (!article.value) {
        console.error('Article non trouvé')
        // TODO: Rediriger vers une page 404 ou liste des articles
    }
})

const retourListe = () => {
    router.push('/annonces') // À adapter selon votre route pour la liste des annonces
}

const acheterArticle = (articleId) => {
    console.log('Acheter article:', articleId)
    // TODO: Appel API pour acheter l'article
    // TODO: Redirection vers le panier ou page de paiement
}

const placerOffre = (data) => {
    console.log('Placer offre:', data)
    // TODO: Appel API pour placer une offre
    // Mise à jour optimiste
    if (article.value && article.value.id === data.articleId) {
        article.value.enchereActuelle = data.montant
        article.value.nombreOffres = (article.value.nombreOffres || 0) + 1
    }
}

const envoyerMessage = (data) => {
    console.log('Envoyer message:', data)
    // TODO: Appel API pour envoyer un message au vendeur
}
</script>

<style scoped>
.article-detail-client-view {
    min-height: 100vh;
}

.loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    font-size: 1.5rem;
    color: #6b7280;
}
</style>
