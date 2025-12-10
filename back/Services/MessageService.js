const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const MessageRepository = require('../Repository/MessageRepository');
const ConversationRepository = require('../Repository/ConversationRepository');

class MessageService {
  async sendMessage(messageData) {
    const { conversation_id, sender_id, content } = messageData;

    if (!conversation_id || !sender_id || !content) {
      throw new Error('conversation_id, sender_id et content sont obligatoires');
    }

    try {
      const result = await prisma.$transaction(async (tx) => {
        const conversation = await tx.conversation.findUnique({
          where: { id: parseInt(conversation_id) }
        });

        if (!conversation) {
          throw new Error('Conversation non trouvée');
        }

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

        const newMessage = await tx.message.create({
          data: {
            conversation_id: parseInt(conversation_id),
            sender_id: senderId,
            content,
            is_read: false
          },
          include: {
            sender: true,
            conversation: true
          }
        });

        // Mettre à jour la conversation
        await tx.conversation.update({
          where: { id: parseInt(conversation_id) },
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
}

module.exports = new MessageService();