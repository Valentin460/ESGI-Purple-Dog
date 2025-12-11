const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const UserRepository = require('../Repository/UserRepository');
const IndividualRepository = require('../Repository/IndividualRepository');
const ProfessionalRepository = require('../Repository/ProfessionalRepository');

class UserService {
  // CREATE - Ne pas toucher, ça marche
  async createUser(userData) {
    const { email, password_hash, user_type, individual_data, professional_data } = userData;

    if (!email || !password_hash || !user_type) {
      throw new Error('email, password_hash et user_type sont obligatoires');
    }

    try {
      const existingUser = await UserRepository.findByEmail(email);
      if (existingUser) {
        throw new Error('Cet email est déjà utilisé');
      }

      const validUserTypes = ['individual', 'professional', 'admin'];
      if (!validUserTypes.includes(user_type)) {
        throw new Error(`Type d'utilisateur invalide. Valeurs autorisées: ${validUserTypes.join(', ')}`);
      }

      if (user_type === 'individual' && !individual_data) {
        throw new Error('individual_data est obligatoire pour un utilisateur individuel');
      }

      if (user_type === 'professional' && !professional_data) {
        throw new Error('professional_data est obligatoire pour un utilisateur professionnel');
      }

      const result = await prisma.$transaction(async (tx) => {
        const newUser = await tx.user.create({
          data: {
            email,
            password_hash,
            user_type,
            is_active: true
          }
        });

        if (user_type === 'individual') {
          await tx.individual.create({
            data: {
              user_id: newUser.id,
              first_name: individual_data.first_name,
              last_name: individual_data.last_name,
              display_name: individual_data.display_name || individual_data.first_name,
              postal_address: individual_data.postal_address,
              age_verified: individual_data.age_verified || false,
              over_18_certified: individual_data.over_18_certified || false,
              newsletter_subscribed: individual_data.newsletter_subscribed || false,
              rgpd_accepted: individual_data.rgpd_accepted || false,
              rgpd_accepted_at: individual_data.rgpd_accepted ? new Date() : null
            }
          });
        }

        if (user_type === 'professional') {
          await tx.professional.create({
            data: {
              user_id: newUser.id,
              first_name: professional_data.first_name,
              last_name: professional_data.last_name,
              company_name: professional_data.company_name,
              siret_number: professional_data.siret_number,
              postal_address: professional_data.postal_address,
              website: professional_data.website || null,
              specialties: professional_data.specialties || null,
              sought_items: professional_data.sought_items || null,
              social_networks: professional_data.social_networks || null,
              newsletter_subscribed: professional_data.newsletter_subscribed || false
            }
          });
        }

        const completeUser = await tx.user.findUnique({
          where: { id: newUser.id },
          include: {
            individual: true,
            professional: true
          }
        });

        return completeUser;
      });

      const { password_hash: _, ...userWithoutPassword } = result;

      return {
        success: true,
        message: 'Utilisateur créé avec succès',
        data: userWithoutPassword
      };
    } catch (error) {
      throw new Error(`Erreur création utilisateur: ${error.message}`);
    }
  }

  // READ ALL - Adapté au repository
  async getAllUsers(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      
      // Le repository retourne déjà l'objet formaté
      const result = await UserRepository.findAll({ page: parseInt(page), limit: parseInt(limit) });

      // Retirer les mots de passe
      const usersWithoutPassword = result.data.map(user => {
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      return {
        success: true,
        data: usersWithoutPassword,
        pagination: result.pagination
      };
    } catch (error) {
      throw new Error(`Erreur récupération utilisateurs: ${error.message}`);
    }
  }

  // READ BY ID
  async getUserById(userId) {
    try {
      const user = await UserRepository.findById(userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      const { password_hash, ...userWithoutPassword } = user;

      return {
        success: true,
        data: userWithoutPassword
      };
    } catch (error) {
      throw new Error(`Erreur récupération utilisateur: ${error.message}`);
    }
  }

  // READ BY EMAIL
  async getUserByEmail(email) {
    try {
      const user = await UserRepository.findByEmail(email);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      const { password_hash, ...userWithoutPassword } = user;

      return {
        success: true,
        data: userWithoutPassword
      };
    } catch (error) {
      throw new Error(`Erreur récupération utilisateur: ${error.message}`);
    }
  }

  // READ BY TYPE
  async getUsersByType(userType) {
    try {
      const validTypes = ['individual', 'professional', 'admin'];
      if (!validTypes.includes(userType)) {
        throw new Error(`Type invalide. Valeurs autorisées: ${validTypes.join(', ')}`);
      }

      const users = await UserRepository.findByUserType(userType);

      const usersWithoutPassword = users.map(user => {
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      return {
        success: true,
        data: usersWithoutPassword
      };
    } catch (error) {
      throw new Error(`Erreur récupération utilisateurs par type: ${error.message}`);
    }
  }

  // READ ACTIVE
  async getActiveUsers() {
    try {
      const users = await UserRepository.findActive();

      const usersWithoutPassword = users.map(user => {
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      return {
        success: true,
        data: usersWithoutPassword
      };
    } catch (error) {
      throw new Error(`Erreur récupération utilisateurs actifs: ${error.message}`);
    }
  }

  // UPDATE
  async updateUser(userId, updateData) {
    try {
      // Ne pas permettre la mise à jour directe du mot de passe
      if (updateData.password_hash) {
        delete updateData.password_hash;
      }

      // Si l'email est modifié, vérifier qu'il n'existe pas déjà
      if (updateData.email) {
        const user = await UserRepository.findById(userId);
        if (!user) {
          throw new Error('Utilisateur non trouvé');
        }

        if (updateData.email !== user.email) {
          const existingEmail = await UserRepository.findByEmail(updateData.email);
          if (existingEmail) {
            throw new Error('Cet email est déjà utilisé');
          }
        }
      }

      const updatedUser = await UserRepository.update(userId, updateData);

      return {
        success: true,
        message: 'Utilisateur mis à jour',
        data: updatedUser
      };
    } catch (error) {
      throw new Error(`Erreur mise à jour utilisateur: ${error.message}`);
    }
  }

  // UPDATE PASSWORD
  async updatePassword(userId, oldPassword, newPassword) {
    try {
      const user = await UserRepository.findById(userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // TODO: Ajouter la vérification du mot de passe avec bcrypt
      // const isPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
      // if (!isPasswordValid) {
      //   throw new Error('Ancien mot de passe incorrect');
      // }

      // TODO: Hasher le nouveau mot de passe
      // const hashedPassword = await bcrypt.hash(newPassword, 10);

      await UserRepository.update(userId, {
        password_hash: newPassword // Remplacer par hashedPassword en production
      });

      return {
        success: true,
        message: 'Mot de passe mis à jour'
      };
    } catch (error) {
      throw new Error(`Erreur mise à jour mot de passe: ${error.message}`);
    }
  }

  // TOGGLE STATUS
  async toggleUserStatus(userId) {
    try {
      const user = await UserRepository.findById(userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      const updatedUser = await UserRepository.update(userId, {
        is_active: !user.is_active
      });

      return {
        success: true,
        message: `Utilisateur ${updatedUser.is_active ? 'activé' : 'désactivé'}`,
        data: updatedUser
      };
    } catch (error) {
      throw new Error(`Erreur modification statut utilisateur: ${error.message}`);
    }
  }

  // DEACTIVATE
  async deactivateUser(userId) {
    try {
      const updatedUser = await UserRepository.deactivate(userId);

      return {
        success: true,
        message: 'Utilisateur désactivé',
        data: updatedUser
      };
    } catch (error) {
      throw new Error(`Erreur désactivation utilisateur: ${error.message}`);
    }
  }

  // ACTIVATE
  async activateUser(userId) {
    try {
      const updatedUser = await UserRepository.update(userId, {
        is_active: true
      });

      return {
        success: true,
        message: 'Utilisateur activé',
        data: updatedUser
      };
    } catch (error) {
      throw new Error(`Erreur activation utilisateur: ${error.message}`);
    }
  }

  // DELETE
  async deleteUser(userId) {
    try {
      await UserRepository.delete(userId);

      return {
        success: true,
        message: 'Utilisateur supprimé'
      };
    } catch (error) {
      throw new Error(`Erreur suppression utilisateur: ${error.message}`);
    }
  }

  // STATS
  async getUserStats(userId) {
    try {
      const user = await UserRepository.findById(userId);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      const stats = {
        user_id: user.id,
        email: user.email,
        user_type: user.user_type,
        is_active: user.is_active,
        created_at: user.created_at,
        items_sold_count: user.items_sold?.length || 0,
        reviews_received_count: user.reviews_received?.length || 0,
        subscriptions_count: user.subscriptions?.length || 0
      };

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      throw new Error(`Erreur récupération statistiques: ${error.message}`);
    }
  }

  // SEARCH
  async searchUsers(searchTerm) {
    try {
      if (!searchTerm || searchTerm.trim().length < 2) {
        throw new Error('Le terme de recherche doit contenir au moins 2 caractères');
      }

      const users = await prisma.user.findMany({
        where: {
          OR: [
            { email: { contains: searchTerm, mode: 'insensitive' } },
            {
              individual: {
                OR: [
                  { first_name: { contains: searchTerm, mode: 'insensitive' } },
                  { last_name: { contains: searchTerm, mode: 'insensitive' } },
                  { display_name: { contains: searchTerm, mode: 'insensitive' } }
                ]
              }
            },
            {
              professional: {
                OR: [
                  { first_name: { contains: searchTerm, mode: 'insensitive' } },
                  { last_name: { contains: searchTerm, mode: 'insensitive' } },
                  { company_name: { contains: searchTerm, mode: 'insensitive' } }
                ]
              }
            }
          ]
        },
        include: {
          individual: true,
          professional: true
        },
        take: 20
      });

      const usersWithoutPassword = users.map(user => {
        const { password_hash, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      return {
        success: true,
        data: usersWithoutPassword
      };
    } catch (error) {
      throw new Error(`Erreur recherche utilisateurs: ${error.message}`);
    }
  }

  // COUNT
  async getUserCount() {
    try {
      const total = await UserRepository.count();
      const activeCount = await UserRepository.count({ is_active: true });
      const individualCount = await UserRepository.count({ user_type: 'individual' });
      const professionalCount = await UserRepository.count({ user_type: 'professional' });
      const adminCount = await UserRepository.count({ user_type: 'admin' });

      return {
        success: true,
        data: {
          total,
          active: activeCount,
          inactive: total - activeCount,
          by_type: {
            individual: individualCount,
            professional: professionalCount,
            admin: adminCount
          }
        }
      };
    } catch (error) {
      throw new Error(`Erreur comptage utilisateurs: ${error.message}`);
    }
  }
}

module.exports = new UserService();