const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ProfessionalRepository = require('../Repository/ProfessionalRepository');
const UserRepository = require('../Repository/UserRepository');

class ProfessionalService {
  async createProfessional(professionalData) {
    const { email, password_hash, first_name, last_name, company_name, siret_number, postal_address } = professionalData;

    if (!email || !password_hash || !first_name || !last_name || !company_name || !siret_number || !postal_address) {
      throw new Error('email, password_hash, first_name, last_name, company_name, siret_number et postal_address sont obligatoires');
    }

    try {
      // 🔒 TRANSACTION : Tout ou rien
      const result = await prisma.$transaction(async (tx) => {
        const existingUser = await UserRepository.findByEmail(email);

        if (existingUser) {
          throw new Error('Cet email est déjà utilisé');
        }

        // 1️⃣ Créer User
        const newUser = await tx.user.create({
          data: {
            email,
            password_hash,
            user_type: 'professional',
            is_verified: false,
            is_active: true
          }
        });

        // 2️⃣ Créer Professional
        const newProfessional = await tx.professional.create({
          data: {
            user_id: newUser.id,
            first_name,
            last_name,
            company_name,
            siret_number,
            postal_address,
            website: professionalData.website || null,
            specialties: professionalData.specialties || null,
            sought_items: professionalData.sought_items || null,
            social_networks: professionalData.social_networks || null,
            newsletter_subscribed: professionalData.newsletter_subscribed || false,
            mandate_signed: false,
            mandate_signed_at: null
          },
          include: {
            user: true
          }
        });

        return { newUser, newProfessional };
      });

      return {
        success: true,
        message: 'Profil professionnel créé avec succès',
        data: {
          user: {
            id: result.newUser.id,
            email: result.newUser.email,
            user_type: result.newUser.user_type,
            is_verified: result.newUser.is_verified,
            created_at: result.newUser.created_at
          },
          professional: result.newProfessional
        }
      };
    } catch (error) {
      throw new Error(`Erreur création profil professionnel: ${error.message}`);
    }
  }

  async createProfessionalForExistingUser(professionalData) {
    const { user_id, first_name, last_name, company_name, siret_number, postal_address } = professionalData;

    if (!user_id || !first_name || !last_name || !company_name || !siret_number || !postal_address) {
      throw new Error('user_id, first_name, last_name, company_name, siret_number et postal_address sont obligatoires');
    }

    try {
      const user = await UserRepository.findById(user_id);
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      if (user.user_type !== 'professional') {
        throw new Error('Cet utilisateur n\'est pas un professionnel');
      }

      const existingProfessional = await ProfessionalRepository.findByUserId(user_id);
      if (existingProfessional) {
        throw new Error('Ce profil professionnel existe déjà');
      }

      const newProfessional = await ProfessionalRepository.create({
        user_id: parseInt(user_id),
        first_name,
        last_name,
        company_name,
        siret_number,
        postal_address,
        website: professionalData.website || null,
        specialties: professionalData.specialties || null,
        sought_items: professionalData.sought_items || null,
        social_networks: professionalData.social_networks || null,
        newsletter_subscribed: professionalData.newsletter_subscribed || false,
        mandate_signed: false,
        mandate_signed_at: null
      });

      return {
        success: true,
        message: 'Profil professionnel créé avec succès',
        data: newProfessional
      };
    } catch (error) {
      throw new Error(`Erreur création profil professionnel: ${error.message}`);
    }
  }

  async getAllProfessionals(pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const skip = (page - 1) * limit;

      const professionals = await ProfessionalRepository.findAll({ skip, take: limit });
      const total = await ProfessionalRepository.count();

      return {
        success: true,
        data: professionals,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Erreur récupération professionnels: ${error.message}`);
    }
  }

  async getProfessionalById(professionalId) {
    try {
      const professional = await ProfessionalRepository.findById(professionalId);
      if (!professional) {
        throw new Error('Profil professionnel non trouvé');
      }

      return {
        success: true,
        data: professional
      };
    } catch (error) {
      throw new Error(`Erreur récupération profil professionnel: ${error.message}`);
    }
  }

  async getProfessionalByUserId(userId) {
    try {
      const professional = await ProfessionalRepository.findByUserId(userId);
      if (!professional) {
        throw new Error('Profil professionnel non trouvé pour cet utilisateur');
      }

      return {
        success: true,
        data: professional
      };
    } catch (error) {
      throw new Error(`Erreur récupération profil professionnel: ${error.message}`);
    }
  }

  async updateProfessional(professionalId, updateData) {
    try {
      const professional = await ProfessionalRepository.findById(professionalId);
      if (!professional) {
        throw new Error('Profil professionnel non trouvé');
      }

      const updatedProfessional = await ProfessionalRepository.update(professionalId, updateData);

      return {
        success: true,
        message: 'Profil professionnel mis à jour',
        data: updatedProfessional
      };
    } catch (error) {
      throw new Error(`Erreur mise à jour profil professionnel: ${error.message}`);
    }
  }

  async updateProfessionalByUserId(userId, updateData) {
    try {
      const professional = await ProfessionalRepository.findByUserId(userId);
      if (!professional) {
        throw new Error('Profil professionnel non trouvé pour cet utilisateur');
      }

      const updatedProfessional = await ProfessionalRepository.update(professional.id, updateData);

      return {
        success: true,
        message: 'Profil professionnel mis à jour',
        data: updatedProfessional
      };
    } catch (error) {
      throw new Error(`Erreur mise à jour profil professionnel: ${error.message}`);
    }
  }

  async signMandate(professionalId) {
    try {
      const professional = await ProfessionalRepository.findById(professionalId);
      if (!professional) {
        throw new Error('Profil professionnel non trouvé');
      }

      const updatedProfessional = await ProfessionalRepository.update(professionalId, {
        mandate_signed: true,
        mandate_signed_at: new Date()
      });

      return {
        success: true,
        message: 'Mandat signé',
        data: updatedProfessional
      };
    } catch (error) {
      throw new Error(`Erreur signature mandat: ${error.message}`);
    }
  }

  async deleteProfessional(professionalId) {
    try {
      const professional = await ProfessionalRepository.findById(professionalId);
      if (!professional) {
        throw new Error('Profil professionnel non trouvé');
      }

      // 🔒 TRANSACTION : Supprimer les deux en même temps
      await prisma.$transaction(async (tx) => {
        await tx.professional.delete({
          where: { id: parseInt(professionalId) }
        });

        await tx.user.delete({
          where: { id: professional.user_id }
        });
      });

      return {
        success: true,
        message: 'Profil professionnel et utilisateur supprimés'
      };
    } catch (error) {
      throw new Error(`Erreur suppression profil professionnel: ${error.message}`);
    }
  }

  // SEARCH - Rechercher des professionnels
async searchProfessionals(searchTerm) {
  try {
    const professionals = await prisma.professional.findMany({
      where: {
        OR: [
          { first_name: { contains: searchTerm, mode: 'insensitive' } },
          { last_name: { contains: searchTerm, mode: 'insensitive' } },
          { company_name: { contains: searchTerm, mode: 'insensitive' } },
          { specialties: { contains: searchTerm, mode: 'insensitive' } }
        ]
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            is_active: true
          }
        }
      },
      take: 20
    });

    return {
      success: true,
      data: professionals,
      count: professionals.length
    };
  } catch (error) {
    throw new Error(`Erreur recherche professionnels: ${error.message}`);
  }
}
}

module.exports = new ProfessionalService();
