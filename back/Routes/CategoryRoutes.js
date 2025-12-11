const express = require('express');
const router = express.Router();
const CategoryController = require('../Controllers/CategoryController');

// 🔑 ROUTES SPÉCIFIQUES D'ABORD (avant /:id)
router.get('/root', CategoryController.getRootCategories);
router.get('/tree', CategoryController.getCategoryTree);
router.get('/active', CategoryController.getActiveCategories);
router.get('/slug/:slug', CategoryController.getCategoryBySlug);

// ROUTES CRUD DE BASE
router.post('/', CategoryController.createCategory);
router.get('/', CategoryController.getAllCategories);

// 🔑 ROUTES PARAMÉTRIQUES À LA FIN
router.get('/:id', CategoryController.getCategoryById);
router.get('/:id/children', CategoryController.getChildrenCategories);
router.put('/:id', CategoryController.updateCategory);
router.patch('/:id/toggle-status', CategoryController.toggleCategoryStatus);
router.delete('/:id', CategoryController.deleteCategory);

module.exports = router;