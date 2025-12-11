const express = require('express');
const router = express.Router();
const ConversationController = require('../Controllers/ConversationController');

// 🔑 ROUTES SPÉCIFIQUES D'ABORD (avant /:id)
router.get('/user/:userId', ConversationController.getUserConversations);

// ROUTES CRUD DE BASE
router.post('/', ConversationController.createConversation);
router.get('/', ConversationController.getAllConversations);

// 🔑 ROUTES PARAMÉTRIQUES À LA FIN
router.get('/:id', ConversationController.getConversationById);
router.patch('/:id/status', ConversationController.updateConversationStatus);
router.patch('/:id/close', ConversationController.closeConversation);
router.patch('/:id/read/:userId', ConversationController.markAsRead);  // ✅ AJOUTÉ
router.delete('/:id', ConversationController.deleteConversation);

module.exports = router;