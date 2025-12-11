<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const acceptRGPD = ref(false)
const activeSection = ref('rgpd')
const rgpdError = ref('')

const onAccept = () => {
  rgpdError.value = ''

  if (!acceptRGPD.value) {
    rgpdError.value = 'Vous devez accepter la politique RGPD pour continuer'
    return
  }

  alert('RGPD et politique de confidentialité acceptés')
  router.push('/auth/register/particulier')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- En-tête -->
      <div class="bg-gray-200 rounded-lg shadow-md p-8 mb-8">
        <h1 class="text-4xl font-bold mb-4">RGPD et Protection des Données</h1>
      </div>

      <!-- Onglets -->
      <div class="flex gap-4 mb-8 flex-wrap">
        <button 
          @click="activeSection = 'rgpd'"
          :class="[
            'px-6 py-3 font-semibold rounded-lg transition cursor-pointer',
            activeSection === 'rgpd' 
              ? 'bg-green-950 text-white ' 
              : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-500 cursor-pointer'
          ]"
        >
          RGPD
        </button>
        <button 
          @click="activeSection = 'privacy'"
          :class="[
            'px-6 py-3 font-semibold rounded-lg transition',
            activeSection === 'privacy' 
              ? 'bg-green-950 text-white' 
              : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-500 cursor-pointer'
          ]"
        >
          Confidentialité
        </button>
        <button 
          @click="activeSection = 'cookies'"
          :class="[
            'px-6 py-3 font-semibold rounded-lg transition',
            activeSection === 'cookies' 
              ? 'bg-green-950 text-white' 
              : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-500 cursor-pointer'
          ]"
        >
          Cookies
        </button>
      </div>

      <!-- Contenu RGPD -->
      <div v-if="activeSection === 'rgpd'" class="bg-white rounded-lg shadow-md p-8 space-y-6">
        <u class="text-gray-500"><h2 class="text-2xl font-bold text-gray-700">Conformité RGPD</h2></u>
        
        <section>
          <h3 class="text-xl font-bold mb-3 text-white bg-gray-600 rounded w-75">Vos droits en tant qu'utilisateur</h3>
          <p class="text-gray-700 mb-3">Le Règlement Général sur la Protection des Données (RGPD) vous garantit des droits fondamentaux :</p>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li>Droit d'accès : consulter vos données personnelles</li>
            <li>Droit de rectification : corriger des informations inexactes</li>
            <li>Droit à l'oubli : demander la suppression de vos données</li>
            <li>Droit à la portabilité : recevoir vos données dans un format courant</li>
            <li>Droit d'opposition : refuser certains traitements</li>
          </ul>
        </section>

        <section>
          <h3 class="text-xl font-bold mb-3 text-white bg-gray-600 rounded w-75">Données collectées</h3>
          <p class="text-gray-700 mb-3">Purple Dog collecte les données suivantes auprès des utilisateurs :</p>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li>Prénom, nom, email, mot de passe</li>
            <li>Adresse postale</li>
            <li>Photo de profil</li>
            <li>Historique de consultation et d'achat</li>
            <li>Données de navigation (cookies, IP)</li>
          </ul>
        </section>

        <section>
          <h3 class="text-xl font-bold mb-3 text-white bg-gray-600 rounded w-75">Finalités du traitement</h3>
          <p class="text-gray-700 mb-3">Ces données sont utilisées pour :</p>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li>Créer et gérer votre compte utilisateur</li>
            <li>Vous permettre d'accéder à la plateforme</li>
            <li>Faciliter les transactions entre utilisateurs</li>
            <li>Améliorer nos services</li>
            <li>Respecter nos obligations légales</li>
          </ul>
        </section>

        <section>
          <h3 class="text-xl font-bold mb-3 text-white bg-gray-600 rounded w-75">Durée de conservation</h3>
          <p class="text-gray-700">Vos données sont conservées aussi longtemps que nécessaire pour l'exécution du contrat et au maximum 3 ans après la fermeture de votre compte, sauf obligation légale.</p>
        </section>
      </div>

      <!-- Contenu Confidentialité -->
      <div v-if="activeSection === 'privacy'" class="bg-white rounded-lg shadow-md p-8 space-y-6">
        <h2 class="text-2xl font-bold text-white bg-gray-600 rounded w-75">Politique de Confidentialité</h2>
        
        <section>
          <h3 class="text-xl font-semibold mb-3">Visibilité de vos données</h3>
          <p class="text-gray-700 mb-3">Pour protéger votre vie privée, seules certaines informations sont visibles sur la plateforme :</p>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li>✓ Visible : Votre prénom et photo de profil</li>
            <li>✗ Non visible : Votre nom, adresse, email, téléphone</li>
          </ul>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">Communication sécurisée</h3>
          <p class="text-gray-700">La communication entre utilisateurs se fait via un système de messagerie sécurisé sur la plateforme. Les adresses email ne sont jamais directement partagées.</p>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">Partage de données avec les tiers</h3>
          <p class="text-gray-700 mb-3">Nous ne partageons jamais vos données personnelles avec des tiers, sauf :</p>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li>Si vous nous en donnez l'autorisation explicite</li>
            <li>Pour respecter une obligation légale</li>
            <li>Avec nos prestataires techniques (serveurs, paiements) liés par des contrats de confidentialité stricts</li>
          </ul>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">Sécurité de vos données</h3>
          <p class="text-gray-700 mb-3">Purple Dog met en place les mesures suivantes :</p>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li>Chiffrement SSL/TLS de toutes les connexions</li>
            <li>Hashage sécurisé des mots de passe</li>
            <li>Sauvegarde encryptée et régulière</li>
            <li>Accès restreint aux données</li>
          </ul>
        </section>
      </div>

      <!-- Contenu Cookies -->
      <div v-if="activeSection === 'cookies'" class="bg-white rounded-lg shadow-md p-8 space-y-6">
        <h2 class="text-2xl font-bold text-white bg-gray-600 rounded w-75">Gestion des Cookies</h2>
        
        <section>
          <h3 class="text-xl font-semibold mb-3">Qu'est-ce qu'un cookie ?</h3>
          <p class="text-gray-700">Un cookie est un petit fichier stocké sur votre navigateur qui permet aux sites web de mémoriser vos préférences et informations de session.</p>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">Types de cookies utilisés</h3>
          <ul class="space-y-3 text-gray-700">
            <li>
              <strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site (authentification, sécurité)
            </li>
            <li>
              <strong>Cookies de performance :</strong> Nous aident à comprendre comment vous utilisez notre plateforme pour l'améliorer
            </li>
            <li>
              <strong>Cookies de fonctionnalité :</strong> Mémorisent vos préférences (langue, thème)
            </li>
          </ul>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">Comment les contrôler</h3>
          <p class="text-gray-700 mb-3">Vous pouvez contrôler les cookies via les paramètres de votre navigateur :</p>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li>Chrome, Firefox, Edge, Safari : Paramètres → Confidentialité → Cookies</li>
            <li>Vous pouvez accepter, refuser ou supprimer les cookies à tout moment</li>
            <li>Note : Certains cookies essentiels ne peuvent pas être désactivés sans impacter le fonctionnement du site</li>
          </ul>
        </section>
      </div>

      <!-- Acceptation RGPD -->
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-8 mt-8">
        <h3 class="text-xl font-semibold mb-4">Acceptation de la politique</h3>
        <div class="flex items-start gap-3 mb-6">
          <input 
            id="accept-rgpd"
            v-model="acceptRGPD" 
            type="checkbox" 
            class="w-5 h-5 mt-1 accent-green-700"
          >
          <div class="flex-1">
            <label for="accept-rgpd" class="text-gray-700">
              Je reconnais avoir lu et compris la politique de confidentialité, les conditions d'utilisation et la gestion des cookies
            </label>
            <p v-if="rgpdError" class="text-red-600 text-sm mt-2">{{ rgpdError }}</p>
          </div>
        </div>

        <div class="flex gap-4">
          <button 
            @click="onAccept"
            :disabled="!acceptRGPD"
            class="flex-1 bg-green-800 text-white font-semibold py-3 rounded hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Accepter et retourner à l'inscription
          </button>

          <RouterLink 
            to="/"
            class="flex-1 bg-gray-600 text-white font-semibold py-3 rounded hover:bg-gray-700 transition text-center"
          >
            ← Retour
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
