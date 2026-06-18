const userService = require('../services/userService');

const adminController = {
  async listUsers(req, res, next) {
    try {
      const users = await userService.listUsers();

      res.status(200).json({
        success: true,
        message: 'Users retrieved successfully.',
        data: users,
        errors: [],
      });
    } catch (error) {
      next(error);
    }
  },

  async getUser(req, res, next) {
    try {
      const user = await userService.getUserById(req.params.id);

      res.status(200).json({
        success: true,
        message: 'User retrieved successfully.',
        data: user,
        errors: [],
      });
    } catch (error) {
      next(error);
    }
  },

  async updateUser(req, res, next) {
    try {
      const user = await userService.updateUser(req.params.id, req.body);

      res.status(200).json({
        success: true,
        message: 'User updated successfully.',
        data: user,
        errors: [],
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req, res, next) {
    try {
      const result = await userService.softDeleteUser(req.params.id);

      res.status(200).json({
        success: true,
        message: result.message,
        data: null,
        errors: [],
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = adminController;
