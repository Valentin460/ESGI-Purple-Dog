import { ref } from 'vue'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const useItemPublishing = () => {
  const isLoading = ref(false)
  const error = ref('')

  /**
   * Publier un objet complet avec images et documents
   */
  const publishItem = async (formData, sellerId) => {
    isLoading.value = true
    error.value = ''

    try {
      // Créer FormData pour multipart/form-data
      const data = new FormData()

      // Ajouter les données de l'item comme JSON
      const itemData = {
        seller_id: sellerId,
        nom: formData.nom,
        categorie: formData.categorie,
        description: formData.description,
        prix: formData.prix,
        typeVente: formData.typeVente,
        dureeEnchere: formData.dureeEnchere,
        dimensions: {
          hauteur: formData.dimensions.hauteur,
          largeur: formData.dimensions.largeur,
          profondeur: formData.dimensions.profondeur
        },
        poids: formData.poids,
        prixDepart: formData.prixDepart
      }

      // Ajouter les données comme un blob JSON
      data.append('itemData', JSON.stringify(itemData))

      // Ajouter les photos - utiliser photo.file (qui est un File object)
      if (formData.photos && formData.photos.length > 0) {
        formData.photos.forEach((photo, index) => {
          if (photo.file) {
            data.append('photos', photo.file, photo.file.name || `photo-${index}.jpg`)
          }
        })
      }

      // Ajouter les documents
      if (formData.documents && formData.documents.length > 0) {
        formData.documents.forEach((doc) => {
          if (doc instanceof File) {
            data.append('documents', doc, doc.name)
          }
        })
      }

      const response = await fetch(`${API_BASE_URL}/items/publish`, {
        method: 'POST',
        body: data
        // Ne pas définir Content-Type, le navigateur le fera automatiquement
      })

      // Vérifier le statut HTTP
      if (!response.ok) {
        const contentType = response.headers.get('content-type')
        let errorMessage = `Erreur ${response.status}`
        
        try {
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json()
            errorMessage += `: ${errorData.error || response.statusText}`
          } else {
            const text = await response.text()
            // Extraire juste le message d'erreur du HTML
            const match = text.match(/<pre>Error: (.*?)<br>/)
            if (match && match[1]) {
              errorMessage += `: ${match[1]}`
            } else {
              errorMessage += `: ${response.statusText}`
            }
          }
        } catch {
          errorMessage += `: ${response.statusText || 'Erreur inconnue'}`
        }
        
        throw new Error(errorMessage)
      }

      // Parser la réponse
      const contentType = response.headers.get('content-type')
      let result

      if (contentType && contentType.includes('application/json')) {
        result = await response.json()
      } else {
        throw new Error('Réponse du serveur invalide (pas de JSON)')
      }

      if (result.success) {
        return {
          success: true,
          message: result.message,
          data: result.data
        }
      } else {
        throw new Error(result.error || 'Erreur inconnue lors de la publication')
      }
    } catch (err) {
      error.value = err.message
      console.error('Erreur publication:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Récupérer les détails complets d'un item publié
   */
  const getItemDetails = async (itemId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/items/${itemId}/details`)

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des détails')
      }

      const result = await response.json()

      if (result.success) {
        return result.data
      } else {
        throw new Error(result.error || 'Erreur inconnue')
      }
    } catch (err) {
      console.error('Erreur récupération détails:', err)
      throw err
    }
  }

  /**
   * Récupérer les images d'un item
   */
  const getItemImages = async (itemId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/items/${itemId}/images`)

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des images')
      }

      const result = await response.json()

      if (result.success) {
        return result.data
      } else {
        throw new Error(result.error || 'Erreur inconnue')
      }
    } catch (err) {
      console.error('Erreur récupération images:', err)
      throw err
    }
  }

  /**
   * Récupérer les documents d'un item
   */
  const getItemDocuments = async (itemId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/items/${itemId}/documents`)

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des documents')
      }

      const result = await response.json()

      if (result.success) {
        return result.data
      } else {
        throw new Error(result.error || 'Erreur inconnue')
      }
    } catch (err) {
      console.error('Erreur récupération documents:', err)
      throw err
    }
  }

  /**
   * Supprimer une image d'un item
   */
  const deleteImage = async (itemId, imageId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/items/${itemId}/images/${imageId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de l\'image')
      }

      const result = await response.json()
      return result
    } catch (err) {
      console.error('Erreur suppression image:', err)
      throw err
    }
  }

  /**
   * Supprimer un document d'un item
   */
  const deleteDocument = async (itemId, documentId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/items/${itemId}/documents/${documentId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression du document')
      }

      const result = await response.json()
      return result
    } catch (err) {
      console.error('Erreur suppression document:', err)
      throw err
    }
  }

  return {
    isLoading,
    error,
    publishItem,
    getItemDetails,
    getItemImages,
    getItemDocuments,
    deleteImage,
    deleteDocument
  }
}

export default useItemPublishing
