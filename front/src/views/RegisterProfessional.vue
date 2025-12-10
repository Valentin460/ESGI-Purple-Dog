<script setup>
import { ref } from 'vue';
import { useCamera } from '../composables/useCamera';

const user = ref({
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  profilePhoto: null,
  companyName: '',
  siret: '',
  address: '',
  website: '',
  specialties: '',
  searchedObjects: '',
  socialMedia: '',
});

const photoPreview = ref(null);
const photoError = ref('');
const fileInputRef = ref(null);
const { videoRef, isCameraOpen, cameraError, startCamera, stopCamera, captureFromCamera: cameraCapture } = useCamera();
const document = ref(null);
const documentPreview = ref(null);

const triggerPhotoSelect = () => {
  photoError.value = '';
  if (fileInputRef.value) {
    fileInputRef.value.click();
  }
};

const handlePhotoUpload = (event) => {
  const input = event.target;
  if (input.files && input.files[0]) {
    user.value.profilePhoto = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      photoPreview.value = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
    photoError.value = '';
  }
};

const capturePhoto = () => {
  cameraCapture(photoPreview, (file) => {
    user.value.profilePhoto = file;
  });
};

const handleDocumentUpload = (event) => {
  const input = event.target;
  if (input.files && input.files[0]) {
    documentPreview.value = input.files[0].name;
  }
};

const onSubmit = () => {
  if (!user.value.profilePhoto) {
    photoError.value = 'La photo de profil est obligatoire.';
    return;
  }

  if (!user.value.website || !user.value.specialties || !user.value.searchedObjects) {
    alert('Tous les champs marqués comme obligatoires doivent être remplis');
    return;
  }
  
  alert('Un email de validation a été envoyé à ' + user.value.email);
  user.value = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    profilePhoto: null,
    companyName: '',
    siret: '',
    address: '',
    website: '',
    specialties: '',
    searchedObjects: '',
    socialMedia: '',
  };
  photoPreview.value = null;
  photoError.value = '';
  document.value = null;
  documentPreview.value = null;
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 rounded-2xl">
    <div class="max-w-2xl w-full space-y-8">
      <div>
        <h1 class="text-center font-bold text-4xl bg-linear-to-t from-green-950 to-indigo-600 bg-clip-text text-transparent">
          Inscription Professionnel
        </h1>
        <p class="text-center text-gray-600 mt-2">Aucune carte bancaire requise</p>
      </div>
      
      <form class="mt-8 space-y-8 bg-white p-8 rounded-lg shadow-md" @submit.prevent="onSubmit()">
        <!-- Photo de profil -->
        <div class="flex flex-col items-center">
          <p class="font-medium mb-3 text-gray-800">Obligatoire : chargez votre photo de profil</p>
          <button
            type="button"
            class="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-gray-300 mb-2 transition hover:border-indigo-500 hover:shadow relative"
            @click="triggerPhotoSelect"
          >
            <img v-if="photoPreview" :src="photoPreview" alt="Aperçu" class="w-full h-full object-cover cursor-pointer">
            <div v-else class="flex flex-col items-center justify-center text-gray-500 cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-gray-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <span class="text-xs font-semibold mt-1">Obligatoire</span>
            </div>
          </button>
          <input
            ref="fileInputRef"
            id="photo"
            type="file"
            accept="image/*"
            capture="user"
            @change="handlePhotoUpload"
            class="hidden"
          >
          <p class="text-xs text-gray-600 mb-1">Vous pouvez choisir un fichier ou prendre une photo avec la caméra.</p>

          <div class="flex flex-col items-center gap-2 w-full">
            <button
              type="button"
              class="text-sm text-gray-800 font-semibold underline cursor-pointer"
              @click="startCamera"
            >
              Activer la caméra
            </button>

            <div v-if="isCameraOpen" class="w-full flex flex-col items-center gap-2">
              <video ref="videoRef" class="w-64 rounded-lg border border-gray-300 bg-black" autoplay playsinline muted @loadedmetadata="() => {}"></video>
              <div class="flex gap-2">
                <button
                  type="button"
                  class="px-3 py-2 bg-indigo-600 text-white rounded shadow"
                  @click="capturePhoto"
                >
                  Capturer
                </button>
                <button
                  type="button"
                  class="px-3 py-2 bg-gray-200 text-gray-800 rounded border"
                  @click="stopCamera"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>

          <p v-if="cameraError" class="text-sm text-red-600">{{ cameraError }}</p>
          <p v-if="photoError" class="text-sm text-red-600">{{ photoError }}</p>
        </div>

        <!-- Informations personnelles -->
        <div>
          <h2 class="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Informations personnelles</h2>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="firstname" class="block font-medium mb-2 text-gray-800">Prénom :</label>
                <input id="firstname" v-model.trim="user.firstname" type="text" required placeholder="Votre prénom" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 text-black bg-gray-200 focus:ring-gray-300">
              </div>
              <div>
                <label for="lastname" class="block font-medium mb-2 text-gray-800">Nom de famille :</label>
                <input id="lastname" v-model.trim="user.lastname" type="text" required placeholder="Votre nom de famille" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 text-black bg-gray-200 focus:ring-gray-300">
              </div>
            </div>

            <div>
              <label for="email" class="block font-medium mb-2 text-gray-800">Email :</label>
              <input id="email" v-model.trim="user.email" type="email" required placeholder="Votre email professionnel" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 text-black bg-gray-200 focus:ring-gray-300">
              <p class="text-xs text-gray-600 mt-1">Un email de validation sera envoyé à cette adresse</p>
            </div>

            <div>
              <label for="password" class="block font-medium mb-2 text-gray-800">Mot de passe :</label>
              <input id="password" v-model.trim="user.password" type="password" required placeholder="Choisissez un mot de passe sécurisé" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 text-black bg-gray-200 focus:ring-gray-300">
            </div>

            <div>
              <label for="address" class="block font-medium mb-2 text-gray-800">Adresse postale :</label>
              <textarea id="address" v-model.trim="user.address" required placeholder="Votre adresse professionnelle complète" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 text-black bg-gray-200 focus:ring-gray-300 h-20"></textarea>
            </div>
          </div>
        </div>

        <!-- Informations entreprise -->
        <div>
          <h2 class="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Informations entreprise</h2>
          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label for="companyName" class="block font-medium mb-2 text-gray-800">Dénomination de l'entreprise :</label>
                <input id="companyName" v-model.trim="user.companyName" type="text" required placeholder="Nom de l'entreprise" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 text-black bg-gray-200 focus:ring-gray-300">
              </div>
              <div>
                <label for="siret" class="block font-medium mb-2 text-gray-800">Numéro SIRET :</label>
                <input id="siret" v-model.trim="user.siret" type="text" required placeholder="N° SIRET (14 chiffres)" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 text-black bg-gray-200 focus:ring-gray-300">
              </div>
            </div>

            <div>
              <label for="document" class="block font-medium mb-2 text-gray-800">Document officiel :</label>
              <p class="text-sm text-gray-600 mb-3">K-Bis, avis de situation INSEE, etc.</p>
              <input 
                id="document" 
                type="file" 
                required
                accept=".pdf,.jpg,.jpeg,.png"
                @change="handleDocumentUpload"
                class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 text-black bg-gray-200 focus:ring-gray-300"
              >
              <p v-if="documentPreview" class="text-sm text-green-600 mt-2">✓ {{ documentPreview }}</p>
            </div>
          </div>
        </div>

        <!-- Questions marketing -->
        <div>
          <h2 class="text-xl font-semibold mb-4 pb-2 border-b border-gray-200">Informations supplémentaires</h2>
          <div class="space-y-4">
            <div>
              <label for="website" class="block font-medium mb-2 text-gray-800">
                Site internet : 
                <span class="text-red-500">*</span>
              </label>
              <input id="website" v-model.trim="user.website" type="url" required placeholder="https://www.exemple.com" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 text-black bg-gray-200 focus:ring-gray-300">
            </div>

            <div>
              <label for="specialties" class="block font-medium mb-2 text-gray-800">
                Spécialités : 
                <span class="text-red-500">*</span>
              </label>
              <textarea 
                id="specialties" 
                v-model.trim="user.specialties" 
                required 
                placeholder="Décrivez vos spécialités (ex: Art contemporain, Sculptures, Œuvres graphiques, etc.)" 
                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 text-black bg-gray-200 focus:ring-gray-300 h-20"
              ></textarea>
            </div>

            <div>
              <label for="searchedObjects" class="block font-medium mb-2 text-gray-800">
                Objets recherchés : 
                <span class="text-red-500">*</span>
              </label>
              <textarea 
                id="searchedObjects" 
                v-model.trim="user.searchedObjects" 
                required 
                placeholder="Décrivez les types d'objets que vous recherchez le plus (ex: Tableaux abstraits, Sculptures en bois, Photographies d'art, etc.)" 
                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 text-black bg-gray-200 focus:ring-gray-300 h-20"
              ></textarea>
            </div>

            <div>
              <label for="socialMedia" class="block font-medium mb-2 text-gray-800">Réseaux sociaux (optionnel)</label>
              <input 
                id="socialMedia" 
                v-model.trim="user.socialMedia" 
                type="text" 
                placeholder="Instagram, Facebook, LinkedIn, etc." 
                class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 text-black bg-gray-200 focus:ring-gray-300"
              >
            </div>
          </div>
        </div>

        <!-- Conditions -->
        <div class="space-y-3 bg-blue-50 p-6 rounded border border-blue-200">
          <div class="flex items-start gap-3">
            <input type="checkbox" required class="w-5 h-5 mt-1 accent-green-800">
            <div>
              <p class="text-sm text-gray-700 mb-3">J'accepte les <RouterLink to="/pro/cgv" target="_blank" class="text-blue-700 hover:underline font-semibold">Conditions Générales de Vente</RouterLink></p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <input type="checkbox" required class="w-5 h-5 mt-1 accent-green-800">
            <div>
              <p class="text-sm text-gray-700 mb-3">J'accepte le <RouterLink to="/pro/mandat" target="_blank" class="text-blue-700 hover:underline font-semibold">mandat d'apport d'affaire</RouterLink></p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <input type="checkbox" required class="w-5 h-5 mt-1 accent-green-800">
            <div>
              <p class="text-sm text-gray-700">J'ai lu et j'accepte la <RouterLink to="/pro/rgpd" target="_blank" class="text-blue-700 hover:underline font-semibold">politique RGPD et confidentialité</RouterLink></p>
            </div>
          </div>

          <div class="flex items-start gap-3">
            <input type="checkbox" required class="w-5 h-5 mt-1 accent-green-800">
            <div>
              <p class="text-sm text-gray-700">Je souhaite recevoir les informations de <RouterLink to="/pro/newsletter" target="_blank" class="text-blue-700 hover:underline font-semibold">la newsletter Purple Dog</RouterLink></p>
            </div>
          </div>
        </div>
        
        <!-- Bouton soumettre -->
        <div class="pt-4">
          <input type="submit" value="Créer mon compte professionnel" class="w-full accent-green-800 text-white font-semibold py-3 rounded hover:bg-green-850 transition cursor-pointer">
        </div>
        
        <!-- Lien connexion -->
        <div class="text-center pt-2">
          <RouterLink to="/auth/login" class="hover:text-blue-700 text-blue-800 font-bold transition">
            <i><u>Vous avez déjà un compte ?</u></i>
          </RouterLink>
        </div>
      </form>
    </div>
  </div>
</template>
