const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const SubscriptionRepository = require('../Repository/SubscriptionRepository');
const SubscriptionPlanRepository = require('../Repository/SubscriptionPlanRepository');
const UserRepository = require('../Repository/UserRepository');

class SubscriptionService {
  async createSubscription(subscriptionData) {
    const { user_id, plan_id, payment_method } = subscriptionData;

    if (!user_id || !plan_id || !payment_method) {
      throw new Error('user_id, plan_id et payment_method sont obligatoires');
    }

    try {
      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.findUnique({
          where: { id: parseInt(user_id) }
        });

        if (!user) {
          throw new Error('Utilisateur non trouvé');
        }

        const plan = await tx.subscriptionPlan.findUnique({
          where: { id: parseInt(plan_id) }
        });

        if (!plan) {
          throw new Error('Plan non trouvé');
        }

        if (!plan.is_active) {
          throw new Error('Ce plan n\'est pas disponible');
        }

        const activeSubscription = await tx.subscription.findFirst({
          where: {
            user_id: parseInt(user_id),
            status: 'ACTIVE',
            end_date: {
              gte: new Date()
            }
          }
        });

        if (activeSubscription) {
          throw new Error('Cet utilisateur a déjà un abonnement actif');
        }

        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(endDate.getDate() + plan.duration_days);

        const newSubscription = await tx.subscription.create({
          data: {
            user_id: parseInt(user_id),
            plan_id: parseInt(plan_id),
            start_date: startDate,
            end_date: endDate,
            status: 'ACTIVE',
            payment_method,
            auto_renew: subscriptionData.auto_renew || false
          },
          include: {
            user: true,
            plan: true
          }
        });

        return newSubscription;
      });

      return {
        success: true,
        message: 'Abonnement créé avec succès',
        data: result
      };
    } catch (error) {
      throw new Error(`Erreur création abonnement: ${error.message}`);
    }
  }

  async getAllSubscriptions(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const skip = (page - 1) * limit;

      const where = {};
      if (filters.status) where.status = filters.status;
      if (filters.user_id) where.user_id = parseInt(filters.user_id);

      const subscriptions = await SubscriptionRepository.findAll({ skip, take: limit, where });
      const total = await SubscriptionRepository.count(where);

      return {
        success: true,
        data: subscriptions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Erreur récupération abonnements: ${error.message}`);
    }
  }

  async getSubscriptionById(subscriptionId) {
    try {
      const subscription = await SubscriptionRepository.findById(subscriptionId);
      if (!subscription) {
        throw new Error('Abonnement non trouvé');
      }

      return {
        success: true,
        data: subscription
      };
    } catch (error) {
      throw new Error(`Erreur récupération abonnement: ${error.message}`);
    }
  }

  async getUserSubscriptions(userId) {
    try {
      const subscriptions = await SubscriptionRepository.findByUserId(userId);

      return {
        success: true,
        data: subscriptions
      };
    } catch (error) {
      throw new Error(`Erreur récupération abonnements utilisateur: ${error.message}`);
    }
  }

  async getUserActiveSubscription(userId) {
    try {
      const subscription = await SubscriptionRepository.findActiveByUserId(userId);

      if (!subscription) {
        return {
          success: true,
          message: 'Aucun abonnement actif',
          data: null
        };
      }

      return {
        success: true,
        data: subscription
      };
    } catch (error) {
      throw new Error(`Erreur récupération abonnement actif: ${error.message}`);
    }
  }

  async cancelSubscription(subscriptionId) {
    try {
      const subscription = await SubscriptionRepository.findById(subscriptionId);
      if (!subscription) {
        throw new Error('Abonnement non trouvé');
      }

      if (subscription.status === 'CANCELLED') {
        throw new Error('Cet abonnement est déjà annulé');
      }

      const updatedSubscription = await SubscriptionRepository.update(subscriptionId, {
        status: 'CANCELLED',
        cancelled_at: new Date(),
        auto_renew: false
      });

      return {
        success: true,
        message: 'Abonnement annulé',
        data: updatedSubscription
      };
    } catch (error) {
      throw new Error(`Erreur annulation abonnement: ${error.message}`);
    }
  }

  async renewSubscription(subscriptionId) {
    try {
      const subscription = await SubscriptionRepository.findById(subscriptionId);
      if (!subscription) {
        throw new Error('Abonnement non trouvé');
      }

      const plan = await SubscriptionPlanRepository.findById(subscription.plan_id);
      if (!plan) {
        throw new Error('Plan non trouvé');
      }

      const newEndDate = new Date(subscription.end_date);
      newEndDate.setDate(newEndDate.getDate() + plan.duration_days);

      const updatedSubscription = await SubscriptionRepository.update(subscriptionId, {
        end_date: newEndDate,
        status: 'ACTIVE'
      });

      return {
        success: true,
        message: 'Abonnement renouvelé',
        data: updatedSubscription
      };
    } catch (error) {
      throw new Error(`Erreur renouvellement abonnement: ${error.message}`);
    }
  }

  async toggleAutoRenew(subscriptionId) {
    try {
      const subscription = await SubscriptionRepository.findById(subscriptionId);
      if (!subscription) {
        throw new Error('Abonnement non trouvé');
      }

      const updatedSubscription = await SubscriptionRepository.update(subscriptionId, {
        auto_renew: !subscription.auto_renew
      });

      return {
        success: true,
        message: `Renouvellement automatique ${updatedSubscription.auto_renew ? 'activé' : 'désactivé'}`,
        data: updatedSubscription
      };
    } catch (error) {
      throw new Error(`Erreur modification renouvellement automatique: ${error.message}`);
    }
  }

  async deleteSubscription(subscriptionId) {
    try {
      const subscription = await SubscriptionRepository.findById(subscriptionId);
      if (!subscription) {
        throw new Error('Abonnement non trouvé');
      }

      await SubscriptionRepository.delete(subscriptionId);

      return {
        success: true,
        message: 'Abonnement supprimé'
      };
    } catch (error) {
      throw new Error(`Erreur suppression abonnement: ${error.message}`);
    }
  }
}

module.exports = new SubscriptionService();