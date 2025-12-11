const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ReviewRepository {
  async create(data) {
    return await prisma.review.create({
      data,
      include: {
        reviewer: true,
        reviewee: true,
        item: true
      }
    });
  }

  async findAll(options = {}) {
    return await prisma.review.findMany({
      ...options,
      include: {
        reviewer: true,
        reviewee: true,
        item: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async findById(id) {
    return await prisma.review.findUnique({
      where: { id: parseInt(id) },
      include: {
        reviewer: true,
        reviewee: true,
        item: true
      }
    });
  }

  async findByRevieweeId(revieweeId) {
    return await prisma.review.findMany({
      where: { reviewee_id: parseInt(revieweeId) },
      include: {
        reviewer: true,
        item: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async findByReviewerId(reviewerId) {
    return await prisma.review.findMany({
      where: { reviewer_id: parseInt(reviewerId) },
      include: {
        reviewee: true,
        item: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async findByItemId(itemId) {
    return await prisma.review.findMany({
      where: { item_id: parseInt(itemId) },
      include: {
        reviewer: true,
        reviewee: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async getAverageRating(revieweeId) {
    const result = await prisma.review.aggregate({
      where: { reviewee_id: parseInt(revieweeId) },
      _avg: {
        rating: true
      },
      _count: {
        rating: true
      }
    });

    return {
      average: result._avg.rating || 0,
      count: result._count.rating
    };
  }

  async update(id, data) {
    return await prisma.review.update({
      where: { id: parseInt(id) },
      data,
      include: {
        reviewer: true,
        reviewee: true,
        item: true
      }
    });
  }

  async delete(id) {
    return await prisma.review.delete({
      where: { id: parseInt(id) }
    });
  }

  async count(where = {}) {
    return await prisma.review.count({ where });
  }
}

module.exports = new ReviewRepository();