const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class UserRepository {
  // CREATE
  async create(data) {
    try {
      return await prisma.user.create({
        data
      });
    } catch (error) {
      throw new Error(`Erreur création utilisateur: ${error.message}`);
    }
  }

  // READ - Tous les utilisateurs
  async findAll(options = {}) {
    try {
      const { page = 1, limit = 10 } = options;
      const skip = (page - 1) * limit;

      const [users, count] = await Promise.all([
        prisma.user.findMany({
          skip,
          take: limit,
          orderBy: { created_at: 'desc' },
          select: {
            id: true,
            email: true,
            user_type: true,
            is_verified: true,
            is_active: true,
            created_at: true,
            updated_at: true,
            individual: true,
            professional: true
          }
        }),
        prisma.user.count()
      ]);

      return {
        data: users,
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      throw new Error(`Erreur récupération utilisateurs: ${error.message}`);
    }
  }

  // READ - Par ID
  async findById(id) {
    try {
      return await prisma.user.findUnique({
        where: { id: parseInt(id) },
        include: {
          individual: true,
          professional: true,
          items_sold: true,
          reviews_received: true,
          subscriptions: true
        }
      });
    } catch (error) {
      throw new Error(`Erreur récupération utilisateur: ${error.message}`);
    }
  }

  // READ - Par email
  async findByEmail(email) {
    try {
      return await prisma.user.findUnique({
        where: { email }
      });
    } catch (error) {
      throw new Error(`Erreur recherche par email: ${error.message}`);
    }
  }

  // READ - Par type d'utilisateur
  async findByUserType(userType) {
    return await prisma.user.findMany({
      where: { user_type: userType },
      include: {
        individual: true,
        professional: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  // READ - Utilisateurs actifs
  async findActive() {
    return await prisma.user.findMany({
      where: { is_active: true },
      include: {
        individual: true,
        professional: true
      },
      orderBy: { created_at: 'desc' }
    });
  }

  // UPDATE
  async update(id, data) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) }
      });

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      return await prisma.user.update({
        where: { id: parseInt(id) },
        data,
        select: {
          id: true,
          email: true,
          user_type: true,
          is_verified: true,
          is_active: true,
          created_at: true,
          updated_at: true
        }
      });
    } catch (error) {
      throw new Error(`Erreur mise à jour utilisateur: ${error.message}`);
    }
  }

  // DELETE
  async delete(id) {
    try {
      return await prisma.user.delete({
        where: { id: parseInt(id) }
      });
    } catch (error) {
      throw new Error(`Erreur suppression utilisateur: ${error.message}`);
    }
  }

  // Vérifier l'utilisateur
  async verify(id) {
    try {
      return await prisma.user.update({
        where: { id: parseInt(id) },
        data: { is_verified: true }
      });
    } catch (error) {
      throw new Error(`Erreur vérification utilisateur: ${error.message}`);
    }
  }

   async count(where = {}) {
    return await prisma.user.count({ where });
  }
  // Désactiver l'utilisateur
  async deactivate(id) {
    try {
      return await prisma.user.update({
        where: { id: parseInt(id) },
        data: { is_active: false }
      });
    } catch (error) {
      throw new Error(`Erreur désactivation utilisateur: ${error.message}`);
    }
  }
}

module.exports = new UserRepository();