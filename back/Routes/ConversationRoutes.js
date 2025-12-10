const express = require('express');
const router = express.Router();
const ConversationController = require('../controllers/ConversationController');

router.post('/', ConversationController.createConversation);
router.get('/', ConversationController.getAllConversations);
router.get('/:id', ConversationController.getConversationById);
router.get('/user/:userId', ConversationController.getUserConversations);
router.patch('/:id/status', ConversationController.updateConversationStatus);
router.patch('/:id/close', ConversationController.closeConversation);
router.delete('/:id', ConversationController.deleteConversation);

module.exports = router;