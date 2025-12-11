<script setup>
import { ref } from 'vue'

const activeTab = ref('commissions')
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const selectTab = (tab) => {
  activeTab.value = tab
  isMenuOpen.value = false
}

// Commissions
const commissions = ref({
  sellerCommission: 2,
  buyerCommission: 3
})

// Catégories
const categories = ref([
  { id: 1, name: 'Bijoux & montres', active: true },
  { id: 2, name: 'Meubles anciens', active: true },
  { id: 3, name: 'Objets d\'art & tableaux', active: true },
  { id: 4, name: 'Objets de collection', active: true }
])
const newCategory = ref('')

// Utilisateurs
const users = ref([
  { id: 1, name: 'Jean Dupont', email: 'jean@example.com', type: 'professional', blocked: false },
  { id: 2, name: 'Marie Martin', email: 'marie@example.com', type: 'individual', blocked: false }
])
const newUserForm = ref({
  email: '',
  firstName: '',
  lastName: '',
  type: 'professional'
})

// Enchères et ventes
const auctions = ref([
  { id: 1, itemName: 'Peinture XVIIIe', seller: 'Jean Dupont', status: 'active', currentPrice: 1500 },
  { id: 2, itemName: 'Montre ancienne', seller: 'Marie Martin', status: 'completed', currentPrice: 800 }
])

// Transporteurs
const transporters = ref([
  { id: 1, name: 'Cocolis', active: true },
  { id: 2, name: 'DHL', active: true },
  { id: 3, name: 'UPS', active: false }
])

// Avis clients
const reviews = ref([
  { id: 1, user: 'Jean Dupont', rating: 5, nps: 9, comment: 'Excellent service', date: '2025-01-10' },
  { id: 2, user: 'Marie Martin', rating: 4, nps: 8, comment: 'Très bien', date: '2025-01-09' }
])

// Messages de confirmation
const successMessage = ref('')
const errorMessage = ref('')

// Fonctions Commissions
const saveCommissions = () => {
  successMessage.value = 'Commissions mises à jour avec succès'
  setTimeout(() => (successMessage.value = ''), 3000)
}

// Fonctions Catégories
const addCategory = () => {
  if (newCategory.value.trim()) {
    categories.value.push({
      id: Date.now(),
      name: newCategory.value,
      active: true
    })
    newCategory.value = ''
    successMessage.value = 'Catégorie ajoutée avec succès'
    setTimeout(() => (successMessage.value = ''), 3000)
  }
}

const deleteCategory = (id) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
    categories.value = categories.value.filter(cat => cat.id !== id)
    successMessage.value = 'Catégorie supprimée avec succès'
    setTimeout(() => (successMessage.value = ''), 3000)
  }
}

const toggleCategoryStatus = (id) => {
  const category = categories.value.find(cat => cat.id === id)
  if (category) {
    category.active = !category.active
  }
}

// Fonctions Utilisateurs
const createUser = () => {
  if (newUserForm.value.email && newUserForm.value.firstName && newUserForm.value.lastName) {
    users.value.push({
      id: Date.now(),
      name: `${newUserForm.value.firstName} ${newUserForm.value.lastName}`,
      email: newUserForm.value.email,
      type: newUserForm.value.type,
      blocked: false
    })
    newUserForm.value = { email: '', firstName: '', lastName: '', type: 'professional' }
    successMessage.value = 'Utilisateur créé avec succès'
    setTimeout(() => (successMessage.value = ''), 3000)
  }
}

const toggleBlockUser = (id) => {
  const user = users.value.find(u => u.id === id)
  if (user) {
    user.blocked = !user.blocked
    successMessage.value = user.blocked ? 'Utilisateur bloqué' : 'Utilisateur débloqué'
    setTimeout(() => (successMessage.value = ''), 3000)
  }
}

// Fonctions Transporteurs
const toggleTransporter = (id) => {
  const transporter = transporters.value.find(t => t.id === id)
  if (transporter) {
    transporter.active = !transporter.active
  }
}
</script>

<template>
  <div class="admin-container">
    <div class="admin-wrapper">
      <header class="admin-header">
        <h1>Dashboard Admin</h1>
        <p class="subtitle">Gestion de la plateforme Purple Dog</p>
      </header>

      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>

      <!-- Navigation par onglets -->
      <nav class="admin-tabs">
        <!-- Bouton hamburger (visible sur mobile uniquement) -->
        <button class="hamburger-button" @click="toggleMenu">
          <span class="hamburger-icon">☰</span>
          <span class="current-tab-mobile">{{
            activeTab === 'commissions' ? 'Commissions' :
            activeTab === 'categories' ? 'Catégories' :
            activeTab === 'users' ? 'Utilisateurs' :
            activeTab === 'sales' ? 'Enchères/Ventes' :
            activeTab === 'accounting' ? 'Comptabilité' :
            activeTab === 'stripe' ? 'Stripe' :
            activeTab === 'transporters' ? 'Transporteurs' :
            'Avis clients'
          }}</span>
        </button>

        <!-- Menu de navigation (visible sur desktop, dropdown sur mobile) -->
        <div :class="['tabs-menu', { 'menu-open': isMenuOpen }]">
          <button
            :class="['tab-button', { active: activeTab === 'commissions' }]"
            @click="selectTab('commissions')"
          >
            Commissions
          </button>
          <button
            :class="['tab-button', { active: activeTab === 'categories' }]"
            @click="selectTab('categories')"
          >
            Catégories
          </button>
          <button
            :class="['tab-button', { active: activeTab === 'users' }]"
            @click="selectTab('users')"
          >
            Utilisateurs
          </button>
          <button
            :class="['tab-button', { active: activeTab === 'sales' }]"
            @click="selectTab('sales')"
          >
            Enchères/Ventes
          </button>
          <button
            :class="['tab-button', { active: activeTab === 'accounting' }]"
            @click="selectTab('accounting')"
          >
            Comptabilité
          </button>
          <button
            :class="['tab-button', { active: activeTab === 'stripe' }]"
            @click="selectTab('stripe')"
          >
            Stripe
          </button>
          <button
            :class="['tab-button', { active: activeTab === 'transporters' }]"
            @click="selectTab('transporters')"
          >
            Transporteurs
          </button>
          <button
            :class="['tab-button', { active: activeTab === 'reviews' }]"
            @click="selectTab('reviews')"
          >
            Avis clients
          </button>
        </div>
      </nav>

      <div class="admin-content">
        <!-- Onglet Commissions -->
        <section v-if="activeTab === 'commissions'" class="admin-section">
          <h2>Gestion des Commissions</h2>
          <div class="form-group">
            <label for="sellerCommission">Commission Vendeur (%)</label>
            <input
              id="sellerCommission"
              v-model.number="commissions.sellerCommission"
              type="number"
              min="0"
              max="100"
              step="0.1"
            />
          </div>
          <div class="form-group">
            <label for="buyerCommission">Commission Acheteur (%)</label>
            <input
              id="buyerCommission"
              v-model.number="commissions.buyerCommission"
              type="number"
              min="0"
              max="100"
              step="0.1"
            />
          </div>
          <button class="btn-primary" @click="saveCommissions">
            Enregistrer les commissions
          </button>
        </section>

        <!-- Onglet Catégories -->
        <section v-if="activeTab === 'categories'" class="admin-section">
          <h2>Gestion des Catégories</h2>
          <div class="add-category">
            <input
              v-model="newCategory"
              type="text"
              placeholder="Nouvelle catégorie"
              @keyup.enter="addCategory"
            />
            <button class="btn-primary" @click="addCategory">Ajouter</button>
          </div>
          <div class="categories-list">
            <div v-for="category in categories" :key="category.id" class="category-item">
              <span :class="{ inactive: !category.active }">{{ category.name }}</span>
              <div class="category-actions">
                <button class="btn-toggle" @click="toggleCategoryStatus(category.id)">
                  {{ category.active ? 'Désactiver' : 'Activer' }}
                </button>
                <button class="btn-danger" @click="deleteCategory(category.id)">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </section>

        <!-- Onglet Utilisateurs -->
        <section v-if="activeTab === 'users'" class="admin-section">
          <h2>Gestion des Utilisateurs</h2>
          <div class="create-user-form">
            <h3>Créer un nouvel utilisateur</h3>
            <div class="form-grid">
              <div class="form-group">
                <label>Prénom</label>
                <input v-model="newUserForm.firstName" type="text" />
              </div>
              <div class="form-group">
                <label>Nom</label>
                <input v-model="newUserForm.lastName" type="text" />
              </div>
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="newUserForm.email" type="email" />
            </div>
            <div class="form-group">
              <label>Type de compte</label>
              <select v-model="newUserForm.type">
                <option value="professional">Professionnel</option>
                <option value="individual">Particulier</option>
              </select>
            </div>
            <button class="btn-primary" @click="createUser">Créer le compte</button>
          </div>

          <h3>Liste des utilisateurs</h3>
          <div class="users-list">
            <div v-for="user in users" :key="user.id" class="user-item">
              <div class="user-info">
                <strong :class="{ blocked: user.blocked }">{{ user.name }}</strong>
                <span class="user-email">{{ user.email }}</span>
                <span class="user-type">{{ user.type === 'professional' ? 'Pro' : 'Part.' }}</span>
              </div>
              <button
                :class="['btn-toggle', { 'btn-danger': !user.blocked }]"
                @click="toggleBlockUser(user.id)"
              >
                {{ user.blocked ? 'Débloquer' : 'Bloquer' }}
              </button>
            </div>
          </div>
        </section>

        <!-- Onglet Enchères/Ventes -->
        <section v-if="activeTab === 'sales'" class="admin-section">
          <h2>Enchères et Ventes Rapides</h2>
          <div class="sales-list">
            <div v-for="auction in auctions" :key="auction.id" class="sale-item">
              <div class="sale-info">
                <strong>{{ auction.itemName }}</strong>
                <span>Vendeur: {{ auction.seller }}</span>
                <span :class="['status', auction.status]">
                  {{ auction.status === 'active' ? 'En cours' : 'Terminée' }}
                </span>
              </div>
              <div class="sale-price">{{ auction.currentPrice }}€</div>
            </div>
          </div>
        </section>

        <!-- Onglet Comptabilité -->
        <section v-if="activeTab === 'accounting'" class="admin-section">
          <h2>Gestion Comptabilité</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <h3>Ventes totales</h3>
              <p class="stat-value">45 230 €</p>
            </div>
            <div class="stat-card">
              <h3>Commissions perçues</h3>
              <p class="stat-value">2 261 €</p>
            </div>
            <div class="stat-card">
              <h3>Transactions ce mois</h3>
              <p class="stat-value">127</p>
            </div>
            <div class="stat-card">
              <h3>En attente</h3>
              <p class="stat-value">3 450 €</p>
            </div>
          </div>
        </section>

        <!-- Onglet Stripe -->
        <section v-if="activeTab === 'stripe'" class="admin-section">
          <h2>Gestion Stripe</h2>
          <div class="stripe-info">
            <p>
              <strong>Mode:</strong> Test
            </p>
            <p>
              <strong>Clé publique:</strong> pk_test_xxxxxxxxxxxxx
            </p>
            <button class="btn-primary">Accéder au dashboard Stripe</button>
          </div>
        </section>

        <!-- Onglet Transporteurs -->
        <section v-if="activeTab === 'transporters'" class="admin-section">
          <h2>Gestion des Transporteurs</h2>
          <div class="transporters-list">
            <div v-for="transporter in transporters" :key="transporter.id" class="transporter-item">
              <span :class="{ inactive: !transporter.active }">{{ transporter.name }}</span>
              <button class="btn-toggle" @click="toggleTransporter(transporter.id)">
                {{ transporter.active ? 'Désactiver' : 'Activer' }}
              </button>
            </div>
          </div>
        </section>

        <!-- Onglet Avis clients -->
        <section v-if="activeTab === 'reviews'" class="admin-section">
          <h2>Avis Clients</h2>
          <div class="reviews-list">
            <div v-for="review in reviews" :key="review.id" class="review-item">
              <div class="review-header">
                <strong>{{ review.user }}</strong>
                <span class="review-date">{{ review.date }}</span>
              </div>
              <div class="review-ratings">
                <span>⭐ {{ review.rating }}/5</span>
                <span>NPS: {{ review.nps }}/10</span>
              </div>
              <p class="review-comment">{{ review.comment }}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-container {
  min-height: 100vh;
  background-color: #fafafa;
  padding: 0;
}

.admin-wrapper {
  background: white;
  min-height: 100vh;
}

.admin-header {
  padding: 2rem 1.5rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  text-align: center;
}

.admin-header h1 {
  font-size: 1.5rem;
  font-weight: 400;
  margin: 0 0 0.5rem;
  color: #1a1a1a;
  letter-spacing: -0.02em;
}

.subtitle {
  color: #666;
  font-size: 0.95rem;
  margin: 0;
}

.success-message {
  background-color: #d4edda;
  color: #155724;
  padding: 1rem 2rem;
  margin: 0;
  text-align: center;
  border-bottom: 1px solid #c3e6cb;
}

.error-message {
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem 2rem;
  margin: 0;
  text-align: center;
  border-bottom: 1px solid #f5c6cb;
}

.admin-tabs {
  position: relative;
  background-color: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.hamburger-button {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 1rem 1.5rem;
  border: none;
  background-color: white;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 500;
  color: #1a1a1a;
  border-radius: 4px;
  transition: all 0.2s;
}

.hamburger-button:hover {
  background-color: #f0f0f0;
}

.hamburger-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.current-tab-mobile {
  flex: 1;
  text-align: left;
}

.tabs-menu {
  display: none;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0 0.5rem 0.5rem;
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.tabs-menu.menu-open {
  display: flex;
  max-height: 500px;
}

.tab-button {
  padding: 0.75rem 1.5rem;
  border: none;
  background-color: white;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  color: #666;
  border-radius: 4px;
  transition: all 0.2s;
  white-space: nowrap;
  text-align: left;
}

.tab-button:hover {
  background-color: #e0e0e0;
}

.tab-button.active {
  background-color: #1a1a1a;
  color: white;
}

@media (min-width: 769px) {
  .hamburger-button {
    display: none;
  }

  .admin-tabs {
    padding: 1rem;
  }

  .tabs-menu {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    max-height: none;
    padding: 0;
    gap: 0.5rem;
    overflow-x: auto;
  }

  .tab-button {
    text-align: center;
  }
}

.admin-content {
  padding: 2rem;
}

.admin-section {
  max-width: 1200px;
  margin: 0 auto;
}

.admin-section h2 {
  font-size: 1.3rem;
  font-weight: 500;
  margin: 0 0 1.5rem;
  color: #1a1a1a;
}

.admin-section h3 {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 2rem 0 1rem;
  color: #1a1a1a;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  color: #444;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d0d0d0;
  border-radius: 2px;
  font-size: 0.95rem;
  font-family: inherit;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.btn-primary,
.btn-secondary,
.btn-toggle,
.btn-danger {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 2px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.btn-primary {
  background-color: #1a1a1a;
  color: white;
}

.btn-primary:hover {
  background-color: #000;
}

.btn-secondary {
  background-color: white;
  color: #1a1a1a;
  border: 1px solid #d0d0d0;
}

.btn-toggle {
  background-color: #667eea;
  color: white;
  font-size: 0.75rem;
  padding: 0.5rem 1rem;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
  font-size: 0.75rem;
  padding: 0.5rem 1rem;
}

.add-category {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.add-category input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #d0d0d0;
  border-radius: 2px;
}

.categories-list,
.users-list,
.sales-list,
.transporters-list,
.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  color: #000000;
}

.category-item,
.user-item,
.sale-item,
.transporter-item,
.review-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
  color: #1a1a1a;
}

.category-item span,
.transporter-item span {
  color: #1a1a1a;
}

.category-actions,
.user-actions {
  display: flex;
  gap: 0.5rem;
}

.inactive {
  color: #999;
  text-decoration: line-through;
}

.blocked {
  color: #dc3545;
}

.create-user-form {
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 4px;
  margin-bottom: 2rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-email {
  font-size: 0.85rem;
  color: #666;
}

.user-type {
  font-size: 0.75rem;
  background-color: #667eea;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  width: fit-content;
}

.sale-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.sale-info span {
  font-size: 0.85rem;
  color: #666;
}

.status {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  width: fit-content;
}

.status.active {
  background-color: #28a745;
  color: white;
}

.status.completed {
  background-color: #6c757d;
  color: white;
}

.sale-price {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1a1a1a;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background-color: #f9f9f9;
  padding: 1.5rem;
  border-radius: 4px;
  border: 1px solid #e0e0e0;
}

.stat-card h3 {
  font-size: 0.9rem;
  font-weight: 500;
  color: #666;
  margin: 0 0 0.5rem;
}

.stat-value {
  font-size: 2rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.stripe-info {
  background-color: #f9f9f9;
  padding: 2rem;
  border-radius: 4px;
}

.stripe-info p {
  margin: 0.5rem 0;
  font-size: 0.95rem;
  color: #000000;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.review-date {
  font-size: 0.85rem;
  color: #666;
}

.review-ratings {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.review-comment {
  font-size: 0.95rem;
  color: #444;
  margin: 0;
}

@media (min-width: 769px) {
  .admin-container {
    padding: 2rem 1rem;
  }

  .admin-wrapper {
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .admin-header {
    padding: 3rem 2rem 2rem;
  }

  .admin-header h1 {
    font-size: 2rem;
  }

  .admin-tabs {
    padding: 1.5rem 2rem;
  }

  .admin-content {
    padding: 2.5rem 2rem;
  }
}
</style>
