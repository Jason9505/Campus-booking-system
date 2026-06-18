const authService = require('../services/authService');

const authController = {
  async register(req, res, next) {
    try {
      const { name, email, password, role, department, campusId } = req.body;

      const result = await authService.register({ name, email, password, role, department, campusId });

      res.status(201).json({
        success: true,
        message: 'Registration successful.',
        data: result,
        errors: [],
      });
    } catch (error) {
      next(error);
    }
  },

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const result = await authService.login({ email, password });

      res.status(200).json({
        success: true,
        message: 'Login successful.',
        data: result,
        errors: [],
      });
    } catch (error) {
      next(error);
    }
  },

  async logout(req, res, next) {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader.split(' ')[1];

      await authService.logout(token);

      res.status(200).json({
        success: true,
        message: 'Logout successful. Token revoked.',
        data: null,
        errors: [],
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
