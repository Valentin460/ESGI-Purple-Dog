const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class CategoryRepository {
  async create(data) {
    return await prisma.category.create({
      data
    });
  }

  async findAll(options = {}) {
    return await prisma.category.findMany({
      ...options,
      orderBy: { created_at: 'desc' }
    });
  }

  async findById(id) {
    return await prisma.category.findUnique({
      where: { id: parseInt(id) },
      include: {
        items: {
          include: {
            item: true
          }
        }
      }
    });
  }

  async findBySlug(slug) {
    return await prisma.category.findUnique({
      where: { slug }
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

  async findActive() {
    return await prisma.category.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' }
    });
  }

  async findRootCategories() {
    return await prisma.category.findMany({
      where: {
        parent_id: null
      },
      include: {
        children: true
      }
    });
  }

  async findByParentId(parentId) {
    return await prisma.category.findMany({
      where: {
        parent_id: parseInt(parentId)
      }
    });
  }

  async findCategoryTree() {
    return await prisma.category.findMany({
      where: {
        parent_id: null
      },
      include: {
        children: {
          include: {
            children: true
          }
        }
      }
    });
  }
}

module.exports = new CategoryRepository();