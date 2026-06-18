const { Router } = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');

const router = Router();

const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required.'),
  body('email')
    .trim()
    .isEmail().withMessage('Valid email is required.')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters.')
    .matches(/[A-Z]/).withMessage('Password must contain an uppercase letter.')
    .matches(/[a-z]/).withMessage('Password must contain a lowercase letter.')
    .matches(/\d/).withMessage('Password must contain a digit.'),
  body('role')
    .isIn(['Student', 'FacultyStaff', 'ResourceManager', 'Admin']).withMessage('Invalid role selected.'),
  body('department')
    .optional()
    .trim(),
  body('campusId')
    .optional()
    .trim(),
];

const loginValidation = [
  body('email')
    .trim()
    .isEmail().withMessage('Valid email is required.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required.'),
];

router.post('/register', validationMiddleware(registerValidation), authController.register);
router.post('/login', validationMiddleware(loginValidation), authController.login);
router.post('/logout', authMiddleware, authController.logout);

module.exports = router;
