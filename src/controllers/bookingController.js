const bookingService =
  require('../services/bookingService');

const bookingController = {

  async create(req, res, next) {

    try {

      console.log('BODY:', req.body);

      const bookingID =
        await bookingService.createBooking(
          req.user.id,
          req.body
        );

      res.status(201).json({
        success: true,
        message: 'Booking created',
        bookingID
      });

    } catch (err) {
      next(err);
    }

  },

  async getMyBookings(req, res, next) {

    try {

      const bookings =
        await bookingService.getMyBookings(
          req.user.id,
          req.query.filter
        );

      res.json({
        success: true,
        data: bookings
      });

    } catch (err) {
      next(err);
    }
  },

  async cancel(req, res, next) {

    try {

      await bookingService.cancelBooking(
        req.params.id
      );

      res.json({
        success: true,
        message: 'Booking cancelled'
      });

    } catch (err) {
      next(err);
    }
  },

  async approve(req, res, next) {

    try {

      await bookingService
        .approveBooking(req.params.id);

      res.json({
        success: true,
        message: 'Booking approved'
      });

    } catch (err) {

      next(err);

    }

  },

  async reject(req, res, next) {

    try {

      await bookingService
        .rejectBooking(req.params.id);

      res.json({
        success: true,
        message: 'Booking rejected'
      });

    } catch (err) {

      next(err);

    }

  },

  async getPending(req, res, next) {

    try {

      const bookings =
        await bookingService
          .getPendingBookings();

      res.json({
        success: true,
        data: bookings
      });

    } catch (err) {

      next(err);

    }

  },

};

module.exports = bookingController;