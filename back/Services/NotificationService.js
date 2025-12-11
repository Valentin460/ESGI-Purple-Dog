const NotificationRepository = require('../Repository/NotificationRepository');

class NotificationService {
  async createNotification(notificationData) {
    const { user_id, type, title, message } = notificationData;

    if (!user_id || !type || !title || !message) {
      throw new Error('user_id, type, title et message sont obligatoires');
    }

    try {
      const validTypes = ['INFO', 'SUCCESS', 'WARNING', 'ERROR', 'BID', 'MESSAGE', 'AUCTION', 'TRANSACTION'];
      if (!validTypes.includes(type)) {
        throw new Error(`Type invalide. Types autorisés: ${validTypes.join(', ')}`);
      }

      const newNotification = await NotificationRepository.create({
        user_id: parseInt(user_id),
        type,
        title,
        message,
        link: notificationData.link || null,
        is_read: false
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
      const skip = (page - 1) * limit;

      const notifications = await NotificationRepository.findByUserId(userId);
      const paginatedNotifications = notifications.slice(skip, skip + limit);
      const total = notifications.length;

      return {
        success: true,
        data: paginatedNotifications,
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
      await NotificationRepository.markAllAsRead(userId);

      return {
        success: true,
        message: 'Toutes les notifications marquées comme lues'
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
      await NotificationRepository.deleteAllByUserId(userId);

      return {
        success: true,
        message: 'Toutes les notifications supprimées'
      };
    } catch (error) {
      throw new Error(`Erreur suppression notifications: ${error.message}`);
    }
  }
}

module.exports = new NotificationService();