const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const TransactionRepository = require('../Repository/TransactionRepository');

class TransactionService {
  async createTransaction(transactionData) {
    const { 
      item_id, 
      buyer_id, 
      seller_id, 
      item_price, 
      shipping_cost,
      payment_method 
    } = transactionData;

    if (!item_id || !buyer_id || !seller_id || !item_price) {
      throw new Error('item_id, buyer_id, seller_id et item_price sont obligatoires');
    }

    try {
      const result = await prisma.$transaction(async (tx) => {
        // Vérifier que l'item existe
        const item = await tx.item.findUnique({
          where: { id: parseInt(item_id) }
        });

        if (!item) {
          throw new Error('Item non trouvé');
        }

        if (item.status === 'SOLD') {
          throw new Error('Cet item est déjà vendu');
        }

        // Vérifier que buyer et seller existent
        const buyer = await tx.user.findUnique({ where: { id: parseInt(buyer_id) } });
        if (!buyer) {
          throw new Error('Acheteur non trouvé');
        }

        const seller = await tx.user.findUnique({ where: { id: parseInt(seller_id) } });
        if (!seller) {
          throw new Error('Vendeur non trouvé');
        }

        if (parseInt(buyer_id) === parseInt(seller_id)) {
          throw new Error('L\'acheteur et le vendeur ne peuvent pas être la même personne');
        }

        // Vérifier si une transaction existe déjà pour cet item
        const existingTransaction = await tx.transaction.findFirst({
          where: { item_id: parseInt(item_id) }
        });

        if (existingTransaction) {
          throw new Error('Une transaction existe déjà pour cet item');
        }

        // Calculer les frais selon le schema
        const itemPriceValue = parseFloat(item_price);
        const shippingCostValue = shipping_cost ? parseFloat(shipping_cost) : 0;
        const platformFeeBuyer = itemPriceValue * 0.03;  // 3% commission acheteur
        const platformFeeSeller = itemPriceValue * 0.02; // 2% commission vendeur
        const totalBuyerPays = itemPriceValue + shippingCostValue + platformFeeBuyer;
        const totalSellerReceives = itemPriceValue - platformFeeSeller;

        const newTransaction = await tx.transaction.create({
          data: {
            item_id: parseInt(item_id),
            buyer_id: parseInt(buyer_id),
            seller_id: parseInt(seller_id),
            item_price: itemPriceValue,
            shipping_cost: shippingCostValue,
            platform_fee_buyer: platformFeeBuyer,
            platform_fee_seller: platformFeeSeller,
            total_buyer_pays: totalBuyerPays,
            total_seller_receives: totalSellerReceives,
            status: 'PENDING_PAYMENT',
            payment_method: payment_method || null
          },
          include: {
            buyer: {
              select: {
                id: true,
                email: true
              }
            },
            seller: {
              select: {
                id: true,
                email: true
              }
            },
            item: true
          }
        });

        // Mettre à jour le statut de l'item
        await tx.item.update({
          where: { id: parseInt(item_id) },
          data: { status: 'SOLD' }
        });

        return newTransaction;
      });

      return {
        success: true,
        message: 'Transaction créée avec succès',
        data: result
      };
    } catch (error) {
      throw new Error(`Erreur création transaction: ${error.message}`);
    }
  }

  async getAllTransactions(filters = {}, pagination = {}) {
    try {
      const { page = 1, limit = 10 } = pagination;
      const skip = (page - 1) * limit;

      const where = {};
      if (filters.status) where.status = filters.status;
      if (filters.buyer_id) where.buyer_id = parseInt(filters.buyer_id);
      if (filters.seller_id) where.seller_id = parseInt(filters.seller_id);

      const transactions = await TransactionRepository.findAll({ skip, take: limit, where });
      const total = await TransactionRepository.count(where);

      return {
        success: true,
        data: transactions,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw new Error(`Erreur récupération transactions: ${error.message}`);
    }
  }

  async getTransactionById(transactionId) {
    try {
      const transaction = await TransactionRepository.findById(transactionId);
      if (!transaction) {
        throw new Error('Transaction non trouvée');
      }

      return {
        success: true,
        data: transaction
      };
    } catch (error) {
      throw new Error(`Erreur récupération transaction: ${error.message}`);
    }
  }

  async getUserTransactions(userId) {
    try {
      const transactions = await TransactionRepository.findByUserId(userId);

      return {
        success: true,
        data: transactions
      };
    } catch (error) {
      throw new Error(`Erreur récupération transactions utilisateur: ${error.message}`);
    }
  }

  async getBuyerTransactions(buyerId) {
    try {
      const transactions = await TransactionRepository.findByBuyerId(buyerId);

      return {
        success: true,
        data: transactions
      };
    } catch (error) {
      throw new Error(`Erreur récupération achats: ${error.message}`);
    }
  }

  async getSellerTransactions(sellerId) {
    try {
      const transactions = await TransactionRepository.findBySellerId(sellerId);

      return {
        success: true,
        data: transactions
      };
    } catch (error) {
      throw new Error(`Erreur récupération ventes: ${error.message}`);
    }
  }

  async updatePaymentStatus(transactionId, paymentStatus) {
    try {
      const transaction = await TransactionRepository.findById(transactionId);
      if (!transaction) {
        throw new Error('Transaction non trouvée');
      }

      // Mapping du statut de paiement vers TransactionStatus
      const statusMapping = {
        'PAID': 'PAYMENT_RECEIVED',
        'PENDING': 'PENDING_PAYMENT',
        'FAILED': 'CANCELLED',
        'REFUNDED': 'REFUNDED'
      };

      const newStatus = statusMapping[paymentStatus];
      if (!newStatus) {
        throw new Error(`Statut de paiement invalide. Valeurs autorisées: ${Object.keys(statusMapping).join(', ')}`);
      }

      const result = await prisma.$transaction(async (tx) => {
        const updateData = {
          status: newStatus
        };

        if (paymentStatus === 'PAID') {
          updateData.payment_date = new Date();
        }

        const updatedTransaction = await tx.transaction.update({
          where: { id: parseInt(transactionId) },
          data: updateData,
          include: {
            buyer: {
              select: { id: true, email: true }
            },
            seller: {
              select: { id: true, email: true }
            },
            item: true
          }
        });

        return updatedTransaction;
      });

      return {
        success: true,
        message: 'Statut de paiement mis à jour',
        data: result
      };
    } catch (error) {
      throw new Error(`Erreur mise à jour statut paiement: ${error.message}`);
    }
  }

  async updateTransactionStatus(transactionId, status) {
    try {
      const transaction = await TransactionRepository.findById(transactionId);
      if (!transaction) {
        throw new Error('Transaction non trouvée');
      }

      const validStatuses = [
        'PENDING_PAYMENT',
        'PAYMENT_RECEIVED',
        'PREPARING_SHIPMENT',
        'SHIPPED',
        'DELIVERED',
        'COMPLETED',
        'CANCELLED',
        'REFUNDED'
      ];

      if (!validStatuses.includes(status)) {
        throw new Error(`Statut invalide. Valeurs autorisées: ${validStatuses.join(', ')}`);
      }

      const updateData = { status };

      if (status === 'COMPLETED') {
        updateData.funds_released_at = new Date();
      }

      const updatedTransaction = await TransactionRepository.update(transactionId, updateData);

      return {
        success: true,
        message: 'Statut de transaction mis à jour',
        data: updatedTransaction
      };
    } catch (error) {
      throw new Error(`Erreur mise à jour statut transaction: ${error.message}`);
    }
  }

  async addTrackingNumber(transactionId, trackingNumber) {
    try {
      const transaction = await TransactionRepository.findById(transactionId);
      if (!transaction) {
        throw new Error('Transaction non trouvée');
      }

      const updatedTransaction = await TransactionRepository.update(transactionId, {
        shipment_tracking: trackingNumber,
        status: 'SHIPPED'
      });

      return {
        success: true,
        message: 'Numéro de suivi ajouté',
        data: updatedTransaction
      };
    } catch (error) {
      throw new Error(`Erreur ajout numéro de suivi: ${error.message}`);
    }
  }

  async getSellerRevenue(sellerId) {
    try {
      const revenue = await TransactionRepository.getTotalRevenue(sellerId);

      return {
        success: true,
        data: {
          seller_id: parseInt(sellerId),
          total_revenue: revenue
        }
      };
    } catch (error) {
      throw new Error(`Erreur calcul revenus: ${error.message}`);
    }
  }

  async cancelTransaction(transactionId, reason) {
    try {
      const transaction = await TransactionRepository.findById(transactionId);
      if (!transaction) {
        throw new Error('Transaction non trouvée');
      }

      if (transaction.status === 'COMPLETED') {
        throw new Error('Impossible d\'annuler une transaction complétée');
      }

      const result = await prisma.$transaction(async (tx) => {
        const updatedTransaction = await tx.transaction.update({
          where: { id: parseInt(transactionId) },
          data: {
            status: 'CANCELLED'
          },
          include: {
            buyer: {
              select: { id: true, email: true }
            },
            seller: {
              select: { id: true, email: true }
            },
            item: true
          }
        });

        // Remettre l'item en vente
        await tx.item.update({
          where: { id: transaction.item_id },
          data: { status: 'PUBLISHED' }
        });

        return updatedTransaction;
      });

      return {
        success: true,
        message: 'Transaction annulée',
        data: result
      };
    } catch (error) {
      throw new Error(`Erreur annulation transaction: ${error.message}`);
    }
  }

  async deleteTransaction(transactionId) {
    try {
      const transaction = await TransactionRepository.findById(transactionId);
      if (!transaction) {
        throw new Error('Transaction non trouvée');
      }

      await TransactionRepository.delete(transactionId);

      return {
        success: true,
        message: 'Transaction supprimée'
      };
    } catch (error) {
      throw new Error(`Erreur suppression transaction: ${error.message}`);
    }
  }
}

module.exports = new TransactionService();