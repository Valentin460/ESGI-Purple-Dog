<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Header du profil -->
      <div class="bg-white rounded-lg shadow-md p-8 mb-6">
        <div class="flex items-center gap-6">
          <div class="w-24 h-24 rounded-full bg-gradient-to-br from-green-950 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
            {{ userInitials }}
          </div>
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">{{ userName }}</h1>
            <p class="text-gray-600">{{ userEmail }}</p>
            <span class="inline-block mt-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
              Compte {{ accountType }}
            </span>
          </div>
          <RouterLink
            to="/auth/logout"
            class="px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition"
          >
            Se déconnecter
          </RouterLink>
        </div>
      </div>

      <!-- Informations du profil -->
      <div class="bg-white rounded-lg shadow-md p-8 mb-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Informations personnelles</h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
            <input
              type="text"
              v-model="userProfile.fullName"
              class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 transition-all text-gray-900"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              v-model="userProfile.email"
              class="w-full px-4 py-3 border rounded-lg bg-gray-100"
              disabled
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
            <input
              type="tel"
              v-model="userProfile.phone"
              placeholder="+33 6 00 00 00 00"
              class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 transition-all text-gray-900"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Date de naissance</label>
            <input
              type="date"
              v-model="userProfile.birthdate"
              class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 transition-all text-gray-900"
            />
          </div>
        </div>

        <div class="mt-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Adresse</label>
          <input
            type="text"
            v-model="userProfile.address"
            placeholder="Numéro et nom de rue"
            class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 transition-all mb-4 text-gray-900"
          />

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              v-model="userProfile.postalCode"
              placeholder="Code postal"
              class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 transition-all text-gray-900"
            />
            <input
              type="text"
              v-model="userProfile.city"
              placeholder="Ville"
              class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 transition-all text-gray-900"
            />
            <input
              type="text"
              v-model="userProfile.country"
              placeholder="Pays"
              class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-800 transition-all text-gray-900"
            />
          </div>
        </div>

        <button
          @click="saveProfile"
          class="mt-6 w-full bg-gradient-to-r from-green-950 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition-all"
        >
          Enregistrer les modifications
        </button>
      </div>

      <!-- Forfait & Abonnement -->
      <div class="bg-white rounded-lg shadow-md p-8 mb-6">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Mon forfait</h2>

        <div v-if="accountType === 'Particulier'" class="p-6 bg-green-50 border-2 border-green-200 rounded-lg">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-xl font-bold text-green-900">Forfait Gratuit</h3>
              <p class="text-green-700">Compte Particulier</p>
            </div>
            <span class="px-4 py-2 bg-green-600 text-white rounded-full font-semibold">
              Actif
            </span>
          </div>
          <ul class="space-y-2 text-gray-700">
            <li class="flex items-center gap-2">
              <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              Accès illimité à la plateforme
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              Parcourir toutes les œuvres d'art
            </li>
            <li class="flex items-center gap-2">
              <svg class="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
              Contactez les professionnels
            </li>
          </ul>
        </div>

        <div v-else class="space-y-4">
          <div class="p-6 border-2 rounded-lg" :class="subscriptionStatus === 'trial' ? 'bg-blue-50 border-blue-200' : 'bg-indigo-50 border-indigo-200'">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="text-xl font-bold text-gray-900">Forfait Professionnel</h3>
                <p class="text-gray-700">{{ subscriptionStatus === 'trial' ? 'Période d\'essai gratuite' : '49€ / mois' }}</p>
              </div>
              <span v-if="subscriptionStatus === 'trial'" class="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold">
                Essai gratuit
              </span>
              <span v-else class="px-4 py-2 bg-indigo-600 text-white rounded-full font-semibold">
                Actif
              </span>
            </div>

            <div v-if="subscriptionStatus === 'trial'" class="mb-4 p-3 bg-blue-100 border border-blue-300 rounded text-blue-900 text-sm">
              <strong>Période d'essai :</strong> Il vous reste {{ trialDaysRemaining }} jours gratuits.
              Après cette période, l'abonnement passera à 49€/mois automatiquement.
            </div>

            <ul class="space-y-2 text-gray-700 mb-4">
              <li class="flex items-center gap-2">
                <svg class="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                Accès illimité à la plateforme
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                Publication illimitée d'œuvres
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                Statistiques et analyses détaillées
              </li>
              <li class="flex items-center gap-2">
                <svg class="w-5 h-5 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
                Support prioritaire
              </li>
            </ul>

            <div class="text-sm text-gray-600 mb-4">
              <p><strong>Prochaine facturation :</strong> {{ nextBillingDate }}</p>
              <p v-if="subscriptionStatus === 'active'"><strong>Méthode de paiement :</strong> •••• •••• •••• 1234</p>
            </div>

            <div class="flex gap-3">
              <button
                v-if="subscriptionStatus === 'active'"
                class="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                Gérer le paiement
              </button>
              <button
                class="flex-1 px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition"
              >
                Annuler l'abonnement
              </button>
            </div>
          </div>

          <div class="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p class="text-sm text-gray-600">
              <strong>Note :</strong> Les tarifs et les avantages peuvent être modifiés à tout moment.
              Vous serez informé par email de tout changement tarifaire 30 jours avant son application.
            </p>
          </div>
        </div>
      </div>

      <!-- Préférences -->
      <div class="bg-white rounded-lg shadow-md p-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Préférences</h2>

        <div class="space-y-4">
          <div class="flex items-start gap-3">
            <input
              type="checkbox"
              id="newsletter"
              v-model="preferences.newsletter"
              class="w-5 h-5 mt-1 accent-green-800"
            />
            <div>
              <label for="newsletter" class="text-gray-900 font-medium cursor-pointer">
                Newsletter
              </label>
              <p class="text-sm text-gray-600">Recevoir les actualités et sélections d'œuvres d'art</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <input
              type="checkbox"
              id="offers"
              v-model="preferences.offers"
              class="w-5 h-5 mt-1 accent-green-800"
            />
            <div>
              <label for="offers" class="text-gray-900 font-medium cursor-pointer">
                Offres spéciales
              </label>
              <p class="text-sm text-gray-600">Recevoir les promotions et offres exclusives</p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <input
              type="checkbox"
              id="notifications"
              v-model="preferences.notifications"
              class="w-5 h-5 mt-1 accent-green-800"
            />
            <div>
              <label for="notifications" class="text-gray-900 font-medium cursor-pointer">
                Notifications
              </label>
              <p class="text-sm text-gray-600">Recevoir des notifications sur l'activité du compte</p>
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
import authService from '@/services/auth.service'
import apiService from '@/services/api.service'

const router = useRouter()

// Données utilisateur
const userName = ref('Chargement...')
const userEmail = ref('')
const accountType = ref('Particulier')
const userId = ref(null)

// État de l'abonnement pour les professionnels
const subscriptionStatus = ref('trial')
const trialDaysRemaining = ref(25)
const nextBillingDate = ref('10 janvier 2026')

const userProfile = ref({
  fullName: '',
  email: '',
  phone: '',
  birthdate: '',
  address: '',
  postalCode: '',
  city: '',
  country: 'France'
})

const preferences = ref({
  newsletter: true,
  offers: false,
  notifications: true
})

const userInitials = computed(() => {
  if (!userName.value || userName.value === 'Chargement...') return '?'
  const names = userName.value.split(' ')
  return names.map(n => n[0]).join('').toUpperCase()
})

// Charger les données utilisateur au montage
onMounted(async () => {
  try {
    // Vérifier si l'utilisateur est connecté
    if (!authService.isAuthenticated()) {
      router.push('/auth/login')
      return
    }

    // Récupérer les données utilisateur
    const response = await authService.getCurrentUser()

    if (response.success) {
      const user = response.data
      userId.value = user.id
      userEmail.value = user.email
      userProfile.value.email = user.email

      // Déterminer le type de compte
      accountType.value = user.user_type === 'individual' ? 'Particulier' : 'Professionnel'

      // Charger le profil selon le type
      if (user.user_type === 'individual') {
        await loadIndividualProfile(user.id)
      } else if (user.user_type === 'professional') {
        await loadProfessionalProfile(user.id)
      }
    }
  } catch (error) {
    console.error('Erreur lors du chargement du profil:', error)
    // Rediriger vers login si erreur d'authentification
    router.push('/auth/login')
  }
})

// Charger le profil particulier
const loadIndividualProfile = async (userId) => {
  try {
    const response = await apiService.get(`/api/individuals/user/${userId}`)
    if (response.data) {
      const profile = response.data
      userName.value = `${profile.first_name} ${profile.last_name}`
      userProfile.value.fullName = `${profile.first_name} ${profile.last_name}`
      userProfile.value.address = profile.postal_address || ''
      preferences.value.newsletter = profile.newsletter_subscribed || false
    }
  } catch (error) {
    console.error('Erreur lors du chargement du profil particulier:', error)
    userName.value = 'Utilisateur'
  }
}

// Charger le profil professionnel
const loadProfessionalProfile = async (userId) => {
  try {
    const response = await apiService.get(`/api/professionals/user/${userId}`)
    if (response.data) {
      const profile = response.data
      userName.value = `${profile.first_name} ${profile.last_name}`
      userProfile.value.fullName = `${profile.first_name} ${profile.last_name}`
      userProfile.value.address = profile.postal_address || ''
      preferences.value.newsletter = profile.newsletter_subscribed || false
    }
  } catch (error) {
    console.error('Erreur lors du chargement du profil professionnel:', error)
    userName.value = 'Utilisateur'
  }
}

const saveProfile = async () => {
  try {
    // Mettre à jour le profil selon le type
    if (accountType.value === 'Particulier') {
      const [firstName, ...lastNameParts] = userProfile.value.fullName.split(' ')
      const lastName = lastNameParts.join(' ')

      await apiService.put(`/api/individuals/user/${userId.value}`, {
        first_name: firstName,
        last_name: lastName,
        postal_address: userProfile.value.address,
        newsletter_subscribed: preferences.value.newsletter
      })
    } else {
      const [firstName, ...lastNameParts] = userProfile.value.fullName.split(' ')
      const lastName = lastNameParts.join(' ')

      await apiService.put(`/api/professionals/user/${userId.value}`, {
        first_name: firstName,
        last_name: lastName,
        postal_address: userProfile.value.address,
        newsletter_subscribed: preferences.value.newsletter
      })
    }

    alert('Profil enregistré avec succès !')
    userName.value = userProfile.value.fullName
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du profil:', error)
    alert('Erreur lors de la sauvegarde. Veuillez réessayer.')
  }
}
</script>
