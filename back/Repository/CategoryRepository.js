const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CategoryRepository {
  async create(data) {
    return await prisma.category.create({ data });
  }

  async findAll(options = {}) {
    const { skip = 0, take = 20 } = options;
    return await prisma.category.findMany({
      skip: parseInt(skip),
      take: parseInt(take),
      orderBy: { created_at: 'desc' }
    });
  }

  async findById(id) {
    return await prisma.category.findUnique({
      where: { id: parseInt(id) }
    });
  }

  async findBySlug(slug) {
    return await prisma.category.findUnique({
      where: { slug }
    });
  }

  async findActive() {
    return await prisma.category.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' }
    });
  }

  async update(id, data) {
    return await prisma.category.update({
      where: { id: parseInt(id) },
      data
    });
  }

  async delete(id) {
    return await prisma.category.delete({
      where: { id: parseInt(id) }
    });
  }

  async count() {
    return await prisma.category.count();
  }
}

module.exports = new CategoryRepository();