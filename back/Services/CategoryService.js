const CategoryRepository = require('../Repository/CategoryRepository');

// Générer un slug à partir d'un texte
function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

class CategoryService {
  async createCategory(categoryData) {
    const { name, description } = categoryData;

    if (!name) {
      throw new Error('Le nom est obligatoire');
    }

    try {
      // Générer le slug automatiquement
      const slug = categoryData.slug || generateSlug(name);

      // Vérifier si le slug existe déjà
      const existingCategory = await CategoryRepository.findBySlug(slug);
      if (existingCategory) {
        throw new Error('Cette catégorie existe déjà');
      }

      const newCategory = await CategoryRepository.create({
        name,
        slug,
        description: description || null,
        is_active: categoryData.is_active !== undefined ? categoryData.is_active : true
      });

      return {
        success: true,
        message: 'Catégorie créée avec succès',
        data: newCategory
      };
    } catch (error) {
      throw new Error(`Erreur création catégorie: ${error.message}`);
    }
  }

  async getAllCategories(pagination = {}) {
    try {
      const { page = 1, limit = 20 } = pagination;
      const skip = (page - 1) * parseInt(limit);

      const categories = await CategoryRepository.findAll({ skip, take: parseInt(limit) });
      const total = await CategoryRepository.count();

      return {
        success: true,
        data: categories,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      };
    } catch (error) {
      throw new Error(`Erreur récupération catégories: ${error.message}`);
    }
  }

  async getActiveCategories() {
    try {
      const categories = await CategoryRepository.findActive();

      return {
        success: true,
        data: categories,
        count: categories.length
      };
    } catch (error) {
      throw new Error(`Erreur récupération catégories actives: ${error.message}`);
    }
  }

  async getCategoryById(categoryId) {
    try {
      const category = await CategoryRepository.findById(categoryId);
      if (!category) {
        throw new Error('Catégorie non trouvée');
      }

      return {
        success: true,
        data: category
      };
    } catch (error) {
      throw new Error(`Erreur récupération catégorie: ${error.message}`);
    }
  }

  async getCategoryBySlug(slug) {
    try {
      const category = await CategoryRepository.findBySlug(slug);
      if (!category) {
        throw new Error('Catégorie non trouvée');
      }

      return {
        success: true,
        data: category
      };
    } catch (error) {
      throw new Error(`Erreur récupération catégorie: ${error.message}`);
    }
  }

  async updateCategory(categoryId, updateData) {
    try {
      const category = await CategoryRepository.findById(categoryId);
      if (!category) {
        throw new Error('Catégorie non trouvée');
      }

      // Si le slug change, vérifier qu'il n'existe pas déjà
      if (updateData.slug && updateData.slug !== category.slug) {
        const existingSlug = await CategoryRepository.findBySlug(updateData.slug);
        if (existingSlug) {
          throw new Error('Ce slug est déjà utilisé');
        }
      }

      const updatedCategory = await CategoryRepository.update(categoryId, updateData);

      return {
        success: true,
        message: 'Catégorie mise à jour',
        data: updatedCategory
      };
    } catch (error) {
      throw new Error(`Erreur mise à jour catégorie: ${error.message}`);
    }
  }

  async toggleCategoryStatus(categoryId) {
    try {
      const category = await CategoryRepository.findById(categoryId);
      if (!category) {
        throw new Error('Catégorie non trouvée');
      }

      const updatedCategory = await CategoryRepository.update(categoryId, {
        is_active: !category.is_active
      });

      return {
        success: true,
        message: `Catégorie ${updatedCategory.is_active ? 'activée' : 'désactivée'}`,
        data: updatedCategory
      };
    } catch (error) {
      throw new Error(`Erreur modification statut: ${error.message}`);
    }
  }

  async deleteCategory(categoryId) {
    try {
      const category = await CategoryRepository.findById(categoryId);
      if (!category) {
        throw new Error('Catégorie non trouvée');
      }

      await CategoryRepository.delete(categoryId);

      return {
        success: true,
        message: 'Catégorie supprimée'
      };
    } catch (error) {
      throw new Error(`Erreur suppression catégorie: ${error.message}`);
    }
  }
}

module.exports = new CategoryService();