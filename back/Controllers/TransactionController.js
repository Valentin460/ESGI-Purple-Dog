const TransactionService = require('../services/TransactionService');

class TransactionController {
  async createTransaction(req, res) {
    try {
      const result = await TransactionService.createTransaction(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getAllTransactions(req, res) {
    try {
      const { page, limit, status, payment_status, buyer_id, seller_id } = req.query;
      const result = await TransactionService.getAllTransactions(
        { status, payment_status, buyer_id, seller_id },
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

  async getTransactionById(req, res) {
    try {
      const result = await TransactionService.getTransactionById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  async getUserTransactions(req, res) {
    try {
      const result = await TransactionService.getUserTransactions(req.params.userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getBuyerTransactions(req, res) {
    try {
      const result = await TransactionService.getBuyerTransactions(req.params.buyerId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getSellerTransactions(req, res) {
    try {
      const result = await TransactionService.getSellerTransactions(req.params.sellerId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async updatePaymentStatus(req, res) {
    try {
      const { payment_status } = req.body;
      const result = await TransactionService.updatePaymentStatus(req.params.id, payment_status);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateTransactionStatus(req, res) {
    try {
      const { status } = req.body;
      const result = await TransactionService.updateTransactionStatus(req.params.id, status);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async addTrackingNumber(req, res) {
    try {
      const { tracking_number } = req.body;
      const result = await TransactionService.addTrackingNumber(req.params.id, tracking_number);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getSellerRevenue(req, res) {
    try {
      const result = await TransactionService.getSellerRevenue(req.params.sellerId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async cancelTransaction(req, res) {
    try {
      const { reason } = req.body;
      const result = await TransactionService.cancelTransaction(req.params.id, reason);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteTransaction(req, res) {
    try {
      const result = await TransactionService.deleteTransaction(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new TransactionController();