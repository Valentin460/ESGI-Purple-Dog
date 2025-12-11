const BidService = require('../services/BidService');

class BidController {
  async placeBid(req, res) {
    try {
      const result = await BidService.placeBid(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getAllBids(req, res) {
    try {
      const { page = 1, limit = 10, auction_id, bidder_id } = req.query;
      const result = await BidService.getAllBids(
        { auction_id, bidder_id },
        { page: parseInt(page), limit: parseInt(limit) }  // ✅ Convertir en Int
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getBidById(req, res) {
    try {
      const result = await BidService.getBidById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  async getBidsByAuction(req, res) {
    try {
      const result = await BidService.getBidsByAuction(req.params.auctionId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getBidsByBidder(req, res) {
    try {
      const result = await BidService.getBidsByBidder(req.params.bidderId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getHighestBid(req, res) {
    try {
      const result = await BidService.getHighestBid(req.params.auctionId);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteBid(req, res) {
    try {
      const result = await BidService.deleteBid(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getBidsByUser(req, res) {
    try {
      const { userId } = req.params;
      const result = await BidService.getBidsByUser(userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getWinningBid(req, res) {
    try {
      const { auctionId } = req.params;
      const result = await BidService.getWinningBid(auctionId);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new BidController();