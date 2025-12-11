const CategoryService = require('../Services/CategoryService');

const CategoryController = {
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
  },

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
  },

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
  },

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
  },

  // GET /categories/root - Catégories racines
  getRootCategories: async (req, res) => {
    try {
      const result = await CategoryService.getRootCategories();
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // GET /categories/tree - Arbre des catégories
  getCategoryTree: async (req, res) => {
    try {
      const result = await CategoryService.getCategoryTree();
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // GET /categories/:id/children - Sous-catégories
  getChildrenCategories: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await CategoryService.getChildrenCategories(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // GET /categories/slug/:slug - Par slug
  getCategoryBySlug: async (req, res) => {
    try {
      const { slug } = req.params;
      const result = await CategoryService.getCategoryBySlug(slug);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  },

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
  },

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
  },

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
};

module.exports = CategoryController;