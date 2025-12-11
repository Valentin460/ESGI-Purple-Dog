const express = require('express');
const router = express.Router();
const UserController = require('../Controllers/UserController');

// 🔑 ROUTES SPÉCIFIQUES D'ABORD (avant les paramétriques)

// GET - Routes spéciales
router.get('/active', UserController.getActiveUsers);
router.get('/count', UserController.getUserCount);
router.get('/search', UserController.searchUsers);
router.get('/type/:type', UserController.getUsersByType);
router.get('/email/:email', UserController.getUserByEmail);

// POST - Créer un utilisateur
router.post('/', UserController.createUser);

// GET - Tous les utilisateurs
router.get('/', UserController.getAllUsers);

// POST - Désactiver
router.post('/:id/deactivate', UserController.deactivateUser);

// 🔑 ROUTES PARAMÉTRIQUES À LA FIN

// GET - Par ID
router.get('/:id', UserController.getUserById);

// GET - Stats utilisateur
router.get('/:id/stats', UserController.getUserStats);

// PUT - Mettre à jour utilisateur
router.put('/:id', UserController.updateUser);

// PATCH - Mot de passe
router.patch('/:id/password', UserController.updatePassword);

// PATCH - Toggle statut
router.patch('/:id/toggle-status', UserController.toggleUserStatus);

// PATCH - Activer
router.patch('/:id/activate', UserController.activateUser);

// DELETE - Supprimer
router.delete('/:id', UserController.deleteUser);

module.exports = router;