<template>
  <div class="processus-achat-page">
    <div class="page-container">
      <!-- En-tête -->
      <div class="page-header">
        <button @click="retourAnnonce" class="btn-retour">← Retour à l'annonce</button>
        <h1>💳 Processus d'achat</h1>
        <p class="subtitle">Finalisez votre achat en toute sécurité</p>
      </div>

      <!-- Étapes de progression -->
      <div class="steps-progress">
        <div class="step" :class="{ active: etapeActuelle === 1, completed: etapeActuelle > 1 }">
          <div class="step-number">1</div>
          <div class="step-label">Livraison</div>
        </div>
        <div class="step-divider"></div>
        <div class="step" :class="{ active: etapeActuelle === 2, completed: etapeActuelle > 2 }">
          <div class="step-number">2</div>
          <div class="step-label">Transporteur</div>
        </div>
        <div class="step-divider"></div>
        <div class="step" :class="{ active: etapeActuelle === 3, completed: etapeActuelle > 3 }">
          <div class="step-number">3</div>
          <div class="step-label">Paiement</div>
        </div>
        <div class="step-divider"></div>
        <div class="step" :class="{ active: etapeActuelle === 4 }">
          <div class="step-number">4</div>
          <div class="step-label">Confirmation</div>
        </div>
      </div>

      <!-- Récapitulatif de l'objet -->
      <div class="objet-recap">
        <div class="recap-photo">
          <img :src="objet.photos[0].preview" :alt="objet.nom">
        </div>
        <div class="recap-info">
          <h3>{{ objet.nom }}</h3>
          <p class="recap-categorie">{{ objet.categorie }}</p>
          <div class="recap-prix">{{ objet.prix }} €</div>
        </div>
      </div>

      <!-- Formulaires selon l'étape -->
      <div class="content-section">
        <!-- Étape 1: Adresses de livraison et facturation -->
        <div v-if="etapeActuelle === 1" class="etape-content">
          <h2>📍 Informations de livraison</h2>

          <div class="form-section">
            <h3>Adresse de livraison</h3>
            <div class="form-row">
              <div class="form-group">
                <label for="nom-livraison">Nom complet *</label>
                <input type="text" id="nom-livraison" v-model="adresseLivraison.nom" placeholder="Prénom Nom" required>
              </div>
              <div class="form-group">
                <label for="telephone-livraison">Téléphone *</label>
                <input type="tel" id="telephone-livraison" v-model="adresseLivraison.telephone"
                  placeholder="06 12 34 56 78" required>
              </div>
            </div>

            <div class="form-group">
              <label for="adresse-livraison">Adresse *</label>
              <input type="text" id="adresse-livraison" v-model="adresseLivraison.adresse"
                placeholder="Numéro et nom de rue" required>
            </div>

            <div class="form-group">
              <label for="complement-livraison">Complément d'adresse</label>
              <input type="text" id="complement-livraison" v-model="adresseLivraison.complement"
                placeholder="Bâtiment, étage, appartement...">
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="code-postal-livraison">Code postal *</label>
                <input type="text" id="code-postal-livraison" v-model="adresseLivraison.codePostal" placeholder="75001"
                  required>
              </div>
              <div class="form-group">
                <label for="ville-livraison">Ville *</label>
                <input type="text" id="ville-livraison" v-model="adresseLivraison.ville" placeholder="Paris" required>
              </div>
              <div class="form-group">
                <label for="pays-livraison">Pays *</label>
                <select id="pays-livraison" v-model="adresseLivraison.pays" required>
                  <option value="">Sélectionner</option>
                  <option value="France">France</option>
                  <option value="Belgique">Belgique</option>
                  <option value="Suisse">Suisse</option>
                  <option value="Luxembourg">Luxembourg</option>
                </select>
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="checkbox-option">
              <input type="checkbox" id="meme-adresse" v-model="adresseFacturationIdentique">
              <label for="meme-adresse">L'adresse de facturation est identique</label>
            </div>

            <div v-if="!adresseFacturationIdentique">
              <h3>Adresse de facturation</h3>
              <div class="form-row">
                <div class="form-group">
                  <label for="nom-facturation">Nom complet *</label>
                  <input type="text" id="nom-facturation" v-model="adresseFacturation.nom" placeholder="Prénom Nom"
                    required>
                </div>
                <div class="form-group">
                  <label for="telephone-facturation">Téléphone *</label>
                  <input type="tel" id="telephone-facturation" v-model="adresseFacturation.telephone"
                    placeholder="06 12 34 56 78" required>
                </div>
              </div>

              <div class="form-group">
                <label for="adresse-facturation">Adresse *</label>
                <input type="text" id="adresse-facturation" v-model="adresseFacturation.adresse"
                  placeholder="Numéro et nom de rue" required>
              </div>

              <div class="form-group">
                <label for="complement-facturation">Complément d'adresse</label>
                <input type="text" id="complement-facturation" v-model="adresseFacturation.complement"
                  placeholder="Bâtiment, étage, appartement...">
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label for="code-postal-facturation">Code postal *</label>
                  <input type="text" id="code-postal-facturation" v-model="adresseFacturation.codePostal"
                    placeholder="75001" required>
                </div>
                <div class="form-group">
                  <label for="ville-facturation">Ville *</label>
                  <input type="text" id="ville-facturation" v-model="adresseFacturation.ville" placeholder="Paris"
                    required>
                </div>
                <div class="form-group">
                  <label for="pays-facturation">Pays *</label>
                  <select id="pays-facturation" v-model="adresseFacturation.pays" required>
                    <option value="">Sélectionner</option>
                    <option value="France">France</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Luxembourg">Luxembourg</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div class="actions-buttons">
            <button @click="etapeSuivante" class="btn-primary" :disabled="!validerEtape1()">
              Continuer →
            </button>
          </div>
        </div>

        <!-- Étape 2: Choix du transporteur -->
        <div v-if="etapeActuelle === 2" class="etape-content">
          <h2>🚚 Choix du transporteur</h2>

          <div class="transporteurs-list">
            <div v-for="transporteur in transporteurs" :key="transporteur.id" class="transporteur-card"
              :class="{ selected: transporteurSelectionne?.id === transporteur.id }"
              @click="selectionnerTransporteur(transporteur)">
              <div class="transporteur-icon">{{ transporteur.icon }}</div>
              <div class="transporteur-info">
                <h4>{{ transporteur.nom }}</h4>
                <p class="transporteur-delai">{{ transporteur.delai }}</p>
                <p class="transporteur-description">{{ transporteur.description }}</p>
              </div>
              <div class="transporteur-prix">
                <div class="prix-label">Frais de port</div>
                <div class="prix-value">{{ transporteur.prix }} €</div>
              </div>
              <div class="radio-indicator">
                <span v-if="transporteurSelectionne?.id === transporteur.id">✓</span>
              </div>
            </div>
          </div>

          <div class="info-box">
            <div class="info-icon">ℹ️</div>
            <div class="info-text">
              <strong>Important :</strong> Le transporteur récupérera l'objet chez le vendeur.
              Vous serez notifié à chaque étape de la livraison.
            </div>
          </div>

          <div class="actions-buttons">
            <button @click="etapePrecedente" class="btn-secondary">← Retour</button>
            <button @click="etapeSuivante" class="btn-primary" :disabled="!transporteurSelectionne">
              Continuer →
            </button>
          </div>
        </div>

        <!-- Étape 3: Paiement -->
        <div v-if="etapeActuelle === 3" class="etape-content">
          <h2>💳 Paiement sécurisé</h2>

          <div class="payment-info-box">
            <div class="info-icon">🔒</div>
            <div class="info-text">
              <strong>Paiement sécurisé avec Stripe</strong><br>
              Votre paiement sera bloqué jusqu'à confirmation de la réception de l'objet.
              Le vendeur recevra le paiement 3 à 5 jours ouvrés après votre signature de réception.
            </div>
          </div>

          <div class="form-section">
            <h3>Informations de carte bancaire</h3>

            <div class="form-group">
              <label for="carte-numero">Numéro de carte *</label>
              <input type="text" id="carte-numero" v-model="paiement.numeroCarte" placeholder="1234 5678 9012 3456"
                maxlength="19" @input="formaterNumeroCarte" required>
            </div>

            <div class="form-group">
              <label for="carte-nom">Nom sur la carte *</label>
              <input type="text" id="carte-nom" v-model="paiement.nomCarte" placeholder="Prénom Nom" required>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label for="carte-expiration">Date d'expiration *</label>
                <input type="text" id="carte-expiration" v-model="paiement.expiration" placeholder="MM/AA" maxlength="5"
                  @input="formaterExpiration" required>
              </div>
              <div class="form-group">
                <label for="carte-cvv">CVV *</label>
                <input type="text" id="carte-cvv" v-model="paiement.cvv" placeholder="123" maxlength="3" required>
              </div>
            </div>
          </div>

          <!-- Récapitulatif des frais -->
          <div class="recap-paiement">
            <h3>Récapitulatif</h3>
            <div class="recap-ligne">
              <span>Prix de l'objet</span>
              <span>{{ objet.prix }} €</span>
            </div>
            <div class="recap-ligne">
              <span>Frais de port ({{ transporteurSelectionne?.nom }})</span>
              <span>{{ transporteurSelectionne?.prix }} €</span>
            </div>
            <div class="recap-ligne">
              <span>Frais de service</span>
              <span>{{ fraisService }} €</span>
            </div>
            <div class="recap-divider"></div>
            <div class="recap-ligne total">
              <span>Total à payer</span>
              <span>{{ totalAPayer }} €</span>
            </div>
          </div>

          <div class="actions-buttons">
            <button @click="etapePrecedente" class="btn-secondary">← Retour</button>
            <button @click="validerPaiement" class="btn-primary" :disabled="!validerEtape3() || paiementEnCours">
              {{ paiementEnCours ? 'Paiement en cours...' : `Payer ${totalAPayer} €` }}
            </button>
          </div>
        </div>

        <!-- Étape 4: Confirmation -->
        <div v-if="etapeActuelle === 4" class="etape-content confirmation">
          <div class="confirmation-icon">✅</div>
          <h2>Commande confirmée !</h2>
          <p class="confirmation-message">
            Votre paiement a été sécurisé avec succès. Le vendeur a été informé et va préparer l'envoi.
          </p>

          <div class="confirmation-details">
            <div class="detail-box">
              <div class="detail-icon">📦</div>
              <div class="detail-content">
                <h4>Numéro de commande</h4>
                <p class="detail-value">{{ numeroCommande }}</p>
              </div>
            </div>

            <div class="detail-box">
              <div class="detail-icon">🚚</div>
              <div class="detail-content">
                <h4>Transporteur</h4>
                <p class="detail-value">{{ transporteurSelectionne?.nom }}</p>
                <p class="detail-info">{{ transporteurSelectionne?.delai }}</p>
              </div>
            </div>

            <div class="detail-box">
              <div class="detail-icon">📍</div>
              <div class="detail-content">
                <h4>Adresse de livraison</h4>
                <p class="detail-value">{{ adresseLivraison.nom }}</p>
                <p class="detail-info">
                  {{ adresseLivraison.adresse }}<br>
                  {{ adresseLivraison.codePostal }} {{ adresseLivraison.ville }}
                </p>
              </div>
            </div>
          </div>

          <div class="timeline-info">
            <h3>Prochaines étapes</h3>
            <div class="timeline">
              <div class="timeline-item">
                <div class="timeline-marker completed">1</div>
                <div class="timeline-content">
                  <strong>Confirmation envoyée</strong>
                  <p>Email envoyé au vendeur et à l'acheteur</p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-marker">2</div>
                <div class="timeline-content">
                  <strong>Enlèvement par le transporteur</strong>
                  <p>Le transporteur récupèrera l'objet chez le vendeur</p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-marker">3</div>
                <div class="timeline-content">
                  <strong>Livraison</strong>
                  <p>Vous recevrez l'objet à l'adresse indiquée</p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-marker">4</div>
                <div class="timeline-content">
                  <strong>Signature de réception</strong>
                  <p>Confirmez la bonne réception de l'objet</p>
                </div>
              </div>
              <div class="timeline-item">
                <div class="timeline-marker">5</div>
                <div class="timeline-content">
                  <strong>Paiement au vendeur</strong>
                  <p>Le vendeur recevra le paiement 3-5 jours ouvrés après la réception</p>
                </div>
              </div>
            </div>
          </div>

          <div class="actions-buttons">
            <button @click="voirMesAchats" class="btn-primary">
              Voir mes achats
            </button>
            <button @click="retourAccueil" class="btn-secondary">
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import TransporteurService from '../services/TransporteurAdapter.js'
import EmailService from '../services/EmailService.js'
import PaiementService from '../services/PaiementService.js'

const router = useRouter()

// Données de l'objet (à récupérer via route params ou API)
const objet = ref({
  id: 1,
  nom: 'Vase Art Déco en cristal',
  categorie: 'Décoration',
  photos: [{ preview: 'https://via.placeholder.com/300x300?text=Vase' }],
  prix: 450
})

// Étape actuelle du processus
const etapeActuelle = ref(1)

// Adresse de livraison
const adresseLivraison = ref({
  nom: '',
  telephone: '',
  adresse: '',
  complement: '',
  codePostal: '',
  ville: '',
  pays: ''
})

// Adresse de facturation
const adresseFacturationIdentique = ref(true)
const adresseFacturation = ref({
  nom: '',
  telephone: '',
  adresse: '',
  complement: '',
  codePostal: '',
  ville: '',
  pays: ''
})

// Transporteurs disponibles (mock - à récupérer du back office)
const transporteurs = ref([
  {
    id: 1,
    nom: 'Colissimo',
    icon: '📮',
    delai: 'Livraison en 2-3 jours ouvrés',
    description: 'Service postal standard avec suivi',
    prix: 8.50
  },
  {
    id: 2,
    nom: 'Chronopost',
    icon: '⚡',
    delai: 'Livraison express en 24h',
    description: 'Livraison rapide avant 13h',
    prix: 15.00
  },
  {
    id: 3,
    nom: 'Mondial Relay',
    icon: '🏪',
    delai: 'Livraison en point relais (3-5 jours)',
    description: 'Retrait en point relais',
    prix: 5.50
  },
  {
    id: 4,
    nom: 'DHL Express',
    icon: '🚀',
    delai: 'Livraison premium en 24h',
    description: 'Service premium avec assurance',
    prix: 22.00
  }
])

const transporteurSelectionne = ref(null)

// Informations de paiement
const paiement = ref({
  numeroCarte: '',
  nomCarte: '',
  expiration: '',
  cvv: ''
})

const paiementEnCours = ref(false)
const numeroCommande = ref('')

// Frais de service (2% du prix de l'objet)
const fraisService = computed(() => {
  return (objet.value.prix * 0.02).toFixed(2)
})

// Total à payer
const totalAPayer = computed(() => {
  const prixObjet = parseFloat(objet.value.prix)
  const fraisPort = transporteurSelectionne.value ? parseFloat(transporteurSelectionne.value.prix) : 0
  const frais = parseFloat(fraisService.value)
  return (prixObjet + fraisPort + frais).toFixed(2)
})

// Fonctions de validation
const validerEtape1 = () => {
  const livraison = adresseLivraison.value
  const livraisonValide = livraison.nom && livraison.telephone && livraison.adresse &&
    livraison.codePostal && livraison.ville && livraison.pays

  if (adresseFacturationIdentique.value) {
    return livraisonValide
  }

  const facturation = adresseFacturation.value
  return livraisonValide && facturation.nom && facturation.telephone &&
    facturation.adresse && facturation.codePostal && facturation.ville && facturation.pays
}

const validerEtape3 = () => {
  const p = paiement.value
  return p.numeroCarte.replace(/\s/g, '').length === 16 &&
    p.nomCarte &&
    p.expiration.length === 5 &&
    p.cvv.length === 3
}

// Navigation entre étapes
const etapeSuivante = () => {
  if (etapeActuelle.value < 4) {
    etapeActuelle.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const etapePrecedente = () => {
  if (etapeActuelle.value > 1) {
    etapeActuelle.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// Sélection du transporteur
const selectionnerTransporteur = (transporteur) => {
  transporteurSelectionne.value = transporteur
}

// Formatage des champs de paiement
const formaterNumeroCarte = (event) => {
  let value = event.target.value.replace(/\s/g, '')
  let formatted = value.match(/.{1,4}/g)?.join(' ') || value
  paiement.value.numeroCarte = formatted
}

const formaterExpiration = (event) => {
  let value = event.target.value.replace(/\//g, '')
  if (value.length >= 2) {
    value = value.substring(0, 2) + '/' + value.substring(2, 4)
  }
  paiement.value.expiration = value
}

// Validation du paiement
const validerPaiement = async () => {
  paiementEnCours.value = true

  try {
    // Valider les informations de carte
    const validation = PaiementService.validerCarte(paiement.value)
    if (!validation.valide) {
      alert(validation.erreur)
      paiementEnCours.value = false
      return
    }

    // Générer un numéro de commande
    numeroCommande.value = 'CMD-' + Date.now().toString(36).toUpperCase()

    // Créer l'objet commande complet
    const commande = {
      numero: numeroCommande.value,
      objet: objet.value,
      vendeur: {
        id: 'VENDOR-123',
        email: 'vendeur@example.com',
        nom: 'Vendeur Test',
        adresse: '456 Rue du Vendeur, 75002 Paris'
      },
      acheteur: {
        id: 'BUYER-456',
        email: 'acheteur@example.com',
        nom: adresseLivraison.value.nom
      },
      adresseLivraison: adresseLivraison.value,
      adresseFacturation: adresseFacturationIdentique.value ? adresseLivraison.value : adresseFacturation.value,
      transporteur: {
        ...transporteurSelectionne.value,
        emailContact: 'contact@transporteur.com'
      },
      montantTotal: totalAPayer.value,
      fraisCommission: fraisService.value
    }

    // Créer la transaction avec paiement bloqué
    const resultatTransaction = await PaiementService.creerTransaction(commande, paiement.value)
    console.log('✅ Transaction créée:', resultatTransaction)

    // Créer l'enlèvement avec le transporteur (Design Pattern Adapter)
    const detailsEnlevement = await TransporteurService.creerEnlevement(
      transporteurSelectionne.value.nom,
      commande
    )
    console.log('✅ Enlèvement programmé:', detailsEnlevement)

    // Envoyer tous les emails de confirmation
    await EmailService.envoyerEmailsConfirmationAchat(commande, detailsEnlevement)
    console.log('✅ Emails de confirmation envoyés')

    // Passer à l'étape de confirmation
    paiementEnCours.value = false
    etapeActuelle.value = 4
    window.scrollTo({ top: 0, behavior: 'smooth' })

  } catch (error) {
    console.error('❌ Erreur lors du paiement:', error)
    alert('Une erreur est survenue lors du paiement. Veuillez réessayer.')
    paiementEnCours.value = false
  }
}

// Navigation
const retourAnnonce = () => {
  router.go(-1)
}

const voirMesAchats = () => {
  router.push('/mes-achats')
}

const retourAccueil = () => {
  router.push('/')
}
</script>

<style scoped>
.processus-achat-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem 0;
}

.page-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.btn-retour {
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-retour:hover {
  background: rgba(255, 255, 255, 0.3);
}

.page-header h1 {
  color: white;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
}

/* Étapes de progression */
.steps-progress {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 3rem;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  transition: all 0.3s;
}

.step.active .step-number {
  background: #667eea;
  color: white;
  transform: scale(1.1);
}

.step.completed .step-number {
  background: #10b981;
  color: white;
}

.step-label {
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
}

.step.active .step-label {
  color: #667eea;
  font-weight: 600;
}

.step-divider {
  width: 60px;
  height: 2px;
  background: #e5e7eb;
  margin: 0 1rem;
}

/* Récapitulatif objet */
.objet-recap {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin-bottom: 2rem;
}

.recap-photo {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.recap-photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.recap-info h3 {
  font-size: 1.25rem;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.recap-categorie {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
}

.recap-prix {
  font-size: 1.5rem;
  font-weight: 700;
  color: #667eea;
}

/* Contenu des étapes */
.content-section {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.etape-content h2 {
  font-size: 1.75rem;
  color: #1f2937;
  margin-bottom: 2rem;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e5e7eb;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  color: #374151;
  font-weight: 500;
  font-size: 0.95rem;
}

input[type="text"],
input[type="tel"],
select {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
  font-family: inherit;
}

input:focus,
select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 1.5rem;
}

.checkbox-option input[type="checkbox"] {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.checkbox-option label {
  cursor: pointer;
  margin: 0;
}

/* Transporteurs */
.transporteurs-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.transporteur-card {
  display: grid;
  grid-template-columns: 60px 1fr 120px 40px;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.transporteur-card:hover {
  border-color: #667eea;
  background: #f9fafb;
}

.transporteur-card.selected {
  border-color: #667eea;
  background: #eff6ff;
}

.transporteur-icon {
  font-size: 2.5rem;
  text-align: center;
}

.transporteur-info h4 {
  font-size: 1.1rem;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.transporteur-delai {
  color: #667eea;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.transporteur-description {
  color: #6b7280;
  font-size: 0.875rem;
}

.transporteur-prix {
  text-align: center;
}

.prix-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.25rem;
}

.prix-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
}

.radio-indicator {
  width: 24px;
  height: 24px;
  border: 2px solid #d1d5db;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.transporteur-card.selected .radio-indicator {
  background: #667eea;
  border-color: #667eea;
  color: white;
}

/* Info box */
.info-box,
.payment-info-box {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #eff6ff;
  border-left: 3px solid #667eea;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.info-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.info-text {
  color: #1e40af;
  font-size: 0.95rem;
  line-height: 1.6;
}

/* Récapitulatif paiement */
.recap-paiement {
  background: #f9fafb;
  padding: 1.5rem;
  border-radius: 12px;
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.recap-paiement h3 {
  font-size: 1.25rem;
  color: #1f2937;
  margin-bottom: 1rem;
}

.recap-ligne {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 0;
  color: #374151;
}

.recap-divider {
  height: 1px;
  background: #d1d5db;
  margin: 0.5rem 0;
}

.recap-ligne.total {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  padding-top: 1rem;
}

/* Boutons d'action */
.actions-buttons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.btn-primary,
.btn-secondary {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #667eea;
  border: 2px solid #667eea;
}

.btn-secondary:hover {
  background: #f9fafb;
}

/* Confirmation */
.confirmation {
  text-align: center;
}

.confirmation-icon {
  font-size: 5rem;
  margin-bottom: 1rem;
}

.confirmation h2 {
  color: #10b981;
  margin-bottom: 1rem;
}

.confirmation-message {
  font-size: 1.1rem;
  color: #6b7280;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.confirmation-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
  text-align: left;
}

.detail-box {
  padding: 1.5rem;
  background: #f9fafb;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  display: flex;
  gap: 1rem;
}

.detail-icon {
  font-size: 2rem;
}

.detail-content h4 {
  font-size: 0.875rem;
  color: #6b7280;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.detail-info {
  font-size: 0.875rem;
  color: #6b7280;
  line-height: 1.5;
}

/* Timeline */
.timeline-info {
  text-align: left;
  margin-bottom: 2rem;
}

.timeline-info h3 {
  font-size: 1.5rem;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding-left: 2rem;
  border-left: 2px solid #e5e7eb;
}

.timeline-item {
  display: flex;
  gap: 1rem;
  position: relative;
}

.timeline-marker {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  border: 2px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #9ca3af;
  flex-shrink: 0;
  position: absolute;
  left: -2.9rem;
}

.timeline-marker.completed {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

.timeline-content strong {
  display: block;
  color: #1f2937;
  margin-bottom: 0.25rem;
}

.timeline-content p {
  color: #6b7280;
  font-size: 0.875rem;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header h1 {
    font-size: 1.75rem;
    margin-top: 3rem;
  }

  .btn-retour {
    position: static;
    margin-bottom: 1rem;
    width: 100%;
  }

  .steps-progress {
    padding: 1rem;
    overflow-x: auto;
  }

  .step-label {
    font-size: 0.75rem;
  }

  .step-divider {
    width: 30px;
  }

  .objet-recap {
    flex-direction: column;
    text-align: center;
  }

  .content-section {
    padding: 1.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .transporteur-card {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .transporteur-icon {
    text-align: left;
  }

  .transporteur-prix,
  .radio-indicator {
    justify-self: start;
  }

  .actions-buttons {
    flex-direction: column-reverse;
  }

  .btn-primary,
  .btn-secondary {
    width: 100%;
  }

  .confirmation-details {
    grid-template-columns: 1fr;
  }

  .timeline {
    padding-left: 1.5rem;
  }

  .timeline-marker {
    left: -2.4rem;
  }
}
</style>
