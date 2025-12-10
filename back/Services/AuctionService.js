const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const AuctionRepository = require('../Repository/AuctionRepository');
const ItemRepository = require('../Repository/ItemRepository');

class AuctionService {
  async createAuction(auctionData) {
    const { item_id, starting_price, reserve_price, increment_step, start_time, end_time } = auctionData;

    if (!item_id || !starting_price || !reserve_price || !increment_step || !start_time || !end_time) {
      throw new Error('item_id, starting_price, reserve_price, increment_step, start_time et end_time sont obligatoires');
    }

    try {
      const item = await ItemRepository.findById(item_id);
      if (!item) {
        throw new Error('Item non trouvé');
      }

      if (item.sale_type !== 'AUCTION') {
        throw new Error('Cet item n\'est pas configuré pour les enchères');
      }

      const existingAuction = await AuctionRepository.findByItemId(item_id);
      if (existingAuction) {
        throw new Error('Une enchère existe déjà pour cet item');
      }

      const newAuction = await AuctionRepository.create({
        item_id: parseInt(item_id),
        starting_price: parseFloat(starting_price),
        reserve_price: parseFloat(reserve_price),
        current_price: parseFloat(starting_price),
        increment_step: parseFloat(increment_step),
        start_time: new Date(start_time),
        end_time: new Date(end_time),
        status: 'PENDING'
      });

      await ItemRepository.update(item_id, {
        status: 'IN_AUCTION'
      });

      return {
        success: true,
        message: 'Enchère créée avec succès',
        data: newAuction
      };
    } catch (error) {
      throw new Error(`Erreur création enchère: ${error.message}`);
    }
  }

  async getAllAuctions(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const skip = (page - 1) * limit;

      const where = {};
      if (filters.status) where.status = filters.status;

      const auctions = await AuctionRepository.findAll({ skip, take: limit, where });
      const total = await AuctionRepository.count();

      return {
        success: true,
        data: auctions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Erreur récupération enchères: ${error.message}`);
    }
  }

  async getActiveAuctions() {
    try {
      const auctions = await AuctionRepository.findActive();

      return {
        success: true,
        data: auctions
      };
    } catch (error) {
      throw new Error(`Erreur récupération enchères actives: ${error.message}`);
    }
  }

  async getAuctionById(auctionId) {
    try {
      const auction = await AuctionRepository.findById(auctionId);
      if (!auction) {
        throw new Error('Enchère non trouvée');
      }

      return {
        success: true,
        data: auction
      };
    } catch (error) {
      throw new Error(`Erreur récupération enchère: ${error.message}`);
    }
  }

  async startAuction(auctionId) {
    try {
      const auction = await AuctionRepository.findById(auctionId);
      if (!auction) {
        throw new Error('Enchère non trouvée');
      }

      if (auction.status !== 'PENDING') {
        throw new Error('Cette enchère ne peut pas être démarrée');
      }

      const updatedAuction = await AuctionRepository.update(auctionId, {
        status: 'ACTIVE',
        start_time: new Date()
      });

      return {
        success: true,
        message: 'Enchère démarrée',
        data: updatedAuction
      };
    } catch (error) {
      throw new Error(`Erreur démarrage enchère: ${error.message}`);
    }
  }

  async extendAuction(auctionId, extensionMinutes = 10) {
    try {
      const auction = await AuctionRepository.findById(auctionId);
      if (!auction) {
        throw new Error('Enchère non trouvée');
      }

      const newEndTime = new Date(auction.end_time);
      newEndTime.setMinutes(newEndTime.getMinutes() + extensionMinutes);

      const updatedAuction = await AuctionRepository.update(auctionId, {
        extended_end_time: newEndTime,
        status: 'EXTENDED'
      });

      return {
        success: true,
        message: `Enchère prolongée de ${extensionMinutes} minutes`,
        data: updatedAuction
      };
    } catch (error) {
      throw new Error(`Erreur prolongation enchère: ${error.message}`);
    }
  }

  async completeAuction(auctionId, winnerId) {
    try {
      const auction = await AuctionRepository.findById(auctionId);
      if (!auction) {
        throw new Error('Enchère non trouvée');
      }

      const updatedAuction = await AuctionRepository.update(auctionId, {
        status: 'COMPLETED',
        winner_id: winnerId ? parseInt(winnerId) : null
      });

      if (winnerId) {
        await ItemRepository.update(auction.item_id, {
          status: 'SOLD',
          sold_at: new Date()
        });
      } else {
        await ItemRepository.update(auction.item_id, {
          status: 'PUBLISHED'
        });
      }

      return {
        success: true,
        message: winnerId ? 'Enchère terminée avec gagnant' : 'Enchère terminée sans gagnant',
        data: updatedAuction
      };
    } catch (error) {
      throw new Error(`Erreur finalisation enchère: ${error.message}`);
    }
  }

  async cancelAuction(auctionId) {
    try {
      const auction = await AuctionRepository.findById(auctionId);
      if (!auction) {
        throw new Error('Enchère non trouvée');
      }

      const updatedAuction = await AuctionRepository.update(auctionId, {
        status: 'CANCELLED'
      });

      await ItemRepository.update(auction.item_id, {
        status: 'CANCELLED'
      });

      return {
        success: true,
        message: 'Enchère annulée',
        data: updatedAuction
      };
    } catch (error) {
      throw new Error(`Erreur annulation enchère: ${error.message}`);
    }
  }

  async deleteAuction(auctionId) {
    try {
      const auction = await AuctionRepository.findById(auctionId);
      if (!auction) {
        throw new Error('Enchère non trouvée');
      }

      await AuctionRepository.delete(auctionId);

      return {
        success: true,
        message: 'Enchère supprimée'
      };
    } catch (error) {
      throw new Error(`Erreur suppression enchère: ${error.message}`);
    }
  }
}

module.exports = new AuctionService();