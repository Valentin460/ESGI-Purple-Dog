const PublishingService = require('../Services/PublishingService');

const PublishingController = {
  /**
   * POST /items/publish
   * Publier un item complet avec images, documents et enchère
   */
  publishItem: async (req, res) => {
    try {
      // Parser itemData depuis le body (envoyé en JSON string)
      let itemData = req.body.itemData;
      
      // Si itemData est une chaîne JSON, la parser
      if (typeof itemData === 'string') {
        itemData = JSON.parse(itemData);
      }
      
      const auctionData = req.body.auctionData || null;
      
      // Récupérer les fichiers uploadés
      // Avec upload.fields(), les fichiers sont dans req.files[fieldname]
      let images = req.files?.photos || [];
      let documents = req.files?.documents || [];

      console.log('PublishingController - Fichiers reçus:', {
        images: images.length,
        documents: documents.length,
        itemData: itemData
      });

      const result = await PublishingService.publishItem(itemData, auctionData, images, documents);
      res.status(201).json(result);
    } catch (error) {
      console.error('Erreur publication:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  /**
   * GET /items/:id/details
   * Récupérer les détails complets d'un item publié
   */
  getItemDetails: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await PublishingService.getPublishedItemDetails(id);
      res.status(200).json(result);
    } catch (error) {
      console.error('Erreur récupération détails:', error);
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = PublishingController;
