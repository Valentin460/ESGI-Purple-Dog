// ==========================================
// Model: User
// ==========================================

const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

class User {

  // CREATE - Créer un utilisateur
  static async create({ email, password, user_type }) {
    try {
      // Hasher le mot de passe
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(password, saltRounds);
      
      const query = `
        INSERT INTO users (email, password_hash, user_type)
        VALUES ($1, $2, $3)
        RETURNING id, email, user_type, is_verified, is_active, created_at
      `;
      
      const values = [email, password_hash, user_type];
      const result = await pool.query(query, values);
      
      return result.rows[0];
      
    } catch (error) {
      throw error;
    }
  }
  
  // ==========================================
  // READ - Trouver un utilisateur par ID
  // ==========================================
  
  static async findById(id) {
    try {
      const query = `
        SELECT id, email, user_type, is_verified, is_active, created_at, updated_at
        FROM users
        WHERE id = $1
      `;
      
      const result = await pool.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0];
      
    } catch (error) {
      throw error;
    }
  }
  
  // ==========================================
  // READ - Trouver un utilisateur par email
  // ==========================================
  
  static async findByEmail(email) {
    try {
      const query = `
        SELECT id, email, password_hash, user_type, is_verified, is_active, created_at, updated_at
        FROM users
        WHERE email = $1
      `;
      
      const result = await pool.query(query, [email]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0];
      
    } catch (error) {
      throw error;
    }
  }
  
  // ==========================================
  // READ - Obtenir tous les utilisateurs
  // ==========================================
  
  static async findAll({ limit = 10, offset = 0, user_type = null }) {
    try {
      let query = `
        SELECT id, email, user_type, is_verified, is_active, created_at, updated_at
        FROM users
      `;
      
      const values = [];
      
      // Filtrer par type si spécifié
      if (user_type) {
        query += ` WHERE user_type = $1`;
        values.push(user_type);
      }
      
      query += ` ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
      values.push(limit, offset);
      
      const result = await pool.query(query, values);
      
      // Compter le total
      const countQuery = user_type 
        ? `SELECT COUNT(*) FROM users WHERE user_type = $1`
        : `SELECT COUNT(*) FROM users`;
      
      const countValues = user_type ? [user_type] : [];
      const countResult = await pool.query(countQuery, countValues);
      
      return {
        users: result.rows,
        total: parseInt(countResult.rows[0].count),
        limit,
        offset
      };
      
    } catch (error) {
      throw error;
    }
  }
  
  // ==========================================
  // UPDATE - Mettre à jour un utilisateur
  // ==========================================
  
  static async update(id, updates) {
    try {
      const allowedFields = ['email', 'is_verified', 'is_active'];
      const fields = [];
      const values = [];
      let paramCount = 1;
      
      // Construire dynamiquement la requête UPDATE
      for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key)) {
          fields.push(`${key} = $${paramCount}`);
          values.push(value);
          paramCount++;
        }
      }
      
      if (fields.length === 0) {
        throw new Error('No valid fields to update');
      }
      
      values.push(id);
      
      const query = `
        UPDATE users
        SET ${fields.join(', ')}, updated_at = NOW()
        WHERE id = $${paramCount}
        RETURNING id, email, user_type, is_verified, is_active, updated_at
      `;
      
      const result = await pool.query(query, values);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return result.rows[0];
      
    } catch (error) {
      throw error;
    }
  }
  
  // ==========================================
  // UPDATE - Changer le mot de passe
  // ==========================================
  
  static async updatePassword(id, newPassword) {
    try {
      const saltRounds = 10;
      const password_hash = await bcrypt.hash(newPassword, saltRounds);
      
      const query = `
        UPDATE users
        SET password_hash = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING id
      `;
      
      const result = await pool.query(query, [password_hash, id]);
      
      return result.rows.length > 0;
      
    } catch (error) {
      throw error;
    }
  }
  
  // ==========================================
  // DELETE - Supprimer un utilisateur
  // ==========================================
  
  static async delete(id) {
    try {
      const query = `
        DELETE FROM users
        WHERE id = $1
        RETURNING id
      `;
      
      const result = await pool.query(query, [id]);
      
      return result.rows.length > 0;
      
    } catch (error) {
      throw error;
    }
  }
  
  // ==========================================
  // UTILITY - Vérifier le mot de passe
  // ==========================================
  
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw error;
    }
  }
  
  // ==========================================
  // UTILITY - Obtenir le profil complet
  // ==========================================
  
  static async getFullProfile(userId) {
    try {
      // Récupérer l'utilisateur
      const user = await this.findById(userId);
      
      if (!user) {
        return null;
      }
      
      let profile = null;
      
      // Récupérer le profil selon le type
      if (user.user_type === 'individual') {
        const query = `SELECT * FROM individual_profiles WHERE user_id = $1`;
        const result = await pool.query(query, [userId]);
        profile = result.rows[0] || null;
      } else if (user.user_type === 'professional') {
        const query = `SELECT * FROM professional_profiles WHERE user_id = $1`;
        const result = await pool.query(query, [userId]);
        profile = result.rows[0] || null;
      }
      
      return {
        ...user,
        profile
      };
      
    } catch (error) {
      throw error;
    }
  }
}

module.exports = User;
