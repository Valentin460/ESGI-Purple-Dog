<template>
  <div class="forfait-page">
    <div class="forfait-container">
      <!-- En-tête -->
      <div class="header-section">
        <h1>
          <CreditCard :size="48" class="header-icon" />
          Nos Forfaits
        </h1>
        <p class="header-subtitle">Choisissez le forfait qui correspond à vos besoins</p>
      </div>

      <!-- Toggle Particulier/Professionnel -->
      <div class="user-type-toggle">
        <button @click="userType = 'particulier'" :class="{ active: userType === 'particulier' }" class="toggle-btn">
          <User :size="20" />
          Particulier
        </button>
        <button @click="userType = 'professionnel'" :class="{ active: userType === 'professionnel' }"
          class="toggle-btn">
          <Briefcase :size="20" />
          Professionnel
        </button>
      </div>

      <!-- Cartes de forfait -->
      <div class="forfait-cards">
        <!-- Forfait Particulier -->
        <div v-if="userType === 'particulier'" class="forfait-card particulier-card">
          <div class="card-ribbon">
            <span>Toujours Gratuit</span>
          </div>

          <div class="card-header">
            <div class="card-icon">
              <User :size="48" />
            </div>
            <h2>Forfait Particulier</h2>
            <p class="card-description">Parfait pour vendre vos objets de collection</p>
          </div>

          <div class="card-price">
            <div class="price-amount">
              <span class="currency">0€</span>
              <span class="period">/mois</span>
            </div>
            <p class="price-label">Gratuit à vie</p>
          </div>

          <div class="card-features">
            <h3>
              <CheckCircle :size="20" />
              Ce qui est inclus :
            </h3>
            <ul class="features-list">
              <li>
                <Check :size="18" class="check-icon" />
                <div>
                  <strong>Publication illimitée d'objets</strong>
                  <span>Vendez autant d'objets que vous souhaitez</span>
                </div>
              </li>
              <li>
                <Check :size="18" class="check-icon" />
                <div>
                  <strong>Gestion de vos annonces</strong>
                  <span>Modifiez et suivez vos ventes facilement</span>
                </div>
              </li>
              <li>
                <Check :size="18" class="check-icon" />
                <div>
                  <strong>Système d'enchères</strong>
                  <span>Enchères et ventes rapides disponibles</span>
                </div>
              </li>
              <li>
                <Check :size="18" class="check-icon" />
                <div>
                  <strong>Messagerie intégrée</strong>
                  <span>Communiquez avec les acheteurs</span>
                </div>
              </li>
              <li>
                <X :size="18" class="x-icon" />
                <div>
                  <strong>Achat d'objets</strong>
                  <span>Fonctionnalité réservée aux professionnels</span>
                </div>
              </li>
            </ul>
          </div>

          <div class="card-limitations">
            <div class="limitation-badge">
              <Info :size="16" />
              <span>Les particuliers peuvent uniquement vendre, pas acheter</span>
            </div>
          </div>

          <button class="btn-subscribe active-plan">
            <CheckCircle :size="20" />
            Forfait Actif
          </button>
        </div>

        <!-- Forfait Professionnel -->
        <div v-if="userType === 'professionnel'" class="forfait-card professionnel-card">
          <div class="card-ribbon premium">
            <span>⭐ Premium</span>
          </div>

          <div class="card-header">
            <div class="card-icon premium-icon">
              <Briefcase :size="48" />
            </div>
            <h2>Forfait Professionnel</h2>
            <p class="card-description">Accès complet à toutes les fonctionnalités</p>
          </div>

          <div class="card-price">
            <div class="price-amount">
              <span class="currency">49€</span>
              <span class="period">/mois</span>
            </div>
            <p class="price-label trial">
              <Gift :size="18" />
              Premier mois gratuit
            </p>
          </div>

          <div class="card-features">
            <h3>
              <Star :size="20" />
              Tous les avantages :
            </h3>
            <ul class="features-list">
              <li>
                <Check :size="18" class="check-icon" />
                <div>
                  <strong>Accès illimité à la plateforme</strong>
                  <span>Achetez et vendez sans restriction</span>
                </div>
              </li>
              <li>
                <Check :size="18" class="check-icon" />
                <div>
                  <strong>Vente illimitée</strong>
                  <span>Publiez autant d'objets que nécessaire</span>
                </div>
              </li>
              <li>
                <Check :size="18" class="check-icon" />
                <div>
                  <strong>Achat d'objets</strong>
                  <span>Participez aux enchères et achats rapides</span>
                </div>
              </li>
              <li>
                <Check :size="18" class="check-icon" />
                <div>
                  <strong>Priorité dans les recherches</strong>
                  <span>Vos annonces mises en avant</span>
                </div>
              </li>
              <li>
                <Check :size="18" class="check-icon" />
                <div>
                  <strong>Statistiques avancées</strong>
                  <span>Analysez vos performances de vente</span>
                </div>
              </li>
              <li>
                <Check :size="18" class="check-icon" />
                <div>
                  <strong>Support prioritaire</strong>
                  <span>Assistance dédiée pour les professionnels</span>
                </div>
              </li>
              <li>
                <Check :size="18" class="check-icon" />
                <div>
                  <strong>Badge "Professionnel"</strong>
                  <span>Augmentez votre crédibilité</span>
                </div>
              </li>
            </ul>
          </div>

          <div class="card-trial">
            <div class="trial-info">
              <Calendar :size="20" />
              <div>
                <strong>Essai gratuit de 30 jours</strong>
                <span>Aucun engagement - Résiliez à tout moment</span>
              </div>
            </div>
          </div>

          <button @click="subscribeToPro" class="btn-subscribe premium-btn">
            <Zap :size="20" />
            Commencer l'essai gratuit
          </button>

          <p class="legal-notice">
            Après le mois d'essai, 49€/mois seront prélevés automatiquement. Annulez à tout moment.
          </p>
        </div>
      </div>

      <!-- Tableau comparatif -->
      <div class="comparison-section">
        <h2>
          <TrendingUp :size="28" />
          Comparaison des forfaits
        </h2>

        <div class="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Fonctionnalité</th>
                <th>
                  <User :size="20" />
                  Particulier
                </th>
                <th>
                  <Briefcase :size="20" />
                  Professionnel
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Prix mensuel</td>
                <td><strong class="free">Gratuit</strong></td>
                <td><strong class="price">49€</strong> <span class="trial-badge">1er mois offert</span></td>
              </tr>
              <tr>
                <td>Publication d'objets</td>
                <td>
                  <CheckCircle :size="20" class="icon-check" />
                  Illimité
                </td>
                <td>
                  <CheckCircle :size="20" class="icon-check" />
                  Illimité
                </td>
              </tr>
              <tr>
                <td>Achat d'objets</td>
                <td>
                  <X :size="20" class="icon-x" />
                </td>
                <td>
                  <CheckCircle :size="20" class="icon-check" />
                  Illimité
                </td>
              </tr>
              <tr>
                <td>Enchères et ventes rapides</td>
                <td>
                  <CheckCircle :size="20" class="icon-check" />
                  En tant que vendeur
                </td>
                <td>
                  <CheckCircle :size="20" class="icon-check" />
                  Achat et vente
                </td>
              </tr>
              <tr>
                <td>Messagerie</td>
                <td>
                  Standard
                </td>
                <td>
                  <CheckCircle :size="20" class="icon-check" />
                  Prioritaire
                </td>
              </tr>
              <tr>
                <td>Statistiques</td>
                <td>
                  Basiques
                </td>
                <td>
                  <CheckCircle :size="20" class="icon-check" />
                  Avancées
                </td>
              </tr>
              <tr>
                <td>Support client</td>
                <td>
                  Standard
                </td>
                <td>
                  <CheckCircle :size="20" class="icon-check" />
                  Prioritaire
                </td>
              </tr>
              <tr>
                <td>Badge professionnel</td>
                <td>
                  <X :size="20" class="icon-x" />
                </td>
                <td>
                  <CheckCircle :size="20" class="icon-check" />
                </td>
              </tr>
              <tr>
                <td>Mise en avant des annonces</td>
                <td>
                  <X :size="20" class="icon-x" />
                </td>
                <td>
                  <CheckCircle :size="20" class="icon-check" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- FAQ -->
      <div class="faq-section">
        <h2>
          <HelpCircle :size="28" />
          Questions fréquentes
        </h2>

        <div class="faq-list">
          <div class="faq-item">
            <button @click="toggleFaq(0)" class="faq-question">
              <span>Pourquoi les particuliers ne peuvent-ils pas acheter ?</span>
              <ChevronDown :size="20" :class="{ rotated: openFaq === 0 }" />
            </button>
            <transition name="faq-slide">
              <div v-if="openFaq === 0" class="faq-answer">
                <p>Notre plateforme est conçue pour permettre aux particuliers de vendre leurs objets de collection
                  gratuitement. L'achat est réservé aux professionnels qui contribuent financièrement à la
                  maintenance et au développement de la plateforme via leur abonnement.</p>
              </div>
            </transition>
          </div>

          <div class="faq-item">
            <button @click="toggleFaq(1)" class="faq-question">
              <span>Comment fonctionne le mois gratuit pour les professionnels ?</span>
              <ChevronDown :size="20" :class="{ rotated: openFaq === 1 }" />
            </button>
            <transition name="faq-slide">
              <div v-if="openFaq === 1" class="faq-answer">
                <p>En vous inscrivant comme professionnel, vous bénéficiez automatiquement d'un mois d'essai gratuit.
                  Aucun paiement n'est demandé pendant cette période. Après 30 jours, le forfait à 49€/mois démarre
                  automatiquement, sauf résiliation.</p>
              </div>
            </transition>
          </div>

          <div class="faq-item">
            <button @click="toggleFaq(2)" class="faq-question">
              <span>Puis-je passer de particulier à professionnel ?</span>
              <ChevronDown :size="20" :class="{ rotated: openFaq === 2 }" />
            </button>
            <transition name="faq-slide">
              <div v-if="openFaq === 2" class="faq-answer">
                <p>Oui, vous pouvez upgrader votre compte à tout moment depuis votre profil. Vous bénéficierez alors
                  du mois gratuit et de toutes les fonctionnalités professionnelles immédiatement.</p>
              </div>
            </transition>
          </div>

          <div class="faq-item">
            <button @click="toggleFaq(3)" class="faq-question">
              <span>Comment résilier mon abonnement professionnel ?</span>
              <ChevronDown :size="20" :class="{ rotated: openFaq === 3 }" />
            </button>
            <transition name="faq-slide">
              <div v-if="openFaq === 3" class="faq-answer">
                <p>Vous pouvez annuler votre abonnement à tout moment depuis votre profil. L'accès aux fonctionnalités
                  professionnelles restera actif jusqu'à la fin de la période payée.</p>
              </div>
            </transition>
          </div>

          <div class="faq-item">
            <button @click="toggleFaq(4)" class="faq-question">
              <span>Y a-t-il des frais cachés ou des commissions ?</span>
              <ChevronDown :size="20" :class="{ rotated: openFaq === 4 }" />
            </button>
            <transition name="faq-slide">
              <div v-if="openFaq === 4" class="faq-answer">
                <p>Non, les forfaits sont transparents. Les seuls frais sont les commissions sur les ventes (acheteur
                  et vendeur), qui sont clairement indiqués lors de chaque transaction. Le forfait professionnel à
                  49€/mois n'a aucun coût caché.</p>
              </div>
            </transition>
          </div>
        </div>
      </div>

      <!-- Call to action -->
      <div class="cta-section">
        <div class="cta-card">
          <h2>Prêt à commencer ?</h2>
          <p>Rejoignez des milliers d'utilisateurs qui vendent et achètent des objets de collection sur Purple Dog</p>
          <div class="cta-buttons">
            <button @click="userType = 'particulier'" class="btn-cta particulier">
              <User :size="20" />
              Commencer gratuitement
            </button>
            <button @click="userType = 'professionnel'; subscribeToPro()" class="btn-cta professionnel">
              <Zap :size="20" />
              Essai pro gratuit
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast de confirmation -->
    <transition name="toast">
      <div v-if="showToast" class="toast success">
        <CheckCircle :size="20" />
        <span>{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  CreditCard,
  User,
  Briefcase,
  CheckCircle,
  Check,
  X,
  Info,
  Gift,
  Star,
  Calendar,
  Zap,
  TrendingUp,
  Minus,
  HelpCircle,
  ChevronDown
} from 'lucide-vue-next'

const userType = ref('particulier')
const openFaq = ref(null)
const showToast = ref(false)
const toastMessage = ref('')

const toggleFaq = (index) => {
  openFaq.value = openFaq.value === index ? null : index
}

const subscribeToPro = () => {
  // TODO: Rediriger vers le processus de paiement/inscription
  toastMessage.value = 'Redirection vers l\'inscription professionnelle...'
  showToast.value = true

  setTimeout(() => {
    showToast.value = false
  }, 3000)
}
</script>

<style scoped>
.forfait-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  padding: 3rem 0;
}

.forfait-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* En-tête */
.header-section {
  text-align: center;
  margin-bottom: 3rem;
}

.header-section h1 {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  font-size: 3rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 1rem 0;
}

.header-icon {
  color: #1f2937;
  -webkit-text-fill-color: initial;
}

.header-subtitle {
  font-size: 1.25rem;
  color: #6b7280;
  margin: 0;
}

/* Toggle */
.user-type-toggle {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  background: white;
  padding: 0.5rem;
  border-radius: 16px;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.toggle-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.3s;
}

.toggle-btn:hover {
  background: #f9fafb;
}

.toggle-btn.active {
  background: #1f2937;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Cartes de forfait */
.forfait-cards {
  display: flex;
  justify-content: center;
  margin-bottom: 4rem;
}

.forfait-card {
  background: white;
  border-radius: 24px;
  padding: 2.5rem;
  max-width: 550px;
  width: 100%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  position: relative;
  overflow: hidden;
  animation: slideIn 0.4s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-ribbon {
  position: absolute;
  top: 20px;
  right: -35px;
  background: #10b981;
  color: white;
  padding: 0.5rem 3rem;
  transform: rotate(45deg);
  font-weight: 700;
  font-size: 0.85rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.card-ribbon.premium {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.card-header {
  text-align: center;
  margin-bottom: 2rem;
}

.card-icon {
  width: 96px;
  height: 96px;
  background: #f3f4f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: #1f2937;
}

.premium-icon {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #d97706;
}

.card-header h2 {
  font-size: 2rem;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
}

.card-description {
  color: #6b7280;
  font-size: 1.05rem;
  margin: 0;
}

.card-price {
  text-align: center;
  padding: 2rem 0;
  border-top: 2px solid #f3f4f6;
  border-bottom: 2px solid #f3f4f6;
  margin-bottom: 2rem;
}

.price-amount {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.5rem;
}

.currency {
  font-size: 3.5rem;
  font-weight: 800;
  color: #1f2937;
}

.period {
  font-size: 1.25rem;
  color: #6b7280;
}

.price-label {
  margin: 0.75rem 0 0 0;
  color: #10b981;
  font-weight: 600;
  font-size: 1.1rem;
}

.price-label.trial {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #f59e0b;
}

.card-features h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  color: #1f2937;
  margin: 0 0 1.5rem 0;
}

.features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.features-list li {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.check-icon {
  color: #10b981;
  flex-shrink: 0;
  margin-top: 2px;
}

.x-icon {
  color: #ef4444;
  flex-shrink: 0;
  margin-top: 2px;
}

.features-list li>div {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.features-list strong {
  color: #1f2937;
  font-size: 1rem;
}

.features-list span {
  color: #6b7280;
  font-size: 0.9rem;
}

.card-limitations {
  margin: 2rem 0;
}

.limitation-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  background: #fef3c7;
  border-radius: 12px;
  color: #92400e;
  font-weight: 600;
  font-size: 0.95rem;
}

.card-trial {
  margin: 2rem 0;
}

.trial-info {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
  color: #92400e;
}

.trial-info strong {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 1.05rem;
}

.trial-info span {
  font-size: 0.9rem;
  opacity: 0.9;
}

.btn-subscribe {
  width: 100%;
  padding: 1.25rem 2rem;
  background: #1f2937;
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.btn-subscribe:hover {
  background: #374151;
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
}

.btn-subscribe.active-plan {
  background: #10b981;
  cursor: default;
}

.btn-subscribe.active-plan:hover {
  transform: none;
}

.btn-subscribe.premium-btn {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.btn-subscribe.premium-btn:hover {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
}

.legal-notice {
  text-align: center;
  margin: 1rem 0 0 0;
  color: #9ca3af;
  font-size: 0.85rem;
}

/* Tableau comparatif */
.comparison-section {
  margin-bottom: 4rem;
}

.comparison-section h2 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  color: #1f2937;
  margin: 0 0 2rem 0;
  text-align: center;
  justify-content: center;
}

.comparison-table {
  background: white;
  border-radius: 20px;
  padding: 0;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.comparison-table table {
  width: 100%;
  border-collapse: collapse;
}

.comparison-table thead {
  background: #1f2937;
  color: white;
}

.comparison-table th {
  padding: 1.5rem 1rem;
  text-align: center;
  font-weight: 700;
  font-size: 1.1rem;
  vertical-align: middle;
}

.comparison-table th:first-child {
  width: 40%;
  text-align: left;
}

.comparison-table th>svg {
  display: inline-block;
  vertical-align: middle;
  margin-right: 0.5rem;
}

.comparison-table tbody tr {
  border-bottom: 1px solid #f3f4f6;
}

.comparison-table tbody tr:last-child {
  border-bottom: none;
}

.comparison-table td {
  padding: 1.25rem 1rem;
  text-align: center;
  color: #374151;
}

.comparison-table td:first-child {
  text-align: left;
  font-weight: 600;
  color: #1f2937;
}

.icon-check {
  color: #10b981;
}

.icon-x {
  color: #ef4444;
}

.icon-partial {
  color: #f59e0b;
}

.free {
  color: #10b981;
  font-size: 1.25rem;
}

.price {
  color: #1f2937;
  font-size: 1.25rem;
}

.trial-badge {
  display: inline-block;
  background: #fef3c7;
  color: #92400e;
  padding: 0.25rem 0.75rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  margin-left: 0.5rem;
}

/* FAQ */
.faq-section {
  margin-bottom: 4rem;
}

.faq-section h2 {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 2rem;
  color: #1f2937;
  margin: 0 0 2rem 0;
  text-align: center;
  justify-content: center;
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.faq-question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  background: white;
  border: none;
  text-align: left;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  cursor: pointer;
  transition: all 0.2s;
}

.faq-question:hover {
  background: #f9fafb;
}

.faq-question svg {
  transition: transform 0.3s;
  color: #6b7280;
  flex-shrink: 0;
}

.faq-question svg.rotated {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 0 2rem 1.5rem 2rem;
  color: #6b7280;
  line-height: 1.7;
}

.faq-answer p {
  margin: 0;
}

.faq-slide-enter-active,
.faq-slide-leave-active {
  transition: all 0.3s ease;
}

.faq-slide-enter-from,
.faq-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* CTA */
.cta-section {
  margin-bottom: 2rem;
}

.cta-card {
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  border-radius: 24px;
  padding: 3rem 2rem;
  text-align: center;
  color: white;
}

.cta-card h2 {
  font-size: 2.5rem;
  margin: 0 0 1rem 0;
}

.cta-card p {
  font-size: 1.25rem;
  margin: 0 0 2rem 0;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-cta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1.25rem 2rem;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-cta.particulier {
  background: white;
  color: #1f2937;
}

.btn-cta.particulier:hover {
  background: #f3f4f6;
  transform: translateY(-2px);
}

.btn-cta.professionnel {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.btn-cta.professionnel:hover {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  transform: translateY(-2px);
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

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Responsive */
@media (max-width: 768px) {
  .header-section h1 {
    font-size: 2rem;
  }

  .forfait-card {
    padding: 2rem 1.5rem;
  }

  .currency {
    font-size: 2.5rem;
  }

  .comparison-table {
    overflow-x: auto;
  }

  .cta-buttons {
    flex-direction: column;
  }

  .btn-cta {
    width: 100%;
    justify-content: center;
  }
}
</style>
