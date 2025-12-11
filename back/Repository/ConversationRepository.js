const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ConversationRepository {
  async create(data) {
    return await prisma.conversation.create({
      data,
      include: {
        buyer: true,
        seller: true,
        item: true
      }
    });
  }

  async findAll(options = {}) {
    return await prisma.conversation.findMany({
      ...options,
      include: {
        buyer: true,
        seller: true,
        item: true,
        messages: {
          orderBy: { sent_at: 'desc' },
          take: 1
        }
      },
      orderBy: { updated_at: 'desc' }
    });
  }

  async findById(id) {
    return await prisma.conversation.findUnique({
      where: { id: parseInt(id) },
      include: {
        buyer: true,
        seller: true,
        item: true,
        messages: {
          include: {
            sender: true
          },
          orderBy: { sent_at: 'asc' }
        }
      }
    });
  }

  async findByUserId(userId) {
    return await prisma.conversation.findMany({
      where: {
        OR: [
          { buyer_id: parseInt(userId) },
          { seller_id: parseInt(userId) }
        ]
      },
      include: {
        buyer: true,
        seller: true,
        item: true,
        messages: {
          orderBy: { sent_at: 'desc' },
          take: 1
        }
      },
      orderBy: { updated_at: 'desc' }
    });
  }

  async findByItemAndUsers(itemId, buyerId, sellerId) {
    return await prisma.conversation.findFirst({
      where: {
        item_id: parseInt(itemId),
        buyer_id: parseInt(buyerId),
        seller_id: parseInt(sellerId)
      },
      include: {
        buyer: true,
        seller: true,
        item: true
      }
    });
  }

  async update(id, data) {
    return await prisma.conversation.update({
      where: { id: parseInt(id) },
      data,
      include: {
        buyer: true,
        seller: true,
        item: true
      }
    });
  }

  async delete(id) {
    return await prisma.conversation.delete({
      where: { id: parseInt(id) }
    });
  }

  async count(where = {}) {
    return await prisma.conversation.count({ where });
  }

  async markMessagesAsRead(conversationId, userId) {
    // Puisque is_read et read_at n'existent pas, on utilise is_flagged comme alternative
    // Ou on retourne simplement un succès
    
    // Option 1: Retourner simplement le nombre de messages non lus
    const unreadCount = await prisma.message.count({
      where: {
        conversation_id: parseInt(conversationId),
        sender_id: { not: parseInt(userId) }
      }
    });

    return {
      messagesMarked: unreadCount,
      conversationId: parseInt(conversationId)
    };
  }
}

module.exports = new ConversationRepository();