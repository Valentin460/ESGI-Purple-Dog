const ConversationService = require('../services/ConversationService');

class ConversationController {
  async createConversation(req, res) {
    try {
      const result = await ConversationService.createConversation(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getAllConversations(req, res) {
    try {
      const { page, limit, status, user_id } = req.query;
      const result = await ConversationService.getAllConversations(
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

  async getConversationById(req, res) {
    try {
      const result = await ConversationService.getConversationById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  async getUserConversations(req, res) {
    try {
      const result = await ConversationService.getUserConversations(req.params.userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateConversationStatus(req, res) {
    try {
      const { status } = req.body;
      const result = await ConversationService.updateConversationStatus(req.params.id, status);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async closeConversation(req, res) {
    try {
      const result = await ConversationService.closeConversation(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteConversation(req, res) {
    try {
      const result = await ConversationService.deleteConversation(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async markAsRead(req, res) {
    try {
      const { id, userId } = req.params;
      const result = await ConversationService.markAsRead(id, userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new ConversationController();