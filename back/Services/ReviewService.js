const ReviewRepository = require('../Repository/ReviewRepository');
const ItemRepository = require('../Repository/ItemRepository');

class ReviewService {
  async createReview(reviewData) {
    const { reviewer_id, reviewee_id, item_id, rating, comment } = reviewData;

    if (!reviewer_id || !reviewee_id || !rating) {
      throw new Error('reviewer_id, reviewee_id et rating sont obligatoires');
    }

    if (rating < 1 || rating > 5) {
      throw new Error('La note doit être entre 1 et 5');
    }

    try {
      if (parseInt(reviewer_id) === parseInt(reviewee_id)) {
        throw new Error('Vous ne pouvez pas vous évaluer vous-même');
      }

      if (item_id) {
        const item = await ItemRepository.findById(item_id);
        if (!item) {
          throw new Error('Item non trouvé');
        }
      }

      const newReview = await ReviewRepository.create({
        reviewer_id: parseInt(reviewer_id),
        reviewee_id: parseInt(reviewee_id),
        item_id: item_id ? parseInt(item_id) : null,
        rating: parseInt(rating),
        comment: comment || null
      });

      return {
        success: true,
        message: 'Avis créé avec succès',
        data: newReview
      };
    } catch (error) {
      throw new Error(`Erreur création avis: ${error.message}`);
    }
  }

  async getAllReviews(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const skip = (page - 1) * limit;

      const where = {};
      if (filters.reviewee_id) where.reviewee_id = parseInt(filters.reviewee_id);
      if (filters.reviewer_id) where.reviewer_id = parseInt(filters.reviewer_id);
      if (filters.item_id) where.item_id = parseInt(filters.item_id);

      const reviews = await ReviewRepository.findAll({ skip, take: limit, where });
      const total = await ReviewRepository.count(where);

      return {
        success: true,
        data: reviews,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Erreur récupération avis: ${error.message}`);
    }
  }

  async getReviewById(reviewId) {
    try {
      const review = await ReviewRepository.findById(reviewId);
      if (!review) {
        throw new Error('Avis non trouvé');
      }

      return {
        success: true,
        data: review
      };
    } catch (error) {
      throw new Error(`Erreur récupération avis: ${error.message}`);
    }
  }

  async getUserReviews(userId) {
    try {
      const reviews = await ReviewRepository.findByRevieweeId(userId);
      const stats = await ReviewRepository.getAverageRating(userId);

      return {
        success: true,
        data: reviews,
        stats: {
          average_rating: stats.average,
          total_reviews: stats.count
        }
      };
    } catch (error) {
      throw new Error(`Erreur récupération avis utilisateur: ${error.message}`);
    }
  }

  async getReviewsByReviewer(reviewerId) {
    try {
      const reviews = await ReviewRepository.findByReviewerId(reviewerId);

      return {
        success: true,
        data: reviews
      };
    } catch (error) {
      throw new Error(`Erreur récupération avis: ${error.message}`);
    }
  }

  async getItemReviews(itemId) {
    try {
      const reviews = await ReviewRepository.findByItemId(itemId);

      return {
        success: true,
        data: reviews
      };
    } catch (error) {
      throw new Error(`Erreur récupération avis item: ${error.message}`);
    }
  }

  async updateReview(reviewId, updateData) {
    try {
      const review = await ReviewRepository.findById(reviewId);
      if (!review) {
        throw new Error('Avis non trouvé');
      }

      if (updateData.rating && (updateData.rating < 1 || updateData.rating > 5)) {
        throw new Error('La note doit être entre 1 et 5');
      }

      const updatedReview = await ReviewRepository.update(reviewId, updateData);

      return {
        success: true,
        message: 'Avis mis à jour',
        data: updatedReview
      };
    } catch (error) {
      throw new Error(`Erreur mise à jour avis: ${error.message}`);
    }
  }

  async deleteReview(reviewId) {
    try {
      const review = await ReviewRepository.findById(reviewId);
      if (!review) {
        throw new Error('Avis non trouvé');
      }

      await ReviewRepository.delete(reviewId);

      return {
        success: true,
        message: 'Avis supprimé'
      };
    } catch (error) {
      throw new Error(`Erreur suppression avis: ${error.message}`);
    }
  }
}

module.exports = new ReviewService();