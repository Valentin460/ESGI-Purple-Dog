const MediaService = require('../Services/MediaService');

const MediaController = {
  /**
   * POST /items/:id/upload-images
   * Uploader les images d'un item
   */
  uploadImages: async (req, res) => {
    try {
      const { id: itemId } = req.params;

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          error: 'Aucune image fournie'
        });
      }

      const result = await MediaService.handleImageUpload(itemId, req.files);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  /**
   * POST /items/:id/upload-documents
   * Uploader les documents d'un item
   */
  uploadDocuments: async (req, res) => {
    try {
      const { id: itemId } = req.params;

      if (!req.files || req.files.length === 0) {
        return res.status(200).json({
          success: true,
          message: 'Aucun document fourni',
          documents: []
        });
      }

      const result = await MediaService.handleDocumentUpload(itemId, req.files);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  /**
   * GET /items/:id/images
   * Récupérer les images d'un item
   */
  getImages: async (req, res) => {
    try {
      const { id: itemId } = req.params;
      const images = await MediaService.getItemImages(itemId);
      
      res.status(200).json({
        success: true,
        data: images
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  /**
   * GET /items/:id/documents
   * Récupérer les documents d'un item
   */
  getDocuments: async (req, res) => {
    try {
      const { id: itemId } = req.params;
      const documents = await MediaService.getItemDocuments(itemId);
      
      res.status(200).json({
        success: true,
        data: documents
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  /**
   * DELETE /items/:id/images/:imageId
   * Supprimer une image
   */
  deleteImage: async (req, res) => {
    try {
      const { id: itemId, imageId } = req.params;
      const result = await MediaService.deleteImage(imageId, itemId);
      
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  /**
   * DELETE /items/:id/documents/:documentId
   * Supprimer un document
   */
  deleteDocument: async (req, res) => {
    try {
      const { id: itemId, documentId } = req.params;
      const result = await MediaService.deleteDocument(documentId, itemId);
      
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = MediaController;
