const userService = require('../services/userService');
const emailService = require('../services/emailService');

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

  async createUser(req, res, next) {
    try {
      const { name, email, password, role, department, campusId, isActive } = req.body;

      const user = await userService.createUser({
        name, email, password, role, department, campusId, isActive,
      });

      const html = await emailService.renderTemplate('welcome', {
        userName: user.name,
        email: user.email,
        loginUrl: `${req.protocol}://${req.get('host')}/login.html`,
      });

      await emailService.sendMail({
        to: user.email,
        subject: 'Welcome to Campus Resource Booking System',
        html,
      });

      res.status(201).json({
        success: true,
        message: 'User created successfully. Welcome email sent.',
        data: user,
        errors: [],
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = adminController;
