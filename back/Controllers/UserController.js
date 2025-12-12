const UserService = require('../services/UserService');

class UserController {
  async createUser(req, res) {
    try {
      const result = await UserService.createUser(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getAllUsers(req, res) {
    try {
      const { page, limit, user_type, is_active } = req.query;
      const result = await UserService.getAllUsers(
        { user_type, is_active },
        { page, limit }
      );
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async getUserById(req, res) {
    try {
      const result = await UserService.getUserById(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  async getUserByEmail(req, res) {
    try {
      const result = await UserService.getUserByEmail(req.params.email);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  async getUsersByType(req, res) {
    try {
      const result = await UserService.getUsersByType(req.params.type);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getActiveUsers(req, res) {
    try {
      const result = await UserService.getActiveUsers();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  async updateUser(req, res) {
    try {
      const result = await UserService.updateUser(req.params.id, req.body);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async updatePassword(req, res) {
    try {
      const { old_password, new_password } = req.body;
      const result = await UserService.updatePassword(req.params.id, old_password, new_password);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async toggleUserStatus(req, res) {
    try {
      const result = await UserService.toggleUserStatus(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async deactivateUser(req, res) {
    try {
      const result = await UserService.deactivateUser(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async activateUser(req, res) {
    try {
      const result = await UserService.activateUser(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async deleteUser(req, res) {
    try {
      const result = await UserService.deleteUser(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getUserStats(req, res) {
    try {
      const result = await UserService.getUserStats(req.params.id);
      res.status(200).json(result);
    } catch (error) {
      res.status(404).json({
        success: false,
        error: error.message
      });
    }
  }

  async searchUsers(req, res) {
    try {
      const { q } = req.query;
      const result = await UserService.searchUsers(q);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  }

  async getUserCount(req, res) {
    try {
      const result = await UserService.getUserCount();
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}

module.exports = new UserController();