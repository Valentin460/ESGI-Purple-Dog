// ==========================================
// Controller: User
// ==========================================

const User = require('../models/User');

class UserController {
  
  // ==========================================
  // POST /api/users - Créer un utilisateur
  // ==========================================
  
  static async create(req, res) {
    try {
      const { email, password, user_type } = req.body;
      
      // Validation
      if (!email || !password || !user_type) {
        return res.status(400).json({
          success: false,
          message: 'Email, password and user_type are required'
        });
      }
      
      // Vérifier si l'email existe déjà
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Email already exists'
        });
      }
      
      // Créer l'utilisateur
      const user = await User.create({ email, password, user_type });
      
      res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: user
      });
      
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
  
  // ==========================================
  // GET /api/users - Obtenir tous les utilisateurs
  // ==========================================
  
  static async getAll(req, res) {
    try {
      const { limit = 10, offset = 0, user_type } = req.query;
      
      const result = await User.findAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
        user_type
      });
      
      res.status(200).json({
        success: true,
        data: result.users,
        pagination: {
          total: result.total,
          limit: result.limit,
          offset: result.offset,
          pages: Math.ceil(result.total / result.limit)
        }
      });
      
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
  
  // ==========================================
  // GET /api/users/:id - Obtenir un utilisateur par ID
  // ==========================================
  
  static async getById(req, res) {
    try {
      const { id } = req.params;
      
      const user = await User.findById(id);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: user
      });
      
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
  
  // ==========================================
  // GET /api/users/:id/profile - Obtenir le profil complet
  // ==========================================
  
  static async getProfile(req, res) {
    try {
      const { id } = req.params;
      
      const profile = await User.getFullProfile(id);
      
      if (!profile) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      res.status(200).json({
        success: true,
        data: profile
      });
      
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
  
  // ==========================================
  // PUT /api/users/:id - Mettre à jour un utilisateur
  // ==========================================
  
  static async update(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      // Vérifier que l'utilisateur existe
      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Mettre à jour
      const updatedUser = await User.update(id, updates);
      
      res.status(200).json({
        success: true,
        message: 'User updated successfully',
        data: updatedUser
      });
      
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
  
  // ==========================================
  // PUT /api/users/:id/password - Changer le mot de passe
  // ==========================================
  
  static async updatePassword(req, res) {
    try {
      const { id } = req.params;
      const { newPassword } = req.body;
      
      if (!newPassword) {
        return res.status(400).json({
          success: false,
          message: 'New password is required'
        });
      }
      
      // Vérifier que l'utilisateur existe
      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Mettre à jour le mot de passe
      const success = await User.updatePassword(id, newPassword);
      
      if (success) {
        res.status(200).json({
          success: true,
          message: 'Password updated successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to update password'
        });
      }
      
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
  
  // ==========================================
  // DELETE /api/users/:id - Supprimer un utilisateur
  // ==========================================
  
  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      // Vérifier que l'utilisateur existe
      const existingUser = await User.findById(id);
      if (!existingUser) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Supprimer
      const success = await User.delete(id);
      
      if (success) {
        res.status(200).json({
          success: true,
          message: 'User deleted successfully'
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to delete user'
        });
      }
      
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
  
  // ==========================================
  // GET /api/users/email/:email - Trouver par email
  // ==========================================
  
  static async getByEmail(req, res) {
    try {
      const { email } = req.params;
      
      const user = await User.findByEmail(email);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }
      
      // Retirer le password_hash de la réponse
      delete user.password_hash;
      
      res.status(200).json({
        success: true,
        data: user
      });
      
    } catch (error) {
      console.error('Error fetching user by email:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = UserController;
