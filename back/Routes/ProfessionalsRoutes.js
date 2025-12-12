const express = require('express');
const router = express.Router();
const ProfessionalController = require('../Controllers/ProfessionalController');


router.get('/search', ProfessionalController.searchProfessionals);
// POST - Créer
router.post('/', ProfessionalController.createProfessional);

// GET - Tous
router.get('/', ProfessionalController.getAllProfessionals);

// POST - Signer mandat
router.post('/:id/sign-mandate', ProfessionalController.signMandate);

// GET - Par user_id
router.get('/user/:userId', ProfessionalController.getProfessionalByUserId);

// PUT - Mettre à jour par user_id
router.put('/user/:userId', ProfessionalController.updateProfessionalByUserId);

// GET - Par ID
router.get('/:id', ProfessionalController.getProfessionalById);

// PUT - Mettre à jour
router.put('/:id', ProfessionalController.updateProfessional);

// DELETE - Supprimer
router.delete('/:id', ProfessionalController.deleteProfessional);

module.exports = router;
