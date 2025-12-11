const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class NotificationRepository {
  async create(data) {
    return await prisma.notification.create({
      data,
      include: {
        user: true
      }
    });
  }

  async findAll(options = {}) {
    return await prisma.notification.findMany({
      ...options,
      include: {
        user: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async findById(id) {
    return await prisma.notification.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true
      }
    });
  }

  async findByUserId(userId) {
    return await prisma.notification.findMany({
      where: { user_id: parseInt(userId) },
      orderBy: { created_at: 'desc' }
    });
  }

  async findUnreadByUserId(userId) {
    return await prisma.notification.findMany({
      where: {
        user_id: parseInt(userId),
        is_read: false
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async update(id, data) {
    return await prisma.notification.update({
      where: { id: parseInt(id) },
      data,
      include: {
        user: true
      }
    });
  }

  async markAsRead(id) {
    return await prisma.notification.update({
      where: { id: parseInt(id) },
      data: {
        is_read: true,
        read_at: new Date()
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
        is_read: true,
        read_at: new Date()
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

  async count(where = {}) {
    return await prisma.notification.count({ where });
  }
}

module.exports = new NotificationRepository();