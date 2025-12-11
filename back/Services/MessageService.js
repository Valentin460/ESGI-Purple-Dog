const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const MessageRepository = require('../Repository/MessageRepository');
const ConversationRepository = require('../Repository/ConversationRepository');

class MessageService {
  async sendMessage(messageData) {
    const { conversation_id, sender_id, content, item_id } = messageData;

    if (!sender_id || !content) {
      throw new Error('sender_id et content sont obligatoires');
    }

    if (!conversation_id && !item_id) {
      throw new Error('conversation_id ou item_id est obligatoire');
    }

    try {
      const result = await prisma.$transaction(async (tx) => {
        let conversation;
        let convId = conversation_id ? parseInt(conversation_id) : null;

        // Si pas de conversation_id, chercher ou créer une conversation
        if (!convId) {
          // Récupérer l'item pour trouver le propriétaire (seller)
          const item = await tx.item.findUnique({
            where: { id: parseInt(item_id) }
          });

          if (!item) {
            throw new Error('Item non trouvé');
          }

          const sellerId = item.seller_id;
          const buyerId = parseInt(sender_id);

          // Vérifier que l'acheteur n'est pas le vendeur
          if (buyerId === sellerId) {
            throw new Error('Vous ne pouvez pas vous envoyer un message à vous-même');
          }

          // Chercher une conversation existante entre ces utilisateurs pour cet item
          conversation = await tx.conversation.findFirst({
            where: {
              item_id: parseInt(item_id),
              OR: [
                {
                  buyer_id: buyerId,
                  seller_id: sellerId
                },
                {
                  buyer_id: sellerId,
                  seller_id: buyerId
                }
              ]
            }
          });

          // Si pas de conversation, en créer une
          if (!conversation) {
            conversation = await tx.conversation.create({
              data: {
                item_id: parseInt(item_id),
                buyer_id: buyerId,
                seller_id: sellerId,
                status: 'ACTIVE'
              }
            });
          }

          convId = conversation.id;
        } else {
          // Récupérer la conversation existante
          conversation = await tx.conversation.findUnique({
            where: { id: convId }
          });

          if (!conversation) {
            throw new Error('Conversation non trouvée');
          }
        }

        // Vérifications sur la conversation
        if (conversation.status === 'CLOSED') {
          throw new Error('Cette conversation est fermée');
        }

        if (conversation.status === 'BLOCKED') {
          throw new Error('Cette conversation est bloquée');
        }

        const senderId = parseInt(sender_id);
        if (senderId !== conversation.buyer_id && senderId !== conversation.seller_id) {
          throw new Error('Vous n\'êtes pas participant de cette conversation');
        }

        // Créer le message
        const newMessage = await tx.message.create({
          data: {
            conversation_id: convId,
            sender_id: senderId,
            content
          },
          include: {
            sender: {
              select: {
                id: true,
                email: true
              }
            },
            conversation: {
              include: {
                item: true
              }
            }
          }
        });

        // Mettre à jour la conversation
        await tx.conversation.update({
          where: { id: convId },
          data: { updated_at: new Date() }
        });

        return newMessage;
      });

      return {
        success: true,
        message: 'Message envoyé',
        data: result
      };
    } catch (error) {
      throw new Error(`Erreur envoi message: ${error.message}`);
    }
  }

  async getConversationMessages(conversationId) {
    try {
      const messages = await MessageRepository.findByConversationId(conversationId);

      return {
        success: true,
        data: messages
      };
    } catch (error) {
      throw new Error(`Erreur récupération messages: ${error.message}`);
    }
  }

  async getUnreadMessages(userId) {
    try {
      const messages = await MessageRepository.findUnreadByUserId(userId);

      return {
        success: true,
        data: messages,
        unread_count: messages.length
      };
    } catch (error) {
      throw new Error(`Erreur récupération messages non lus: ${error.message}`);
    }
  }

  async markMessagesAsRead(conversationId, userId) {
    try {
      await MessageRepository.markAsRead(conversationId, userId);

      return {
        success: true,
        message: 'Messages marqués comme lus'
      };
    } catch (error) {
      throw new Error(`Erreur marquage messages: ${error.message}`);
    }
  }

  async markMessageAsRead(messageId) {
    try {
      const message = await MessageRepository.findById(parseInt(messageId));
      
      if (!message) {
        throw new Error('Message non trouvé');
      }

      const updatedMessage = await MessageRepository.markAsReadById(parseInt(messageId));

      return {
        success: true,
        message: 'Message marqué comme lu',
        data: updatedMessage
      };
    } catch (error) {
      throw new Error(`Erreur marquage message: ${error.message}`);
    }
  }

  async deleteMessage(messageId) {
    try {
      const message = await MessageRepository.findById(messageId);
      if (!message) {
        throw new Error('Message non trouvé');
      }

      await MessageRepository.delete(messageId);

      return {
        success: true,
        message: 'Message supprimé'
      };
    } catch (error) {
      throw new Error(`Erreur suppression message: ${error.message}`);
    }
  }

  async getAllMessages(pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const skip = (page - 1) * limit;

      const [messages, total] = await Promise.all([
        MessageRepository.findAll({ skip, take: limit }),
        MessageRepository.count()
      ]);

      return {
        success: true,
        data: messages,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Erreur récupération messages: ${error.message}`);
    }
  }

  async getMessageById(id) {
    try {
      const message = await MessageRepository.findById(parseInt(id));
      if (!message) {
        throw new Error('Message non trouvé');
      }
      return {
        success: true,
        data: message
      };
    } catch (error) {
      throw new Error(`Erreur récupération message: ${error.message}`);
    }
  }

  async getUserMessages(userId) {
    try {
      const messages = await MessageRepository.findByUserId(parseInt(userId));
      return {
        success: true,
        data: messages,
        count: messages.length
      };
    } catch (error) {
      throw new Error(`Erreur récupération messages utilisateur: ${error.message}`);
    }
  }

  async getConversationUnreadMessages(conversationId) {
    try {
      const messages = await MessageRepository.findUnreadByConversationId(parseInt(conversationId));
      return {
        success: true,
        data: messages,
        count: messages.length
      };
    } catch (error) {
      throw new Error(`Erreur récupération messages non lus: ${error.message}`);
    }
  }

  async markAllMessagesAsRead(conversationId, userId) {
    try {
      const result = await MessageRepository.markAllAsReadByConversation(
        parseInt(conversationId),
        userId ? parseInt(userId) : null
      );

      return {
        success: true,
        message: 'Tous les messages ont été marqués comme lus',
        data: result
      };
    } catch (error) {
      throw new Error(`Erreur marquage messages: ${error.message}`);
    }
  }
}

module.exports = new MessageService();