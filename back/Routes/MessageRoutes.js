const express = require('express');
const router = express.Router();
const MessageController = require('../controllers/MessageController');

router.post('/', MessageController.sendMessage);
router.get('/conversation/:conversationId', MessageController.getConversationMessages);
router.get('/unread/:userId', MessageController.getUnreadMessages);
router.patch('/conversation/:conversationId/read', MessageController.markMessagesAsRead);
router.delete('/:id', MessageController.deleteMessage);

module.exports = router;