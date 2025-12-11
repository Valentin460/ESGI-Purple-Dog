const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const BidRepository = require('../Repository/BidRepository');
const AuctionRepository = require('../Repository/AuctionRepository');

class BidService {
  async placeBid(bidData) {
    const { auction_id, bidder_id, amount, is_autobid, max_autobid_amount } = bidData;

    if (!auction_id || !bidder_id || !amount) {
      throw new Error('auction_id, bidder_id et amount sont obligatoires');
    }

    try {
      const result = await prisma.$transaction(async (tx) => {
        const auction = await tx.auction.findUnique({
          where: { id: parseInt(auction_id) },
          include: {
            item: {
              include: {
                seller: true
              }
            }
          }
        });

        if (!auction) {
          throw new Error('Enchère non trouvée');
        }

        if (auction.status !== 'ACTIVE') {
          throw new Error('Cette enchère n\'est pas active');
        }

        if (new Date() > new Date(auction.end_time)) {
          throw new Error('Cette enchère est terminée');
        }

        if (parseInt(bidder_id) === auction.item.seller_id) {
          throw new Error('Vous ne pouvez pas enchérir sur votre propre item');
        }

        const minBidAmount = parseFloat(auction.current_price) + parseFloat(auction.increment_step);
        if (parseFloat(amount) < minBidAmount) {
          throw new Error(`L'enchère minimale est de ${minBidAmount}€`);
        }

        // Marquer toutes les enchères précédentes comme non gagnantes
        await tx.bid.updateMany({
          where: { auction_id: parseInt(auction_id) },
          data: { is_winning: false }
        });

        // Créer la nouvelle enchère
        const newBid = await tx.bid.create({
          data: {
            auction_id: parseInt(auction_id),
            bidder_id: parseInt(bidder_id),
            amount: parseFloat(amount),
            is_autobid: is_autobid || false,
            max_autobid_amount: max_autobid_amount ? parseFloat(max_autobid_amount) : null,
            is_winning: true
          },
          include: {
            bidder: true,
            auction: {
              include: {
                item: true
              }
            }
          }
        });

        // Mettre à jour le prix actuel de l'enchère
        await tx.auction.update({
          where: { id: parseInt(auction_id) },
          data: { current_price: parseFloat(amount) }
        });

        return newBid;
      });

      return {
        success: true,
        message: 'Enchère placée avec succès',
        data: result
      };
    } catch (error) {
      throw new Error(`Erreur placement enchère: ${error.message}`);
    }
  }

  async getAllBids(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const skip = (page - 1) * limit;

      const where = {};
      if (filters.auction_id) where.auction_id = parseInt(filters.auction_id);
      if (filters.bidder_id) where.bidder_id = parseInt(filters.bidder_id);

      const bids = await BidRepository.findAll({ skip, take: limit, where });
      const total = await BidRepository.count(where);

      return {
        success: true,
        data: bids,
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

  async getBidById(bidId) {
    try {
      const bid = await BidRepository.findById(bidId);
      if (!bid) {
        throw new Error('Enchère non trouvée');
      }

      return {
        success: true,
        data: bid
      };
    } catch (error) {
      throw new Error(`Erreur récupération enchère: ${error.message}`);
    }
  }

  async getBidsByAuction(auctionId) {
    try {
      const bids = await BidRepository.findByAuctionId(auctionId);

      return {
        success: true,
        data: bids
      };
    } catch (error) {
      throw new Error(`Erreur récupération enchères: ${error.message}`);
    }
  }

  async getBidsByBidder(bidderId) {
    try {
      const bids = await BidRepository.findByBidderId(bidderId);

      return {
        success: true,
        data: bids
      };
    } catch (error) {
      throw new Error(`Erreur récupération enchères: ${error.message}`);
    }
  }

  async getBidsByUser(userId) {
    try {
      const bids = await BidRepository.findByUserId(parseInt(userId));
      return {
        success: true,
        data: bids,
        count: bids.length
      };
    } catch (error) {
      throw new Error(`Erreur récupération enchères utilisateur: ${error.message}`);
    }
  }

  async getHighestBid(auctionId) {
    try {
      const bid = await BidRepository.findHighestBid(auctionId);
      if (!bid) {
        throw new Error('Aucune enchère trouvée pour cette vente');
      }

      return {
        success: true,
        data: bid
      };
    } catch (error) {
      throw new Error(`Erreur récupération enchère la plus haute: ${error.message}`);
    }
  }

  async getWinningBid(auctionId) {
    try {
      const bid = await BidRepository.findWinningBid(parseInt(auctionId));
      
      if (!bid) {
        throw new Error('Aucune enchère gagnante trouvée pour cette auction');
      }

      return {
        success: true,
        data: bid
      };
    } catch (error) {
      throw new Error(`Erreur récupération enchère gagnante: ${error.message}`);
    }
  }

  async deleteBid(bidId) {
    try {
      const bid = await BidRepository.findById(bidId);
      if (!bid) {
        throw new Error('Enchère non trouvée');
      }

      await BidRepository.delete(bidId);

      return {
        success: true,
        message: 'Enchère supprimée'
      };
    } catch (error) {
      throw new Error(`Erreur suppression enchère: ${error.message}`);
    }
  }
}

module.exports = new BidService();