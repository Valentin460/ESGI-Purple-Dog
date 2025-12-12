const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class IndividualRepository {
  async create(data) {
    try {
      return await prisma.individual.create({
        data,
        include: { user: true }
      });
    } catch (error) {
      throw new Error(`Erreur création individual: ${error.message}`);
    }
  }

  async findAll(options = {}) {
    try {
      const { skip = 0, take = 10 } = options;
      return await prisma.individual.findMany({
        skip,
        take,
        include: { user: true },
        orderBy: { created_at: 'desc' }
      });
    } catch (error) {
      throw new Error(`Erreur récupération individuals: ${error.message}`);
    }
  }

  async findById(id) {
    try {
      return await prisma.individual.findUnique({
        where: { id: parseInt(id) },
        include: { user: true }
      });
    } catch (error) {
      throw new Error(`Erreur récupération individual: ${error.message}`);
    }
  }

  async findByUserId(userId) {
    try {
      return await prisma.individual.findUnique({
        where: { user_id: parseInt(userId) },
        include: { user: true }
      });
    } catch (error) {
      throw new Error(`Erreur récupération individual: ${error.message}`);
    }
  }

  async count() {
    try {
      return await prisma.individual.count();
    } catch (error) {
      throw new Error(`Erreur comptage individuals: ${error.message}`);
    }
  }

  async update(id, data) {
    try {
      return await prisma.individual.update({
        where: { id: parseInt(id) },
        data,
        include: { user: true }
      });
    } catch (error) {
      throw new Error(`Erreur mise à jour individual: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      return await prisma.individual.delete({
        where: { id: parseInt(id) }
      });
    } catch (error) {
      throw new Error(`Erreur suppression individual: ${error.message}`);
    }
  }
}

module.exports = new IndividualRepository();