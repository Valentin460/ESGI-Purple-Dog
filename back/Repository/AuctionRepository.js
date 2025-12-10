const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class AuctionRepository {
  async create(data) {
    return await prisma.auction.create({
      data,
      include: {
        item: true,
        winner: true
      }
    });
  }

  async findAll(options = {}) {
    return await prisma.auction.findMany({
      ...options,
      include: {
        item: true,
        winner: true,
        bids: {
          orderBy: { bid_time: 'desc' },
          take: 5
        }
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async findById(id) {
    return await prisma.auction.findUnique({
      where: { id: parseInt(id) },
      include: {
        item: {
          include: {
            seller: true,
            categories: {
              include: {
                category: true
              }
            }
          }
        },
        winner: true,
        bids: {
          include: {
            bidder: true
          },
          orderBy: { bid_time: 'desc' }
        }
      }
    });
  }

  async findByItemId(itemId) {
    return await prisma.auction.findUnique({
      where: { item_id: parseInt(itemId) },
      include: {
        item: true,
        winner: true,
        bids: true
      }
    });
  }

  async findActive() {
    const now = new Date();
    return await prisma.auction.findMany({
      where: {
        status: 'ACTIVE',
        start_time: { lte: now },
        end_time: { gte: now }
      },
      include: {
        item: true,
        bids: {
          orderBy: { bid_time: 'desc' },
          take: 1
        }
      },
      orderBy: { end_time: 'asc' }
    });
  }

  async findByStatus(status) {
    return await prisma.auction.findMany({
      where: { status },
      include: {
        item: true,
        winner: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async update(id, data) {
    return await prisma.auction.update({
      where: { id: parseInt(id) },
      data,
      include: {
        item: true,
        winner: true
      }
    });
  }

  async delete(id) {
    return await prisma.auction.delete({
      where: { id: parseInt(id) }
    });
  }

  async count() {
    return await prisma.auction.count();
  }
}

module.exports = new AuctionRepository();