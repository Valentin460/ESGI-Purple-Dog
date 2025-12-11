<template>
  <div class="article-detail-view">
    <ArticleDetail v-if="article" :article="article" @retour="retourListe" @modifier="modifierArticle"
      @baisser-prix="baisserPrix" />
    <div v-else class="loading">
      <p>Chargement...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ArticleDetail from '../components/ArticleDetail.vue'

const route = useRoute()
const router = useRouter()
const article = ref(null)

// Données de test - À remplacer par un appel API
const mesObjets = [
  {
    id: 1,
    nom: 'Vase Art Déco en cristal',
    categorie: 'Décoration',
    photos: [
      { preview: 'https://via.placeholder.com/600x600?text=Vase+1' },
      { preview: 'https://via.placeholder.com/600x600?text=Vase+2' },
      { preview: 'https://via.placeholder.com/600x600?text=Vase+3' }
    ],
    dimensions: { hauteur: 30, largeur: 15, profondeur: 15 },
    poids: 2.5,
    description: 'Magnifique vase en cristal de style Art Déco, datant des années 1920. Pièce unique en parfait état.',
    prix: 450,
    typeVente: 'enchere',
    prixDepart: 405,
    dureeEnchere: 7,
    statut: 'actif',
    nombreOffres: 5,
    nombreMessages: 12,
    nombreFavoris: 23,
    documents: [
      { name: 'Certificat d\'authenticité.pdf', url: '#' },
      { name: 'Expertise.pdf', url: '#' }
    ]
  },
  {
    id: 2,
    nom: 'Fauteuil vintage années 70',
    categorie: 'Mobilier',
    photos: [
      { preview: 'https://via.placeholder.com/600x600?text=Fauteuil+1' },
      { preview: 'https://via.placeholder.com/600x600?text=Fauteuil+2' }
    ],
    dimensions: { hauteur: 80, largeur: 70, profondeur: 75 },
    poids: 15.0,
    description: 'Fauteuil confortable en velours orange, parfait état. Style typique des années 70.',
    prix: 280,
    typeVente: 'vente-rapide',
    statut: 'actif',
    nombreOffres: 0,
    nombreMessages: 8,
    nombreFavoris: 15,
    documents: []
  },
  {
    id: 3,
    nom: 'Tableau abstrait signé',
    categorie: 'Art',
    photos: [
      { preview: 'https://via.placeholder.com/600x600?text=Tableau+1' }
    ],
    dimensions: { hauteur: 100, largeur: 80, profondeur: 3 },
    poids: 3.5,
    description: 'Tableau abstrait original signé par un artiste contemporain reconnu.',
    prix: 1200,
    typeVente: 'enchere',
    prixDepart: 1080,
    dureeEnchere: 14,
    statut: 'actif',
    nombreOffres: 8,
    nombreMessages: 20,
    nombreFavoris: 42,
    documents: [
      { name: 'Certificat d\'authenticité.pdf', url: '#' }
    ]
  }
]

onMounted(() => {
  const id = parseInt(route.params.id)

  // TODO: Remplacer par un appel API
  // const response = await fetch(`http://localhost:3000/api/objets/${id}`)
  // article.value = await response.json()

  // Pour l'instant, on cherche dans les données de test
  article.value = mesObjets.find(obj => obj.id === id)

  if (!article.value) {
    // Rediriger si l'objet n'existe pas
    router.push('/mes-objets')
  }
})

const retourListe = () => {
  router.push('/mes-objets')
}

const modifierArticle = () => {
  // Rediriger vers la page Mes Objets avec un paramètre pour ouvrir la modale
  router.push({
    path: '/mes-objets',
    query: { modifier: article.value.id }
  })
}

const baisserPrix = () => {
  // Rediriger vers la page Mes Objets avec un paramètre pour ouvrir la modale baisser prix
  router.push({
    path: '/mes-objets',
    query: { baisserPrix: article.value.id }
  })
}
</script>

<style scoped>
.article-detail-view {
  min-height: 100vh;
  background: #fafafa;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  font-size: 1.2rem;
  color: #6b7280;
}
</style>
