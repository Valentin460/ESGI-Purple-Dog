const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class BidRepository {
  async create(data) {
    return await prisma.bid.create({
      data,
      include: {
        bidder: true,
        auction: {
          include: {
            item: true
          }
        }
      }
    });
  }

  async findAll(options = {}) {
    const { skip = 0, take = 10, where = {} } = options;
    return await prisma.bid.findMany({
      skip: parseInt(skip),   // ✅ Convertir en Int
      take: parseInt(take),   // ✅ Convertir en Int
      where,
      include: {
        bidder: true,
        auction: {
          include: {
            item: true
          }
        }
      },
      orderBy: {
        bid_time: 'desc'
      }
    });
  }

  async findById(id) {
    return await prisma.bid.findUnique({
      where: { id: parseInt(id) },
      include: {
        bidder: true,
        auction: {
          include: {
            item: true
          }
        }
      }
    });
  }

  async findByAuctionId(auctionId) {
    return await prisma.bid.findMany({
      where: { auction_id: parseInt(auctionId) },
      include: {
        bidder: true
      },
      orderBy: { bid_time: 'desc' }
    });
  }

  async findByBidderId(bidderId) {
    return await prisma.bid.findMany({
      where: { bidder_id: parseInt(bidderId) },
      include: {
        auction: {
          include: {
            item: true
          }
        }
      },
      orderBy: { bid_time: 'desc' }
    });
  }

  async findHighestBid(auctionId) {
    return await prisma.bid.findFirst({
      where: { auction_id: parseInt(auctionId) },
      orderBy: { amount: 'desc' },
      include: {
        bidder: true
      }
    });
  }

  async findWinningBid(auctionId) {
    return await prisma.bid.findFirst({
      where: {
        auction_id: parseInt(auctionId)
      },
      include: {
        bidder: {
          select: {
            id: true,
            email: true
          }
        },
        auction: {
          include: {
            item: true
          }
        }
      },
      orderBy: {
        amount: 'desc'  // ✅ Changé de bid_amount à amount
      }
    });
  }

  async update(id, data) {
    return await prisma.bid.update({
      where: { id: parseInt(id) },
      data,
      include: {
        bidder: true,
        auction: true
      }
    });
  }

  async updateMany(where, data) {
    return await prisma.bid.updateMany({
      where,
      data
    });
  }

  async delete(id) {
    return await prisma.bid.delete({
      where: { id: parseInt(id) }
    });
  }

  async count(where = {}) {
    return await prisma.bid.count({ where });
  }

  async findByUserId(userId) {
    return await prisma.bid.findMany({
      where: {
        bidder_id: parseInt(userId)
      },
      include: {
        auction: {
          include: {
            item: true
          }
        }
      },
      orderBy: {
        bid_time: 'desc'
      }
    });
  }
}

module.exports = new BidRepository();