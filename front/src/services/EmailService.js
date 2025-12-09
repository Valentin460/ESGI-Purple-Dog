/**
 * Service de gestion des emails pour le processus d'achat
 */

class EmailService {
  constructor() {
    this.apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
  }

  /**
   * Envoie un email de confirmation d'achat à l'acheteur
   */
  async envoyerConfirmationAcheteur(commande) {
    console.log(' Envoi email confirmation acheteur')

    const emailData = {
      destinataire: commande.acheteur.email,
      sujet: `Confirmation de votre achat - Commande ${commande.numero}`,
      template: 'confirmation-acheteur',
      data: {
        numeroCommande: commande.numero,
        objetNom: commande.objet.nom,
        prix: commande.montantTotal,
        transporteur: commande.transporteur.nom,
        delaiLivraison: commande.transporteur.delai,
        adresseLivraison: commande.adresseLivraison
      }
    }

    // Mock - à remplacer par un vrai appel API
    await this.simulerEnvoiEmail(emailData)

    return {
      success: true,
      message: 'Email de confirmation envoyé à l\'acheteur'
    }
  }

  /**
   * Envoie un email de notification de vente au vendeur
   */
  async envoyerNotificationVendeur(commande) {
    console.log(' Envoi email notification vendeur')

    const emailData = {
      destinataire: commande.vendeur.email,
      sujet: `Nouvelle vente - ${commande.objet.nom}`,
      template: 'notification-vendeur',
      data: {
        numeroCommande: commande.numero,
        objetNom: commande.objet.nom,
        prix: commande.objet.prix,
        acheteurNom: commande.acheteur.nom,
        transporteur: commande.transporteur.nom,
        dateEnlevementPrevue: commande.dateEnlevementPrevue,
        instructions: `Le transporteur ${commande.transporteur.nom} viendra récupérer l'objet le ${new Date(commande.dateEnlevementPrevue).toLocaleDateString('fr-FR')}. Veuillez préparer l'emballage.`
      }
    }

    await this.simulerEnvoiEmail(emailData)

    return {
      success: true,
      message: 'Email de notification envoyé au vendeur'
    }
  }

  /**
   * Envoie un email au transporteur pour programmer l'enlèvement
   */
  async envoyerDemandeEnlevementTransporteur(commande, detailsEnlevement) {
    console.log(' Envoi email demande enlèvement transporteur')

    const emailData = {
      destinataire: commande.transporteur.emailContact,
      sujet: `Nouvelle demande d'enlèvement - ${detailsEnlevement.numeroEnlevement}`,
      template: 'demande-enlevement',
      data: {
        numeroEnlevement: detailsEnlevement.numeroEnlevement,
        numeroSuivi: detailsEnlevement.numeroSuivi,
        dateEnlevement: detailsEnlevement.dateEnlevementPrevue,
        adresseEnlevement: commande.vendeur.adresse,
        adresseLivraison: commande.adresseLivraison,
        objetDescription: commande.objet.nom,
        dimensions: commande.objet.dimensions,
        poids: commande.objet.poids
      }
    }

    await this.simulerEnvoiEmail(emailData)

    return {
      success: true,
      message: 'Email envoyé au transporteur'
    }
  }

  /**
   * Envoie un email de notification de livraison à l'acheteur
   */
  async envoyerNotificationLivraison(commande, numeroSuivi) {
    console.log(' Envoi email notification livraison')

    const emailData = {
      destinataire: commande.acheteur.email,
      sujet: `Votre colis est en cours de livraison - ${numeroSuivi}`,
      template: 'notification-livraison',
      data: {
        numeroCommande: commande.numero,
        numeroSuivi: numeroSuivi,
        lienSuivi: `https://purpledog.com/suivre/${numeroSuivi}`,
        transporteur: commande.transporteur.nom,
        livraisonEstimee: commande.dateLivraisonEstimee
      }
    }

    await this.simulerEnvoiEmail(emailData)

    return {
      success: true,
      message: 'Email de notification de livraison envoyé'
    }
  }

  /**
   * Envoie un email de demande de signature de réception
   */
  async envoyerDemandeSignatureReception(commande) {
    console.log(' Envoi email demande signature réception')

    const emailData = {
      destinataire: commande.acheteur.email,
      sujet: `Confirmez la réception de votre colis - ${commande.numero}`,
      template: 'demande-signature',
      data: {
        numeroCommande: commande.numero,
        objetNom: commande.objet.nom,
        lienSignature: `https://purpledog.com/signer-reception/${commande.numero}`,
        delaiSignature: '48 heures'
      }
    }

    await this.simulerEnvoiEmail(emailData)

    return {
      success: true,
      message: 'Email de demande de signature envoyé'
    }
  }

  /**
   * Envoie un email de notification de paiement au vendeur
   */
  async envoyerNotificationPaiementVendeur(commande, datePaiement) {
    console.log(' Envoi email notification paiement vendeur')

    const emailData = {
      destinataire: commande.vendeur.email,
      sujet: `Paiement reçu - Commande ${commande.numero}`,
      template: 'notification-paiement',
      data: {
        numeroCommande: commande.numero,
        objetNom: commande.objet.nom,
        montant: commande.objet.prix,
        fraisCommission: commande.fraisCommission,
        montantNet: commande.objet.prix - commande.fraisCommission,
        datePaiement: datePaiement,
        delaiVirement: '3-5 jours ouvrés'
      }
    }

    await this.simulerEnvoiEmail(emailData)

    return {
      success: true,
      message: 'Email de notification de paiement envoyé au vendeur'
    }
  }

  /**
   * Envoie tous les emails de confirmation après un achat
   */
  async envoyerEmailsConfirmationAchat(commande, detailsEnlevement) {
    try {
      // Envoyer tous les emails en parallèle
      const resultats = await Promise.all([
        this.envoyerConfirmationAcheteur(commande),
        this.envoyerNotificationVendeur(commande),
        this.envoyerDemandeEnlevementTransporteur(commande, detailsEnlevement)
      ])

      console.log('Tous les emails de confirmation ont été envoyés')

      return {
        success: true,
        emailsEnvoyes: resultats.length,
        details: resultats
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi des emails:', error)
      throw error
    }
  }

  /**
   * Simule l'envoi d'un email (mock)
   */
  async simulerEnvoiEmail(emailData) {
    // Simuler un délai d'envoi
    await new Promise(resolve => setTimeout(resolve, 500))

    console.log('📨 Email simulé:', {
      destinataire: emailData.destinataire,
      sujet: emailData.sujet,
      template: emailData.template
    })

    return Promise.resolve()
  }

  /**
   * Appel réel à l'API backend pour envoyer un email
   * À décommenter quand le backend sera prêt
   */
  async envoyerEmailViaAPI(emailData) {
    try {
      const response = await fetch(`${this.apiUrl}/emails/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(emailData)
      })

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de l\'email')
      }

      return await response.json()
    } catch (error) {
      console.error('Erreur API email:', error)
      throw error
    }
  }
}

export default new EmailService()
