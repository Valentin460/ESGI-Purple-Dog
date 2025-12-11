<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const acceptMandate = ref(false)
const signedDate = ref('')
const mandateError = ref('')
const dateError = ref('')

const onAccept = () => {
  mandateError.value = ''
  dateError.value = ''

  if (!acceptMandate.value) {
    mandateError.value = 'Vous devez accepter le mandat pour continuer'
    return
  }

  if (!signedDate.value) {
    dateError.value = 'Veuillez dater votre signature'
    return
  }

  alert('Mandat d\'apport d\'affaire accepté le ' + signedDate.value)
  router.push('/pro/newsletter')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-3xl w-full">
      <div class="bg-white rounded-lg shadow-md p-8">
        <h1 class="text-3xl font-bold mb-8 text-center">Mandat d'Apport d'Affaire</h1>

        <!-- Contenu Mandat -->
        <div class="prose prose-sm max-w-none mb-8 space-y-6 bg-gray-50 p-6 rounded-lg max-h-96 overflow-y-auto">
          <h2 class="text-xl font-semibold">Définition du mandat</h2>
          <p>Par la signature de ce mandat, vous acceptez de mettre en relation votre portefeuille de clients avec la plateforme Purple Dog.</p>

          <h2 class="text-xl font-semibold">Obligations du mandant</h2>
          <ul class="list-disc list-inside space-y-2">
            <li>Apporter des affaires de bonne foi</li>
            <li>Assurer l'authenticité des œuvres proposées</li>
            <li>Respecter la confidentialité des données clients</li>
            <li>Informer Purple Dog de tout changement de situation</li>
          </ul>

          <h2 class="text-xl font-semibold">Commission</h2>
          <p>Purple Dog percevra une commission sur les transactions facilitées par cette plateforme, dont le taux sera défini dans les conditions commerciales particulières.</p>

          <h2 class="text-xl font-semibold">Durée</h2>
          <p>Le présent mandat est conclu pour une durée indéterminée et peut être résilié par l'une ou l'autre des parties avec un préavis de 30 jours.</p>

          <h2 class="text-xl font-semibold">Responsabilité</h2>
          <p>Le mandant demeure responsable de la légalité et de l'authenticité des biens apportés via ce mandat.</p>

          <h2 class="text-xl font-semibold">Confidentialité</h2>
          <p>Les informations communiquées dans le cadre de ce mandat sont traitées conformément à la politique de confidentialité de Purple Dog.</p>

          <h2 class="text-xl font-semibold">Dispositions finales</h2>
          <p>Ce mandat est régi par la loi française. Toute modification doit être formalisée par écrit.</p>
        </div>

        <!-- Formulaire d'acceptation -->
        <form @submit.prevent="onAccept" class="space-y-6">
          <div class="flex items-start gap-3 bg-blue-50 p-4 rounded border border-blue-200">
            <input 
              id="accept-mandate"
              v-model="acceptMandate" 
              type="checkbox" 
              required 
              class="w-5 h-5 mt-1 accent-indigo-600"
            >
            <div class="flex-1">
              <label for="accept-mandate" class="text-sm text-gray-700">
                J'accepte le mandat d'apport d'affaire et reconnais avoir lu l'intégralité du document ci-dessus. Je m'engage à respecter l'ensemble des conditions stipulées.
              </label>
              <p v-if="mandateError" class="text-red-600 text-sm mt-2">{{ mandateError }}</p>
            </div>
          </div>

          <div>
            <label for="signed-date" class="block font-medium mb-2">Date de signature :</label>
            <input 
              id="signed-date"
              v-model="signedDate" 
              type="date" 
              required 
              class="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
            <p v-if="dateError" class="text-red-600 text-sm mt-2">{{ dateError }}</p>
          </div>

          <button 
            type="submit" 
            class="w-full bg-indigo-600 text-white font-semibold py-3 rounded hover:bg-indigo-700 transition"
          >
            Accepter et continuer
          </button>

          <div class="text-center">
            <RouterLink to="/pro/cgv" class="text-blue-800 hover:text-blue-700 font-semibold">
              ← Retour aux CGV
            </RouterLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
