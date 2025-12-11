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
    const { skip = 0, take = 10 } = options;
    return await prisma.message.findMany({
      skip: parseInt(skip),
      take: parseInt(take),
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
      },
      orderBy: { sent_at: 'desc' }
    });
  }

  async count() {
    return await prisma.message.count();
  }

  async findById(id) {
    return await prisma.message.findUnique({
      where: { id: parseInt(id) },
      include: {
        sender: {
          select: {
            id: true,
            email: true
          }
        },
        conversation: true
      }
    });
  }

  async findByUserId(userId) {
    return await prisma.message.findMany({
      where: {
        sender_id: parseInt(userId)
      },
      include: {
        conversation: {
          include: {
            item: true
          }
        }
      },
      orderBy: { sent_at: 'desc' }
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

  async findUnreadByConversationId(conversationId) {
    // Note: Si le champ is_read n'existe pas, on retourne tous les messages récents
    return await prisma.message.findMany({
      where: {
        conversation_id: parseInt(conversationId)
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true
          }
        }
      },
      orderBy: { sent_at: 'desc' },
      take: 50  // Limite aux 50 derniers messages
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

  async markAsReadById(messageId) {
    return await prisma.message.update({
      where: { id: parseInt(messageId) },
      data: {
        updated_at: new Date()
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true
          }
        }
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

  async markAllAsReadByConversation(conversationId, userId = null) {
    const where = {
      conversation_id: parseInt(conversationId)
    };

    // Si userId fourni, ne marquer que les messages des autres utilisateurs
    if (userId) {
      where.sender_id = { not: parseInt(userId) };
    }

    return await prisma.message.updateMany({
      where,
      data: {
        updated_at: new Date()
      }
    });
  }
}

module.exports = new MessageRepository();