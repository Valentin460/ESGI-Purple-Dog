const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth');
const { authenticate, rateLimitLogin } = require('../middleware/auth');

// Routes publiques (pas besoin d'auth)

// POST /api/auth/register - Inscription
router.post('/register', AuthController.register);

// POST /api/auth/login - Connexion (avec rate limiting)
router.post('/login', rateLimitLogin, AuthController.login);

// POST /api/auth/refresh - Rafraîchir le token
router.post('/refresh', AuthController.refreshToken);

// POST /api/auth/verify-email - Vérifier l'email
router.post('/verify-email', AuthController.verifyEmail);

// Routes protégées (nécessitent auth)

// GET /api/auth/me - Obtenir l'utilisateur connecté (page profile)
router.get('/me', authenticate, AuthController.getCurrentUser);

// POST /api/auth/logout - Déconnexion
router.post('/logout', authenticate, AuthController.logout);

module.exports = router;