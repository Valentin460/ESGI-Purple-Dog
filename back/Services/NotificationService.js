const NotificationRepository = require('../Repository/NotificationRepository');

class NotificationService {
  // Types valides selon le schema.prisma
  static VALID_TYPES = [
    'NEW_OFFER',
    'NEW_BID',
    'OUTBID',
    'AUCTION_WON',
    'AUCTION_LOST',
    'ITEM_SOLD',
    'PAYMENT_RECEIVED',
    'SHIPMENT_UPDATE',
    'NEW_MESSAGE',
    'ACCOUNT_UPDATE'
  ];

  async createNotification(notificationData) {
    const { 
      user_id, 
      type, 
      title, 
      content,
      related_item_id,
      related_auction_id,
      related_transaction_id,
      is_email_sent
    } = notificationData;

    if (!user_id || !type || !title || !content) {
      throw new Error('user_id, type, title et content sont obligatoires');
    }

    try {
      if (!NotificationService.VALID_TYPES.includes(type)) {
        throw new Error(`Type invalide. Types autorisés: ${NotificationService.VALID_TYPES.join(', ')}`);
      }

      const newNotification = await NotificationRepository.create({
        user_id: parseInt(user_id),
        type,
        title,
        content,
        related_item_id,
        related_auction_id,
        related_transaction_id,
        is_email_sent
      });

      return {
        success: true,
        message: 'Notification créée',
        data: newNotification
      };
    } catch (error) {
      throw new Error(`Erreur création notification: ${error.message}`);
    }
  }

  async getUserNotifications(userId, pagination = {}) {
    try {
      const { page = 1, limit = 20 } = pagination;
      const skip = (page - 1) * parseInt(limit);

      const notifications = await NotificationRepository.findByUserId(userId);
      const paginatedNotifications = notifications.slice(skip, skip + parseInt(limit));
      const total = notifications.length;

      return {
        success: true,
        data: paginatedNotifications,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      };
    } catch (error) {
      throw new Error(`Erreur récupération notifications: ${error.message}`);
    }
  }

  async getUnreadNotifications(userId) {
    try {
      const notifications = await NotificationRepository.findUnreadByUserId(userId);

      return {
        success: true,
        data: notifications,
        unread_count: notifications.length
      };
    } catch (error) {
      throw new Error(`Erreur récupération notifications non lues: ${error.message}`);
    }
  }

  async markAsRead(notificationId) {
    try {
      const notification = await NotificationRepository.findById(notificationId);
      if (!notification) {
        throw new Error('Notification non trouvée');
      }

      const updatedNotification = await NotificationRepository.markAsRead(notificationId);

      return {
        success: true,
        message: 'Notification marquée comme lue',
        data: updatedNotification
      };
    } catch (error) {
      throw new Error(`Erreur marquage notification: ${error.message}`);
    }
  }

  async markAllAsRead(userId) {
    try {
      const result = await NotificationRepository.markAllAsRead(userId);

      return {
        success: true,
        message: 'Toutes les notifications marquées comme lues',
        count: result.count
      };
    } catch (error) {
      throw new Error(`Erreur marquage notifications: ${error.message}`);
    }
  }

  async deleteNotification(notificationId) {
    try {
      const notification = await NotificationRepository.findById(notificationId);
      if (!notification) {
        throw new Error('Notification non trouvée');
      }

      await NotificationRepository.delete(notificationId);

      return {
        success: true,
        message: 'Notification supprimée'
      };
    } catch (error) {
      throw new Error(`Erreur suppression notification: ${error.message}`);
    }
  }

  async deleteAllUserNotifications(userId) {
    try {
      const result = await NotificationRepository.deleteAllByUserId(userId);

      return {
        success: true,
        message: 'Toutes les notifications supprimées',
        count: result.count
      };
    } catch (error) {
      throw new Error(`Erreur suppression notifications: ${error.message}`);
    }
  }

  async getAllNotifications(pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const skip = (page - 1) * limit;

      const [notifications, total] = await Promise.all([
        NotificationRepository.findAll({ skip, take: limit }),
        NotificationRepository.count()
      ]);

      return {
        success: true,
        data: notifications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Erreur récupération notifications: ${error.message}`);
    }
  }

  async getNotificationById(notificationId) {
    try {
      const notification = await NotificationRepository.findById(notificationId);
      if (!notification) {
        throw new Error('Notification non trouvée');
      }

      return {
        success: true,
        data: notification
      };
    } catch (error) {
      throw new Error(`Erreur récupération notification: ${error.message}`);
    }
  }
}

module.exports = new NotificationService();