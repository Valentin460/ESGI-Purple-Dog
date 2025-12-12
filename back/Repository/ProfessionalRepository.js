const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ProfessionalRepository {
  async create(data) {
    try {
      return await prisma.professional.create({
        data,
        include: { user: true }
      });
    } catch (error) {
      throw new Error(`Erreur création professional: ${error.message}`);
    }
  }

  async findAll(options = {}) {
    try {
      const { skip = 0, take = 10 } = options;
      return await prisma.professional.findMany({
        skip,
        take,
        include: { user: true },
        orderBy: { created_at: 'desc' }
      });
    } catch (error) {
      throw new Error(`Erreur récupération professionals: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      return await prisma.professional.findUnique({
        where: { id: parseInt(id) },
        include: { user: true }
      });
    } catch (error) {
      throw new Error(`Erreur récupération professional: ${error.message}`);
    }
  }

  async findByUserId(userId) {
    try {
      return await prisma.professional.findUnique({
        where: { user_id: parseInt(userId) },
        include: { user: true }
      });
    } catch (error) {
      throw new Error(`Erreur récupération professional: ${error.message}`);
    }
  }

  async count() {
    try {
      return await prisma.professional.count();
    } catch (error) {
      throw new Error(`Erreur comptage professionals: ${error.message}`);
    }
  }

  async update(id, data) {
    try {
      return await prisma.professional.update({
        where: { id: parseInt(id) },
        data,
        include: { user: true }
      });
    } catch (error) {
      throw new Error(`Erreur mise à jour professional: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      return await prisma.professional.delete({
        where: { id: parseInt(id) }
      });
    } catch (error) {
      throw new Error(`Erreur suppression professional: ${error.message}`);
    }
  }
}

module.exports = new ProfessionalRepository();