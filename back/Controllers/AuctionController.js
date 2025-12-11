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
      const { page = 1, limit = 10, status } = req.query;
      const result = await AuctionService.getAllAuctions(
        { status }, 
        { page: parseInt(page), limit: parseInt(limit) }
      );
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

  async getUpcomingAuctions(req, res) {
    try {
      const result = await AuctionService.getUpcomingAuctions();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getAllActiveAuctions(req, res) {
    try {
      const result = await AuctionService.getAllActiveAuctions();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  // ✅ AJOUTÉ - Récupérer par statut
  async getAuctionsByStatus(req, res) {
    try {
      const { status } = req.params;
      const result = await AuctionService.getAuctionsByStatus(status);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  // ✅ AJOUTÉ - Récupérer par item
  async getAuctionByItemId(req, res) {
    try {
      const { itemId } = req.params;
      const result = await AuctionService.getAuctionByItemId(itemId);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
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

  // ✅ AJOUTÉ - Mettre à jour
  async updateAuction(req, res) {
    try {
      const { id } = req.params;
      const result = await AuctionService.updateAuction(id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
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
      const result = await AuctionService.extendAuction(req.params.id, parseInt(extensionMinutes));
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

  async getCompletedAuctions(req, res) {
    try {
      const result = await AuctionService.getCompletedAuctions();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getCancelledAuctions(req, res) {
    try {
      const result = await AuctionService.getCancelledAuctions();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getAuctionsBySeller(req, res) {
    try {
      const { sellerId } = req.params;
      const result = await AuctionService.getAuctionsBySeller(sellerId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async endAuction(req, res) {
    try {
      const { id } = req.params;
      const result = await AuctionService.endAuction(id);
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