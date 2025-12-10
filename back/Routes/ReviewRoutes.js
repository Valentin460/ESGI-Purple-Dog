const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/ReviewController');

router.post('/', ReviewController.createReview);
router.get('/', ReviewController.getAllReviews);
router.get('/:id', ReviewController.getReviewById);
router.get('/user/:userId', ReviewController.getUserReviews);
router.get('/reviewer/:reviewerId', ReviewController.getReviewsByReviewer);
router.get('/item/:itemId', ReviewController.getItemReviews);
router.put('/:id', ReviewController.updateReview);
router.delete('/:id', ReviewController.deleteReview);

module.exports = router;