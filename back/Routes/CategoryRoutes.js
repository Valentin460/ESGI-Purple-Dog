const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryController');

router.post('/', CategoryController.createCategory);
router.get('/', CategoryController.getAllCategories);
router.get('/active', CategoryController.getActiveCategories);
router.get('/:id', CategoryController.getCategoryById);
router.get('/slug/:slug', CategoryController.getCategoryBySlug);
router.put('/:id', CategoryController.updateCategory);
router.patch('/:id/toggle-status', CategoryController.toggleCategoryStatus);
router.delete('/:id', CategoryController.deleteCategory);

module.exports = router;