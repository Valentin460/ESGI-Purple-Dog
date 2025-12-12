// src/api/axios.js
import axios from 'axios'

// Créer une instance axios avec la configuration de base
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 30000, // 30 secondes
  headers: {
    'Content-Type': 'application/json'
  }
})

// Intercepteur pour ajouter le token d'authentification si présent
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Intercepteur pour gérer les erreurs de réponse
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Le serveur a répondu avec un code d'erreur
      console.error('Erreur API:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url
      })

      // Gérer les erreurs d'authentification
      if (error.response.status === 401) {
        // Rediriger vers la page de connexion ou rafraîchir le token
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    } else if (error.request) {
      // La requête a été envoyée mais pas de réponse
      console.error('Pas de réponse du serveur:', error.request)
    } else {
      // Erreur lors de la configuration de la requête
      console.error('Erreur de configuration:', error.message)
    }

    return Promise.reject(error)
  }
)

export default apiClient