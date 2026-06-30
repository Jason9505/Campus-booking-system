const { Router } = require('express');
const { body } = require('express-validator');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const validationMiddleware = require('../middlewares/validationMiddleware');

const router = Router();

router.use(authMiddleware);
router.use(roleMiddleware('Admin'));

const updateUserValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Name cannot be empty.'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Valid email is required.')
    .normalizeEmail(),
  body('role')
    .optional()
    .isIn(['Student', 'FacultyStaff', 'ResourceManager', 'Admin']).withMessage('Invalid role.'),
  body('department')
    .optional()
    .trim(),
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean.'),
  body('campusId')
    .optional()
    .trim(),
];

const createUserValidation = [
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
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean.'),
];

router.get('/', adminController.listUsers);
router.get('/:id', adminController.getUser);
router.put('/:id', validationMiddleware(updateUserValidation), adminController.updateUser);
router.delete('/:id', adminController.deleteUser);
router.post('/', validationMiddleware(createUserValidation), adminController.createUser);

module.exports = router;
