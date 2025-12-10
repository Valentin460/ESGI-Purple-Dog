const AuctionService = require('../services/AuctionService');

class AuctionController {
  async createAuction(req, res) {
    try {
      const result = await AuctionService.createAuction(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getAllAuctions(req, res) {
    try {
      const { page, limit, status } = req.query;
      const result = await AuctionService.getAllAuctions({ status }, { page, limit });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getActiveAuctions(req, res) {
    try {
      const result = await AuctionService.getActiveAuctions();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getAuctionById(req, res) {
    try {
      const result = await AuctionService.getAuctionById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  async startAuction(req, res) {
    try {
      const result = await AuctionService.startAuction(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async extendAuction(req, res) {
    try {
      const { extensionMinutes } = req.body;
      const result = await AuctionService.extendAuction(req.params.id, extensionMinutes);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async completeAuction(req, res) {
    try {
      const { winner_id } = req.body;
      const result = await AuctionService.completeAuction(req.params.id, winner_id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async cancelAuction(req, res) {
    try {
      const result = await AuctionService.cancelAuction(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteAuction(req, res) {
    try {
      const result = await AuctionService.deleteAuction(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new AuctionController();