const express = require('express');
const router = express.Router();
const IndividualController = require('../Controllers/IndividualController');

// POST - Créer
router.post('/', IndividualController.createIndividual);

// GET - Tous
router.get('/', IndividualController.getAllIndividuals);

// POST - Vérifier âge
router.post('/:id/verify-age', IndividualController.verifyAge);

// POST - Accepter RGPD
router.post('/:id/accept-rgpd', IndividualController.acceptRGPD);

// GET - Par user_id
router.get('/user/:userId', IndividualController.getIndividualByUserId);

// PUT - Mettre à jour par user_id
router.put('/user/:userId', IndividualController.updateIndividualByUserId);

// GET - Par ID
router.get('/:id', IndividualController.getIndividualById);

// PUT - Mettre à jour
router.put('/:id', IndividualController.updateIndividual);

// DELETE - Supprimer
router.delete('/:id', IndividualController.deleteIndividual);

module.exports = router;
