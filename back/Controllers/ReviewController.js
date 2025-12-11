const ReviewService = require('../services/ReviewService');

class ReviewController {
  async createReview(req, res) {
    try {
      const result = await ReviewService.createReview(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getAllReviews(req, res) {
    try {
      const { page, limit, reviewee_id, reviewer_id, item_id } = req.query;
      const result = await ReviewService.getAllReviews(
        { reviewee_id, reviewer_id, item_id },
        { page, limit }
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getReviewById(req, res) {
    try {
      const result = await ReviewService.getReviewById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  async getUserReviews(req, res) {
    try {
      const result = await ReviewService.getUserReviews(req.params.userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getReviewsByReviewer(req, res) {
    try {
      const result = await ReviewService.getReviewsByReviewer(req.params.reviewerId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getItemReviews(req, res) {
    try {
      const result = await ReviewService.getItemReviews(req.params.itemId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateReview(req, res) {
    try {
      const result = await ReviewService.updateReview(req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteReview(req, res) {
    try {
      const result = await ReviewService.deleteReview(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new ReviewController();