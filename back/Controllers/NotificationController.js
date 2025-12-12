const NotificationService = require('../services/NotificationService');

class NotificationController {
  async createNotification(req, res) {
    try {
      const result = await NotificationService.createNotification(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getAllNotifications(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await NotificationService.getAllNotifications({ 
        page: parseInt(page), 
        limit: parseInt(limit) 
      });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getNotificationById(req, res) {
    try {
      const result = await NotificationService.getNotificationById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  async getUserNotifications(req, res) {
    try {
      const { page, limit } = req.query;
      const result = await NotificationService.getUserNotifications(req.params.userId, { page, limit });
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getUnreadNotifications(req, res) {
    try {
      const result = await NotificationService.getUnreadNotifications(req.params.userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async markAsRead(req, res) {
    try {
      const result = await NotificationService.markAsRead(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async markAllAsRead(req, res) {
    try {
      const result = await NotificationService.markAllAsRead(req.params.userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteNotification(req, res) {
    try {
      const result = await NotificationService.deleteNotification(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteAllUserNotifications(req, res) {
    try {
      const result = await NotificationService.deleteAllUserNotifications(req.params.userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new NotificationController();