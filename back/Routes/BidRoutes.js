const express = require('express');
const router = express.Router();
const BidController = require('../controllers/BidController');

router.post('/', BidController.placeBid);
router.get('/', BidController.getAllBids);
router.get('/:id', BidController.getBidById);
router.get('/auction/:auctionId', BidController.getBidsByAuction);
router.get('/bidder/:bidderId', BidController.getBidsByBidder);
router.get('/auction/:auctionId/highest', BidController.getHighestBid);
router.delete('/:id', BidController.deleteBid);

module.exports = router;