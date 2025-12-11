const express = require('express');
const router = express.Router();
const MessageController = require('../Controllers/MessageController');

// 🔑 ROUTES SPÉCIFIQUES D'ABORD (avant /:id)
router.get('/conversation/:conversationId/unread', MessageController.getConversationUnreadMessages);
router.patch('/conversation/:conversationId/read-all', MessageController.markAllMessagesAsRead);  // ✅ AJOUTÉ
router.patch('/conversation/:conversationId/read', MessageController.markMessagesAsRead);
router.get('/conversation/:conversationId', MessageController.getConversationMessages);
router.get('/unread/:userId', MessageController.getUnreadMessages);
router.get('/user/:userId', MessageController.getUserMessages);

// ROUTES CRUD DE BASE
router.post('/', MessageController.sendMessage);
router.get('/', MessageController.getAllMessages);  // ✅ AJOUTÉ

// 🔑 ROUTES PARAMÉTRIQUES À LA FIN
router.get('/:id', MessageController.getMessageById);
router.patch('/:id/read', MessageController.markMessageAsRead);  // ✅ AJOUTÉ
router.delete('/:id', MessageController.deleteMessage);

module.exports = router;