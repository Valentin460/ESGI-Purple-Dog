const CategoryRepository = require('../Repository/CategoryRepository');

// Fonction utilitaire pour générer un slug
function generateSlug(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Retire les accents
    .replace(/[^a-z0-9]+/g, '-')     // Remplace les caractères spéciaux par des tirets
    .replace(/^-+|-+$/g, '');        // Retire les tirets au début et à la fin
}

class CategoryService {

  async createCategory(categoryData) {
    const { name, description } = categoryData;

    if (!name) {
      throw new Error('name est obligatoire');
    }

    // Générer le slug automatiquement si non fourni
    const slug = categoryData.slug || generateSlug(name);

    try {
      const existingCategory = await CategoryRepository.findBySlug(slug);
      if (existingCategory) {
        throw new Error('Ce slug est déjà utilisé');
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
      const { page = 1, limit = 10 } = pagination;
      const skip = (page - 1) * limit;

      const categories = await CategoryRepository.findAll({ skip, take: limit });
      const total = await CategoryRepository.count();

      return {
        success: true,
        data: categories,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
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
        data: categories
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
      throw new Error(`Erreur modification statut catégorie: ${error.message}`);
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

  async getRootCategories() {
    try {
      const categories = await CategoryRepository.findRootCategories();
      return {
        success: true,
        data: categories
      };
    } catch (error) {
      throw new Error(`Erreur récupération catégories racines: ${error.message}`);
    }
  }

  async getChildrenCategories(parentId) {
    try {
      const categories = await CategoryRepository.findByParentId(parentId);
      return {
        success: true,
        data: categories
      };
    } catch (error) {
      throw new Error(`Erreur récupération sous-catégories: ${error.message}`);
    }
  }

  async getCategoryTree() {
    try {
      const categories = await CategoryRepository.findCategoryTree();
      return {
        success: true,
        data: categories
      };
    } catch (error) {
      throw new Error(`Erreur récupération arbre catégories: ${error.message}`);
    }
  }
}

module.exports = new CategoryService();