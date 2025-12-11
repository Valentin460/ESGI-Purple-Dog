const fs = require('fs');
const path = require('path');
const { ItemImageRepository, ItemDocumentRepository } = require('../Repository/ItemMediaRepository');

class MediaService {
  /**
   * Traiter les images uploadées et les ajouter à la base de données
   */
  async handleImageUpload(itemId, files) {
    try {
      if (!files || files.length === 0) {
        throw new Error('Aucune image fournie');
      }

      const imageUrls = files.map((file, index) => ({
        url: `/uploads/images/${file.filename}`,
        alt_text: `Image ${index + 1}`,
        position: index,
        is_main: index === 0 // La première image est principale par défaut
      }));

      // Créer les enregistrements en base de données
      await ItemImageRepository.createMultiple(itemId, imageUrls);

      return {
        success: true,
        message: `${files.length} image(s) uploadée(s) avec succès`,
        images: imageUrls
      };
    } catch (error) {
      // Nettoyer les fichiers en cas d'erreur
      if (files) {
        files.forEach(file => {
          try {
            fs.unlinkSync(file.path);
          } catch (e) {
            console.error(`Erreur suppression fichier: ${file.path}`);
          }
        });
      }
      throw new Error(`Erreur upload images: ${error.message}`);
    }
  }

  /**
   * Traiter les documents uploadés et les ajouter à la base de données
   */
  async handleDocumentUpload(itemId, files) {
    try {
      if (!files || files.length === 0) {
        return {
          success: true,
          message: 'Aucun document fourni',
          documents: []
        };
      }

      const documentUrls = files.map(file => ({
        url: `/uploads/documents/${file.filename}`,
        filename: file.originalname,
        type: this.getDocumentType(file.originalname)
      }));

      // Créer les enregistrements en base de données
      await ItemDocumentRepository.createMultiple(itemId, documentUrls);

      return {
        success: true,
        message: `${files.length} document(s) uploadé(s) avec succès`,
        documents: documentUrls
      };
    } catch (error) {
      // Nettoyer les fichiers en cas d'erreur
      if (files) {
        files.forEach(file => {
          try {
            fs.unlinkSync(file.path);
          } catch (e) {
            console.error(`Erreur suppression fichier: ${file.path}`);
          }
        });
      }
      throw new Error(`Erreur upload documents: ${error.message}`);
    }
  }

  /**
   * Déterminer le type de document basé sur le nom
   */
  getDocumentType(filename) {
    const lower = filename.toLowerCase();
    if (lower.includes('certificat')) return 'CERTIFICATE';
    if (lower.includes('facture') || lower.includes('invoice')) return 'INVOICE';
    if (lower.includes('expertise')) return 'EXPERTISE';
    return 'OTHER';
  }

  /**
   * Récupérer toutes les images d'un item
   */
  async getItemImages(itemId) {
    try {
      return await ItemImageRepository.findByItemId(itemId);
    } catch (error) {
      throw new Error(`Erreur récupération images: ${error.message}`);
    }
  }

  /**
   * Récupérer tous les documents d'un item
   */
  async getItemDocuments(itemId) {
    try {
      return await ItemDocumentRepository.findByItemId(itemId);
    } catch (error) {
      throw new Error(`Erreur récupération documents: ${error.message}`);
    }
  }

  /**
   * Supprimer une image physiquement et en base de données
   */
  async deleteImage(imageId, itemId) {
    try {
      const image = await ItemImageRepository.findByItemId(itemId);
      const imageToDelete = image.find(img => img.id === parseInt(imageId));

      if (!imageToDelete) {
        throw new Error('Image non trouvée');
      }

      // Supprimer le fichier physique
      const filePath = path.join(__dirname, '../' + imageToDelete.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Supprimer en base de données
      await ItemImageRepository.deleteById(imageId);

      return {
        success: true,
        message: 'Image supprimée avec succès'
      };
    } catch (error) {
      throw new Error(`Erreur suppression image: ${error.message}`);
    }
  }

  /**
   * Supprimer un document physiquement et en base de données
   */
  async deleteDocument(documentId, itemId) {
    try {
      const documents = await ItemDocumentRepository.findByItemId(itemId);
      const docToDelete = documents.find(doc => doc.id === parseInt(documentId));

      if (!docToDelete) {
        throw new Error('Document non trouvé');
      }

      // Supprimer le fichier physique
      const filePath = path.join(__dirname, '../' + docToDelete.url);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Supprimer en base de données
      await ItemDocumentRepository.deleteById(documentId);

      return {
        success: true,
        message: 'Document supprimé avec succès'
      };
    } catch (error) {
      throw new Error(`Erreur suppression document: ${error.message}`);
    }
  }

  /**
   * Supprimer tous les médias d'un item
   */
  async deleteAllItemMedia(itemId) {
    try {
      const images = await ItemImageRepository.findByItemId(itemId);
      const documents = await ItemDocumentRepository.findByItemId(itemId);

      // Supprimer les fichiers physiques
      [...images, ...documents].forEach(media => {
        const filePath = path.join(__dirname, '../' + media.url);
        if (fs.existsSync(filePath)) {
          try {
            fs.unlinkSync(filePath);
          } catch (e) {
            console.error(`Erreur suppression fichier: ${filePath}`);
          }
        }
      });

      // Supprimer en base de données
      await ItemImageRepository.deleteByItemId(itemId);
      await ItemDocumentRepository.deleteByItemId(itemId);

      return {
        success: true,
        message: 'Tous les médias ont été supprimés'
      };
    } catch (error) {
      throw new Error(`Erreur suppression médias: ${error.message}`);
    }
  }
}

module.exports = new MediaService();
