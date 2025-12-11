const SubscriptionService = require('../services/SubscriptionService');

class SubscriptionController {
  async createSubscription(req, res) {
    try {
      const result = await SubscriptionService.createSubscription(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getAllSubscriptions(req, res) {
    try {
      const { page, limit, status, user_id } = req.query;
      const result = await SubscriptionService.getAllSubscriptions(
        { status, user_id },
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

  async getSubscriptionById(req, res) {
    try {
      const result = await SubscriptionService.getSubscriptionById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  async getUserSubscriptions(req, res) {
    try {
      const result = await SubscriptionService.getUserSubscriptions(req.params.userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getUserActiveSubscription(req, res) {
    try {
      const result = await SubscriptionService.getUserActiveSubscription(req.params.userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async cancelSubscription(req, res) {
    try {
      const result = await SubscriptionService.cancelSubscription(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async renewSubscription(req, res) {
    try {
      const result = await SubscriptionService.renewSubscription(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async toggleAutoRenew(req, res) {
    try {
      const result = await SubscriptionService.toggleAutoRenew(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteSubscription(req, res) {
    try {
      const result = await SubscriptionService.deleteSubscription(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new SubscriptionController();