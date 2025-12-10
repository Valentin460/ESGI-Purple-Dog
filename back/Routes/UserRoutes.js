const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/UserController');

// 🔑 ROUTES SPÉCIFIQUES D'ABORD (avant les paramétriques)

// POST - Créer un utilisateur
router.post('/', UserController.createUser);

// GET - Tous les utilisateurs
router.get('/', UserController.getAllUsers);

// POST - Vérifier
// router.post('/:id/verify', UserController.verifyUser);

// POST - Désactiver
router.post('/:id/deactivate', UserController.deactivateUser);

// PUT - Mettre à jour profil individu
// router.put('/:id/individual', UserController.updateIndividual);

// PUT - Mettre à jour profil professionnel
// router.put('/:id/professional', UserController.updateProfessional);

// 🔑 ROUTES PARAMÉTRIQUES À LA FIN

// GET - Par email (avant /:id pour éviter la capture)
router.get('/email/:email', UserController.getUserByEmail);

// GET - Par ID
router.get('/:id', UserController.getUserById);

// PUT - Mettre à jour utilisateur
router.put('/:id', UserController.updateUser);

// DELETE - Supprimer
router.delete('/:id', UserController.deleteUser);

module.exports = router;