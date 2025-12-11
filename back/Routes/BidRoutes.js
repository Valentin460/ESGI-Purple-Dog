const express = require('express');
const router = express.Router();
const BidController = require('../Controllers/BidController');

// 🔑 ROUTES SPÉCIFIQUES D'ABORD (avant /:id)
router.get('/auction/:auctionId/highest', BidController.getHighestBid);
router.get('/auction/:auctionId/winning', BidController.getWinningBid);  // ✅ AJOUTÉ
router.get('/auction/:auctionId', BidController.getBidsByAuction);
router.get('/bidder/:bidderId', BidController.getBidsByBidder);
router.get('/user/:userId', BidController.getBidsByUser);

// ROUTES CRUD DE BASE
router.post('/', BidController.placeBid);
router.get('/', BidController.getAllBids);

// 🔑 ROUTES PARAMÉTRIQUES À LA FIN
router.get('/:id', BidController.getBidById);
router.delete('/:id', BidController.deleteBid);

module.exports = router;