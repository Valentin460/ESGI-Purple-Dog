const ItemRepository = require('../Repository/ItemRepository');

class ItemService {
  async createItem(itemData) {
    try {
      const { seller_id, name, description, desired_price, sale_type, category_ids } = itemData;

      // Validation
      if (!seller_id || !name || !description || !desired_price || !sale_type) {
        throw new Error('Les champs obligatoires sont manquants');
      }

      // Créer l'item
      const newItem = await ItemRepository.create({
        seller_id: parseInt(seller_id),
        name,
        description,
        desired_price: parseFloat(desired_price),
        sale_type,
        dimensions: itemData.dimensions,
        weight: itemData.weight ? parseFloat(itemData.weight) : null,
        ai_suggested_price: itemData.ai_suggested_price ? parseFloat(itemData.ai_suggested_price) : null,
        status: 'DRAFT',
        view_count: 0
      });

      // Ajouter les catégories
      if (category_ids && Array.isArray(category_ids) && category_ids.length > 0) {
        for (const categoryId of category_ids) {
          await ItemRepository.addCategory(newItem.id, categoryId);
        }
      }

      return {
        success: true,
        message: 'Objet créé avec succès',
        data: newItem
      };
    } catch (error) {
      throw new Error(`Erreur création item: ${error.message}`);
    }
  }

  async getAllItems(filters = {}, pagination = {}) {
    try {
      const result = await ItemRepository.findAll(filters, pagination);
      return {
        success: true,
        ...result
      };
    } catch (error) {
      throw new Error(`Erreur récupération items: ${error.message}`);
    }
  }

  async getSellerItems(sellerId, filters = {}) {
    try {
      const items = await ItemRepository.findBySellerId(sellerId, filters);
      return { 
        success: true, 
        data: items 
      };
    } catch (error) {
      throw new Error(`Erreur récupération items vendeur: ${error.message}`);
    }
  }

  async getItemById(itemId) {
    try {
      const item = await ItemRepository.findById(itemId);
      if (!item) {
        throw new Error('Item non trouvé');
      }

      // Incrémenter les vues
      await ItemRepository.update(itemId, { view_count: item.view_count + 1 });

      return { 
        success: true, 
        data: item 
      };
    } catch (error) {
      throw new Error(`Erreur récupération item: ${error.message}`);
    }
  }

  async updateItem(itemId, updateData) {
    try {
      const item = await ItemRepository.findById(itemId);
      if (!item) {
        throw new Error('Item non trouvé');
      }

      const editableStatuses = ['DRAFT', 'PENDING_VALIDATION'];
      if (!editableStatuses.includes(item.status)) {
        throw new Error('Cet objet ne peut pas être modifié');
      }

      const updatedItem = await ItemRepository.update(itemId, updateData);
      return {
        success: true,
        message: 'Objet mis à jour',
        data: updatedItem
      };
    } catch (error) {
      throw new Error(`Erreur mise à jour item: ${error.message}`);
    }
  }

  async publishItem(itemId) {
    try {
      const item = await ItemRepository.findById(itemId);
      if (!item) {
        throw new Error('Item non trouvé');
      }

      if (item.status !== 'DRAFT') {
        throw new Error('Seuls les brouillons peuvent être publiés');
      }

      const updatedItem = await ItemRepository.update(itemId, {
        status: 'PUBLISHED',
        published_at: new Date()
      });

      return {
        success: true,
        message: 'Objet publié',
        data: updatedItem
      };
    } catch (error) {
      throw new Error(`Erreur publication item: ${error.message}`);
    }
  }

  async searchItems(query, filters = {}) {
    try {
      if (!query || query.trim() === '') {
        throw new Error('Requête de recherche requise');
      }

      const result = await ItemRepository.search(query, filters);
      return {
        success: true,
        ...result
      };
    } catch (error) {
      throw new Error(`Erreur recherche items: ${error.message}`);
    }
  }

  async addCategoryToItem(itemId, categoryId) {
    try {
      await ItemRepository.addCategory(itemId, categoryId);
      return { 
        success: true, 
        message: 'Catégorie ajoutée' 
      };
    } catch (error) {
      throw new Error(`Erreur ajout catégorie: ${error.message}`);
    }
  }

  async removeCategoryFromItem(itemId, categoryId) {
    try {
      await ItemRepository.removeCategory(itemId, categoryId);
      return { 
        success: true, 
        message: 'Catégorie retirée' 
      };
    } catch (error) {
      throw new Error(`Erreur retrait catégorie: ${error.message}`);
    }
  }

  async deleteItem(itemId) {
    try {
      const item = await ItemRepository.findById(itemId);
      if (!item) {
        throw new Error('Item non trouvé');
      }

      const deletableStatuses = ['DRAFT', 'PENDING_VALIDATION', 'CANCELLED'];
      if (!deletableStatuses.includes(item.status)) {
        throw new Error('Cet objet ne peut pas être supprimé');
      }

      await ItemRepository.delete(itemId);
      return { 
        success: true, 
        message: 'Objet supprimé' 
      };
    } catch (error) {
      throw new Error(`Erreur suppression item: ${error.message}`);
    }
  }

  async markItemAsSold(itemId) {
    try {
      const item = await ItemRepository.findById(itemId);
      if (!item) {
        throw new Error('Item non trouvé');
      }

      const updatedItem = await ItemRepository.update(itemId, {
        status: 'SOLD',
        sold_at: new Date()
      });

      return {
        success: true,
        message: 'Objet marqué comme vendu',
        data: updatedItem
      };
    } catch (error) {
      throw new Error(`Erreur marquage vente: ${error.message}`);
    }
  }
}

module.exports = new ItemService();