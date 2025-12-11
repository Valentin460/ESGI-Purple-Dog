const express = require('express');
const router = express.Router();
const ItemController = require('../Controllers/ItemController');


router.get('/all', ItemController.getAllItemsAdmin);  // TOUS les items (admin)
// GET - Recherche globale (avant les routes paramétriques)
router.get('/search', ItemController.searchItems);

// GET - Tous les items
router.get('/', ItemController.getAllItems);

// POST - Créer un item
router.post('/', ItemController.createItem);

// GET - Items d'un vendeur
router.get('/seller/:seller_id', ItemController.getSellerItems);

// GET - Un item spécifique
router.get('/:id', ItemController.getItemById);

// PUT - Mettre à jour
router.put('/:id', ItemController.updateItem);

// POST - Publier
router.post('/:id/publish', ItemController.publishItem);

// POST - Ajouter catégorie
router.post('/:id/categories', ItemController.addCategoryToItem);

// DELETE - Retirer catégorie
router.delete('/:id/categories/:category_id', ItemController.removeCategoryFromItem);

// POST - Marquer comme vendu
router.post('/:id/sold', ItemController.markItemAsSold);

// DELETE - Supprimer
router.delete('/:id', ItemController.deleteItem);

module.exports = router;