const ConversationRepository = require('../Repository/ConversationRepository');
const ItemRepository = require('../Repository/ItemRepository');

class ConversationService {
  async createConversation(conversationData) {
    const { item_id, buyer_id, seller_id } = conversationData;

    if (!item_id || !buyer_id || !seller_id) {
      throw new Error('item_id, buyer_id et seller_id sont obligatoires');
    }

    try {
      const item = await ItemRepository.findById(item_id);
      if (!item) {
        throw new Error('Item non trouvé');
      }

      if (parseInt(buyer_id) === parseInt(seller_id)) {
        throw new Error('L\'acheteur et le vendeur ne peuvent pas être la même personne');
      }

      const existingConversation = await ConversationRepository.findByItemAndUsers(
        item_id,
        buyer_id,
        seller_id
      );

      if (existingConversation) {
        return {
          success: true,
          message: 'Conversation existante récupérée',
          data: existingConversation
        };
      }

      const newConversation = await ConversationRepository.create({
        item_id: parseInt(item_id),
        buyer_id: parseInt(buyer_id),
        seller_id: parseInt(seller_id),
        status: 'ACTIVE'
      });

      return {
        success: true,
        message: 'Conversation créée avec succès',
        data: newConversation
      };
    } catch (error) {
      throw new Error(`Erreur création conversation: ${error.message}`);
    }
  }

  async getAllConversations(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const skip = (page - 1) * limit;

      const where = {};
      if (filters.status) where.status = filters.status;
      if (filters.user_id) {
        where.OR = [
          { buyer_id: parseInt(filters.user_id) },
          { seller_id: parseInt(filters.user_id) }
        ];
      }

      const conversations = await ConversationRepository.findAll({ skip, take: limit, where });
      const total = await ConversationRepository.count(where);

      return {
        success: true,
        data: conversations,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Erreur récupération conversations: ${error.message}`);
    }
  }

  async getConversationById(conversationId) {
    try {
      const conversation = await ConversationRepository.findById(conversationId);
      if (!conversation) {
        throw new Error('Conversation non trouvée');
      }

      return {
        success: true,
        data: conversation
      };
    } catch (error) {
      throw new Error(`Erreur récupération conversation: ${error.message}`);
    }
  }

  async getUserConversations(userId) {
    try {
      const conversations = await ConversationRepository.findByUserId(userId);

      return {
        success: true,
        data: conversations
      };
    } catch (error) {
      throw new Error(`Erreur récupération conversations utilisateur: ${error.message}`);
    }
  }

  async updateConversationStatus(conversationId, status) {
    try {
      const conversation = await ConversationRepository.findById(conversationId);
      if (!conversation) {
        throw new Error('Conversation non trouvée');
      }

      const validStatuses = ['ACTIVE', 'CLOSED', 'BLOCKED'];
      if (!validStatuses.includes(status)) {
        throw new Error(`Statut invalide. Valeurs autorisées: ${validStatuses.join(', ')}`);
      }

      const updatedConversation = await ConversationRepository.update(conversationId, {
        status
      });

      return {
        success: true,
        message: 'Statut de la conversation mis à jour',
        data: updatedConversation
      };
    } catch (error) {
      throw new Error(`Erreur mise à jour conversation: ${error.message}`);
    }
  }

  async closeConversation(conversationId) {
    try {
      const conversation = await ConversationRepository.findById(conversationId);
      if (!conversation) {
        throw new Error('Conversation non trouvée');
      }

      const updatedConversation = await ConversationRepository.update(conversationId, {
        status: 'CLOSED'
      });

      return {
        success: true,
        message: 'Conversation fermée',
        data: updatedConversation
      };
    } catch (error) {
      throw new Error(`Erreur fermeture conversation: ${error.message}`);
    }
  }

  async deleteConversation(conversationId) {
    try {
      const conversation = await ConversationRepository.findById(conversationId);
      if (!conversation) {
        throw new Error('Conversation non trouvée');
      }

      await ConversationRepository.delete(conversationId);

      return {
        success: true,
        message: 'Conversation supprimée'
      };
    } catch (error) {
      throw new Error(`Erreur suppression conversation: ${error.message}`);
    }
  }
}

module.exports = new ConversationService();