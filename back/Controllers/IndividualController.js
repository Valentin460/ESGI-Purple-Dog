const IndividualService = require('../Services/IndividualService');

const IndividualController = {
  // POST /individuals - Créer avec email/password (cas 1)
  createIndividual: async (req, res) => {
    try {
      // Si email et password_hash : créer un nouvel user
      if (req.body.email && req.body.password_hash) {
        const result = await IndividualService.createIndividual(req.body);
        return res.status(201).json(result);
      }

      // Si user_id : créer pour un user existant
      if (req.body.user_id) {
        const result = await IndividualService.createIndividualForExistingUser(req.body);
        return res.status(201).json(result);
      }

      res.status(400).json({
        success: false,
        error: 'Fournis soit (email + password_hash) soit (user_id)'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // GET /individuals - Récupérer tous
  getAllIndividuals: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await IndividualService.getAllIndividuals({
        page: parseInt(page),
        limit: parseInt(limit)
      });
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // GET /individuals/:id - Récupérer par ID
  getIndividualById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await IndividualService.getIndividualById(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  },

  // GET /individuals/user/:userId - Récupérer par user_id
  getIndividualByUserId: async (req, res) => {
    try {
      const { userId } = req.params;
      const result = await IndividualService.getIndividualByUserId(userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  },

  // PUT /individuals/:id - Mettre à jour
  updateIndividual: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await IndividualService.updateIndividual(id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // POST /individuals/:id/verify-age - Vérifier l'âge
  verifyAge: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await IndividualService.verifyAge(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // POST /individuals/:id/accept-rgpd - Accepter RGPD
  acceptRGPD: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await IndividualService.acceptRGPD(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // POST /individuals/:id/newsletter - S'abonner à la newsletter
  subscribeNewsletter: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await IndividualService.subscribeNewsletter(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // DELETE /individuals/:id - Supprimer
  deleteIndividual: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await IndividualService.deleteIndividual(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = IndividualController;