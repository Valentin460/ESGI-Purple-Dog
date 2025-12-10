const ItemService = require('../Services/ItemService');

const ItemController = {
  // POST /items - Créer un objet
  createItem: async (req, res) => {
    try {
      const result = await ItemService.createItem(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // GET /items - Récupérer tous les objets publiés
  getAllItems: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await ItemService.getAllItems({}, { page: parseInt(page), limit: parseInt(limit) });
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // GET /items/seller/:seller_id - Récupérer les objets d'un vendeur
  getSellerItems: async (req, res) => {
    try {
      const { seller_id } = req.params;
      const result = await ItemService.getSellerItems(seller_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // GET /items/:id - Récupérer un objet par ID
  getItemById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await ItemService.getItemById(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  },

  // PUT /items/:id - Mettre à jour
  updateItem: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await ItemService.updateItem(id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // POST /items/:id/publish - Publier
  publishItem: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await ItemService.publishItem(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // GET /items/search - Rechercher
  searchItems: async (req, res) => {
    try {
      const { query, page = 1, limit = 10 } = req.query;
      const result = await ItemService.searchItems(query, { page: parseInt(page), limit: parseInt(limit) });
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // POST /items/:id/categories - Ajouter catégorie
  addCategoryToItem: async (req, res) => {
    try {
      const { id } = req.params;
      const { category_id } = req.body;
      const result = await ItemService.addCategoryToItem(id, category_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // DELETE /items/:id/categories/:category_id - Retirer catégorie
  removeCategoryFromItem: async (req, res) => {
    try {
      const { id, category_id } = req.params;
      const result = await ItemService.removeCategoryFromItem(id, category_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // DELETE /items/:id - Supprimer
  deleteItem: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await ItemService.deleteItem(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // POST /items/:id/sold - Marquer comme vendu
  markItemAsSold: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await ItemService.markItemAsSold(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = ItemController;