const express = require('express');
const router = express.Router();
const ReviewController = require('../controllers/ReviewController');

// 🔑 ROUTES SPÉCIFIQUES D'ABORD
router.get('/user/:userId', ReviewController.getUserReviews);
router.get('/reviewer/:reviewerId', ReviewController.getReviewsByReviewer);

// ROUTES CRUD DE BASE
router.post('/', ReviewController.createReview);
router.get('/', ReviewController.getAllReviews);

// 🔑 ROUTES PARAMÉTRIQUES À LA FIN
router.get('/:id', ReviewController.getReviewById);
router.put('/:id', ReviewController.updateReview);
router.delete('/:id', ReviewController.deleteReview);

module.exports = router;