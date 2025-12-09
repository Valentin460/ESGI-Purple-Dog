/**
 * Service de gestion des paiements avec Stripe
 */

class PaiementService {
  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
    this.stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
  }

  /**
   * Crée un paiement bloqué (escrow) avec Stripe
   * Le montant est bloqué mais pas encore transféré au vendeur
   */
  async creerPaiementBloque(commande, informationsCarte) {
    console.log(' Création du paiement bloqué Stripe')

    try {
      // Simuler l'appel à l'API Stripe
      const paiement = await this.simulerPaiementStripe({
        montant: commande.montantTotal,
        devise: 'EUR',
        description: `Achat ${commande.objet.nom} - Commande ${commande.numero}`,
        carte: informationsCarte,
        metadata: {
          numeroCommande: commande.numero,
          objetId: commande.objet.id,
          vendeurId: commande.vendeur.id,
          acheteurId: commande.acheteur.id
        }
      })

      console.log(' Paiement bloqué créé:', paiement.id)

      return {
        success: true,
        paiementId: paiement.id,
        montant: paiement.montant,
        statut: 'BLOQUE',
        dateCreation: new Date(),
        message: 'Paiement sécurisé - Fonds bloqués jusqu\'à confirmation de livraison'
      }
    } catch (error) {
      console.error(' Erreur lors du paiement:', error)
      throw new Error('Échec du paiement: ' + error.message)
    }
  }

  /**
   * Vérifie le statut d'un paiement
   */
  async verifierStatutPaiement(paiementId) {
    console.log(' Vérification du statut du paiement:', paiementId)

    // Mock - à remplacer par un vrai appel API
    await this.delay(500)

    return {
      paiementId,
      statut: 'BLOQUE',
      montant: 450,
      dateCreation: new Date(),
      dateLiberationPrevue: null
    }
  }

  /**
   * Libère le paiement au vendeur après confirmation de réception
   */
  async libererPaiementVendeur(paiementId, commandeId) {
    console.log(' Libération du paiement au vendeur')

    try {
      // Simuler l'appel API pour libérer les fonds
      await this.delay(1000)

      // Calculer la date de virement (3-5 jours ouvrés)
      const dateVirement = this.calculerDateVirement(5)

      console.log(' Paiement libéré - Virement prévu le', dateVirement)

      return {
        success: true,
        paiementId,
        commandeId,
        statut: 'LIBERE',
        dateLiberation: new Date(),
        dateVirementPrevue: dateVirement,
        message: 'Le paiement sera transféré au vendeur dans 3-5 jours ouvrés'
      }
    } catch (error) {
      console.error(' Erreur lors de la libération du paiement:', error)
      throw error
    }
  }

  /**
   * Annule un paiement et rembourse l'acheteur
   */
  async annulerPaiement(paiementId, raison) {
    console.log(' Annulation du paiement:', paiementId)

    try {
      // Simuler l'appel API Stripe pour annuler et rembourser
      await this.delay(1000)

      console.log(' Paiement annulé et remboursé')

      return {
        success: true,
        paiementId,
        statut: 'ANNULE',
        montantRembourse: 450,
        dateRemboursement: new Date(),
        delaiRemboursement: '5-10 jours ouvrés',
        raison,
        message: 'Le remboursement sera effectué sous 5-10 jours ouvrés'
      }
    } catch (error) {
      console.error(' Erreur lors de l\'annulation du paiement:', error)
      throw error
    }
  }

  /**
   * Crée une transaction complète (paiement + commission + frais)
   */
  async creerTransaction(commande, informationsCarte) {
    console.log(' Création de la transaction complète')

    const montantObjet = parseFloat(commande.objet.prix)
    const fraisPort = parseFloat(commande.transporteur.prix)
    const fraisService = parseFloat((montantObjet * 0.02).toFixed(2)) // 2% de commission
    const montantTotal = montantObjet + fraisPort + fraisService

    try {
      // Créer le paiement bloqué
      const paiement = await this.creerPaiementBloque(
        {
          ...commande,
          montantTotal,
          fraisCommission: fraisService
        },
        informationsCarte
      )

      // Créer l'enregistrement de la transaction
      const transaction = {
        id: 'TXN-' + Date.now(),
        numeroCommande: commande.numero,
        paiementId: paiement.paiementId,
        montantObjet,
        fraisPort,
        fraisService,
        montantTotal,
        statut: 'EN_ATTENTE_LIVRAISON',
        dateCreation: new Date(),
        historique: [
          {
            date: new Date(),
            statut: 'PAIEMENT_BLOQUE',
            description: 'Paiement sécurisé et bloqué en attente de livraison'
          }
        ]
      }

      console.log(' Transaction créée:', transaction.id)

      return {
        success: true,
        transaction,
        paiement
      }
    } catch (error) {
      console.error(' Erreur lors de la création de la transaction:', error)
      throw error
    }
  }

  /**
   * Met à jour le statut d'une transaction après signature de réception
   */
  async confirmerReception(transactionId, commandeId, signature) {
    console.log(' Confirmation de réception avec signature')

    try {
      await this.delay(800)

      const transaction = {
        id: transactionId,
        commandeId,
        statut: 'RECEPTION_CONFIRMEE',
        dateReception: new Date(),
        signature,
        prochainEtape: 'LIBERATION_PAIEMENT',
        delaiLiberation: '3-5 jours ouvrés'
      }

      console.log(' Réception confirmée - Libération du paiement programmée')

      return {
        success: true,
        transaction,
        message: 'Réception confirmée. Le vendeur recevra le paiement dans 3-5 jours ouvrés.'
      }
    } catch (error) {
      console.error(' Erreur lors de la confirmation de réception:', error)
      throw error
    }
  }

  /**
   * Calcule la date de virement en jours ouvrés
   */
  calculerDateVirement(joursOuvres) {
    const date = new Date()
    let joursAjoutes = 0

    while (joursAjoutes < joursOuvres) {
      date.setDate(date.getDate() + 1)
      // Si ce n'est pas samedi (6) ni dimanche (0)
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        joursAjoutes++
      }
    }

    return date
  }

  /**
   * Simule un appel à l'API Stripe (mock)
   */
  async simulerPaiementStripe(donneesPaiement) {
    await this.delay(2000) // Simuler le temps de traitement

    // Simuler une réponse Stripe
    return {
      id: 'pi_' + Math.random().toString(36).substring(2, 15),
      montant: donneesPaiement.montant,
      devise: donneesPaiement.devise,
      statut: 'requires_capture', // Paiement autorisé mais pas encore capturé
      description: donneesPaiement.description,
      metadata: donneesPaiement.metadata,
      created: Math.floor(Date.now() / 1000)
    }
  }

  /**
   * Utilitaire de délai
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Valide les informations de carte (basique)
   */
  validerCarte(informationsCarte) {
    const { numeroCarte, nomCarte, expiration, cvv } = informationsCarte

    // Supprimer les espaces du numéro de carte
    const numeroNettoye = numeroCarte.replace(/\s/g, '')

    // Vérifications basiques
    if (numeroNettoye.length !== 16) {
      return { valide: false, erreur: 'Numéro de carte invalide' }
    }

    if (!nomCarte || nomCarte.trim().length < 3) {
      return { valide: false, erreur: 'Nom sur la carte invalide' }
    }

    if (!/^\d{2}\/\d{2}$/.test(expiration)) {
      return { valide: false, erreur: 'Date d\'expiration invalide (format MM/AA)' }
    }

    if (cvv.length !== 3) {
      return { valide: false, erreur: 'CVV invalide' }
    }

    // Vérifier que la carte n'est pas expirée
    const [mois, annee] = expiration.split('/')
    const dateExpiration = new Date(2000 + parseInt(annee), parseInt(mois) - 1)
    if (dateExpiration < new Date()) {
      return { valide: false, erreur: 'Carte expirée' }
    }

    return { valide: true }
  }
}

export default new PaiementService()
