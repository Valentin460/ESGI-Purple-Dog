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
  router.push('/auth/register/professionnel')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- En-tête -->
      <div class="bg-white rounded-lg shadow-md p-8 mb-8">
        <h1 class="text-4xl font-bold mb-4">RGPD et Protection des Données</h1>
        <p class="text-gray-600">Pour les professionnels</p>
      </div>

      <!-- Onglets -->
      <div class="flex gap-4 mb-8 flex-wrap">
        <button 
          @click="activeSection = 'rgpd'"
          :class="[
            'px-6 py-3 font-semibold rounded-lg transition',
            activeSection === 'rgpd' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-white text-gray-700 border border-gray-300 hover:border-indigo-600'
          ]"
        >
          RGPD
        </button>
        <button 
          @click="activeSection = 'privacy'"
          :class="[
            'px-6 py-3 font-semibold rounded-lg transition',
            activeSection === 'privacy' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-white text-gray-700 border border-gray-300 hover:border-indigo-600'
          ]"
        >
          Confidentialité
        </button>
        <button 
          @click="activeSection = 'dataSecure'"
          :class="[
            'px-6 py-3 font-semibold rounded-lg transition',
            activeSection === 'dataSecure' 
              ? 'bg-indigo-600 text-white' 
              : 'bg-white text-gray-700 border border-gray-300 hover:border-indigo-600'
          ]"
        >
          Sécurité
        </button>
      </div>

      <!-- Contenu RGPD -->
      <div v-if="activeSection === 'rgpd'" class="bg-white rounded-lg shadow-md p-8 space-y-6">
        <h2 class="text-2xl font-bold">Conformité RGPD</h2>
        
        <section>
          <h3 class="text-xl font-semibold mb-3">Données des clients professionnels</h3>
          <p class="text-gray-700">En tant que professionnel, vous traitez les données personnelles de vos clients. Purple Dog vous aide à respecter le RGPD.</p>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">Données collectées auprès des professionnels</h3>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li>Informations d'identification</li>
            <li>Données professionnelles et SIRET</li>
            <li>Documents officiels (K-Bis, INSEE)</li>
            <li>Données de navigation sur la plateforme</li>
          </ul>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">Vos droits en tant que professionnel</h3>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li>Accéder à vos données</li>
            <li>Rectifier les informations inexactes</li>
            <li>Demander la suppression de votre compte</li>
            <li>Exporter vos données</li>
            <li>Vous opposer à certains traitements</li>
          </ul>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">Responsabilités des professionnels</h3>
          <p class="text-gray-700 mb-3">En tant que responsable de traitement, vous vous engagez à :</p>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li>Respecter le RGPD dans votre collecte de données</li>
            <li>Informer vos clients de l'utilisation de leurs données</li>
            <li>Sécuriser les données collectées</li>
            <li>Répondre aux demandes d'accès aux données</li>
          </ul>
        </section>
      </div>

      <!-- Contenu Confidentialité -->
      <div v-if="activeSection === 'privacy'" class="bg-white rounded-lg shadow-md p-8 space-y-6">
        <h2 class="text-2xl font-bold">Politique de Confidentialité Professionnels</h2>
        
        <section>
          <h3 class="text-xl font-semibold mb-3">Protection des données clients</h3>
          <p class="text-gray-700">Purple Dog protège les données de vos clients. Seules les informations nécessaires à la transaction sont partagées.</p>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">Limite de visibilité</h3>
          <p class="text-gray-700">Les données sensibles (adresse complète, numéro de téléphone) des particuliers ne sont jamais visibles sur la plateforme. Seul le prénom est affiché.</p>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">Communication entre parties</h3>
          <p class="text-gray-700">La communication entre professionnels et particuliers se fait via un système de messagerie sécurisé. Les données de contact ne sont pas directement révélées.</p>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">Partage de données</h3>
          <p class="text-gray-700">Vos données professionnelles ne sont jamais partagées avec des tiers sans votre consentement explicite.</p>
        </section>
      </div>

      <!-- Contenu Sécurité -->
      <div v-if="activeSection === 'dataSecure'" class="bg-white rounded-lg shadow-md p-8 space-y-6">
        <h2 class="text-2xl font-bold">Sécurité des Données</h2>
        
        <section>
          <h3 class="text-xl font-semibold mb-3">Mesures de sécurité</h3>
          <p class="text-gray-700 mb-3">Purple Dog met en place les mesures suivantes :</p>
          <ul class="list-disc list-inside space-y-2 text-gray-700">
            <li>Chiffrement SSL/TLS des connexions</li>
            <li>Hashage sécurisé des mots de passe</li>
            <li>Pare-feu et systèmes de détection d'intrusion</li>
            <li>Sauvegarde régulière et encryptée des données</li>
            <li>Audit de sécurité annuel</li>
          </ul>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">Accès aux données</h3>
          <p class="text-gray-700">Seuls les employés de Purple Dog autorisés ont accès à vos données, dans le respect des obligations de confidentialité.</p>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">Incident de sécurité</h3>
          <p class="text-gray-700">En cas de violation de données, nous vous notifierons dans les 72 heures conformément au RGPD.</p>
        </section>

        <section>
          <h3 class="text-xl font-semibold mb-3">Durée de conservation</h3>
          <p class="text-gray-700">Les données sont conservées aussi longtemps que nécessaire pour l'exécution du contrat. Vous pouvez demander leur suppression à tout moment.</p>
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
            class="w-5 h-5 mt-1 accent-indigo-600"
          >
          <div class="flex-1">
            <label for="accept-rgpd" class="text-gray-700">
              Je reconnais avoir lu et compris la politique de confidentialité et les conditions de traitement de mes données
            </label>
            <p v-if="rgpdError" class="text-red-600 text-sm mt-2">{{ rgpdError }}</p>
          </div>
        </div>

        <div class="flex gap-4">
          <button 
            @click="onAccept"
            :disabled="!acceptRGPD"
            class="flex-1 bg-indigo-600 text-white font-semibold py-3 rounded hover:bg-indigo-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Accepter et retourner à l'inscription
          </button>

          <RouterLink 
            to="/pro/newsletter"
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
