<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCamera } from '../composables/useCamera';
import { useEmailConfirmation } from '../composables/useEmailConfirmation';
import authService from '@/services/auth.service';

const router = useRouter();

const user = ref({
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  confirmPassword: '',
  profilePhoto: null,
  address: '',
  age: '',
  isOver18: false,
});

const photoPreview = ref(null);
const photoError = ref('');
const fileInputRef = ref(null);
const { videoRef, isCameraOpen, cameraError, startCamera, stopCamera, captureFromCamera: cameraCapture } = useCamera();
const { confirmationEmail, showConfirmation, isLoading, errorMessage, sendConfirmationEmail, reset } = useEmailConfirmation();

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
    cameraError.value = '';
    stopCamera();
  }
};

const capturePhoto = () => {
  cameraCapture(photoPreview, (file) => {
    user.value.profilePhoto = file;
  });
};

const onSubmit = async () => {
  if (!user.value.profilePhoto) {
    photoError.value = 'La photo de profil est obligatoire.';
    return;
  }

  if (!user.value.password) {
    alert('Le mot de passe est obligatoire');
    return;
  }

  if (user.value.password !== user.value.confirmPassword) {
    alert('Les mots de passe ne correspondent pas');
    return;
  }

  if (user.value.password.length < 8) {
    alert('Le mot de passe doit contenir au moins 8 caractères');
    return;
  }

  if (!user.value.isOver18) {
    alert('Vous devez avoir plus de 18 ans pour créer un compte');
    return;
  }

  try {
    // Préparer les données pour l'inscription
    const registerData = {
      email: user.value.email,
      password: user.value.password,
      first_name: user.value.firstname,
      last_name: user.value.lastname,
      address: user.value.address,
      age: user.value.age,
      user_type: 'individual'
    };

    // Appel API via authService
    await authService.register(registerData);

    // Envoyer l'email de confirmation
    await sendConfirmationEmail(user.value.email, user.value.firstname, 'particulier');

    // Réinitialiser le formulaire et rediriger après 3 secondes
    setTimeout(() => {
      user.value = {
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confirmPassword: '',
        profilePhoto: null,
        address: '',
        age: '',
        isOver18: false,
      };
      photoPreview.value = null;
      photoError.value = '';
      reset();

      // Rediriger vers la page de connexion
      router.push('/auth/login');
    }, 3000);

  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    alert(error.message || 'Erreur lors de l\'inscription. Veuillez réessayer.');
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 rounded-2xl">
    <div class="max-w-2xl w-full space-y-8">
      <div>
        <h1 class="text-center font-bold text-4xl bg-linear-to-t from-green-950 to-indigo-600 bg-clip-text text-transparent">
          Créer votre espace Particulier
        </h1>
      </div>

      <form class="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-md" @submit.prevent="onSubmit()">
        <div class="space-y-6">
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


          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="firstname" class="block font-medium mb-2 text-gray-800">Prénom :</label>
              <input id="firstname" v-model.trim="user.firstname" type="text" required placeholder="Votre prénom" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 text-black bg-gray-200 focus:ring-gray-300">
              <p class="text-xs text-gray-600 mt-1">Seul votre prénom sera visible sur la plateforme</p>
            </div>
            <div>
              <label for="lastname" class="block font-medium mb-2 text-gray-800">Nom de famille :</label>
              <input id="lastname" v-model.trim="user.lastname" type="text" required placeholder="Votre nom de famille" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 text-black bg-gray-200 focus:ring-gray-300">
              <p class="text-xs text-gray-800 mt-1">Non visible sur la plateforme</p>
            </div>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block font-medium mb-2 text-gray-800">Email :</label>
            <input id="email" v-model.trim="user.email" type="email" required placeholder="Votre email" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 text-black bg-gray-200 focus:ring-gray-300">
            <p class="text-xs text-gray-800 mt-1">Un email de validation sera envoyé à cette adresse</p>
          </div>

          <!-- Adresse postale -->
          <div>
            <label for="address" class="block font-medium mb-2 text-gray-800">Adresse postale :</label>
            <textarea id="address" v-model.trim="user.address" required placeholder="Votre adresse complète" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 text-black bg-gray-200 focus:ring-gray-300 h-15"></textarea>
          </div>

          <!-- Mot de passe -->
          <div>
            <label for="password" class="block font-medium mb-2 text-gray-800">Mot de passe :</label>
            <input id="password" v-model.trim="user.password" type="password" required placeholder="Choisissez un mot de passe sécurisé" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 text-black bg-gray-200 focus:ring-gray-300">
          </div>

          <!-- Confirmation mot de passe -->
          <div>
            <label for="confirmPassword" class="block font-medium mb-2 text-gray-800">Confirmer le mot de passe :</label>
            <input id="confirmPassword" v-model.trim="user.confirmPassword" type="password" required placeholder="Confirmez votre mot de passe" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 text-black bg-gray-200 focus:ring-gray-300">
          </div>

          <!-- Âge et certification 18+ -->
          <div class="space-y-3">
            <div>
              <label for="age" class="block font-medium mb-2 text-gray-800">Âge :</label>
              <input id="age" v-model.number="user.age" type="number" required placeholder="Votre âge" min="13" max="120" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 text-black bg-gray-200 focus:ring-gray-300 mb-2">
            </div>

            <div class="flex items-start gap-3 bg-blue-50 p-4 rounded border border-blue-200">
              <input
                id="is-over-18"
                v-model="user.isOver18"
                type="checkbox"
                required
                class="w-5 h-5 mt-1 accent-green-800"
              >
              <label for="is-over-18" class="text-sm text-gray-700">
                Je certifie sur l'honneur que j'ai plus de 18 ans et que je suis propriétaire de ce compte
              </label>
            </div>
          </div>

          <!-- Conditions -->
          <div class="space-y-3 bg-blue-50 p-6 rounded border ">
            <div class="flex items-start gap-3">
              <input type="checkbox" required class="w-5 h-5 mt-1 accent-green-800 ">
              <p class="text-sm text-gray-700">J'ai lu et j'accepte les <RouterLink to="/rgpd" target="_blank" class="text-blue-700 hover:underline font-semibold">conditions d'utilisation et politique de confidentialité</RouterLink></p>
            </div>

            <div class="flex items-start gap-3">
              <input type="checkbox" class="w-5 h-5 mt-1 accent-green-800">
              <p class="text-sm text-gray-700">Je souhaite m'abonner à la <RouterLink to="/newsletter" target="_blank" class="text-blue-700 hover:underline font-semibold">newsletter Purple Dog</RouterLink> (optionnel)</p>
            </div>
          </div>

          <!-- Bouton soumettre -->
          <div class="pt-4">
            <input type="submit" value="Créer mon compte" class="w-full accent-green-800 text-white font-semibold py-3 rounded hover:bg-green-850 transition cursor-pointer">
          </div>

          <!-- Lien connexion -->
          <div class="text-center pt-2">
            <RouterLink to="/auth/login" class="hover:text-blue-700 text-blue-800 font-bold transition">
              <i><u>Vous avez déjà un compte ?</u></i>
            </RouterLink>
          </div>
        </div>
      </form>

      <!-- Modale de confirmation d'email -->
      <div v-if="showConfirmation" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg shadow-lg p-8 max-w-md w-full mx-4">
          <div class="text-center space-y-4">
            <!-- État loading -->
            <div v-if="isLoading" class="flex flex-col items-center justify-center space-y-4">
              <div class="animate-spin">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p class="text-gray-600">Envoi de l'email en cours...</p>
            </div>

            <!-- État succès -->
            <div v-else-if="!errorMessage" class="space-y-4">
              <div class="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-800">Inscription réussie !</h2>
              <p class="text-gray-600">Un email de confirmation a été envoyé à :</p>
              <p class="font-semibold text-indigo-600 break-all">{{ confirmationEmail }}</p>
              <p class="text-sm text-gray-500">Veuillez consulter votre boîte mail et cliquer sur le lien de confirmation pour activer votre compte.</p>
              <div class="pt-4">
                <p class="text-xs text-gray-400">Redirection en cours...</p>
              </div>
            </div>

            <!-- État erreur -->
            <div v-else class="space-y-4">
              <div class="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 class="text-2xl font-bold text-gray-800">Erreur d'envoi</h2>
              <p class="text-red-600 font-semibold">{{ errorMessage }}</p>
              <p class="text-sm text-gray-500">Veuillez vérifier votre email et réessayer.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
