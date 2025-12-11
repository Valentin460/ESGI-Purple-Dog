const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class TransactionRepository {
  async create(data) {
    return await prisma.transaction.create({
      data,
      include: {
        buyer: {
          select: {
            id: true,
            email: true
          }
        },
        seller: {
          select: {
            id: true,
            email: true
          }
        },
        item: true
      }
    });
  }

  async findAll(options = {}) {
    const { skip = 0, take = 10, where = {} } = options;
    return await prisma.transaction.findMany({
      skip: parseInt(skip),
      take: parseInt(take),
      where,
      include: {
        buyer: {
          select: {
            id: true,
            email: true
          }
        },
        seller: {
          select: {
            id: true,
            email: true
          }
        },
        item: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async findById(id) {
    return await prisma.transaction.findUnique({
      where: { id: parseInt(id) },
      include: {
        buyer: {
          select: {
            id: true,
            email: true
          }
        },
        seller: {
          select: {
            id: true,
            email: true
          }
        },
        item: {
          include: {
            categories: {
              include: {
                category: true
              }
            }
          }
        }
      }
    });
  }

  async findByUserId(userId) {
    return await prisma.transaction.findMany({
      where: {
        OR: [
          { buyer_id: parseInt(userId) },
          { seller_id: parseInt(userId) }
        ]
      },
      include: {
        buyer: {
          select: {
            id: true,
            email: true
          }
        },
        seller: {
          select: {
            id: true,
            email: true
          }
        },
        item: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async findByBuyerId(buyerId) {
    return await prisma.transaction.findMany({
      where: { buyer_id: parseInt(buyerId) },
      include: {
        seller: {
          select: {
            id: true,
            email: true
          }
        },
        item: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async findBySellerId(sellerId) {
    return await prisma.transaction.findMany({
      where: { seller_id: parseInt(sellerId) },
      include: {
        buyer: {
          select: {
            id: true,
            email: true
          }
        },
        item: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async findByStatus(status) {
    return await prisma.transaction.findMany({
      where: { status },
      include: {
        buyer: {
          select: {
            id: true,
            email: true
          }
        },
        seller: {
          select: {
            id: true,
            email: true
          }
        },
        item: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async findByItemId(itemId) {
    return await prisma.transaction.findFirst({
      where: { item_id: parseInt(itemId) },
      include: {
        buyer: {
          select: {
            id: true,
            email: true
          }
        },
        seller: {
          select: {
            id: true,
            email: true
          }
        },
        item: true
      }
    });
  }

  async update(id, data) {
    return await prisma.transaction.update({
      where: { id: parseInt(id) },
      data,
      include: {
        buyer: {
          select: {
            id: true,
            email: true
          }
        },
        seller: {
          select: {
            id: true,
            email: true
          }
        },
        item: true
      }
    });
  }

  async delete(id) {
    return await prisma.transaction.delete({
      where: { id: parseInt(id) }
    });
  }

  async count(where = {}) {
    return await prisma.transaction.count({ where });
  }

  async getTotalRevenue(sellerId = null) {
    const where = {
      status: 'COMPLETED'
    };

    if (sellerId) {
      where.seller_id = parseInt(sellerId);
    }

    const result = await prisma.transaction.aggregate({
      where,
      _sum: {
        total_seller_receives: true
      }
    });

    return result._sum.total_seller_receives || 0;
  }
}

module.exports = new TransactionRepository();