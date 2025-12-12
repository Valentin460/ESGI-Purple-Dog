const express = require('express');
const router = express.Router();
const CategoryController = require('../Controllers/CategoryController');

// Routes spécifiques en premier
router.get('/active', CategoryController.getActiveCategories);
router.get('/slug/:slug', CategoryController.getCategoryBySlug);

// Routes CRUD de base
router.post('/', CategoryController.createCategory);
router.get('/', CategoryController.getAllCategories);
router.get('/:id', CategoryController.getCategoryById);
router.put('/:id', CategoryController.updateCategory);
router.patch('/:id/toggle-status', CategoryController.toggleCategoryStatus);
router.delete('/:id', CategoryController.deleteCategory);

module.exports = router;