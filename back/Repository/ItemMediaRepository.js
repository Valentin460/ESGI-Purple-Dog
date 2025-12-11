const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ItemImageRepository = {
  async create(itemId, imageData) {
    try {
      return await prisma.itemImage.create({
        data: {
          item_id: parseInt(itemId),
          url: imageData.url,
          alt_text: imageData.alt_text || null,
          position: imageData.position || 0,
          is_main: imageData.is_main || false
        }
      });
    } catch (error) {
      throw new Error(`Erreur création image: ${error.message}`);
    }
  },

  async createMultiple(itemId, imagesData) {
    try {
      return await prisma.itemImage.createMany({
        data: imagesData.map((img, idx) => ({
          item_id: parseInt(itemId),
          url: img.url,
          alt_text: img.alt_text || null,
          position: img.position || idx,
          is_main: img.is_main || false
        }))
      });
    } catch (error) {
      throw new Error(`Erreur création images multiples: ${error.message}`);
    }
  },

  async findByItemId(itemId) {
    try {
      return await prisma.itemImage.findMany({
        where: { item_id: parseInt(itemId) },
        orderBy: { position: 'asc' }
      });
    } catch (error) {
      throw new Error(`Erreur récupération images: ${error.message}`);
    }
  },

  async deleteById(imageId) {
    try {
      return await prisma.itemImage.delete({
        where: { id: parseInt(imageId) }
      });
    } catch (error) {
      throw new Error(`Erreur suppression image: ${error.message}`);
    }
  },

  async updatePosition(itemId, imageId, position) {
    try {
      return await prisma.itemImage.update({
        where: { id: parseInt(imageId) },
        data: { position }
      });
    } catch (error) {
      throw new Error(`Erreur mise à jour position: ${error.message}`);
    }
  },

  async setMainImage(itemId, imageId) {
    try {
      // D'abord désactiver toutes les autres images principales
      await prisma.itemImage.updateMany({
        where: { item_id: parseInt(itemId) },
        data: { is_main: false }
      });

      // Puis activer celle-ci
      return await prisma.itemImage.update({
        where: { id: parseInt(imageId) },
        data: { is_main: true }
      });
    } catch (error) {
      throw new Error(`Erreur définition image principale: ${error.message}`);
    }
  },

  async deleteByItemId(itemId) {
    try {
      return await prisma.itemImage.deleteMany({
        where: { item_id: parseInt(itemId) }
      });
    } catch (error) {
      throw new Error(`Erreur suppression images item: ${error.message}`);
    }
  }
};

const ItemDocumentRepository = {
  async create(itemId, documentData) {
    try {
      return await prisma.itemDocument.create({
        data: {
          item_id: parseInt(itemId),
          url: documentData.url,
          filename: documentData.filename,
          type: documentData.type || 'OTHER'
        }
      });
    } catch (error) {
      throw new Error(`Erreur création document: ${error.message}`);
    }
  },

  async createMultiple(itemId, documentsData) {
    try {
      return await prisma.itemDocument.createMany({
        data: documentsData.map(doc => ({
          item_id: parseInt(itemId),
          url: doc.url,
          filename: doc.filename,
          type: doc.type || 'OTHER'
        }))
      });
    } catch (error) {
      throw new Error(`Erreur création documents multiples: ${error.message}`);
    }
  },

  async findByItemId(itemId) {
    try {
      return await prisma.itemDocument.findMany({
        where: { item_id: parseInt(itemId) },
        orderBy: { created_at: 'asc' }
      });
    } catch (error) {
      throw new Error(`Erreur récupération documents: ${error.message}`);
    }
  },

  async deleteById(documentId) {
    try {
      return await prisma.itemDocument.delete({
        where: { id: parseInt(documentId) }
      });
    } catch (error) {
      throw new Error(`Erreur suppression document: ${error.message}`);
    }
  },

  async deleteByItemId(itemId) {
    try {
      return await prisma.itemDocument.deleteMany({
        where: { item_id: parseInt(itemId) }
      });
    } catch (error) {
      throw new Error(`Erreur suppression documents item: ${error.message}`);
    }
  }
};

module.exports = { ItemImageRepository, ItemDocumentRepository };
