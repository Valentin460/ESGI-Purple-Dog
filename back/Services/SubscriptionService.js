const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const SubscriptionRepository = require('../Repository/SubscriptionRepository');

class SubscriptionService {
  // Statuts valides selon le schema.prisma
  static VALID_STATUSES = ['TRIAL', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'EXPIRED'];

  // Durée des périodes de facturation en jours
  static BILLING_PERIODS = {
    'monthly': 30,
    'quarterly': 90,
    'yearly': 365,
    'lifetime': 36500  // ~100 ans
  };

  async createSubscription(subscriptionData) {
    const { 
      user_id, 
      plan_id, 
      stripe_subscription_id,
      start_trial = false 
    } = subscriptionData;

    if (!user_id || !plan_id) {
      throw new Error('user_id et plan_id sont obligatoires');
    }

    try {
      const result = await prisma.$transaction(async (tx) => {
        // Vérifier que l'utilisateur existe
        const user = await tx.user.findUnique({
          where: { id: parseInt(user_id) }
        });

        if (!user) {
          throw new Error('Utilisateur non trouvé');
        }

        // Vérifier que le plan existe et est actif
        const plan = await tx.subscriptionPlan.findUnique({
          where: { id: parseInt(plan_id) }
        });

        if (!plan) {
          throw new Error('Plan non trouvé');
        }

        if (!plan.is_active) {
          throw new Error('Ce plan n\'est pas disponible');
        }

        // Vérifier si l'utilisateur a déjà un abonnement actif
        const activeSubscription = await tx.subscription.findFirst({
          where: {
            user_id: parseInt(user_id),
            status: { in: ['TRIAL', 'ACTIVE'] },
            OR: [
              { ends_at: null },
              { ends_at: { gte: new Date() } }
            ]
          }
        });

        if (activeSubscription) {
          throw new Error('Cet utilisateur a déjà un abonnement actif');
        }

        // Calculer les dates
        const startedAt = new Date();
        let endsAt = null;
        let trialEndsAt = null;
        let status = 'ACTIVE';

        // Période d'essai d'1 mois pour les pros
        if (start_trial && user.user_type === 'professional') {
          trialEndsAt = new Date();
          trialEndsAt.setDate(trialEndsAt.getDate() + 30);
          status = 'TRIAL';
        }

        // Calculer la date de fin selon la période de facturation
        if (plan.billing_period && SubscriptionService.BILLING_PERIODS[plan.billing_period]) {
          endsAt = new Date();
          endsAt.setDate(endsAt.getDate() + SubscriptionService.BILLING_PERIODS[plan.billing_period]);
        }

        const newSubscription = await tx.subscription.create({
          data: {
            user_id: parseInt(user_id),
            plan_id: parseInt(plan_id),
            status,
            started_at: startedAt,
            ends_at: endsAt,
            trial_ends_at: trialEndsAt,
            stripe_subscription_id: stripe_subscription_id || null
          },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                user_type: true
              }
            },
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
      const skip = (page - 1) * parseInt(limit);

      const where = {};
      if (filters.status) where.status = filters.status;
      if (filters.user_id) where.user_id = parseInt(filters.user_id);

      const subscriptions = await SubscriptionRepository.findAll({ 
        skip, 
        take: parseInt(limit), 
        where 
      });
      const total = await SubscriptionRepository.count(where);

      return {
        success: true,
        data: subscriptions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
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
        data: subscriptions,
        count: subscriptions.length
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

      // Vérifier si la période d'essai est terminée
      if (subscription.status === 'TRIAL' && subscription.trial_ends_at) {
        if (new Date() > new Date(subscription.trial_ends_at)) {
          // Mettre à jour le statut si la période d'essai est expirée
          await SubscriptionRepository.update(subscription.id, {
            status: 'EXPIRED'
          });
          
          return {
            success: true,
            message: 'Période d\'essai expirée',
            data: null
          };
        }
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

      if (subscription.status === 'CANCELED') {
        throw new Error('Cet abonnement est déjà annulé');
      }

      if (subscription.status === 'EXPIRED') {
        throw new Error('Cet abonnement est déjà expiré');
      }

      const updatedSubscription = await SubscriptionRepository.update(subscriptionId, {
        status: 'CANCELED',
        ends_at: new Date()  // L'abonnement se termine immédiatement
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

      const plan = subscription.plan;
      if (!plan) {
        throw new Error('Plan non trouvé');
      }

      if (!plan.is_active) {
        throw new Error('Ce plan n\'est plus disponible');
      }

      // Calculer la nouvelle date de fin
      let newEndsAt = new Date();
      
      // Si l'abonnement n'est pas encore expiré, prolonger à partir de la date de fin actuelle
      if (subscription.ends_at && new Date(subscription.ends_at) > new Date()) {
        newEndsAt = new Date(subscription.ends_at);
      }

      if (plan.billing_period && SubscriptionService.BILLING_PERIODS[plan.billing_period]) {
        newEndsAt.setDate(newEndsAt.getDate() + SubscriptionService.BILLING_PERIODS[plan.billing_period]);
      } else {
        // Par défaut, renouveler pour 30 jours
        newEndsAt.setDate(newEndsAt.getDate() + 30);
      }

      const updatedSubscription = await SubscriptionRepository.update(subscriptionId, {
        ends_at: newEndsAt,
        status: 'ACTIVE',
        trial_ends_at: null  // Supprimer la période d'essai si elle existait
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

      // Note: Le schema.prisma n'a pas de champ auto_renew
      // On pourrait stocker cette info dans Stripe ou ajouter le champ

      return {
        success: true,
        message: 'Fonctionnalité de renouvellement automatique gérée par Stripe',
        data: subscription
      };
    } catch (error) {
      throw new Error(`Erreur modification renouvellement automatique: ${error.message}`);
    }
  }

  async updateSubscriptionStatus(subscriptionId, status) {
    try {
      const subscription = await SubscriptionRepository.findById(subscriptionId);
      if (!subscription) {
        throw new Error('Abonnement non trouvé');
      }

      if (!SubscriptionService.VALID_STATUSES.includes(status)) {
        throw new Error(`Statut invalide. Valeurs autorisées: ${SubscriptionService.VALID_STATUSES.join(', ')}`);
      }

      const updatedSubscription = await SubscriptionRepository.update(subscriptionId, {
        status
      });

      return {
        success: true,
        message: 'Statut mis à jour',
        data: updatedSubscription
      };
    } catch (error) {
      throw new Error(`Erreur mise à jour statut: ${error.message}`);
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