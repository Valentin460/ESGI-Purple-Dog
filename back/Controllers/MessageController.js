const MessageService = require('../services/MessageService');

class MessageController {
  async sendMessage(req, res) {
    try {
      const result = await MessageService.sendMessage(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getConversationMessages(req, res) {
    try {
      const result = await MessageService.getConversationMessages(req.params.conversationId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getUnreadMessages(req, res) {
    try {
      const result = await MessageService.getUnreadMessages(req.params.userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async markMessagesAsRead(req, res) {
    try {
      const { userId } = req.body;
      const result = await MessageService.markMessagesAsRead(req.params.conversationId, userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteMessage(req, res) {
    try {
      const result = await MessageService.deleteMessage(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new MessageController();