const ProfessionalService = require('../Services/ProfessionalService');

const ProfessionalController = {
  // POST /professionals - Créer
  createProfessional: async (req, res) => {
    try {
      const result = await ProfessionalService.createProfessional(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // GET /professionals - Récupérer tous
  getAllProfessionals: async (req, res) => {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await ProfessionalService.getAllProfessionals({
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

  // GET /professionals/:id - Récupérer par ID
  getProfessionalById: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await ProfessionalService.getProfessionalById(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  },

  // GET /professionals/user/:userId - Récupérer par user_id
  getProfessionalByUserId: async (req, res) => {
    try {
      const { userId } = req.params;
      const result = await ProfessionalService.getProfessionalByUserId(userId);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  },

  // PUT /professionals/:id - Mettre à jour
  updateProfessional: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await ProfessionalService.updateProfessional(id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // POST /professionals/:id/sign-mandate - Signer le mandat
  signMandate: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await ProfessionalService.signMandate(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },

  // DELETE /professionals/:id - Supprimer
  deleteProfessional: async (req, res) => {
    try {
      const { id } = req.params;
      const result = await ProfessionalService.deleteProfessional(id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }
};

module.exports = ProfessionalController;