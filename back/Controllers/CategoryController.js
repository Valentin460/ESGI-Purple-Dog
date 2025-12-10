const CategoryService = require('../services/CategoryService');

class CategoryController {
  async createCategory(req, res) {
    try {
      const result = await CategoryService.createCategory(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getAllCategories(req, res) {
    try {
      const { page, limit } = req.query;
      const result = await CategoryService.getAllCategories({ page, limit });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getActiveCategories(req, res) {
    try {
      const result = await CategoryService.getActiveCategories();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getCategoryById(req, res) {
    try {
      const result = await CategoryService.getCategoryById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  async getCategoryBySlug(req, res) {
    try {
      const result = await CategoryService.getCategoryBySlug(req.params.slug);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateCategory(req, res) {
    try {
      const result = await CategoryService.updateCategory(req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async toggleCategoryStatus(req, res) {
    try {
      const result = await CategoryService.toggleCategoryStatus(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteCategory(req, res) {
    try {
      const result = await CategoryService.deleteCategory(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new CategoryController();