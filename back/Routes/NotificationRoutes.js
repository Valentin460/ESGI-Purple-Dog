const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/NotificationController');

router.post('/', NotificationController.createNotification);
router.get('/user/:userId', NotificationController.getUserNotifications);
router.get('/user/:userId/unread', NotificationController.getUnreadNotifications);
router.patch('/:id/read', NotificationController.markAsRead);
router.patch('/user/:userId/read-all', NotificationController.markAllAsRead);
router.delete('/:id', NotificationController.deleteNotification);
router.delete('/user/:userId/all', NotificationController.deleteAllUserNotifications);

module.exports = router;