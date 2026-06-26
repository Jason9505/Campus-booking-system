const { Router } = require('express');

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const adminRoutes = require('./adminRoutes');
const resourceRoutes = require('./resourceRoutes');
const bookingRoutes = require('./bookingRoutes');
const policyRoutes = require('./policyRoutes');
const reportRoutes = require('./reportRoutes');
const dashboardRoutes = require("./dashboardRoutes");

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/admin/users', adminRoutes);
router.use('/resources', resourceRoutes);
router.use('/bookings', bookingRoutes);
router.use('/policy', policyRoutes);
router.use('/reports', reportRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;