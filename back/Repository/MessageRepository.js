const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class MessageRepository {
  async create(data) {
    return await prisma.message.create({
      data,
      include: {
        sender: true,
        conversation: true
      }
    });
  }

  async findAll(options = {}) {
    return await prisma.message.findMany({
      ...options,
      include: {
        sender: true,
        conversation: true
      },
      orderBy: { sent_at: 'desc' }
    });
  }

  async findById(id) {
    return await prisma.message.findUnique({
      where: { id: parseInt(id) },
      include: {
        sender: true,
        conversation: {
          include: {
            buyer: true,
            seller: true,
            item: true
          }
        }
      }
    });
  }

  async findByConversationId(conversationId) {
    return await prisma.message.findMany({
      where: { conversation_id: parseInt(conversationId) },
      include: {
        sender: true
      },
      orderBy: { sent_at: 'asc' }
    });
  }

  async findUnreadByUserId(userId) {
    return await prisma.message.findMany({
      where: {
        is_read: false,
        conversation: {
          OR: [
            { buyer_id: parseInt(userId) },
            { seller_id: parseInt(userId) }
          ]
        },
        sender_id: {
          not: parseInt(userId)
        }
      },
      include: {
        sender: true,
        conversation: true
      },
      orderBy: { sent_at: 'desc' }
    });
  }

  async update(id, data) {
    return await prisma.message.update({
      where: { id: parseInt(id) },
      data,
      include: {
        sender: true,
        conversation: true
      }
    });
  }

  async markAsRead(conversationId, userId) {
    return await prisma.message.updateMany({
      where: {
        conversation_id: parseInt(conversationId),
        sender_id: { not: parseInt(userId) },
        is_read: false
      },
      data: {
        is_read: true,
        read_at: new Date()
      }
    });
  }

  async delete(id) {
    return await prisma.message.delete({
      where: { id: parseInt(id) }
    });
  }

  async count(where = {}) {
    return await prisma.message.count({ where });
  }
}

module.exports = new MessageRepository();