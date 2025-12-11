const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class SubscriptionRepository {
  async create(data) {
    return await prisma.subscription.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            user_type: true
          }
        },
        plan: true
      }
    });
  }

  async findAll(options = {}) {
    const { skip = 0, take = 10, where = {} } = options;
    return await prisma.subscription.findMany({
      skip: parseInt(skip),
      take: parseInt(take),
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            user_type: true
          }
        },
        plan: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async findById(id) {
    return await prisma.subscription.findUnique({
      where: { id: parseInt(id) },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            user_type: true
          }
        },
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
        status: { in: ['TRIAL', 'ACTIVE'] },
        OR: [
          { ends_at: null },
          { ends_at: { gte: new Date() } }
        ]
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
        user: {
          select: {
            id: true,
            email: true,
            user_type: true
          }
        },
        plan: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async findExpired() {
    return await prisma.subscription.findMany({
      where: {
        status: { in: ['TRIAL', 'ACTIVE'] },
        ends_at: { lt: new Date() }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        },
        plan: true
      }
    });
  }

  async findTrialExpired() {
    return await prisma.subscription.findMany({
      where: {
        status: 'TRIAL',
        trial_ends_at: { lt: new Date() }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        },
        plan: true
      }
    });
  }

  async update(id, data) {
    return await prisma.subscription.update({
      where: { id: parseInt(id) },
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            user_type: true
          }
        },
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