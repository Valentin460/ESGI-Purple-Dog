const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class SubscriptionRepository {
  async create(data) {
    return await prisma.subscription.create({
      data,
      include: {
        user: true,
        plan: true
      }
    });
  }

  async findAll(options = {}) {
    return await prisma.subscription.findMany({
      ...options,
      include: {
        user: true,
        plan: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async findById(id) {
    return await prisma.subscription.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: true,
        plan: true
      }
    });
  }

  async findByUserId(userId) {
    return await prisma.subscription.findMany({
      where: { user_id: parseInt(userId) },
      include: {
        plan: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async findActiveByUserId(userId) {
    return await prisma.subscription.findFirst({
      where: {
        user_id: parseInt(userId),
        status: 'ACTIVE',
        end_date: {
          gte: new Date()
        }
      },
      include: {
        plan: true
      }
    });
  }

  async findByStatus(status) {
    return await prisma.subscription.findMany({
      where: { status },
      include: {
        user: true,
        plan: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async update(id, data) {
    return await prisma.subscription.update({
      where: { id: parseInt(id) },
      data,
      include: {
        user: true,
        plan: true
      }
    });
  }

  async delete(id) {
    return await prisma.subscription.delete({
      where: { id: parseInt(id) }
    });
  }

  async count(where = {}) {
    return await prisma.subscription.count({ where });
  }
}

module.exports = new SubscriptionRepository();