const SubscriptionPlanService = require('../services/SubscriptionPlanService');

class SubscriptionPlanController {
  async createPlan(req, res) {
    try {
      const result = await SubscriptionPlanService.createPlan(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getAllPlans(req, res) {
    try {
      const { page, limit } = req.query;
      const result = await SubscriptionPlanService.getAllPlans({ page, limit });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getActivePlans(req, res) {
    try {
      const result = await SubscriptionPlanService.getActivePlans();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getPlanById(req, res) {
    try {
      const result = await SubscriptionPlanService.getPlanById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  async updatePlan(req, res) {
    try {
      const result = await SubscriptionPlanService.updatePlan(req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async togglePlanStatus(req, res) {
    try {
      const result = await SubscriptionPlanService.togglePlanStatus(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async deletePlan(req, res) {
    try {
      const result = await SubscriptionPlanService.deletePlan(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new SubscriptionPlanController();