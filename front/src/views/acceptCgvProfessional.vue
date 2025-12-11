<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const acceptCGV = ref(false)
const signedDate = ref('')
const cgvError = ref('')
const dateError = ref('')

const onAccept = () => {
  cgvError.value = ''
  dateError.value = ''

  if (!acceptCGV.value) {
    cgvError.value = 'Vous devez accepter les CGV pour continuer'
    return
  }

  if (!signedDate.value) {
    dateError.value = 'Veuillez dater votre signature'
    return
  }

  alert('CGV acceptées le ' + signedDate.value)
  router.push('/pro/mandat')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
    <div class="max-w-3xl w-full">
      <div class="bg-white rounded-lg shadow-md p-8">
        <h1 class="text-3xl font-bold mb-8 text-center">Conditions Générales de Vente</h1>

        <!-- Contenu CGV -->
        <div class="prose prose-sm max-w-none mb-8 space-y-6 bg-gray-50 p-6 rounded-lg max-h-96 overflow-y-auto">
          <h2 class="text-xl font-semibold">1. Objet</h2>
          <p>Les présentes Conditions Générales de Vente (CGV) régissent les relations commerciales entre Purple Dog et ses utilisateurs professionnels.</p>

          <h2 class="text-xl font-semibold">2. Définitions</h2>
          <p>« Plateforme » : Le site internet et l'application mobile Purple Dog.</p>
          <p>« Utilisateur professionnel » : Toute personne morale exerçant une activité commerciale.</p>

          <h2 class="text-xl font-semibold">3. Services proposés</h2>
          <p>Purple Dog met à disposition une plateforme de vente, d'achat et de mise en relation d'œuvres d'art.</p>

          <h2 class="text-xl font-semibold">4. Obligations des utilisateurs professionnels</h2>
          <ul class="list-disc list-inside space-y-2">
            <li>Respecter la législation applicable</li>
            <li>Ne pas publier de contenus offensants ou illégaux</li>
            <li>Maintenir l'exactitude de leurs informations</li>
            <li>Payer les frais de commission applicables</li>
          </ul>

          <h2 class="text-xl font-semibold">5. Responsabilité</h2>
          <p>Purple Dog ne peut être tenue responsable des transactions entre utilisateurs. Les utilisateurs sont responsables de la légalité et de l'authenticité des œuvres proposées.</p>

          <h2 class="text-xl font-semibold">6. Résiliation</h2>
          <p>Purple Dog se réserve le droit de suspendre ou supprimer un compte en cas de non-respect des CGV.</p>

          <h2 class="text-xl font-semibold">7. Modifications des CGV</h2>
          <p>Purple Dog peut modifier ces CGV à tout moment. Les modifications seront notifiées aux utilisateurs.</p>

          <h2 class="text-xl font-semibold">8. Droit applicable</h2>
          <p>Ces CGV sont régies par la loi française.</p>
        </div>

        <!-- Formulaire d'acceptation -->
        <form @submit.prevent="onAccept" class="space-y-6">
          <div class="flex items-start gap-3 bg-blue-50 p-4 rounded border border-blue-200">
            <input 
              id="accept-cgv"
              v-model="acceptCGV" 
              type="checkbox" 
              required 
              class="w-5 h-5 mt-1 accent-indigo-600"
            >
            <div class="flex-1">
              <label for="accept-cgv" class="text-sm text-gray-700">
                J'accepte les Conditions Générales de Vente de Purple Dog et reconnais avoir lu l'intégralité du document ci-dessus
              </label>
              <p v-if="cgvError" class="text-red-600 text-sm mt-2">{{ cgvError }}</p>
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
            <RouterLink to="/" class="text-blue-800 hover:text-blue-700 font-semibold">
              ← Retour
            </RouterLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
