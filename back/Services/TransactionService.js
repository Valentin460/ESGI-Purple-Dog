const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const TransactionRepository = require('../Repository/TransactionRepository');
const ItemRepository = require('../Repository/ItemRepository');

class TransactionService {
  async createTransaction(transactionData) {
    const { item_id, buyer_id, seller_id, total_amount, payment_method } = transactionData;

    if (!item_id || !buyer_id || !seller_id || !total_amount || !payment_method) {
      throw new Error('item_id, buyer_id, seller_id, total_amount et payment_method sont obligatoires');
    }

    try {
      const result = await prisma.$transaction(async (tx) => {
        const item = await tx.item.findUnique({
          where: { id: parseInt(item_id) }
        });

        if (!item) {
          throw new Error('Item non trouvé');
        }

        if (item.status === 'SOLD') {
          throw new Error('Cet item est déjà vendu');
        }

        if (parseInt(buyer_id) === parseInt(seller_id)) {
          throw new Error('L\'acheteur et le vendeur ne peuvent pas être la même personne');
        }

        const existingTransaction = await tx.transaction.findFirst({
          where: { item_id: parseInt(item_id) }
        });

        if (existingTransaction) {
          throw new Error('Une transaction existe déjà pour cet item');
        }

        const platformFee = parseFloat(total_amount) * 0.10; // 10% de commission
        const sellerAmount = parseFloat(total_amount) - platformFee;

        const newTransaction = await tx.transaction.create({
          data: {
            item_id: parseInt(item_id),
            buyer_id: parseInt(buyer_id),
            seller_id: parseInt(seller_id),
            total_amount: parseFloat(total_amount),
            platform_fee: platformFee,
            seller_amount: sellerAmount,
            payment_method,
            payment_status: 'PENDING',
            status: 'PENDING',
            shipping_address: transactionData.shipping_address || null,
            tracking_number: transactionData.tracking_number || null
          },
          include: {
            buyer: true,
            seller: true,
            item: true
          }
        });

        await tx.item.update({
          where: { id: parseInt(item_id) },
          data: { status: 'PENDING_PAYMENT' }
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
      if (filters.payment_status) where.payment_status = filters.payment_status;
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

      const validStatuses = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];
      if (!validStatuses.includes(paymentStatus)) {
        throw new Error(`Statut de paiement invalide. Valeurs autorisées: ${validStatuses.join(', ')}`);
      }

      const result = await prisma.$transaction(async (tx) => {
        const updateData = {
          payment_status: paymentStatus
        };

        if (paymentStatus === 'PAID') {
          updateData.paid_at = new Date();
          updateData.status = 'PROCESSING';

          await tx.item.update({
            where: { id: transaction.item_id },
            data: { status: 'SOLD' }
          });
        }

        if (paymentStatus === 'FAILED') {
          await tx.item.update({
            where: { id: transaction.item_id },
            data: { status: 'PUBLISHED' }
          });
        }

        const updatedTransaction = await tx.transaction.update({
          where: { id: parseInt(transactionId) },
          data: updateData,
          include: {
            buyer: true,
            seller: true,
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

      const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'REFUNDED'];
      if (!validStatuses.includes(status)) {
        throw new Error(`Statut invalide. Valeurs autorisées: ${validStatuses.join(', ')}`);
      }

      const updateData = { status };

      if (status === 'SHIPPED') {
        updateData.shipped_at = new Date();
      }

      if (status === 'DELIVERED') {
        updateData.delivered_at = new Date();
      }

      if (status === 'COMPLETED') {
        updateData.completed_at = new Date();
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
        tracking_number: trackingNumber,
        status: 'SHIPPED',
        shipped_at: new Date()
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
          seller_id: sellerId,
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
            status: 'CANCELLED',
            cancellation_reason: reason || null
          },
          include: {
            buyer: true,
            seller: true,
            item: true
          }
        });

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