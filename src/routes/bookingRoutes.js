const { Router } = require('express');

const bookingController =
  require('../controllers/bookingController');

const authMiddleware =
  require('../middlewares/authMiddleware');

const router = Router();

router.post(
  '/',
  authMiddleware,
  bookingController.create
);

router.get(
  '/my',
  authMiddleware,
  bookingController.getMyBookings
);

router.put(
  '/:id/cancel',
  authMiddleware,
  bookingController.cancel
);

router.get(
  '/pending',
  authMiddleware,
  bookingController.getPending
);

router.put(
  '/:id/approve',
  authMiddleware,
  bookingController.approve
);

router.put(
  '/:id/reject',
  authMiddleware,
  bookingController.reject
);

module.exports = router;