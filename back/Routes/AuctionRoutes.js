const express = require('express');
const router = express.Router();
const AuctionController = require('../Controllers/AuctionController');

// 🔑 ROUTES SPÉCIFIQUES D'ABORD (avant /:id)
router.get('/active', AuctionController.getActiveAuctions);
router.get('/upcoming', AuctionController.getUpcomingAuctions);
router.get('/all-active', AuctionController.getAllActiveAuctions);
router.get('/completed', AuctionController.getCompletedAuctions);
router.get('/cancelled', AuctionController.getCancelledAuctions);
router.get('/status/:status', AuctionController.getAuctionsByStatus);
router.get('/item/:itemId', AuctionController.getAuctionByItemId);
router.get('/seller/:sellerId', AuctionController.getAuctionsBySeller);

// ROUTES CRUD DE BASE
router.post('/', AuctionController.createAuction);
router.get('/', AuctionController.getAllAuctions);

// 🔑 ROUTES PARAMÉTRIQUES À LA FIN
router.get('/:id', AuctionController.getAuctionById);
router.put('/:id', AuctionController.updateAuction);
router.post('/:id/start', AuctionController.startAuction);
router.post('/:id/end', AuctionController.endAuction);         // ✅ AJOUTÉ
router.post('/:id/extend', AuctionController.extendAuction);
router.post('/:id/complete', AuctionController.completeAuction);
router.post('/:id/cancel', AuctionController.cancelAuction);
router.delete('/:id', AuctionController.deleteAuction);

module.exports = router;