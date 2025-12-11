const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class TransactionRepository {
  async create(data) {
    return await prisma.transaction.create({
      data,
      include: {
        buyer: true,
        seller: true,
        item: true
      }
    });
  }

  async findAll(options = {}) {
    return await prisma.transaction.findMany({
      ...options,
      include: {
        buyer: true,
        seller: true,
        item: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async findById(id) {
    return await prisma.transaction.findUnique({
      where: { id: parseInt(id) },
      include: {
        buyer: true,
        seller: true,
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
        buyer: true,
        seller: true,
        item: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async findByBuyerId(buyerId) {
    return await prisma.transaction.findMany({
      where: { buyer_id: parseInt(buyerId) },
      include: {
        seller: true,
        item: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async findBySellerId(sellerId) {
    return await prisma.transaction.findMany({
      where: { seller_id: parseInt(sellerId) },
      include: {
        buyer: true,
        item: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async findByStatus(status) {
    return await prisma.transaction.findMany({
      where: { status },
      include: {
        buyer: true,
        seller: true,
        item: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async findByItemId(itemId) {
    return await prisma.transaction.findFirst({
      where: { item_id: parseInt(itemId) },
      include: {
        buyer: true,
        seller: true,
        item: true
      }
    });
  }

  async update(id, data) {
    return await prisma.transaction.update({
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
    return await prisma.transaction.delete({
      where: { id: parseInt(id) }
    });
  }

  async count(where = {}) {
    return await prisma.transaction.count({ where });
  }

  async getTotalRevenue(sellerId = null) {
    const where = {
      status: 'COMPLETED',
      payment_status: 'PAID'
    };

    if (sellerId) {
      where.seller_id = parseInt(sellerId);
    }

    const result = await prisma.transaction.aggregate({
      where,
      _sum: {
        total_amount: true
      }
    });

    return result._sum.total_amount || 0;
  }
}

module.exports = new TransactionRepository();