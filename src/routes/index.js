const { Router } = require('express');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const adminRoutes = require('./adminRoutes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin/users', adminRoutes);

module.exports = router;
