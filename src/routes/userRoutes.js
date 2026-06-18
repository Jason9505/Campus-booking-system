const { Router } = require('express');
const { body } = require('express-validator');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');

const router = Router();

const updateProfileValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Name cannot be empty.'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Valid email is required.')
    .normalizeEmail(),
  body('department')
    .optional()
    .trim(),
  body('campusId')
    .optional()
    .trim(),
];

router.get('/profile', authMiddleware, userController.getProfile);
router.put('/profile', authMiddleware, validationMiddleware(updateProfileValidation), userController.updateProfile);

module.exports = router;
