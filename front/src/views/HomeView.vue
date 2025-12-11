<template>
    <div class="home-page">
        <!-- Header Navigation -->
        <header class="luxury-header">
            <div class="header-container">
                <!-- Logo -->
                <div class="logo-section">
                    <h1 class="logo">Purple Dog</h1>
                    <p class="logo-subtitle">Collection d'Exception</p>
                </div>

                <!-- Search Bar -->
                <div class="search-section">
                    <div class="search-container">
                        <Search :size="20" class="search-icon" />
                        <input type="text" v-model="searchQuery" placeholder="Rechercher un objet de collection..."
                            class="search-input" @keyup.enter="handleSearch" />
                    </div>
                </div>

                <!-- User Actions -->
                <div class="user-actions">
                    <router-link to="/favoris" class="action-btn">
                        <Heart :size="24" />
                        <span class="action-label">Favoris</span>
                    </router-link>
                    <router-link to="/panier" class="action-btn">
                        <ShoppingCart :size="24" />
                        <span class="badge" v-if="cartCount > 0">{{ cartCount }}</span>
                        <span class="action-label">Panier</span>
                    </router-link>
                    <router-link to="/connexion" class="action-btn primary">
                        <User :size="24" />
                        <span class="action-label">Connexion</span>
                    </router-link>
                </div>
            </div>
        </header>

        <!-- Categories -->
        <nav class="categories-nav">
            <div class="categories-container">
                <button v-for="category in categories" :key="category.name" @click="selectCategory(category.name)"
                    :class="['category-btn', { active: selectedCategory === category.name }]">
                    <component :is="category.icon" :size="20" />
                    <span>{{ category.name }}</span>
                </button>
            </div>
        </nav>

        <!-- Hero Carousel -->
        <section class="hero-carousel">
            <transition name="fade" mode="out-in">
                <div :key="currentSlide" class="hero-slide"
                    :style="{ backgroundImage: `url(${heroImages[currentSlide].url})` }">
                    <div class="hero-overlay">
                        <div class="hero-content">
                            <h2 class="hero-title">{{ heroImages[currentSlide].title }}</h2>
                            <p class="hero-subtitle">{{ heroImages[currentSlide].subtitle }}</p>
                            <button class="hero-cta">
                                Découvrir
                            </button>
                        </div>
                    </div>
                </div>
            </transition>

            <!-- Carousel Controls -->
            <div class="carousel-controls">
                <button @click="prevSlide" class="carousel-btn">
                    <ChevronLeft :size="24" />
                </button>
                <div class="carousel-dots">
                    <button v-for="(image, index) in heroImages" :key="index" @click="currentSlide = index"
                        :class="['dot', { active: currentSlide === index }]"></button>
                </div>
                <button @click="nextSlide" class="carousel-btn">
                    <ChevronRight :size="24" />
                </button>
            </div>
        </section>

        <!-- Featured Collections -->
        <section class="featured-section">
            <div class="section-header-luxury">
                <h2>Élégance Intemporelle</h2>
                <p>Une sélection exclusive d'objets d'exception</p>
            </div>

            <div class="featured-grid-luxury">
                <div v-for="item in featuredItems" :key="item.id" class="featured-card-luxury">
                    <div class="card-image-luxury">
                        <img :src="item.image" :alt="item.title" />
                        <button class="btn-favorite-luxury">
                            <Heart :size="20" />
                        </button>
                    </div>
                    <div class="card-content-luxury">
                        <h3 class="card-title-luxury">{{ item.title }}</h3>
                        <p class="card-price-luxury">{{ item.price }}€</p>
                    </div>
                </div>
            </div>

            <div class="collection-cta">
                <button class="btn-discover-collection">
                    Découvrir la Sélection
                </button>
            </div>
        </section>

        <!-- Auction Results Banner -->
        <section class="auction-banner">
            <div class="auction-container">
                <div class="auction-carousel">
                    <h3 class="auction-title">
                        Résultats de ventes récentes
                    </h3>
                    <div class="carousel-wrapper">
                        <transition name="slide" mode="out-in">
                            <div :key="currentAuctionSlide" class="auction-image-container">
                                <img :src="auctionResults[currentAuctionSlide].image"
                                    :alt="auctionResults[currentAuctionSlide].title" />
                            </div>
                        </transition>
                        <div class="auction-carousel-dots">
                            <button v-for="(item, index) in auctionResults" :key="index"
                                @click="currentAuctionSlide = index"
                                :class="['auction-dot', { active: currentAuctionSlide === index }]"></button>
                        </div>
                    </div>
                </div>
                <div class="auction-details">
                    <div class="detail-item">
                        <span class="detail-label">Objet vendu</span>
                        <h4 class="detail-value">{{ auctionResults[currentAuctionSlide].title }}</h4>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Catégorie</span>
                        <p class="detail-value">{{ auctionResults[currentAuctionSlide].category }}</p>
                    </div>
                    <div class="detail-item highlight">
                        <span class="detail-label">Prix de vente</span>
                        <p class="detail-value price">{{ auctionResults[currentAuctionSlide].soldPrice }}€</p>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Date de vente</span>
                        <p class="detail-value">{{ auctionResults[currentAuctionSlide].date }}</p>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Nombre d'enchères</span>
                        <p class="detail-value">{{ auctionResults[currentAuctionSlide].bids }} enchères</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Categories Grid -->
        <section class="categories-grid-section">
            <div class="section-header">
                <h2>
                    Explorez nos Catégories
                </h2>
                <p>Trouvez l'objet de collection qui vous correspond</p>
            </div>
            <div class="categories-grid">
                <div v-for="cat in categoryCards" :key="cat.name" class="category-card">
                    <div class="category-image">
                        <img :src="cat.image" :alt="cat.name" />
                        <button class="btn-favorite-category">
                            <Heart :size="20" />
                        </button>
                    </div>
                    <div class="category-info">
                        <h3>{{ cat.name }}</h3>
                        <button class="btn-discover-category">Voir plus</button>
                    </div>
                </div>
            </div>
        </section>

        <!-- Purple Dog Presentation -->
        <section class="presentation-section">
            <div class="presentation-container">
                <div class="presentation-content">
                    <div class="presentation-badge">
                        <span>Purple Dog</span>
                    </div>
                    <h2>LA plateforme pour vendre mieux vos objets de valeur à des tiers de confiance</h2>
                    <div class="presentation-features">
                        <div class="feature-item">
                            <div class="feature-icon">
                                <Shield :size="32" />
                            </div>
                            <div class="feature-text">
                                <h4>Sécurité Maximale</h4>
                                <p>Tous nos acheteurs sont vérifiés et certifiés. Vos transactions sont 100% sécurisées
                                    et assurées.</p>
                            </div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">
                                <TrendingUp :size="32" />
                            </div>
                            <div class="feature-text">
                                <h4>Meilleure Valorisation</h4>
                                <p>Notre système d'enchères intelligent et notre réseau d'experts garantissent le
                                    meilleur prix pour vos objets.</p>
                            </div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">
                                <Award :size="32" />
                            </div>
                            <div class="feature-text">
                                <h4>Expertise Reconnue</h4>
                                <p>Plus de 15 ans d'expérience dans l'authentification et l'évaluation d'objets de
                                    collection.</p>
                            </div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">
                                <User :size="32" />
                            </div>
                            <div class="feature-text">
                                <h4>Communauté de Confiance</h4>
                                <p>Rejoignez plus de 50,000 collectionneurs et vendeurs qui nous font confiance chaque
                                    jour.</p>
                            </div>
                        </div>
                    </div>
                    <div class="presentation-cta">
                        <button class="btn-primary-large">
                            Commencer à vendre
                        </button>
                        <button class="btn-secondary-large">
                            En savoir plus
                        </button>
                    </div>
                </div>
                <div class="presentation-image">
                    <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=1000&fit=crop"
                        alt="Purple Dog Platform" />
                    <div class="stats-overlay">
                        <div class="stat-card">
                            <p class="stat-number">50K+</p>
                            <p class="stat-label">Utilisateurs</p>
                        </div>
                        <div class="stat-card">
                            <p class="stat-number">98%</p>
                            <p class="stat-label">Satisfaction</p>
                        </div>
                        <div class="stat-card">
                            <p class="stat-number">200K+</p>
                            <p class="stat-label">Objets vendus</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Premium Services -->
        <section class="services-section">
            <div class="services-grid">
                <div class="service-card">
                    <Shield :size="48" />
                    <h3>Authenticité Garantie</h3>
                    <p>Chaque pièce est authentifiée par nos experts</p>
                </div>
                <div class="service-card">
                    <TruckIcon :size="48" />
                    <h3>Livraison Sécurisée</h3>
                    <p>Emballage premium et livraison assurée</p>
                </div>
                <div class="service-card">
                    <Award :size="48" />
                    <h3>Service d'Excellence</h3>
                    <p>Support dédié 7j/7 pour votre satisfaction</p>
                </div>
            </div>
        </section>

        <!-- Newsletter -->
        <section class="newsletter-section">
            <div class="newsletter-content">
                <h2>Restez Informé</h2>
                <p>Recevez en avant-première nos nouvelles collections et offres exclusives</p>
                <form @submit.prevent="subscribeNewsletter" class="newsletter-form">
                    <input type="email" v-model="newsletterEmail" placeholder="Votre adresse email" required />
                    <button type="submit">
                        S'abonner
                    </button>
                </form>
            </div>
        </section>

        <!-- Footer -->
        <footer class="footer">
            <div class="footer-container">
                <div class="footer-main">
                    <div class="footer-brand">
                        <h3 class="footer-logo">Purple Dog</h3>
                        <p class="footer-tagline">Collection d'Exception</p>
                        <p class="footer-description">
                            La plateforme de confiance pour vendre et acheter des objets de collection authentiques et
                            de valeur.
                        </p>
                        <div class="footer-social">
                            <a href="#" class="social-link facebook" aria-label="Facebook">
                                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </a>
                            <a href="#" class="social-link instagram" aria-label="Instagram">
                                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                </svg>
                            </a>
                            <a href="#" class="social-link twitter" aria-label="Twitter">
                                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                                </svg>
                            </a>
                            <a href="#" class="social-link linkedin" aria-label="LinkedIn">
                                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                    <path
                                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div class="footer-links">
                        <div class="footer-column">
                            <h4>Navigation</h4>
                            <ul>
                                <li><router-link to="/">Accueil</router-link></li>
                                <li><router-link to="/forfait">Nos Forfaits</router-link></li>
                                <li><router-link to="/publier">Vendre</router-link></li>
                                <li><router-link to="/mes-objets">Mes Objets</router-link></li>
                            </ul>
                        </div>

                        <div class="footer-column">
                            <h4>Catégories</h4>
                            <ul>
                                <li><a href="#bijoux">Bijoux</a></li>
                                <li><a href="#meubles">Meubles</a></li>
                                <li><a href="#art">Art</a></li>
                                <li><a href="#mode">Mode</a></li>
                            </ul>
                        </div>

                        <div class="footer-column">
                            <h4>Informations</h4>
                            <ul>
                                <li><router-link to="/qui-sommes-nous">Qui Sommes-Nous ?</router-link></li>
                                <li><router-link to="/mentions-legales">Mentions Légales</router-link></li>
                                <li><router-link to="/contact">Contact</router-link></li>
                                <li><router-link to="/faq">FAQ</router-link></li>
                            </ul>
                        </div>

                        <div class="footer-column">
                            <h4>Contact</h4>
                            <ul class="footer-contact">
                                <li>
                                    <Mail :size="16" />
                                    <a href="mailto:contact@purpledog.com">contact@purpledog.com</a>
                                </li>
                                <li>
                                    <Phone :size="16" />
                                    <a href="tel:+33123456789">+33 1 23 45 67 89</a>
                                </li>
                            </ul>
                            <router-link to="/contact" class="btn-contact-footer">
                                <MessageSquare :size="18" />
                                Nous contacter
                            </router-link>
                        </div>
                    </div>
                </div>

                <div class="footer-bottom">
                    <p>&copy; 2025 Purple Dog. Tous droits réservés.</p>
                    <div class="footer-legal">
                        <router-link to="/mentions-legales">Mentions Légales</router-link>
                        <span>•</span>
                        <router-link to="/politique-confidentialite">Politique de Confidentialité</router-link>
                        <span>•</span>
                        <router-link to="/cgu">CGU</router-link>
                    </div>
                </div>
            </div>
        </footer>

        <!-- Toast Notification -->
        <transition name="toast">
            <div v-if="showToast" class="toast">
                <CheckCircle :size="20" />
                <span>{{ toastMessage }}</span>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import {
    Search,
    Heart,
    ShoppingCart,
    User,
    TrendingUp,
    Gem,
    Sofa,
    Palette,
    Library,
    Music,
    Shirt,
    Hammer,
    MoreHorizontal,
    Sparkles,
    ChevronLeft,
    ChevronRight,
    Crown,
    Eye,
    Shield,
    Truck as TruckIcon,
    Award,
    Mail,
    Phone,
    MessageSquare,
    CheckCircle
} from 'lucide-vue-next'

// State
const searchQuery = ref('')
const selectedCategory = ref('Tendances')
const cartCount = ref(0)
const currentSlide = ref(0)
const currentAuctionSlide = ref(0)
const showToast = ref(false)
const toastMessage = ref('')
const newsletterEmail = ref('')

// Categories
const categories = [
    { name: 'Tendances', icon: TrendingUp },
    { name: 'Bijoux', icon: Gem },
    { name: 'Meubles', icon: Sofa },
    { name: 'Art', icon: Palette },
    { name: 'Collection', icon: Library },
    { name: 'Musique', icon: Music },
    { name: 'Mode', icon: Shirt },
    { name: 'Sculpture', icon: Hammer },
    { name: 'Autres', icon: MoreHorizontal }
]

// Hero Images
const heroImages = [
    {
        url: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=1920&h=800&fit=crop',
        title: 'Collections Rares & Précieuses',
        subtitle: 'Découvrez des pièces uniques d\'exception'
    },
    {
        url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1920&h=800&fit=crop',
        title: 'Bijoux d\'Exception',
        subtitle: 'L\'élégance intemporelle à portée de main'
    },
    {
        url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1920&h=800&fit=crop',
        title: 'Mobilier de Prestige',
        subtitle: 'Des créations qui traversent le temps'
    }
]

// Featured Items
const featuredItems = ref([
    {
        id: 1,
        image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop',
        category: 'Bijoux',
        title: 'Montre Vintage Or',
        price: '2,450'
    },
    {
        id: 2,
        image: 'https://images.unsplash.com/photo-1578663248512-36e4e4c8a791?w=600&h=600&fit=crop',
        category: 'Art',
        title: 'Sculpture Bronze',
        price: '3,800'
    },
    {
        id: 3,
        image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=600&h=600&fit=crop',
        category: 'Meubles',
        title: 'Fauteuil Louis XV',
        price: '5,200'
    },
    {
        id: 4,
        image: 'https://images.unsplash.com/photo-1604871000636-074fa5117945?w=600&h=600&fit=crop',
        category: 'Mode',
        title: 'Sac à Main Vintage',
        price: '1,850'
    }
])

// Auction Results
const auctionResults = ref([
    {
        image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=500&h=500&fit=crop',
        title: 'Montre Patek Philippe Vintage',
        category: 'Horlogerie de Luxe',
        soldPrice: '45,800',
        date: '8 Décembre 2025',
        bids: 127
    },
    {
        image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&h=500&fit=crop',
        title: 'Fauteuil Louis XVI Authentique',
        category: 'Mobilier d\'Époque',
        soldPrice: '12,400',
        date: '6 Décembre 2025',
        bids: 89
    },
    {
        image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&h=500&fit=crop',
        title: 'Sculpture Bronze Art Déco',
        category: 'Art & Sculpture',
        soldPrice: '8,950',
        date: '5 Décembre 2025',
        bids: 64
    },
    {
        image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=500&h=500&fit=crop',
        title: 'Service à Thé Argent Massif',
        category: 'Argenterie',
        soldPrice: '6,200',
        date: '3 Décembre 2025',
        bids: 52
    },
    {
        image: 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=500&h=500&fit=crop',
        title: 'Sac Hermès Birkin Vintage',
        category: 'Mode & Accessoires',
        soldPrice: '18,500',
        date: '1 Décembre 2025',
        bids: 143
    }
])

// Category Cards (5x2 grid)
const categoryCards = ref([
    {
        name: 'Bijoux',
        icon: Gem,
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
        count: '2,450'
    },
    {
        name: 'Meubles',
        icon: Sofa,
        image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop',
        count: '1,823'
    },
    {
        name: 'Art',
        icon: Palette,
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
        count: '3,167'
    },
    {
        name: 'Collection',
        icon: Library,
        image: 'https://images.unsplash.com/photo-1524578271613-d550eacf6090?w=400&h=400&fit=crop',
        count: '4,892'
    },
    {
        name: 'Musique',
        icon: Music,
        image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop',
        count: '987'
    },
    {
        name: 'Mode',
        icon: Shirt,
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=400&fit=crop',
        count: '1,543'
    },
    {
        name: 'Sculpture',
        icon: Hammer,
        image: 'https://images.unsplash.com/photo-1578663248512-36e4e4c8a791?w=400&h=400&fit=crop',
        count: '756'
    },
    {
        name: 'Horlogerie',
        icon: TrendingUp,
        image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&h=400&fit=crop',
        count: '1,234'
    },
    {
        name: 'Livres Rares',
        icon: Library,
        image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop',
        count: '2,109'
    },
    {
        name: 'Autres',
        icon: MoreHorizontal,
        image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=400&h=400&fit=crop',
        count: '5,678'
    }
])

// Auto-slide interval
let slideInterval = null
let auctionInterval = null

onMounted(() => {
    startAutoSlide()
    startAuctionSlide()
})

onUnmounted(() => {
    stopAutoSlide()
    stopAuctionSlide()
})

const startAutoSlide = () => {
    slideInterval = setInterval(() => {
        nextSlide()
    }, 5000)
}

const stopAutoSlide = () => {
    if (slideInterval) {
        clearInterval(slideInterval)
    }
}

const startAuctionSlide = () => {
    auctionInterval = setInterval(() => {
        currentAuctionSlide.value = (currentAuctionSlide.value + 1) % auctionResults.value.length
    }, 4000)
}

const stopAuctionSlide = () => {
    if (auctionInterval) {
        clearInterval(auctionInterval)
    }
}

const nextSlide = () => {
    currentSlide.value = (currentSlide.value + 1) % heroImages.length
}

const prevSlide = () => {
    currentSlide.value = currentSlide.value === 0
        ? heroImages.length - 1
        : currentSlide.value - 1
}

const selectCategory = (category) => {
    selectedCategory.value = category
    // TODO: Filter items by category
}

const handleSearch = () => {
    if (searchQuery.value.trim()) {
        // TODO: Implement search
        console.log('Searching for:', searchQuery.value)
    }
}

const subscribeNewsletter = () => {
    toastMessage.value = 'Merci pour votre inscription !'
    showToast.value = true
    newsletterEmail.value = ''

    setTimeout(() => {
        showToast.value = false
    }, 3000)
}
</script>

<style scoped>
/* Global Styles */
.home-page {
    min-height: 100vh;
    background: #fafafa;
}

/* Header */
.luxury-header {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    color: white;
    padding: 1.5rem 0;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    gap: 2rem;
    align-items: center;
}

.logo-section {
    text-align: left;
}

.logo {
    font-size: 2rem;
    font-weight: 800;
    margin: 0;
    background: linear-gradient(135deg, #d4af37 0%, #f4e4c1 50%, #d4af37 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    letter-spacing: 1px;
}

.logo-subtitle {
    font-size: 0.75rem;
    color: #d4af37;
    margin: 0.25rem 0 0 0;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.search-section {
    display: flex;
    justify-content: center;
}

.search-container {
    position: relative;
    width: 100%;
    max-width: 600px;
}

.search-icon {
    position: absolute;
    left: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
}

.search-input {
    width: 100%;
    padding: 1rem 1rem 1rem 3.5rem;
    border: 2px solid transparent;
    border-radius: 50px;
    font-size: 1rem;
    background: white;
    transition: all 0.3s;
}

.search-input:focus {
    outline: none;
    border-color: #d4af37;
    box-shadow: 0 4px 16px rgba(212, 175, 55, 0.2);
}

.user-actions {
    display: flex;
    gap: 1.5rem;
    justify-content: flex-end;
    align-items: center;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.25rem;
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50px;
    color: white;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s;
    position: relative;
}

.action-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: #d4af37;
    transform: translateY(-2px);
}

.action-btn.primary {
    background: linear-gradient(135deg, #d4af37 0%, #b8941f 100%);
    border-color: #d4af37;
}

.action-btn.primary:hover {
    background: linear-gradient(135deg, #b8941f 0%, #9a7a19 100%);
}

.action-label {
    font-weight: 600;
    font-size: 0.9rem;
}

.badge {
    position: absolute;
    top: -5px;
    right: -5px;
    background: #ef4444;
    color: white;
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0.15rem 0.4rem;
    border-radius: 50%;
    min-width: 20px;
    text-align: center;
}

/* Categories */
.categories-nav {
    background: white;
    border-bottom: 1px solid #e5e5e5;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    position: sticky;
    top: 96px;
    z-index: 90;
}

.categories-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    gap: 1rem;
    overflow-x: auto;
    scrollbar-width: none;
}

.categories-container::-webkit-scrollbar {
    display: none;
}

.category-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: transparent;
    border: 2px solid transparent;
    border-radius: 50px;
    font-size: 0.95rem;
    font-weight: 600;
    color: #333;
    cursor: pointer;
    transition: all 0.3s;
    white-space: nowrap;
}

.category-btn:hover {
    background: #f9f9f9;
    border-color: #d4af37;
}

.category-btn.active {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    color: white;
    border-color: #1a1a1a;
}

/* Hero Carousel */
.hero-carousel {
    position: relative;
    height: 600px;
    overflow: hidden;
}

.hero-slide {
    height: 100%;
    background-size: cover;
    background-position: center;
    position: relative;
}

.hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.3) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
}

.hero-content {
    max-width: 1400px;
    padding: 0 2rem;
    text-align: left;
    color: white;
}

.hero-title {
    font-size: 3.5rem;
    font-weight: 400;
    margin: 0 0 1rem 0;
    line-height: 1.2;
    letter-spacing: 2px;
    color: white;
    font-family: 'Georgia', serif;
}

.hero-subtitle {
    font-size: 1.2rem;
    margin: 0 0 2rem 0;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 300;
    letter-spacing: 1px;
}

.hero-cta {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 3rem;
    background: transparent;
    color: white;
    border: 1px solid white;
    border-radius: 0;
    font-size: 0.9rem;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.3s;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.hero-cta:hover {
    background: white;
    color: #1a1a1a;
}

.carousel-controls {
    position: absolute;
    bottom: 2rem;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 2rem;
}

.carousel-btn {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
}

.carousel-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.1);
}

.carousel-dots {
    display: flex;
    gap: 0.75rem;
}

.dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
    border: none;
    cursor: pointer;
    transition: all 0.3s;
}

.dot.active {
    background: #d4af37;
    width: 40px;
    border-radius: 6px;
}

/* Featured Section - Luxury Style */
.featured-section {
    max-width: 100%;
    margin: 0 auto;
    padding: 6rem 0;
    background: #ffffff;
}

.section-header-luxury {
    text-align: center;
    margin-bottom: 4rem;
    padding: 0 2rem;
}

.section-header-luxury h2 {
    font-size: 2.5rem;
    font-weight: 400;
    color: #1a1a1a;
    margin: 0 0 1rem 0;
    letter-spacing: 2px;
    text-transform: none;
    font-family: 'Georgia', serif;
}

.section-header-luxury p {
    font-size: 1rem;
    color: #666;
    margin: 0;
    font-weight: 300;
    letter-spacing: 1px;
}

.featured-grid-luxury {
    max-width: 1600px;
    margin: 0 auto;
    padding: 0 3rem;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
}

.featured-card-luxury {
    background: transparent;
    border: none;
    overflow: visible;
    transition: all 0.4s ease;
    cursor: pointer;
}

.featured-card-luxury:hover {
    transform: translateY(-5px);
}

.card-image-luxury {
    position: relative;
    aspect-ratio: 3/4;
    overflow: hidden;
    background: #f8f8f8;
    margin-bottom: 1.5rem;
}

.card-image-luxury img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
}

.featured-card-luxury:hover .card-image-luxury img {
    transform: scale(1.05);
}

.btn-favorite-luxury {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 40px;
    height: 40px;
    background: white;
    border: 1px solid #e5e5e5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    z-index: 10;
    color: #1a1a1a;
    opacity: 0;
}

.featured-card-luxury:hover .btn-favorite-luxury {
    opacity: 1;
}

.btn-favorite-luxury:hover {
    background: #1a1a1a;
    color: white;
    border-color: #1a1a1a;
    transform: scale(1.1);
}

.card-content-luxury {
    text-align: center;
    padding: 0 0.5rem;
}

.card-title-luxury {
    font-size: 1rem;
    font-weight: 400;
    color: #1a1a1a;
    margin: 0 0 0.75rem 0;
    letter-spacing: 0.5px;
}

.card-price-luxury {
    font-size: 0.95rem;
    font-weight: 300;
    color: #666;
    margin: 0;
}

.collection-cta {
    text-align: center;
    margin-top: 4rem;
    padding: 0 2rem;
}

.btn-discover-collection {
    padding: 1rem 3rem;
    background: transparent;
    color: #1a1a1a;
    border: 1px solid #1a1a1a;
    font-weight: 500;
    font-size: 0.95rem;
    letter-spacing: 1.5px;
    cursor: pointer;
    transition: all 0.3s;
    text-transform: uppercase;
}

.btn-discover-collection:hover {
    background: #1a1a1a;
    color: white;
}

/* Legacy styles - keeping for compatibility */
.section-header {
    text-align: center;
    margin-bottom: 3rem;
}

.section-header h2 {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    font-size: 2.5rem;
    font-weight: 400;
    color: #1a1a1a;
    margin: 0 0 0.75rem 0;
    font-family: 'Georgia', serif;
    letter-spacing: 1px;
}

.section-header p {
    font-size: 1rem;
    color: #666;
    margin: 0;
    font-weight: 300;
    letter-spacing: 0.5px;
}

.featured-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.featured-card {
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transition: all 0.3s;
}

.featured-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}

.card-image {
    position: relative;
    height: 350px;
    overflow: hidden;
}

.card-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
}

.featured-card:hover .card-image img {
    transform: scale(1.1);
}

.card-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
}

.featured-card:hover .card-overlay {
    opacity: 1;
}

.quick-view {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: white;
    color: #1a1a1a;
    border: none;
    border-radius: 50px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.quick-view:hover {
    background: #d4af37;
    color: white;
}

.card-content {
    padding: 1.5rem;
}

.card-category {
    display: inline-block;
    font-size: 0.8rem;
    font-weight: 600;
    color: #d4af37;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 0.5rem;
}

.card-title {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 0.75rem 0;
}

.card-price {
    font-size: 1.5rem;
    font-weight: 800;
    color: #1a1a1a;
    margin: 0 0 1rem 0;
}

.card-actions {
    display: flex;
    gap: 0.75rem;
}

.btn-favorite {
    width: 48px;
    height: 48px;
    background: #f5f5f5;
    border: 1px solid #e5e5e5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    color: #666;
}

.btn-favorite:hover {
    background: #ffebee;
    border-color: #ef4444;
    color: #ef4444;
}

.btn-cart {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: #1a1a1a;
    color: white;
    border: none;
    border-radius: 50px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-cart:hover {
    background: #d4af37;
}

/* Auction Banner */
.auction-banner {
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    padding: 4rem 2rem;
    border-top: 1px solid #e5e5e5;
    border-bottom: 1px solid #e5e5e5;
}

.auction-container {
    max-width: 1400px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1.5fr;
    gap: 3rem;
    align-items: center;
}

.auction-carousel {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    height: 100%;
    display: flex;
    flex-direction: column;
}

.auction-title {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 1.75rem;
    font-weight: 400;
    color: #1a1a1a;
    margin: 0 0 1.5rem 0;
    font-family: 'Georgia', serif;
    letter-spacing: 1px;
}

.carousel-wrapper {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
}

.auction-image-container {
    width: 100%;
    flex: 1;
    border-radius: 16px;
    overflow: hidden;
    min-height: 400px;
}

.auction-image-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.auction-carousel-dots {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    margin-top: 1.5rem;
}

.auction-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #d1d5db;
    border: none;
    cursor: pointer;
    transition: all 0.3s;
}

.auction-dot.active {
    background: #d4af37;
    width: 32px;
    border-radius: 5px;
}

.auction-details {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    justify-content: space-between;
}

.detail-item {
    padding: 1.25rem 1.5rem;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s;
    flex: 1;
}

.detail-item:hover {
    transform: translateX(8px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.detail-item.highlight {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    color: white;
}

.detail-label {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #6b7280;
    margin-bottom: 0.5rem;
}

.detail-item.highlight .detail-label {
    color: #d4af37;
}

.detail-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0;
}

.detail-item.highlight .detail-value {
    color: white;
}

.detail-value.price {
    font-size: 2rem;
    color: #d4af37;
}

/* Categories Grid */
.categories-grid-section {
    max-width: 1600px;
    margin: 0 auto;
    padding: 6rem 3rem;
    background: #ffffff;
}

.categories-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
}

.category-card {
    background: transparent;
    border: none;
    overflow: visible;
    transition: all 0.4s ease;
    cursor: pointer;
}

.category-card:hover {
    transform: translateY(-5px);
}

.category-image {
    position: relative;
    aspect-ratio: 3/4;
    overflow: hidden;
    background: #f8f8f8;
    margin-bottom: 1.5rem;
}

.category-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
}

.category-card:hover .category-image img {
    transform: scale(1.05);
}

.btn-favorite-category {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 40px;
    height: 40px;
    background: white;
    border: 1px solid #e5e5e5;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s;
    z-index: 10;
    color: #1a1a1a;
    opacity: 0;
}

.category-card:hover .btn-favorite-category {
    opacity: 1;
}

.btn-favorite-category:hover {
    transform: scale(1.1);
    background: #1a1a1a;
    color: white;
    border-color: #1a1a1a;
}

.category-info {
    padding: 0;
    text-align: left;
}

.category-info h3 {
    font-size: 1.1rem;
    font-weight: 400;
    color: #1a1a1a;
    margin: 0 0 1rem 0;
    font-family: 'Georgia', serif;
    letter-spacing: 0.5px;
}

.btn-discover-category {
    display: inline-block;
    padding: 0.75rem 2rem;
    background: transparent;
    color: #1a1a1a;
    border: 1px solid #1a1a1a;
    border-radius: 0;
    font-size: 0.85rem;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.3s;
    letter-spacing: 1px;
    text-transform: uppercase;
}

.btn-discover-category:hover {
    background: #1a1a1a;
    color: white;
}

/* Presentation Section */
.presentation-section {
    background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
    padding: 6rem 2rem;
}

.presentation-container {
    max-width: 1400px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 4rem;
    align-items: center;
}

.presentation-content {
    padding-right: 2rem;
}

.presentation-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1.5rem;
    background: #1a1a1a;
    color: white;
    border-radius: 0;
    font-weight: 400;
    font-size: 0.85rem;
    margin-bottom: 1.5rem;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.presentation-content h2 {
    font-size: 2.5rem;
    font-weight: 400;
    color: #1a1a1a;
    line-height: 1.3;
    margin: 0 0 2.5rem 0;
    font-family: 'Georgia', serif;
    letter-spacing: 1px;
}

.presentation-features {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    margin-bottom: 3rem;
}

.feature-item {
    display: flex;
    gap: 1.5rem;
    align-items: flex-start;
}

.feature-icon {
    width: 64px;
    height: 64px;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #d4af37;
    flex-shrink: 0;
}

.feature-text h4 {
    font-size: 1.1rem;
    font-weight: 400;
    color: #1a1a1a;
    margin: 0 0 0.5rem 0;
    font-family: 'Georgia', serif;
    letter-spacing: 0.5px;
}

.feature-text p {
    font-size: 1rem;
    color: #6b7280;
    line-height: 1.6;
    margin: 0;
}

.presentation-cta {
    display: flex;
    gap: 1rem;
}

.btn-primary-large {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 3rem;
    background: #1a1a1a;
    color: white;
    border: none;
    border-radius: 0;
    font-size: 0.9rem;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.3s;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.btn-primary-large:hover {
    background: #2d2d2d;
}

.btn-secondary-large {
    padding: 1rem 3rem;
    background: white;
    color: #1a1a1a;
    border: 1px solid #1a1a1a;
    border-radius: 0;
    font-size: 0.9rem;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.3s;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.btn-secondary-large:hover {
    background: #1a1a1a;
    color: white;
}

.presentation-image {
    position: relative;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
}

.presentation-image img {
    width: 100%;
    height: 600px;
    object-fit: cover;
}

.stats-overlay {
    position: absolute;
    bottom: 2rem;
    left: 2rem;
    right: 2rem;
    display: flex;
    gap: 1rem;
}

.stat-card {
    flex: 1;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 1.5rem;
    border-radius: 12px;
    text-align: center;
}

.stat-number {
    font-size: 2rem;
    font-weight: 800;
    color: #d4af37;
    margin: 0 0 0.25rem 0;
}

.stat-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 1px;
}

/* Services Section */
.services-section {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    padding: 5rem 2rem;
}

.services-grid {
    max-width: 1400px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 3rem;
}

.service-card {
    text-align: center;
    color: white;
}

.service-card svg {
    color: #d4af37;
    margin-bottom: 1.5rem;
}

.service-card h3 {
    font-size: 1.25rem;
    font-weight: 400;
    margin: 0 0 1rem 0;
    font-family: 'Georgia', serif;
    letter-spacing: 1px;
}

.service-card p {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 0;
    line-height: 1.6;
}

/* Newsletter */
.newsletter-section {
    background: #1a1a1a;
    padding: 5rem 2rem;
}

.newsletter-content {
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
    color: white;
}

.newsletter-content svg {
    margin-bottom: 1.5rem;
}

.newsletter-content h2 {
    font-size: 2rem;
    font-weight: 400;
    margin: 0 0 1rem 0;
    font-family: 'Georgia', serif;
    letter-spacing: 1px;
}

.newsletter-content p {
    font-size: 1.1rem;
    margin: 0 0 2rem 0;
    opacity: 0.95;
}

.newsletter-form {
    display: flex;
    gap: 1rem;
    max-width: 500px;
    margin: 0 auto;
}

.newsletter-form input {
    flex: 1;
    padding: 1rem 1.5rem;
    border: 1px solid rgba(255, 255, 255, 0.3);
    border-radius: 0;
    font-size: 1rem;
    background: transparent;
    color: white;
}

.newsletter-form input::placeholder {
    color: rgba(255, 255, 255, 0.6);
}

.newsletter-form input:focus {
    outline: none;
    border-color: white;
    background: transparent;
}

.newsletter-form button {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2.5rem;
    background: white;
    color: #1a1a1a;
    border: none;
    border-radius: 0;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.3s;
    letter-spacing: 1px;
    text-transform: uppercase;
    font-size: 0.85rem;
}

.newsletter-form button:hover {
    background: #f5f5f5;
}

/* Toast */
.toast {
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: #10b981;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
    font-weight: 600;
    z-index: 1000;
}

/* Animations */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
    transition: all 0.4s ease;
}

.slide-enter-from {
    opacity: 0;
    transform: translateX(30px);
}

.slide-leave-to {
    opacity: 0;
    transform: translateX(-30px);
}

.toast-enter-active,
.toast-leave-active {
    transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateY(20px);
}

/* Footer */
.footer {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    color: white;
    padding: 4rem 0 0 0;
}

.footer-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 2rem;
}

.footer-main {
    display: grid;
    grid-template-columns: 1.5fr 2fr;
    gap: 4rem;
    padding-bottom: 3rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-brand {
    max-width: 400px;
}

.footer-logo {
    font-size: 2rem;
    font-weight: 800;
    margin: 0 0 0.5rem 0;
    background: linear-gradient(135deg, #d4af37 0%, #f4e4c1 50%, #d4af37 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.footer-tagline {
    font-size: 0.85rem;
    color: #d4af37;
    margin: 0 0 1.5rem 0;
    letter-spacing: 2px;
    text-transform: uppercase;
}

.footer-description {
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
    margin: 0 0 2rem 0;
}

.footer-social {
    display: flex;
    gap: 1rem;
}

.social-link {
    width: 40px;
    height: 40px;
    background: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s;
}

.social-link.facebook {
    color: #1877F2;
}

.social-link.facebook:hover {
    background: #1877F2;
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(24, 119, 242, 0.3);
}

.social-link.instagram {
    background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
    color: white;
}

.social-link.instagram:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(188, 24, 136, 0.4);
}

.social-link.twitter {
    color: #1DA1F2;
}

.social-link.twitter:hover {
    background: #1DA1F2;
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(29, 161, 242, 0.3);
}

.social-link.linkedin {
    color: #0A66C2;
}

.social-link.linkedin:hover {
    background: #0A66C2;
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 4px 12px rgba(10, 102, 194, 0.3);
}

.footer-links {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2rem;
}

.footer-column h4 {
    font-size: 1rem;
    font-weight: 700;
    color: #d4af37;
    margin: 0 0 1.5rem 0;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.footer-column ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.footer-column ul li a {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    transition: all 0.3s;
    display: block;
}

.footer-column ul li a:hover {
    color: #d4af37;
    padding-left: 8px;
}

.footer-contact li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: rgba(255, 255, 255, 0.7);
}

.footer-contact li svg {
    color: #d4af37;
    flex-shrink: 0;
}

.btn-contact-footer {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: #d4af37;
    color: #1a1a1a;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 700;
    margin-top: 1.5rem;
    transition: all 0.3s;
}

.btn-contact-footer:hover {
    background: #b8941f;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);
}

.footer-bottom {
    padding: 2rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: rgba(255, 255, 255, 0.5);
    font-size: 0.9rem;
}

.footer-bottom p {
    margin: 0;
}

.footer-legal {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.footer-legal a {
    color: rgba(255, 255, 255, 0.5);
    text-decoration: none;
    transition: color 0.3s;
}

.footer-legal a:hover {
    color: #d4af37;
}

.footer-legal span {
    color: rgba(255, 255, 255, 0.3);
}

/* Responsive */
@media (max-width: 1024px) {
    .header-container {
        grid-template-columns: 1fr;
        gap: 1.5rem;
    }

    .logo-section {
        text-align: center;
    }

    .user-actions {
        justify-content: center;
    }

    .hero-title {
        font-size: 3rem;
    }

    .hero-subtitle {
        font-size: 1.25rem;
    }

    .featured-grid-luxury {
        grid-template-columns: repeat(2, 1fr);
        padding: 0 2rem;
    }
}

@media (max-width: 768px) {
    .action-label {
        display: none;
    }

    .categories-container {
        padding: 0.75rem 1rem;
    }

    .category-btn {
        padding: 0.6rem 1rem;
        font-size: 0.85rem;
    }

    .hero-carousel {
        height: 400px;
    }

    .hero-title {
        font-size: 2rem;
    }

    .hero-subtitle {
        font-size: 1rem;
    }

    .hero-cta {
        padding: 1rem 1.75rem;
        font-size: 1rem;
    }

    .featured-grid {
        grid-template-columns: 1fr;
    }

    .featured-grid-luxury {
        grid-template-columns: 1fr;
        padding: 0 1.5rem;
        gap: 3rem;
    }

    .section-header-luxury h2 {
        font-size: 2rem;
    }

    .newsletter-form {
        flex-direction: column;
    }

    .auction-container {
        grid-template-columns: 1fr;
    }

    .auction-image-container {
        height: 300px;
    }

    .categories-grid {
        grid-template-columns: repeat(2, 1fr);
    }

    .presentation-container {
        grid-template-columns: 1fr;
    }

    .presentation-content {
        padding-right: 0;
    }

    .presentation-image img {
        height: 400px;
    }

    .stats-overlay {
        flex-direction: column;
    }

    .presentation-cta {
        flex-direction: column;
    }

    .btn-primary-large,
    .btn-secondary-large {
        width: 100%;
        justify-content: center;
    }

    .footer-main {
        grid-template-columns: 1fr;
        gap: 3rem;
    }

    .footer-links {
        grid-template-columns: repeat(2, 1fr);
    }

    .footer-bottom {
        flex-direction: column;
        gap: 1.5rem;
        text-align: center;
    }
}

@media (max-width: 768px) {
    .footer-links {
        grid-template-columns: 1fr;
    }

    .footer-legal {
        flex-direction: column;
        gap: 0.75rem;
    }

    .footer-legal span {
        display: none;
    }
}
</style>
