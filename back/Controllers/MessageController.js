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

  // ✅ AJOUTÉ - Récupérer tous les messages
  async getAllMessages(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await MessageService.getAllMessages({ 
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

  // ✅ AJOUTÉ - Récupérer un message par ID
  async getMessageById(req, res) {
    try {
      const result = await MessageService.getMessageById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  // ✅ AJOUTÉ - Récupérer les messages d'un utilisateur
  async getUserMessages(req, res) {
    try {
      const result = await MessageService.getUserMessages(req.params.userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
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
  async markMessageAsRead(req, res) {
    try {
      const { id } = req.params;
      const result = await MessageService.markMessageAsRead(id);
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

  async getConversationUnreadMessages(req, res) {
    try {
      const { conversationId } = req.params;
      const result = await MessageService.getConversationUnreadMessages(conversationId);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async markAllMessagesAsRead(req, res) {
    try {
      const { conversationId } = req.params;
      const userId = req.body?.userId || null;  // ✅ Rendre userId optionnel
      const result = await MessageService.markAllMessagesAsRead(conversationId, userId);
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