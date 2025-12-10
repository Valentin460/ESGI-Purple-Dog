const express = require('express');
const router = express.Router();
const AuctionController = require('../controllers/AuctionController');

router.post('/', AuctionController.createAuction);
router.get('/', AuctionController.getAllAuctions);
router.get('/active', AuctionController.getActiveAuctions);
router.get('/:id', AuctionController.getAuctionById);
router.patch('/:id/start', AuctionController.startAuction);
router.patch('/:id/extend', AuctionController.extendAuction);
router.patch('/:id/complete', AuctionController.completeAuction);
router.patch('/:id/cancel', AuctionController.cancelAuction);
router.delete('/:id', AuctionController.deleteAuction);

module.exports = router;