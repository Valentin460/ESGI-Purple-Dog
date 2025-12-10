const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class ItemRepository {
  // CREATE
  async create(data) {
    try {
      return await prisma.item.create({
        data
      });
    } catch (error) {
      throw new Error(`Erreur création item: ${error.message}`);
    }
  }

  // READ - Tous les items
  async findAll(filters = {}, options = {}) {
    try {
      const { page = 1, limit = 10 } = options;
      const skip = (page - 1) * limit;

      const [items, count] = await Promise.all([
        prisma.item.findMany({
          where: {
            status: 'PUBLISHED',
            ...filters
          },
          skip,
          take: limit,
          orderBy: { created_at: 'desc' },
          include: { 
            categories: true,
            seller: {
              select: { id: true, email: true }
            }
          }
        }),
        prisma.item.count({
          where: {
            status: 'PUBLISHED',
            ...filters
          }
        })
      ]);

      return {
        data: items,
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      throw new Error(`Erreur récupération items: ${error.message}`);
    }
  }

  // READ - Par ID
  async findById(id) {
    try {
      return await prisma.item.findUnique({
        where: { id: parseInt(id) },
        include: {
          categories: true,
          seller: {
            select: { id: true, email: true }
          },
          auction: true,
          conversations: true
        }
      });
    } catch (error) {
      throw new Error(`Erreur récupération item: ${error.message}`);
    }
  }

  // READ - Par vendeur
  async findBySellerId(sellerId, filters = {}) {
    try {
      return await prisma.item.findMany({
        where: {
          seller_id: parseInt(sellerId),
          ...filters
        },
        include: { 
          categories: true,
          seller: {
            select: { id: true, email: true }
          }
        },
        orderBy: { created_at: 'desc' }
      });
    } catch (error) {
      throw new Error(`Erreur récupération items vendeur: ${error.message}`);
    }
  }

  // SEARCH
  async search(query, filters = {}) {
    try {
      const { page = 1, limit = 10 } = filters;
      const skip = (page - 1) * limit;

      const [items, count] = await Promise.all([
        prisma.item.findMany({
          where: {
            status: 'PUBLISHED',
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } }
            ],
            ...filters
          },
          skip,
          take: limit,
          orderBy: { published_at: 'desc' },
          include: { 
            categories: true,
            seller: {
              select: { id: true, email: true }
            }
          }
        }),
        prisma.item.count({
          where: {
            status: 'PUBLISHED',
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { description: { contains: query, mode: 'insensitive' } }
            ],
            ...filters
          }
        })
      ]);

      return {
        data: items,
        pagination: {
          page,
          limit,
          total: count,
          pages: Math.ceil(count / limit)
        }
      };
    } catch (error) {
      throw new Error(`Erreur recherche items: ${error.message}`);
    }
  }

  // UPDATE
  async update(id, data) {
    try {
      const item = await prisma.item.findUnique({
        where: { id: parseInt(id) }
      });

      if (!item) {
        throw new Error('Item non trouvé');
      }

      return await prisma.item.update({
        where: { id: parseInt(id) },
        data,
        include: { categories: true }
      });
    } catch (error) {
      throw new Error(`Erreur mise à jour item: ${error.message}`);
    }
  }

  // DELETE
  async delete(id) {
    try {
      return await prisma.item.delete({
        where: { id: parseInt(id) }
      });
    } catch (error) {
      throw new Error(`Erreur suppression item: ${error.message}`);
    }
  }

  // Ajouter une catégorie
  async addCategory(itemId, categoryId) {
    try {
      return await prisma.itemCategory.create({
        data: {
          item_id: parseInt(itemId),
          category_id: parseInt(categoryId)
        }
      });
    } catch (error) {
      throw new Error(`Erreur ajout catégorie: ${error.message}`);
    }
  }

  // Retirer une catégorie
  async removeCategory(itemId, categoryId) {
    try {
      return await prisma.itemCategory.deleteMany({
        where: {
          item_id: parseInt(itemId),
          category_id: parseInt(categoryId)
        }
      });
    } catch (error) {
      throw new Error(`Erreur retrait catégorie: ${error.message}`);
    }
  }
}

module.exports = new ItemRepository();