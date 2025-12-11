const SubscriptionPlanRepository = require('../Repository/SubscriptionPlanRepository');

class SubscriptionPlanService {
  // Périodes de facturation valides
  static VALID_BILLING_PERIODS = ['monthly', 'quarterly', 'yearly', 'lifetime'];

  async createPlan(planData) {
    const { name, price, billing_period, features, is_active } = planData;

    if (!name || price === undefined) {
      throw new Error('name et price sont obligatoires');
    }

    try {
      const existingPlan = await SubscriptionPlanRepository.findByName(name);
      if (existingPlan) {
        throw new Error('Un plan avec ce nom existe déjà');
      }

      if (billing_period && !SubscriptionPlanService.VALID_BILLING_PERIODS.includes(billing_period)) {
        throw new Error(`Période de facturation invalide. Valeurs autorisées: ${SubscriptionPlanService.VALID_BILLING_PERIODS.join(', ')}`);
      }

      const newPlan = await SubscriptionPlanRepository.create({
        name,
        price: parseFloat(price),
        billing_period: billing_period || null,
        features: features || null,
        is_active: is_active !== undefined ? is_active : true
      });

      return {
        success: true,
        message: 'Plan d\'abonnement créé',
        data: newPlan
      };
    } catch (error) {
      throw new Error(`Erreur création plan: ${error.message}`);
    }
  }

  async getAllPlans(pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const skip = (page - 1) * parseInt(limit);

      const plans = await SubscriptionPlanRepository.findAll({ 
        skip, 
        take: parseInt(limit) 
      });
      const total = await SubscriptionPlanRepository.count();

      return {
        success: true,
        data: plans,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        }
      };
    } catch (error) {
      throw new Error(`Erreur récupération plans: ${error.message}`);
    }
  }

  async getActivePlans() {
    try {
      const plans = await SubscriptionPlanRepository.findActive();

      return {
        success: true,
        data: plans,
        count: plans.length
      };
    } catch (error) {
      throw new Error(`Erreur récupération plans actifs: ${error.message}`);
    }
  }

  async getPlanById(planId) {
    try {
      const plan = await SubscriptionPlanRepository.findById(planId);
      if (!plan) {
        throw new Error('Plan non trouvé');
      }

      return {
        success: true,
        data: plan
      };
    } catch (error) {
      throw new Error(`Erreur récupération plan: ${error.message}`);
    }
  }

  async updatePlan(planId, updateData) {
    try {
      const plan = await SubscriptionPlanRepository.findById(planId);
      if (!plan) {
        throw new Error('Plan non trouvé');
      }

      if (updateData.name && updateData.name !== plan.name) {
        const existingName = await SubscriptionPlanRepository.findByName(updateData.name);
        if (existingName) {
          throw new Error('Un plan avec ce nom existe déjà');
        }
      }

      if (updateData.billing_period && 
          !SubscriptionPlanService.VALID_BILLING_PERIODS.includes(updateData.billing_period)) {
        throw new Error(`Période de facturation invalide. Valeurs autorisées: ${SubscriptionPlanService.VALID_BILLING_PERIODS.join(', ')}`);
      }

      if (updateData.price !== undefined) {
        updateData.price = parseFloat(updateData.price);
      }

      const updatedPlan = await SubscriptionPlanRepository.update(planId, updateData);

      return {
        success: true,
        message: 'Plan mis à jour',
        data: updatedPlan
      };
    } catch (error) {
      throw new Error(`Erreur mise à jour plan: ${error.message}`);
    }
  }

  async togglePlanStatus(planId) {
    try {
      const plan = await SubscriptionPlanRepository.findById(planId);
      if (!plan) {
        throw new Error('Plan non trouvé');
      }

      const updatedPlan = await SubscriptionPlanRepository.update(planId, {
        is_active: !plan.is_active
      });

      return {
        success: true,
        message: `Plan ${updatedPlan.is_active ? 'activé' : 'désactivé'}`,
        data: updatedPlan
      };
    } catch (error) {
      throw new Error(`Erreur modification statut plan: ${error.message}`);
    }
  }

  async deletePlan(planId) {
    try {
      const plan = await SubscriptionPlanRepository.findById(planId);
      if (!plan) {
        throw new Error('Plan non trouvé');
      }

      if (plan.subscriptions && plan.subscriptions.length > 0) {
        throw new Error('Impossible de supprimer un plan avec des abonnements actifs');
      }

      await SubscriptionPlanRepository.delete(planId);

      return {
        success: true,
        message: 'Plan supprimé'
      };
    } catch (error) {
      throw new Error(`Erreur suppression plan: ${error.message}`);
    }
  }
}

module.exports = new SubscriptionPlanService();