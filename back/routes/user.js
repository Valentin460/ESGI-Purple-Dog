// ==========================================
// Routes: User
// ==========================================

const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user');

// ==========================================
// Routes CRUD de base
// ==========================================

// POST /api/users - Créer un utilisateur
router.post('/', UserController.create);

// GET /api/users - Obtenir tous les utilisateurs (avec pagination et filtres)
router.get('/', UserController.getAll);

// GET /api/users/:id - Obtenir un utilisateur par ID
router.get('/:id', UserController.getById);

// GET /api/users/:id/profile - Obtenir le profil complet d'un utilisateur
router.get('/:id/profile', UserController.getProfile);

// PUT /api/users/:id - Mettre à jour un utilisateur
router.put('/:id', UserController.update);

// PUT /api/users/:id/password - Changer le mot de passe
router.put('/:id/password', UserController.updatePassword);

// DELETE /api/users/:id - Supprimer un utilisateur
router.delete('/:id', UserController.delete);

// ==========================================
// Routes spécifiques
// ==========================================

// GET /api/users/email/:email - Trouver un utilisateur par email
router.get('/email/:email', UserController.getByEmail);

module.exports = router;
