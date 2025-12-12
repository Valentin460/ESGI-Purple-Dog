<template>
    <div class="recherche-page">
        <div class="page-container">
            <!-- En-tête -->
            <div class="page-header">
                <h1>
                    <Search :size="32" class="title-icon" />
                    Recherche d'objets
                </h1>
                <p class="subtitle">Trouvez l'objet d'exception qui vous correspond</p>
            </div>

            <!-- Barre de recherche principale -->
            <div class="search-bar-section">
                <div class="search-input-wrapper">
                    <Search :size="24" class="search-icon" />
                    <input v-model="searchText" type="text" placeholder="Rechercher par nom, description, catégorie..."
                        class="search-input" @input="appliquerFiltres" />
                    <button v-if="searchText" @click="clearSearch" class="clear-btn">
                        <X :size="20" />
                    </button>
                </div>
            </div>

            <!-- Layout avec filtres à gauche et résultats à droite -->
            <div class="content-layout">
                <!-- Filtres à gauche -->
                <aside class="filters-sidebar">
                    <div class="filters-header">
                        <h3>
                            <SlidersHorizontal :size="20" />
                            Filtres
                        </h3>
                        <button v-if="hasActiveFilters" @click="resetFilters" class="btn-reset-filters">
                            <RotateCcw :size="16" />
                            Réinitialiser
                        </button>
                    </div>

                    <div class="filters-list">
                        <!-- Filtre Catégorie -->
                        <div class="filter-group">
                            <label>
                                <Package :size="18" />
                                Catégorie
                            </label>
                            <select v-model="filtres.categorie" @change="appliquerFiltres" class="filter-select">
                                <option value="">Toutes les catégories</option>
                                <option value="Bijoux & montres">Bijoux & montres</option>
                                <option value="Meubles anciens">Meubles anciens</option>
                                <option value="Objets d'art & tableaux">Objets d'art & tableaux</option>
                                <option value="Objets de collection">Objets de collection</option>
                                <option value="Vins & spiritueux de collection">Vins & spiritueux de collection</option>
                                <option value="Instruments de musique">Instruments de musique</option>
                                <option value="Livres anciens & manuscrits">Livres anciens & manuscrits</option>
                                <option value="Mode & accessoires de luxe">Mode & accessoires de luxe</option>
                                <option value="Horlogerie & pendules anciennes">Horlogerie & pendules anciennes</option>
                                <option value="Photographies anciennes & appareils vintage">Photographies anciennes &
                                    appareils vintage</option>
                                <option value="Vaisselle & argenterie & cristallerie">Vaisselle & argenterie &
                                    cristallerie
                                </option>
                                <option value="Sculptures & objets décoratifs">Sculptures & objets décoratifs</option>
                                <option value="Véhicules de collection">Véhicules de collection</option>
                            </select>
                        </div>

                        <!-- Filtre Type de vente -->
                        <div class="filter-group">
                            <label>
                                <ShoppingCart :size="18" />
                                Type de vente
                            </label>
                            <select v-model="filtres.typeVente" @change="appliquerFiltres" class="filter-select">
                                <option value="">Tous les types</option>
                                <option value="enchere">Enchères</option>
                                <option value="vente-rapide">Vente rapide</option>
                            </select>
                        </div>

                        <!-- Filtre Statut -->
                        <div class="filter-group">
                            <label>
                                <CheckCircle :size="18" />
                                Statut
                            </label>
                            <select v-model="filtres.statut" @change="appliquerFiltres" class="filter-select">
                                <option value="">Tous les statuts</option>
                                <option value="actif">En vente</option>
                                <option value="vendu">Vendu (Historique)</option>
                                <option value="expire">Expiré</option>
                            </select>
                        </div>

                        <!-- Filtre Prix -->
                        <div class="filter-group filter-price">
                            <label>
                                <Euro :size="18" />
                                Prix
                            </label>
                            <div class="price-inputs">
                                <input v-model.number="filtres.prixMin" type="number" placeholder="Min"
                                    class="price-input" @input="appliquerFiltres" min="0" />
                                <span class="price-separator">-</span>
                                <input v-model.number="filtres.prixMax" type="number" placeholder="Max"
                                    class="price-input" @input="appliquerFiltres" min="0" />
                            </div>
                        </div>
                    </div>
                </aside>

                <!-- Résultats à droite -->
                <div class="results-section">
                    <div class="results-header">
                        <p class="results-count">
                            {{ objetsFiltres.length }} résultat{{ objetsFiltres.length > 1 ? 's' : '' }}
                        </p>
                        <div class="sort-group">
                            <label>Trier par :</label>
                            <select v-model="tri" @change="appliquerTri" class="sort-select">
                                <option value="recent">Plus récent</option>
                                <option value="ancien">Plus ancien</option>
                                <option value="prix-asc">Prix croissant</option>
                                <option value="prix-desc">Prix décroissant</option>
                                <option value="nom-asc">Nom A-Z</option>
                                <option value="nom-desc">Nom Z-A</option>
                            </select>
                        </div>
                    </div>

                    <!-- Liste vide -->
                    <div v-if="objetsFiltres.length === 0" class="empty-results">
                        <SearchX :size="64" />
                        <h3>Aucun résultat trouvé</h3>
                        <p>Essayez de modifier vos critères de recherche</p>
                        <button @click="resetFilters" class="btn-reset">
                            Réinitialiser les filtres
                        </button>
                    </div>

                    <!-- Grille d'objets -->
                    <div v-else class="objets-grid">
                        <div v-for="objet in objetsFiltres" :key="objet.id" class="objet-card"
                            @click="voirDetails(objet)">
                            <!-- Image -->
                            <div class="objet-image">
                                <img :src="objet.photos[0]?.preview || imageDefault" :alt="objet.nom" />

                                <!-- Badges -->
                                <div class="badges-overlay">
                                    <span class="badge-statut" :class="objet.statut">
                                        {{ getStatutLabel(objet.statut) }}
                                    </span>
                                    <span v-if="objet.typeVente === 'enchere'" class="badge-type enchere">
                                        <Gavel :size="14" />
                                        Enchère
                                    </span>
                                    <span v-else class="badge-type vente-rapide">
                                        <Zap :size="14" />
                                        Vente rapide
                                    </span>
                                </div>

                                <!-- Favoris -->
                                <button @click.stop="toggleFavoris(objet)" class="btn-favoris"
                                    :class="{ active: objet.isFavoris }">
                                    <Heart :size="20" :fill="objet.isFavoris ? 'currentColor' : 'none'" />
                                </button>
                            </div>

                            <!-- Informations -->
                            <div class="objet-info">
                                <span class="objet-categorie">{{ objet.categorie }}</span>
                                <h3 class="objet-nom">{{ objet.nom }}</h3>

                                <!-- Prix -->
                                <div class="prix-section">
                                    <div v-if="objet.typeVente === 'enchere'" class="prix-enchere">
                                        <span class="prix-label">Enchère actuelle</span>
                                        <span class="prix-value">{{ formatPrice(objet.enchereActuelle ||
                                            objet.prixDepart)
                                        }}</span>
                                        <div class="enchere-stats">
                                            <span>
                                                <Users :size="14" />
                                                {{ objet.nombreOffres || 0 }} offre(s)
                                            </span>
                                            <span v-if="objet.statut === 'actif'" class="temps-restant">
                                                <Clock :size="14" />
                                                {{ getTempsRestant(objet) }}
                                            </span>
                                        </div>
                                    </div>
                                    <div v-else class="prix-fixe">
                                        <span class="prix-label">Prix</span>
                                        <span class="prix-value">{{ formatPrice(objet.prix) }}</span>
                                    </div>
                                </div>

                                <!-- Vendeur -->
                                <div class="vendeur-info">
                                    <User :size="16" />
                                    <span>{{ objet.vendeur?.nom || 'Vendeur particulier' }}</span>
                                    <span class="vendeur-note">
                                        <Star :size="12" />
                                        {{ objet.vendeur?.note || 4.5 }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
    Search,
    X,
    SlidersHorizontal,
    RotateCcw,
    Package,
    ShoppingCart,
    CheckCircle,
    Euro,
    SearchX,
    Heart,
    Zap,
    Users,
    Clock,
    User,
    Star
} from 'lucide-vue-next'

const router = useRouter()

// État
const searchText = ref('')
const tri = ref('recent')
const filtres = ref({
    categorie: '',
    typeVente: '',
    statut: '',
    prixMin: null,
    prixMax: null
})

const imageDefault = 'https://via.placeholder.com/400x300?text=Image'

// Données de test - À remplacer par un appel API
const objets = ref([
    {
        id: 1,
        nom: 'Vase Art Déco en cristal',
        categorie: 'Objets d\'art & tableaux',
        photos: [{ preview: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=300&fit=crop' }],
        typeVente: 'enchere',
        prixDepart: 405,
        enchereActuelle: 450,
        statut: 'actif',
        nombreOffres: 5,
        dateExpiration: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        dateCreation: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        vendeur: { nom: 'Marie Dupont', note: 4.8 },
        isFavoris: false
    },
    {
        id: 2,
        nom: 'Montre Rolex Submariner',
        categorie: 'Bijoux & montres',
        photos: [{ preview: 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?w=400&h=300&fit=crop' }],
        typeVente: 'vente-rapide',
        prix: 8500,
        statut: 'actif',
        dateCreation: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        vendeur: { nom: 'Jean Martin', note: 4.9 },
        isFavoris: false
    },
    {
        id: 3,
        nom: 'Tableau abstrait signé Picasso',
        categorie: 'Objets d\'art & tableaux',
        photos: [{ preview: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=400&h=300&fit=crop' }],
        typeVente: 'enchere',
        prixDepart: 12000,
        enchereActuelle: 15000,
        statut: 'actif',
        nombreOffres: 12,
        dateExpiration: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        dateCreation: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        vendeur: { nom: 'Galerie Art Moderne', note: 5.0 },
        isFavoris: true
    },
    {
        id: 4,
        nom: 'Chaise Louis XVI authentique',
        categorie: 'Meubles anciens',
        photos: [{ preview: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop' }],
        typeVente: 'vente-rapide',
        prix: 1200,
        statut: 'vendu',
        dateCreation: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        vendeur: { nom: 'Antiquités Bernard', note: 4.7 },
        isFavoris: false
    },
    {
        id: 5,
        nom: 'Violon Stradivarius copie',
        categorie: 'Instruments de musique',
        photos: [{ preview: 'https://images.unsplash.com/photo-1612225330812-01a9c6b355ec?w=400&h=300&fit=crop' }],
        typeVente: 'enchere',
        prixDepart: 2500,
        enchereActuelle: 3200,
        statut: 'actif',
        nombreOffres: 8,
        dateExpiration: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        dateCreation: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        vendeur: { nom: 'Musique Ancienne', note: 4.6 },
        isFavoris: false
    },
    {
        id: 6,
        nom: 'Sac Hermès Birkin',
        categorie: 'Mode & accessoires de luxe',
        photos: [{ preview: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop' }],
        typeVente: 'vente-rapide',
        prix: 18000,
        statut: 'actif',
        dateCreation: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        vendeur: { nom: 'Luxury Fashion', note: 4.9 },
        isFavoris: true
    },
    {
        id: 7,
        nom: 'Château Margaux 1990',
        categorie: 'Vins & spiritueux de collection',
        photos: [{ preview: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=400&h=300&fit=crop' }],
        typeVente: 'enchere',
        prixDepart: 800,
        enchereActuelle: 950,
        statut: 'actif',
        nombreOffres: 6,
        dateExpiration: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        dateCreation: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        vendeur: { nom: 'Cave Prestige', note: 4.8 },
        isFavoris: false
    },
    {
        id: 8,
        nom: 'Appareil photo Leica M3',
        categorie: 'Photographies anciennes & appareils vintage',
        photos: [{ preview: 'https://via.placeholder.com/400x300?text=Leica+M3' }],
        typeVente: 'vente-rapide',
        prix: 2400,
        statut: 'expire',
        dateCreation: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        vendeur: { nom: 'Photo Vintage', note: 4.5 },
        isFavoris: false
    }
])

const objetsFiltres = ref([...objets.value])

// Computed
const hasActiveFilters = computed(() => {
    return searchText.value !== '' ||
        filtres.value.categorie !== '' ||
        filtres.value.typeVente !== '' ||
        filtres.value.statut !== '' ||
        filtres.value.prixMin !== null ||
        filtres.value.prixMax !== null
})

// Méthodes
const formatPrice = (price) => {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR'
    }).format(price)
}

const getStatutLabel = (statut) => {
    const labels = {
        actif: 'En vente',
        vendu: 'Vendu',
        expire: 'Expiré'
    }
    return labels[statut] || statut
}

const getTempsRestant = (objet) => {
    if (!objet.dateExpiration) return 'N/A'

    const now = new Date()
    const expiration = new Date(objet.dateExpiration)
    const diff = expiration - now

    if (diff <= 0) return 'Terminé'

    const jours = Math.floor(diff / (1000 * 60 * 60 * 24))
    const heures = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (jours > 0) return `${jours}j ${heures}h`
    if (heures > 0) return `${heures}h`

    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${minutes}min`
}

const appliquerFiltres = () => {
    let resultats = [...objets.value]

    // Filtre recherche textuelle
    if (searchText.value) {
        const search = searchText.value.toLowerCase()
        resultats = resultats.filter(obj =>
            obj.nom.toLowerCase().includes(search) ||
            obj.categorie.toLowerCase().includes(search) ||
            obj.vendeur?.nom?.toLowerCase().includes(search)
        )
    }

    // Filtre catégorie
    if (filtres.value.categorie) {
        resultats = resultats.filter(obj => obj.categorie === filtres.value.categorie)
    }

    // Filtre type de vente
    if (filtres.value.typeVente) {
        resultats = resultats.filter(obj => obj.typeVente === filtres.value.typeVente)
    }

    // Filtre statut
    if (filtres.value.statut) {
        resultats = resultats.filter(obj => obj.statut === filtres.value.statut)
    }

    // Filtre prix
    if (filtres.value.prixMin !== null || filtres.value.prixMax !== null) {
        resultats = resultats.filter(obj => {
            const prix = obj.typeVente === 'enchere' ? (obj.enchereActuelle || obj.prixDepart) : obj.prix
            const min = filtres.value.prixMin || 0
            const max = filtres.value.prixMax || Infinity
            return prix >= min && prix <= max
        })
    }

    objetsFiltres.value = resultats
    appliquerTri()
}

const appliquerTri = () => {
    const sortedObjets = [...objetsFiltres.value]

    switch (tri.value) {
        case 'recent':
            sortedObjets.sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation))
            break
        case 'ancien':
            sortedObjets.sort((a, b) => new Date(a.dateCreation) - new Date(b.dateCreation))
            break
        case 'prix-asc':
            sortedObjets.sort((a, b) => {
                const prixA = a.typeVente === 'enchere' ? (a.enchereActuelle || a.prixDepart) : a.prix
                const prixB = b.typeVente === 'enchere' ? (b.enchereActuelle || b.prixDepart) : b.prix
                return prixA - prixB
            })
            break
        case 'prix-desc':
            sortedObjets.sort((a, b) => {
                const prixA = a.typeVente === 'enchere' ? (a.enchereActuelle || a.prixDepart) : a.prix
                const prixB = b.typeVente === 'enchere' ? (b.enchereActuelle || b.prixDepart) : b.prix
                return prixB - prixA
            })
            break
        case 'nom-asc':
            sortedObjets.sort((a, b) => a.nom.localeCompare(b.nom))
            break
        case 'nom-desc':
            sortedObjets.sort((a, b) => b.nom.localeCompare(a.nom))
            break
    }

    objetsFiltres.value = sortedObjets
}

const resetFilters = () => {
    searchText.value = ''
    filtres.value = {
        categorie: '',
        typeVente: '',
        statut: '',
        prixMin: null,
        prixMax: null
    }
    tri.value = 'recent'
    appliquerFiltres()
}

const clearSearch = () => {
    searchText.value = ''
    appliquerFiltres()
}

const toggleFavoris = (objet) => {
    objet.isFavoris = !objet.isFavoris
    // TODO: Appel API pour sauvegarder le favori
}

const voirDetails = (objet) => {
    router.push(`/annonce/${objet.id}`)
}

onMounted(() => {
    appliquerFiltres()
})
</script>

<style scoped>
.recherche-page {
    min-height: 100vh;
    background: #fafafa;
    padding: 2rem 0;
}

.page-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
}

/* En-tête */
.page-header {
    text-align: center;
    margin-bottom: 2rem;
}

.page-header h1 {
    font-size: 2.5rem;
    font-weight: 700;
    color: #1f2937;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
}

.title-icon {
    color: #667eea;
}

.subtitle {
    font-size: 1.125rem;
    color: #6b7280;
}

/* Barre de recherche */
.search-bar-section {
    margin-bottom: 2rem;
}

.search-input-wrapper {
    position: relative;
    max-width: 800px;
    margin: 0 auto;
}

.search-icon {
    position: absolute;
    left: 1.5rem;
    top: 50%;
    transform: translateY(-50%);
    color: #9ca3af;
}

.search-input {
    width: 100%;
    padding: 1.25rem 4rem 1.25rem 4rem;
    border: 2px solid #e5e7eb;
    border-radius: 12px;
    font-size: 1.125rem;
    transition: all 0.2s;
}

.search-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.clear-btn {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    background: #f3f4f6;
    border: none;
    border-radius: 6px;
    padding: 0.5rem;
    cursor: pointer;
    color: #6b7280;
    transition: all 0.2s;
}

.clear-btn:hover {
    background: #e5e7eb;
    color: #374151;
}

/* Layout avec sidebar */
.content-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 2rem;
    align-items: start;
}

/* Filtres sidebar */
.filters-sidebar {
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 2rem;
}

.filters-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.filters-header h3 {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.25rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
}

.btn-reset-filters {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: #fef3c7;
    color: #92400e;
    border: 1px solid #fde68a;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-reset-filters:hover {
    background: #fde68a;
}

.filters-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.filter-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.filter-group label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    color: #374151;
    font-size: 0.875rem;
}

.filter-select {
    padding: 0.75rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 1rem;
    background: white;
    cursor: pointer;
    transition: all 0.2s;
}

.filter-select:focus {
    outline: none;
    border-color: #667eea;
}

.filter-price .price-inputs {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.price-input {
    flex: 1;
    min-width: 0;
    padding: 0.75rem 0.5rem;
    border: 2px solid #e5e7eb;
    border-radius: 8px;
    font-size: 0.875rem;
}

.price-input:focus {
    outline: none;
    border-color: #667eea;
}

.price-separator {
    color: #9ca3af;
    font-weight: 600;
}

/* Résultats */
.results-section {
    flex: 1;
}

.results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.results-count {
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
    margin: 0;
}

.sort-group {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.sort-group label {
    font-weight: 600;
    color: #6b7280;
    font-size: 0.875rem;
}

.sort-select {
    padding: 0.5rem 1rem;
    border: 2px solid #e5e7eb;
    border-radius: 6px;
    background: white;
    cursor: pointer;
    font-size: 0.875rem;
}

/* Liste vide */
.empty-results {
    text-align: center;
    padding: 4rem 2rem;
    background: white;
    border-radius: 12px;
}

.empty-results svg {
    color: #d1d5db;
    margin-bottom: 1rem;
}

.empty-results h3 {
    font-size: 1.5rem;
    color: #1f2937;
    margin-bottom: 0.5rem;
}

.empty-results p {
    color: #6b7280;
    margin-bottom: 1.5rem;
}

.btn-reset {
    background: #667eea;
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-reset:hover {
    background: #5568d3;
}

/* Grille d'objets */
.objets-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 2rem;
}

.objet-card {
    background: white;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;
    cursor: pointer;
}

.objet-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.objet-image {
    position: relative;
    width: 100%;
    height: 240px;
    overflow: hidden;
    background: #f3f4f6;
}

.objet-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
}

.objet-card:hover .objet-image img {
    transform: scale(1.05);
}

.badges-overlay {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.badge-statut,
.badge-type {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.375rem 0.75rem;
    border-radius: 6px;
    font-size: 0.75rem;
    font-weight: 600;
    width: fit-content;
}

.badge-statut.actif {
    background: #d1fae5;
    color: #065f46;
}

.badge-statut.vendu {
    background: #dbeafe;
    color: #1e40af;
}

.badge-statut.expire {
    background: #fee2e2;
    color: #991b1b;
}

.badge-type.enchere {
    background: rgba(102, 126, 234, 0.9);
    color: white;
}

.badge-type.vente-rapide {
    background: rgba(16, 185, 129, 0.9);
    color: white;
}

.btn-favoris {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    background: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #d1d5db;
    transition: all 0.2s;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.btn-favoris:hover {
    color: #ef4444;
    transform: scale(1.1);
}

.btn-favoris.active {
    color: #ef4444;
}

.objet-info {
    padding: 1.25rem;
}

.objet-categorie {
    display: inline-block;
    font-size: 0.75rem;
    font-weight: 600;
    color: #667eea;
    background: #eef2ff;
    padding: 0.25rem 0.75rem;
    border-radius: 4px;
    margin-bottom: 0.5rem;
}

.objet-nom {
    font-size: 1.125rem;
    font-weight: 700;
    color: #1f2937;
    margin: 0.5rem 0;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.prix-section {
    margin: 1rem 0;
}

.prix-label {
    display: block;
    font-size: 0.75rem;
    color: #6b7280;
    margin-bottom: 0.25rem;
}

.prix-value {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1f2937;
}

.enchere-stats {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;
}

.enchere-stats span {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.temps-restant {
    color: #f59e0b;
    font-weight: 600;
}

.vendeur-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
    font-size: 0.875rem;
    color: #6b7280;
}

.vendeur-note {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: #f59e0b;
    font-weight: 600;
    margin-left: auto;
}

/* Responsive */
@media (max-width: 1024px) {
    .content-layout {
        grid-template-columns: 240px 1fr;
        gap: 1.5rem;
    }

    .filters-sidebar {
        padding: 1rem;
    }
}

@media (max-width: 768px) {
    .page-header h1 {
        font-size: 2rem;
    }

    .content-layout {
        grid-template-columns: 1fr;
    }

    .filters-sidebar {
        position: static;
    }

    .results-header {
        flex-direction: column;
        gap: 1rem;
        align-items: flex-start;
    }

    .objets-grid {
        grid-template-columns: 1fr;
    }
}
</style>
