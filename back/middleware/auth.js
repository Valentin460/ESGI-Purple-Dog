// ==========================================
// Middleware: Authentication
// ==========================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ==========================================
// Middleware: Vérifier le JWT
// ==========================================

const authenticate = async (req, res, next) => {
  try {
    // Récupérer le token du header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Please login.'
      });
    }
    
    const token = authHeader.split(' ')[1];
    
    // Vérifier et décoder le token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expired. Please refresh your token or login again.'
        });
      }
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please login again.'
      });
    }
    
    // Récupérer l'utilisateur
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found. Token is invalid.'
      });
    }
    
    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated.'
      });
    }
    
    // Ajouter l'utilisateur à la requête
    req.user = {
      id: user.id,
      email: user.email,
      user_type: user.user_type,
      is_verified: user.is_verified
    };
    
    next();
    
  } catch (error) {
    console.error('Error in authenticate middleware:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
};

// ==========================================
// Middleware: Vérifier le rôle (authorization)
// ==========================================

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    if (!allowedRoles.includes(req.user.user_type)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
      });
    }
    
    next();
  };
};

// ==========================================
// Middleware: Vérifier que l'email est vérifié
// ==========================================

const requireVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated'
    });
  }
  
  if (!req.user.is_verified) {
    return res.status(403).json({
      success: false,
      message: 'Email not verified. Please verify your email to access this resource.'
    });
  }
  
  next();
};

// ==========================================
// Middleware: Rate limiting simple (optionnel)
// ==========================================

const loginAttempts = new Map();

const rateLimitLogin = (req, res, next) => {
  const identifier = req.ip || req.headers['x-forwarded-for'];
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxAttempts = 5;
  
  if (!loginAttempts.has(identifier)) {
    loginAttempts.set(identifier, []);
  }
  
  const attempts = loginAttempts.get(identifier);
  
  // Nettoyer les anciennes tentatives
  const recentAttempts = attempts.filter(time => now - time < windowMs);
  
  if (recentAttempts.length >= maxAttempts) {
    return res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please try again in 15 minutes.'
    });
  }
  
  recentAttempts.push(now);
  loginAttempts.set(identifier, recentAttempts);
  
  next();
};

module.exports = {
  authenticate,
  authorize,
  requireVerified,
  rateLimitLogin
};