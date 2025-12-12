const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class SubscriptionPlanRepository {
  async create(data) {
    return await prisma.subscriptionPlan.create({
      data
    });
  }

  async findAll(options = {}) {
    const { skip = 0, take = 10, where = {} } = options;
    return await prisma.subscriptionPlan.findMany({
      skip: parseInt(skip),
      take: parseInt(take),
      where,
      orderBy: { price: 'asc' }
    });
  }

  async findById(id) {
    return await prisma.subscriptionPlan.findUnique({
      where: { id: parseInt(id) },
      include: {
        subscriptions: {
          include: {
            user: {
              select: {
                id: true,
                email: true
              }
            }
          }
        }
      }
    });
  }

  async findByName(name) {
    return await prisma.subscriptionPlan.findFirst({
      where: { name }
    });
  }

  async findActive() {
    return await prisma.subscriptionPlan.findMany({
      where: { is_active: true },
      orderBy: { price: 'asc' }
    });
  }

  async update(id, data) {
    return await prisma.subscriptionPlan.update({
      where: { id: parseInt(id) },
      data
    });
  }

  async delete(id) {
    return await prisma.subscriptionPlan.delete({
      where: { id: parseInt(id) }
    });
  }

  async count(where = {}) {
    return await prisma.subscriptionPlan.count({ where });
  }
}

module.exports = new SubscriptionPlanRepository();