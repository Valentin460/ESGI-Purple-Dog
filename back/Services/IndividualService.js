const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const IndividualRepository = require('../Repository/IndividualRepository');
const UserRepository = require('../Repository/UserRepository');

class IndividualService {
  async createIndividual(individualData) {
    const { email, password_hash, first_name, last_name, postal_address } = individualData;
    
    if (!email || !password_hash || !first_name || !last_name || !postal_address) {
      throw new Error('email, password_hash, first_name, last_name et postal_address sont obligatoires');
    }

    try {
      // 🔒 TRANSACTION : Tout ou rien
      const result = await prisma.$transaction(async (tx) => {
        // Vérifier email via repository
        const existingUser = await UserRepository.findByEmail(email);
        
        if (existingUser) {
          throw new Error('Cet email est déjà utilisé');
        }

        // 1️⃣ Créer User via tx directement (car repository utilise prisma global)
        const newUser = await tx.user.create({
          data: {
            email,
            password_hash,
            user_type: 'individual',
            is_verified: false,
            is_active: true
          }
        });

        // 2️⃣ Créer Individual via tx
        const newIndividual = await tx.individual.create({
          data: {
            user_id: newUser.id,
            first_name,
            last_name,
            display_name: individualData.display_name || first_name,
            postal_address,
            age_verified: individualData.age_verified || false,
            // over_18_certified: individualData.over_18_certified || false,
            newsletter_subscribed: individualData.newsletter_subscribed || false,
            rgpd_accepted: individualData.rgpd_accepted || false,
            rgpd_accepted_at: individualData.rgpd_accepted ? new Date() : null
          },
          include: {
            user: true
          }
        });

        return { newUser, newIndividual };
      });

      return {
        success: true,
        message: 'Profil individu créé avec succès',
        data: {
          user: {
            id: result.newUser.id,
            email: result.newUser.email,
            user_type: result.newUser.user_type,
            is_verified: result.newUser.is_verified,
            created_at: result.newUser.created_at
          },
          individual: result.newIndividual
        }
      };
    } catch (error) {
      throw new Error(`Erreur création profil individu: ${error.message}`);
    }
  }

  async createIndividualForExistingUser(individualData) {
    const { user_id, first_name, last_name, postal_address } = individualData;

    if (!user_id || !first_name || !last_name || !postal_address) {
      throw new Error('user_id, first_name, last_name et postal_address sont obligatoires');
    }

    try {
      const user = await UserRepository.findById(user_id);

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      if (user.user_type !== 'individual') {
        throw new Error('Cet utilisateur n\'est pas un individu');
      }

      const existingIndividual = await IndividualRepository.findByUserId(user_id);

      if (existingIndividual) {
        throw new Error('Ce profil individu existe déjà');
      }

      const newIndividual = await IndividualRepository.create({
        user_id: parseInt(user_id),
        first_name,
        last_name,
        display_name: individualData.display_name || first_name,
        postal_address,
        age_verified: individualData.age_verified || false,
        // over_18_certified: individualData.over_18_certified || false,
        newsletter_subscribed: individualData.newsletter_subscribed || false,
        rgpd_accepted: individualData.rgpd_accepted || false,
        rgpd_accepted_at: individualData.rgpd_accepted ? new Date() : null
      });

      return {
        success: true,
        message: 'Profil individu créé avec succès',
        data: newIndividual
      };
    } catch (error) {
      throw new Error(`Erreur création profil individu: ${error.message}`);
    }
  }

  async getAllIndividuals(pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const skip = (page - 1) * limit;

      const individuals = await IndividualRepository.findAll({ skip, take: limit });
      const total = await IndividualRepository.count();

      return {
        success: true,
        data: individuals,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Erreur récupération individus: ${error.message}`);
    }
  }

  async getIndividualById(individualId) {
    try {
      const individual = await IndividualRepository.findById(individualId);
      if (!individual) {
        throw new Error('Profil individu non trouvé');
      }

      return {
        success: true,
        data: individual
      };
    } catch (error) {
      throw new Error(`Erreur récupération profil individu: ${error.message}`);
    }
  }

  async getIndividualByUserId(userId) {
    try {
      const individual = await IndividualRepository.findByUserId(userId);
      if (!individual) {
        throw new Error('Profil individu non trouvé pour cet utilisateur');
      }

      return {
        success: true,
        data: individual
      };
    } catch (error) {
      throw new Error(`Erreur récupération profil individu: ${error.message}`);
    }
  }

  async updateIndividual(individualId, updateData) {
    try {
      const individual = await IndividualRepository.findById(individualId);
      if (!individual) {
        throw new Error('Profil individu non trouvé');
      }

      if (updateData.rgpd_accepted && !individual.rgpd_accepted) {
        updateData.rgpd_accepted_at = new Date();
      }

      const updatedIndividual = await IndividualRepository.update(individualId, updateData);

      return {
        success: true,
        message: 'Profil individu mis à jour',
        data: updatedIndividual
      };
    } catch (error) {
      throw new Error(`Erreur mise à jour profil individu: ${error.message}`);
    }
  }

  async updateIndividualByUserId(userId, updateData) {
    try {
      const individual = await IndividualRepository.findByUserId(userId);
      if (!individual) {
        throw new Error('Profil individu non trouvé pour cet utilisateur');
      }

      if (updateData.rgpd_accepted && !individual.rgpd_accepted) {
        updateData.rgpd_accepted_at = new Date();
      }

      const updatedIndividual = await IndividualRepository.update(individual.id, updateData);

      return {
        success: true,
        message: 'Profil individu mis à jour',
        data: updatedIndividual
      };
    } catch (error) {
      throw new Error(`Erreur mise à jour profil individu: ${error.message}`);
    }
  }

  async verifyAge(individualId) {
    try {
      const individual = await IndividualRepository.findById(individualId);
      if (!individual) {
        throw new Error('Profil individu non trouvé');
      }

      const updatedIndividual = await IndividualRepository.update(individualId, {
        age_verified: true,
        // over_18_certified: true
      });

      return {
        success: true,
        message: 'Âge vérifié',
        data: updatedIndividual
      };
    } catch (error) {
      throw new Error(`Erreur vérification âge: ${error.message}`);
    }
  }

  async acceptRGPD(individualId) {
    try {
      const individual = await IndividualRepository.findById(individualId);
      if (!individual) {
        throw new Error('Profil individu non trouvé');
      }

      const updatedIndividual = await IndividualRepository.update(individualId, {
        rgpd_accepted: true,
        rgpd_accepted_at: new Date()
      });

      return {
        success: true,
        message: 'RGPD accepté',
        data: updatedIndividual
      };
    } catch (error) {
      throw new Error(`Erreur acceptation RGPD: ${error.message}`);
    }
  }

  async subscribeNewsletter(individualId) {
    try {
      const individual = await IndividualRepository.findById(individualId);
      if (!individual) {
        throw new Error('Profil individu non trouvé');
      }

      const updatedIndividual = await IndividualRepository.update(individualId, {
        newsletter_subscribed: true
      });

      return {
        success: true,
        message: 'Abonnement à la newsletter confirmé',
        data: updatedIndividual
      };
    } catch (error) {
      throw new Error(`Erreur abonnement newsletter: ${error.message}`);
    }
  }

  async deleteIndividual(individualId) {
    try {
      const individual = await IndividualRepository.findById(individualId);
      if (!individual) {
        throw new Error('Profil individu non trouvé');
      }

      // 🔒 TRANSACTION : Supprimer les deux en même temps
      await prisma.$transaction(async (tx) => {
        await tx.individual.delete({
          where: { id: parseInt(individualId) }
        });

        await tx.user.delete({
          where: { id: individual.user_id }
        });
      });

      return {
        success: true,
        message: 'Profil individu et utilisateur supprimés'
      };
    } catch (error) {
      throw new Error(`Erreur suppression profil individu: ${error.message}`);
    }
  }
}

module.exports = new IndividualService();
