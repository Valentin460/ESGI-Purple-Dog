const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/NotificationController');

// 🔑 ROUTES SPÉCIFIQUES D'ABORD
router.get('/user/:userId/unread', NotificationController.getUnreadNotifications);
router.get('/user/:userId', NotificationController.getUserNotifications);
router.patch('/user/:userId/read-all', NotificationController.markAllAsRead);
router.delete('/user/:userId/all', NotificationController.deleteAllUserNotifications);

// ROUTES CRUD DE BASE
router.post('/', NotificationController.createNotification);
router.get('/', NotificationController.getAllNotifications);  // ✅ AJOUTÉ

// 🔑 ROUTES PARAMÉTRIQUES À LA FIN
router.get('/:id', NotificationController.getNotificationById);  // ✅ AJOUTÉ
router.patch('/:id/read', NotificationController.markAsRead);
router.delete('/:id', NotificationController.deleteNotification);

module.exports = router;