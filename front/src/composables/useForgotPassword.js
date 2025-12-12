import { ref } from 'vue'

export const useForgotPassword = () => {
  const email = ref('')
  const showModal = ref(false)
  const isLoading = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')
  const resetStep = ref(1) // Étape 1: demande email, Étape 2: reset code, Étape 3: nouveau mdp

  /**
   * Demande un lien de réinitialisation de mot de passe
   * @param {string} userEmail - Email de l'utilisateur
   * @returns {Promise<boolean>} - true si succès, false sinon
   */
  const requestPasswordReset = async (userEmail) => {
    isLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    try {
      const response = await fetch('/api/auth/forgot-password/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
        }),
      })

      if (!response.ok) {
        const contentType = response.headers.get('content-type')
        let errorMsg = 'Erreur lors de la demande de réinitialisation'
        
        if (contentType && contentType.includes('application/json')) {
          try {
            const error = await response.json()
            errorMsg = error.message || errorMsg
          } catch {
            errorMsg = `Erreur serveur (${response.status})`
          }
        } else {
          errorMsg = `Erreur serveur (${response.status})`
        }
        
        throw new Error(errorMsg)
      }

      email.value = userEmail
      successMessage.value = 'Un email de réinitialisation a été envoyé. Vérifiez votre boîte mail.'
      resetStep.value = 2

      return true
    } catch (error) {
      errorMessage.value = error.message || 'Erreur de connexion au serveur'
      console.error('Erreur :', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Réinitialise le mot de passe avec le code de confirmation
   * @param {string} resetCode - Code reçu par email
   * @param {string} newPassword - Nouveau mot de passe
   * @param {string} confirmPassword - Confirmation du mot de passe
   * @returns {Promise<boolean>} - true si succès, false sinon
   */
  const resetPassword = async (resetCode, newPassword, confirmPassword) => {
    isLoading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    if (newPassword !== confirmPassword) {
      errorMessage.value = 'Les mots de passe ne correspondent pas'
      isLoading.value = false
      return false
    }

    if (newPassword.length < 8) {
      errorMessage.value = 'Le mot de passe doit contenir au moins 8 caractères'
      isLoading.value = false
      return false
    }

    try {
      const response = await fetch('/api/auth/forgot-password/reset', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.value,
          resetCode,
          newPassword,
        }),
      })

      if (!response.ok) {
        const contentType = response.headers.get('content-type')
        let errorMsg = 'Erreur lors de la réinitialisation'
        
        if (contentType && contentType.includes('application/json')) {
          try {
            const error = await response.json()
            errorMsg = error.message || errorMsg
          } catch {
            errorMsg = `Erreur serveur (${response.status})`
          }
        } else {
          errorMsg = `Erreur serveur (${response.status})`
        }
        
        throw new Error(errorMsg)
      }

      successMessage.value = 'Mot de passe réinitialisé avec succès ! Vous pouvez maintenant vous connecter.'
      resetStep.value = 3

      return true
    } catch (error) {
      errorMessage.value = error.message || 'Erreur de connexion au serveur'
      console.error('Erreur :', error)
      return false
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Ouvre la modale
   */
  const openModal = () => {
    showModal.value = true
    resetStep.value = 1
    email.value = ''
    reset()
  }

  /**
   * Ferme la modale
   */
  const closeModal = () => {
    showModal.value = false
    reset()
  }

  /**
   * Réinitialise tous les états
   */
  const reset = () => {
    email.value = ''
    isLoading.value = false
    errorMessage.value = ''
    successMessage.value = ''
    resetStep.value = 1
  }

  return {
    email,
    showModal,
    isLoading,
    errorMessage,
    successMessage,
    resetStep,
    requestPasswordReset,
    resetPassword,
    openModal,
    closeModal,
    reset,
  }
}
