const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class AuthController {
  
  // ==========================================
  // POST /api/auth/register - Inscription
  // ==========================================
  
  static async register(req, res) {
    try {
      const { email, password, user_type } = req.body;
      
      // Validation des champs non vide
      if (!email || !password || !user_type) {
        return res.status(400).json({
          success: false,
          message: 'Email, password and user_type are required'
        });
      }
      
      // Validation du user_type
      if (!['individual', 'professional', 'admin'].includes(user_type)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid user_type. Must be: individual, professional, or admin'
        });
      }
      
      // regex email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid email format'
        });
      }
      
      // Minimum 6 characteres le mdp
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'Password must be at least 6 characters long'
        });
      }
      
      // Vérifier si l'email existe déjà
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email already registered'
        });
      }
      
      // Créer l'utilisateur (le mot de passe sera hashé dans le modèle)
      const user = await User.create({
        email,
        password,
        user_type
      });
      
      // Générer un token de vérification
      const verificationToken = crypto.randomBytes(32).toString('hex');
      await User.update(user.id, { verification_token: verificationToken });
      
      // TODO: Envoyer un email de vérification
      // await sendVerificationEmail(email, verificationToken);
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully. Please verify your email.',
        data: {
          id: user.id,
          email: user.email,
          user_type: user.user_type
        }
      });
      
    } catch (error) {
      console.error('Error in register:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
  
  // ==========================================
  // POST /api/auth/login - Connexion
  // ==========================================
  
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }
      
      // Trouver l'utilisateur
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
      
      // Vérifier si l'utilisateur est actif
      if (!user.is_active) {
        return res.status(403).json({
          success: false,
          message: 'Account is deactivated. Please contact support.'
        });
      }
      
      // Vérifier le mot de passe
      const isPasswordValid = await User.verifyPassword(password, user.password_hash);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
      
      // Générer les tokens JWT
      const accessToken = AuthController.generateAccessToken(user);
      const refreshToken = AuthController.generateRefreshToken(user);
      
      // TODO: Stocker le refresh token en DB pour pouvoir le révoquer
      // await storeRefreshToken(user.id, refreshToken);
      
      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            user_type: user.user_type,
            is_verified: user.is_verified
          },
          accessToken,
          refreshToken
        }
      });
      
    } catch (error) {
      console.error('Error in login:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
  
  // ==========================================
  // POST /api/auth/refresh - Rafraîchir le token
  // ==========================================
  
  static async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          message: 'Refresh token is required'
        });
      }
      
      // Vérifier le refresh token
      let decoded;
      try {
        decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret_key');
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired refresh token'
        });
      }
      
      // Récupérer l'utilisateur
      const user = await User.findById(decoded.id);
      if (!user || !user.is_active) {
        return res.status(401).json({
          success: false,
          message: 'User not found or inactive'
        });
      }
      
      // Générer un nouveau access token
      const accessToken = AuthController.generateAccessToken(user);
      
      res.json({
        success: true,
        data: {
          accessToken
        }
      });
      
    } catch (error) {
      console.error('Error in refreshToken:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
  
  // ==========================================
  // POST /api/auth/verify-email - Vérifier l'email
  // ==========================================
  
  static async verifyEmail(req, res) {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Verification token is required'
        });
      }
      
      // TODO: Implémenter la logique de vérification
      // Rechercher l'utilisateur avec ce token
      // Marquer is_verified = true
      // Supprimer le token
      
      res.json({
        success: true,
        message: 'Email verified successfully'
      });
      
    } catch (error) {
      console.error('Error in verifyEmail:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
  
  // ==========================================
  // POST /api/auth/logout - Déconnexion
  // ==========================================
  
  static async logout(req, res) {
    try {
      // TODO: Révoquer le refresh token en DB
      // const userId = req.user.id;
      // await revokeRefreshToken(userId);
      
      res.json({
        success: true,
        message: 'Logout successful'
      });
      
    } catch (error) {
      console.error('Error in logout:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
  
  // ==========================================
  // GET /api/auth/me - Obtenir l'utilisateur connecté
  // ==========================================
  
  static async getCurrentUser(req, res) {
    try {
      const userId = req.user.id; // Fourni par le middleware auth
      
      const profile = await User.getFullProfile(userId);
      
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Retirer le password_hash
      delete profile.password_hash;
      
      res.json({
        success: true,
        data: profile
      });
      
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
  
  // ==========================================
  // UTILITY - Générer Access Token (JWT)
  // ==========================================
  
  static generateAccessToken(user) {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        user_type: user.user_type
      },
      process.env.JWT_SECRET || 'secret_key',
      {
        expiresIn: '15m' // Token de courte durée
      }
    );
  }
  
  // ==========================================
  // UTILITY - Générer Refresh Token (JWT)
  // ==========================================
  
  static generateRefreshToken(user) {
    return jwt.sign(
      {
        id: user.id
      },
      process.env.JWT_REFRESH_SECRET || 'refresh_secret_key',
      {
        expiresIn: '7d' // Token de longue durée
      }
    );
  }
}

module.exports = AuthController;