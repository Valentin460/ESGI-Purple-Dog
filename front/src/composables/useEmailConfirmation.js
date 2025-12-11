import { ref } from 'vue'

export const useEmailConfirmation = () => {
  const confirmationEmail = ref('')
  const showConfirmation = ref(false)
  const isLoading = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')

  /**
   * Envoie un email de confirmation
   * @param {string} email - Email destinataire
   * @param {string} firstname - Prénom de l'utilisateur
   * @param {string} userType - Type d'utilisateur ('particulier' ou 'professionnel')
   * @returns {Promise<boolean>} - true si succès, false sinon
   */
  const sendConfirmationEmail = async (email, firstname, userType = 'particulier') => {
    isLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    try {
      const response = await fetch('/api/auth/send-confirmation-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstname,
          userType,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Erreur lors de l\'envoi de l\'email')
      }

      confirmationEmail.value = email
      showConfirmation.value = true
      successMessage.value = 'Email de confirmation envoyé avec succès !'

      return true
    } catch (error) {
      errorMessage.value = error.message
      console.error('Erreur d\'envoi d\'email :', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Ferme la modale de confirmation
   */
  const closeConfirmation = () => {
    showConfirmation.value = false
    confirmationEmail.value = ''
    successMessage.value = ''
  }

  /**
   * Réinitialise tous les états
   */
  const reset = () => {
    confirmationEmail.value = ''
    showConfirmation.value = false
    isLoading.value = false
    errorMessage.value = ''
    successMessage.value = ''
  }

  return {
    confirmationEmail,
    showConfirmation,
    isLoading,
    errorMessage,
    successMessage,
    sendConfirmationEmail,
    closeConfirmation,
    reset,
  }
}
