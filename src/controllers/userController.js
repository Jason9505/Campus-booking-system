const userService = require('../services/userService');

const userController = {
  async getProfile(req, res, next) {
    try {
      const user = await userService.getProfile(req.user.id);

      res.status(200).json({
        success: true,
        message: 'Profile retrieved successfully.',
        data: user,
        errors: [],
      });
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req, res, next) {
    try {
      const user = await userService.updateProfile(req.user.id, req.body);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully.',
        data: user,
        errors: [],
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
