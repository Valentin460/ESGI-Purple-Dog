const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ReviewRepository {
  async create(data) {
    const { reviewer_id, reviewee_id, rating, comment, nps_score } = data;

    const createData = {
      reviewer: {
        connect: { id: parseInt(reviewer_id) }
      },
      reviewed: {
        connect: { id: parseInt(reviewee_id) }
      },
      rating: parseInt(rating),
      comment: comment || null,
      nps_score: nps_score ? parseInt(nps_score) : null
    };

    return await prisma.review.create({
      data: createData,
      include: {
        reviewer: {
          select: {
            id: true,
            email: true
          }
        },
        reviewed: {
          select: {
            id: true,
            email: true
          }
        }
      }
    });
  }

  async findAll(options = {}) {
    const { skip = 0, take = 10, where = {} } = options;
    return await prisma.review.findMany({
      skip: parseInt(skip),
      take: parseInt(take),
      where,
      include: {
        reviewer: {
          select: {
            id: true,
            email: true
          }
        },
        reviewed: {
          select: {
            id: true,
            email: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async count(where = {}) {
    return await prisma.review.count({ where });
  }

  async findById(id) {
    return await prisma.review.findUnique({
      where: { id: parseInt(id) },
      include: {
        reviewer: {
          select: {
            id: true,
            email: true
          }
        },
        reviewed: {
          select: {
            id: true,
            email: true
          }
        }
      }
    });
  }
async findByReviewedId(reviewedId) {
    return await prisma.review.findMany({
      where: { user_id: parseInt(reviewedId) },  // ✅ Changé
      include: {
        reviewer: {
          select: {
            id: true,
            email: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });
  }

  async findByReviewerId(reviewerId) {
    return await prisma.review.findMany({
      where: { reviewer_id: parseInt(reviewerId) },
      include: {
        reviewed: {
          select: {
            id: true,
            email: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });
  }
  
  async findByRevieweeId(userId) {
    return await prisma.review.findMany({
      where: { 
        user_id: parseInt(userId)  // ✅ Changé de reviewed_id à user_id
      },
      include: {
        reviewer: {
          select: {
            id: true,
            email: true
          }
        },
        reviewed: {
          select: {
            id: true,
            email: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });
  }

  // async findByRevieweeId(userId) {
  //   return await prisma.review.findMany({
  //     where: { 
  //       reviewer_id: parseInt(userId) 
  //     },
  //     include: {
  //       reviewer: {
  //         select: {
  //           id: true,
  //           email: true
  //         }
  //       },
  //       reviewed: {
  //         select: {
  //           id: true,
  //           email: true
  //         }
  //       }
  //     },
  //     orderBy: { created_at: 'desc' }
  //   });
  // }

  async getAverageRating(reviewedId) {
    const result = await prisma.review.aggregate({
      where: { user_id: parseInt(reviewedId) },
      _avg: { rating: true },
      _count: { rating: true }
    });

    return {
      average: result._avg.rating || 0,
      count: result._count.rating || 0
    };
  }

  async update(id, data) {
    return await prisma.review.update({
      where: { id: parseInt(id) },
      data,
      include: {
        reviewer: {
          select: {
            id: true,
            email: true
          }
        },
        reviewed: {
          select: {
            id: true,
            email: true
          }
        }
      }
    });
  }

  async delete(id) {
    return await prisma.review.delete({
      where: { id: parseInt(id) }
    });
  }
}

module.exports = new ReviewRepository();