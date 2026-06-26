const db = require('../db');

const approvalService = {

  async getPendingBookings() {

    return await db.queryAll(`
      SELECT *
      FROM bookings
      WHERE status='Pending'
    `);
  },

  async approveBooking(
    bookingID,
    approvedBy
  ) {

    await db.update(
      'bookings',
      { status: 'Confirmed' },
      'bookingID',
      bookingID
    );

    await db.insert(
      'booking_approvals',
      {
        bookingID,
        approvedBy,
        approvalStatus: 'Approved'
      }
    );
  },

  async rejectBooking(
    bookingID,
    approvedBy
  ) {

    await db.update(
      'bookings',
      { status: 'Rejected' },
      'bookingID',
      bookingID
    );

    await db.insert(
      'booking_approvals',
      {
        bookingID,
        approvedBy,
        approvalStatus: 'Rejected'
      }
    );
  }
};

module.exports = approvalService;