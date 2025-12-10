<script setup>
import { ref } from 'vue'

const userType = ref('professional')

const profileData = ref({
  photo: null,
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean.dupont@example.com',
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  address: '12 Rue de la Paix',
  postalCode: '75001',
  city: 'Paris',
  country: 'France',
  companyName: 'Antiquités Dupont',
  siret: '123 456 789 00012',
  emailNotifications: true,
  auctionNotifications: true,
  messageNotifications: true,
  newsletterSubscription: true
})

const photoPreview = ref(null)
const isEditing = ref(false)
const isSaving = ref(false)
const successMessage = ref('')

const handlePhotoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    profileData.value.photo = file
    const reader = new FileReader()
    reader.onload = (e) => {
      photoPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const saveProfile = async () => {
  isSaving.value = true
  successMessage.value = ''

  if (profileData.value.newPassword) {
    if (profileData.value.newPassword !== profileData.value.confirmPassword) {
      alert('Les mots de passe ne correspondent pas')
      isSaving.value = false
      return
    }
    if (!profileData.value.currentPassword) {
      alert('Veuillez entrer votre mot de passe actuel')
      isSaving.value = false
      return
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 1000))

  successMessage.value = 'Profil mis à jour avec succès'
  isEditing.value = false
  isSaving.value = false

  profileData.value.currentPassword = ''
  profileData.value.newPassword = ''
  profileData.value.confirmPassword = ''

  setTimeout(() => {
    successMessage.value = ''
  }, 3000)
}

const cancelEdit = () => {
  isEditing.value = false
}
</script>

<template>
  <div class="profile-container">
    <div class="profile-wrapper">
      <header class="profile-header">
        <h1>Mon Profil</h1>
        <p class="subtitle">
          {{ userType === 'professional' ? 'Compte Professionnel' : 'Compte Particulier' }}
        </p>
      </header>

      <div v-if="successMessage" class="success-message">
        {{ successMessage }}
      </div>

      <div class="profile-content">
        <section class="profile-section photo-section">
          <div class="photo-container">
            <div class="photo-placeholder">
              <img
                v-if="photoPreview"
                :src="photoPreview"
                alt="Photo de profil"
                class="profile-photo"
              />
              <div v-else class="photo-icon">
                <span>{{ profileData.firstName.charAt(0) }}{{ profileData.lastName.charAt(0) }}</span>
              </div>
            </div>
            <div class="photo-actions">
              <label for="photo-upload" class="btn-secondary">
                Changer la photo
              </label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                @change="handlePhotoUpload"
                style="display: none"
              />
            </div>
          </div>
        </section>

        <section class="profile-section">
          <h2>Informations personnelles</h2>
          <div class="form-grid">
            <div class="form-group">
              <label for="firstName">Prénom</label>
              <input
                id="firstName"
                v-model="profileData.firstName"
                type="text"
                :disabled="!isEditing"
              />
            </div>
            <div class="form-group">
              <label for="lastName">Nom</label>
              <input
                id="lastName"
                v-model="profileData.lastName"
                type="text"
                :disabled="!isEditing"
              />
            </div>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" v-model="profileData.email" type="email" :disabled="!isEditing" />
          </div>
        </section>

        <section v-if="userType === 'professional'" class="profile-section">
          <h2>Informations professionnelles</h2>
          <div class="form-group">
            <label for="companyName">Dénomination de l'entreprise</label>
            <input
              id="companyName"
              v-model="profileData.companyName"
              type="text"
              :disabled="!isEditing"
            />
          </div>
          <div class="form-group">
            <label for="siret">Numéro SIRET</label>
            <input id="siret" v-model="profileData.siret" type="text" disabled />
          </div>
        </section>

        <section class="profile-section">
          <h2>Adresse</h2>
          <div class="form-group">
            <label for="address">Adresse</label>
            <input
              id="address"
              v-model="profileData.address"
              type="text"
              :disabled="!isEditing"
            />
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label for="postalCode">Code postal</label>
              <input
                id="postalCode"
                v-model="profileData.postalCode"
                type="text"
                :disabled="!isEditing"
              />
            </div>
            <div class="form-group">
              <label for="city">Ville</label>
              <input id="city" v-model="profileData.city" type="text" :disabled="!isEditing" />
            </div>
          </div>
          <div class="form-group">
            <label for="country">Pays</label>
            <input
              id="country"
              v-model="profileData.country"
              type="text"
              :disabled="!isEditing"
            />
          </div>
        </section>

        <section v-if="isEditing" class="profile-section">
          <h2>Modifier le mot de passe</h2>
          <div class="form-group">
            <label for="currentPassword">Mot de passe actuel</label>
            <input
              id="currentPassword"
              v-model="profileData.currentPassword"
              type="password"
              placeholder="Laissez vide si vous ne souhaitez pas le modifier"
            />
          </div>
          <div class="form-grid">
            <div class="form-group">
              <label for="newPassword">Nouveau mot de passe</label>
              <input id="newPassword" v-model="profileData.newPassword" type="password" />
            </div>
            <div class="form-group">
              <label for="confirmPassword">Confirmer le mot de passe</label>
              <input
                id="confirmPassword"
                v-model="profileData.confirmPassword"
                type="password"
              />
            </div>
          </div>
        </section>

        <section class="profile-section">
          <h2>Notifications</h2>
          <div class="notifications-grid">
            <label class="checkbox-label">
              <input
                v-model="profileData.emailNotifications"
                type="checkbox"
                :disabled="!isEditing"
              />
              <span>Recevoir les notifications par email</span>
            </label>
            <label class="checkbox-label">
              <input
                v-model="profileData.auctionNotifications"
                type="checkbox"
                :disabled="!isEditing"
              />
              <span>Notifications pour les enchères</span>
            </label>
            <label class="checkbox-label">
              <input
                v-model="profileData.messageNotifications"
                type="checkbox"
                :disabled="!isEditing"
              />
              <span>Notifications pour les messages</span>
            </label>
            <label class="checkbox-label">
              <input
                v-model="profileData.newsletterSubscription"
                type="checkbox"
                :disabled="!isEditing"
              />
              <span>Newsletter</span>
            </label>
          </div>
        </section>

        <section class="profile-actions">
          <button v-if="!isEditing" class="btn-primary" @click="isEditing = true">
            Modifier mon profil
          </button>
          <template v-else>
            <button class="btn-primary" :disabled="isSaving" @click="saveProfile">
              {{ isSaving ? 'Enregistrement...' : 'Enregistrer les modifications' }}
            </button>
            <button class="btn-secondary" :disabled="isSaving" @click="cancelEdit">
              Annuler
            </button>
          </template>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-container {
  min-height: 100vh;
  background-color: #fafafa;
  padding: 0;
}

.profile-wrapper {
  background: white;
  min-height: 100vh;
}

.profile-header {
  padding: 2rem 1.5rem 1.5rem;
  border-bottom: 1px solid #e0e0e0;
  text-align: center;
}

.profile-header h1 {
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

.profile-content {
  padding: 2rem;
}

.profile-section {
  margin-bottom: 3rem;
}

.profile-section:last-of-type {
  margin-bottom: 2rem;
}

.profile-section h2 {
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0 0 1.5rem;
  color: #1a1a1a;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.photo-section {
  display: flex;
  justify-content: center;
  padding: 1rem 0;
}

.photo-container {
  text-align: center;
}

.photo-placeholder {
  width: 120px;
  height: 120px;
  margin: 0 auto 1rem;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f5f5f5;
  border: 3px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 2.5rem;
  font-weight: 300;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
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
  letter-spacing: 0.02em;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d0d0d0;
  border-radius: 2px;
  font-size: 0.95rem;
  font-family: inherit;
  transition: all 0.2s;
  background-color: white;
}

.form-group input:focus {
  outline: none;
  border-color: #1a1a1a;
  box-shadow: 0 0 0 1px #1a1a1a;
}

.form-group input:disabled {
  background-color: #f5f5f5;
  color: #666;
  cursor: not-allowed;
}

.notifications-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 0.95rem;
  color: #444;
}

.checkbox-label input[type='checkbox'] {
  width: 18px;
  height: 18px;
  margin-right: 0.75rem;
  cursor: pointer;
}

.checkbox-label input[type='checkbox']:disabled {
  cursor: not-allowed;
}

.profile-actions {
  display: flex;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid #e0e0e0;
}

.btn-primary,
.btn-secondary {
  padding: 0.875rem 2rem;
  border: none;
  border-radius: 2px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-family: inherit;
}

.btn-primary {
  background-color: #1a1a1a;
  color: white;
  flex: 1;
}

.btn-primary:hover:not(:disabled) {
  background-color: #000;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: white;
  color: #1a1a1a;
  border: 1px solid #d0d0d0;
  padding: 0.75rem 1.5rem;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #f5f5f5;
  border-color: #1a1a1a;
}

.photo-actions .btn-secondary {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  font-size: 0.85rem;
}

@media (min-width: 769px) {
  .profile-container {
    padding: 2rem 1rem;
  }

  .profile-wrapper {
    max-width: 900px;
    margin: 0 auto;
    border-radius: 2px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .profile-header {
    padding: 3rem 2rem 2rem;
  }

  .profile-header h1 {
    font-size: 2rem;
  }

  .profile-content {
    padding: 2.5rem 2rem;
  }

  .form-grid {
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
  }

  .profile-actions {
    flex-direction: row;
  }

  .btn-primary,
  .btn-secondary {
    width: auto;
  }
}
</style>
