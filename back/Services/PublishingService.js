const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const ItemRepository = require('../Repository/ItemRepository');
const AuctionRepository = require('../Repository/AuctionRepository');
const { ItemImageRepository, ItemDocumentRepository } = require('../Repository/ItemMediaRepository');
const MediaService = require('./MediaService');

class PublishingService {
  /**
   * Créer un item avec tous les détails et le publier immédiatement
   * 
   * @param {Object} itemData - Les données de l'item
   * @param {Object} auctionData - Les données d'enchère (optionnel)
   * @param {Array} images - Les fichiers d'images uploadées
   * @param {Array} documents - Les fichiers de documents uploadés
   * @returns {Object} L'item créé et les détails de publication
   */
  async publishItem(itemData, auctionData = null, images = [], documents = []) {
    try {
      // Validation des données obligatoires
      this.validateItemData(itemData);

      // Valider le nombre d'images
      if (!images || images.length < 10) {
        throw new Error(`Minimum 10 photos requises. ${images ? images.length : 0} photo(s) fournie(s).`);
      }

      if (images.length > 20) {
        throw new Error('Maximum 20 photos autorisées');
      }

      // Créer l'item
      const newItem = await ItemRepository.create({
        seller_id: parseInt(itemData.seller_id),
        name: itemData.nom || itemData.name,
        description: itemData.description,
        desired_price: parseFloat(itemData.prix || itemData.desired_price),
        sale_type: itemData.typeVente === 'enchere' ? 'AUCTION' : 'QUICK_SALE',
        dimensions: JSON.stringify({
          hauteur: parseFloat(itemData.dimensions?.hauteur || 0),
          largeur: parseFloat(itemData.dimensions?.largeur || 0),
          profondeur: parseFloat(itemData.dimensions?.profondeur || 0)
        }),
        weight: itemData.poids ? parseFloat(itemData.poids) : null,
        ai_suggested_price: itemData.ai_suggested_price ? parseFloat(itemData.ai_suggested_price) : null,
        status: 'PUBLISHED',
        published_at: new Date(),
        view_count: 0
      });

      // Ajouter les images
      if (images && images.length > 0) {
        const imageUrls = images.map((file, index) => ({
          url: `/uploads/images/${file.filename}`,
          alt_text: `Photo ${index + 1}`,
          position: index,
          is_main: index === 0
        }));
        await ItemImageRepository.createMultiple(newItem.id, imageUrls);
      }

      // Ajouter les documents (optionnel)
      if (documents && documents.length > 0) {
        const documentUrls = documents.map(file => ({
          url: `/uploads/documents/${file.filename}`,
          filename: file.originalname,
          type: MediaService.getDocumentType(file.originalname)
        }));
        await ItemDocumentRepository.createMultiple(newItem.id, documentUrls);
      }

      // Ajouter la catégorie
      if (itemData.categorie) {
        // Chercher la catégorie par le nom ou créer une nouvelle
        let category = await prisma.category.findUnique({
          where: { slug: this.slugify(itemData.categorie) }
        });

        if (!category) {
          category = await prisma.category.create({
            data: {
              name: itemData.categorie,
              slug: this.slugify(itemData.categorie),
              is_active: true
            }
          });
        }

        await ItemRepository.addCategory(newItem.id, category.id);
      }

      // Créer l'enchère si type vente = enchères
      let auctionDetails = null;
      if (itemData.typeVente === 'enchere') {
        auctionDetails = await this.createAuctionForItem(newItem, itemData);
      }

      return {
        success: true,
        message: 'Objet publié avec succès',
        data: {
          item: newItem,
          auction: auctionDetails,
          images: {
            count: images.length,
            urls: images.map((f, i) => `/uploads/images/${f.filename}`)
          },
          documents: {
            count: documents.length,
            urls: documents.map(f => `/uploads/documents/${f.filename}`)
          }
        }
      };
    } catch (error) {
      throw new Error(`Erreur publication item: ${error.message}`);
    }
  }

  /**
   * Créer une enchère pour un item
   */
  async createAuctionForItem(item, itemData) {
    try {
      const desiredPrice = parseFloat(itemData.prix || itemData.desired_price);
      const startingPrice = parseFloat(itemData.prixDepart || (desiredPrice * 0.9).toFixed(2));
      
      // Durée par défaut : 7 jours
      const durationDays = parseInt(itemData.dureeEnchere || 7);
      const startTime = new Date();
      const endTime = new Date(startTime.getTime() + durationDays * 24 * 60 * 60 * 1000);

      const auction = await AuctionRepository.create({
        item_id: item.id,
        starting_price: startingPrice,
        reserve_price: desiredPrice,
        current_price: startingPrice,
        increment_step: this.calculateIncrementStep(desiredPrice),
        start_time: startTime,
        end_time: endTime,
        status: 'ACTIVE'
      });

      return {
        id: auction.id,
        starting_price: auction.starting_price,
        reserve_price: auction.reserve_price,
        current_price: auction.current_price,
        start_time: auction.start_time,
        end_time: auction.end_time,
        duration_days: durationDays,
        status: auction.status
      };
    } catch (error) {
      throw new Error(`Erreur création enchère: ${error.message}`);
    }
  }

  /**
   * Valider les données de l'item
   */
  validateItemData(itemData) {
    const requiredFields = [
      { field: 'seller_id', name: 'ID vendeur' },
      { field: 'nom', name: 'Nom de l\'objet' },
      { field: 'description', name: 'Description' },
      { field: 'prix', name: 'Prix souhaité' },
      { field: 'typeVente', name: 'Type de vente' },
      { field: 'categorie', name: 'Catégorie' }
    ];

    for (const { field, name } of requiredFields) {
      if (!itemData[field]) {
        throw new Error(`${name} est obligatoire`);
      }
    }

    if (itemData.dimensions) {
      if (!itemData.dimensions.hauteur || !itemData.dimensions.largeur || !itemData.dimensions.profondeur) {
        throw new Error('Toutes les dimensions sont obligatoires (hauteur, largeur, profondeur)');
      }
    }

    if (!itemData.poids) {
      throw new Error('Le poids est obligatoire');
    }

    if (itemData.typeVente !== 'enchere' && itemData.typeVente !== 'vente-rapide') {
      throw new Error('Type de vente invalide');
    }
  }

  /**
   * Calculer l'incrément d'enchère basé sur le prix
   */
  calculateIncrementStep(price) {
    if (price < 50) return 1;
    if (price < 100) return 2;
    if (price < 500) return 5;
    if (price < 1000) return 10;
    if (price < 5000) return 25;
    return 50;
  }

  /**
   * Créer un slug à partir d'une chaîne
   */
  slugify(text) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  /**
   * Récupérer les détails complets d'un item publié
   */
  async getPublishedItemDetails(itemId) {
    try {
      const item = await ItemRepository.findById(itemId);
      if (!item) {
        throw new Error('Item non trouvé');
      }

      const images = await ItemImageRepository.findByItemId(itemId);
      const documents = await ItemDocumentRepository.findByItemId(itemId);
      let auction = null;

      if (item.sale_type === 'AUCTION') {
        auction = await AuctionRepository.findByItemId(itemId);
      }

      return {
        success: true,
        data: {
          item,
          images,
          documents,
          auction
        }
      };
    } catch (error) {
      throw new Error(`Erreur récupération détails item: ${error.message}`);
    }
  }
}

module.exports = new PublishingService();
