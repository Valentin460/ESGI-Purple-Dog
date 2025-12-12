const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class NotificationRepository {
  async create(data) {
    const { 
      user_id, 
      type, 
      title, 
      content, 
      related_item_id, 
      related_auction_id, 
      related_transaction_id,
      is_email_sent 
    } = data;
    
    return await prisma.notification.create({
      data: {
        user_id: parseInt(user_id),
        type,
        title,
        content,
        related_item_id: related_item_id ? parseInt(related_item_id) : null,
        related_auction_id: related_auction_id ? parseInt(related_auction_id) : null,
        related_transaction_id: related_transaction_id ? parseInt(related_transaction_id) : null,
        is_read: false,
        is_email_sent: is_email_sent || false
      },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        },
        item: true,
        auction: true,
        transaction: true
      }
    });
  }

  async findAll(options = {}) {
    const { skip = 0, take = 10, where = {} } = options;
    return await prisma.notification.findMany({
      skip: parseInt(skip),
      take: parseInt(take),
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        },
        item: true,
        auction: true,
        transaction: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async count(where = {}) {
    return await prisma.notification.count({ where });
  }

  async findById(id) {
    return await prisma.notification.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        },
        item: true,
        auction: true,
        transaction: true
      }
    });
  }

  async findByUserId(userId) {
    return await prisma.notification.findMany({
      where: { user_id: parseInt(userId) },
      include: {
        item: true,
        auction: true,
        transaction: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async findUnreadByUserId(userId) {
    return await prisma.notification.findMany({
      where: {
        user_id: parseInt(userId),
        is_read: false
      },
      include: {
        item: true,
        auction: true,
        transaction: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async update(id, data) {
    return await prisma.notification.update({
      where: { id: parseInt(id) },
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        }
      }
    });
  }

  async markAsRead(id) {
    return await prisma.notification.update({
      where: { id: parseInt(id) },
      data: {
        is_read: true
      }
    });
  }

  async markAllAsRead(userId) {
    return await prisma.notification.updateMany({
      where: {
        user_id: parseInt(userId),
        is_read: false
      },
      data: {
        is_read: true
      }
    });
  }

  async delete(id) {
    return await prisma.notification.delete({
      where: { id: parseInt(id) }
    });
  }

  async deleteAllByUserId(userId) {
    return await prisma.notification.deleteMany({
      where: { user_id: parseInt(userId) }
    });
  }
}

module.exports = new NotificationRepository();