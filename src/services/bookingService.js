const db = require('../db');

const bookingService = {

  async createBooking(userID, data) {

    const bookingID = await db.insert(
      'bookings',
      {
        userID,
        resourceID: data.resourceID,
        startDateTime: data.startDateTime,
        endDateTime: data.endDateTime,
        status: 'Pending'
      }
    );

    return bookingID;
  },

  async getMyBookings(userID, filter){

      let where = "WHERE b.userID=? ";
      let params = [userID];

      switch(filter){

          case "upcoming":

              where += `
              AND b.status='Confirmed'
              AND b.startDateTime>=NOW()
              `;
              break;

          case "pending":

              where += `
              AND b.status='Pending'
              `;
              break;

          case "past":

              where += `
              AND (
                  b.status='Completed'
                  OR b.endDateTime < NOW()
              )
              `;
              break;

          case "cancelled":

              where += `
              AND (
                  b.status='Cancelled'
                  OR b.status='Rejected'
              )
              `;
              break;

      }

      return await db.queryAll(
      `
      SELECT

          b.bookingID,

          r.name resourceName,

          b.startDateTime,

          b.endDateTime,

          b.status

      FROM bookings b

      JOIN resources r

      ON b.resourceID=r.resourceID

      ${where}

      ORDER BY b.startDateTime DESC
      `,
      params
      );

  },

  async getBookingById(id) {

    return await db.queryOne(
      `
      SELECT *
      FROM bookings
      WHERE bookingID = ?
      `,
      [id]
    );
  },

  async cancelBooking(id) {

    await db.update(
      'bookings',
      {
        status: 'Cancelled'
      },
      'bookingID',
      id
    );

    return true;
  },

  async getPendingBookings() {

    return await db.queryAll(
      `
      SELECT
        b.*,
        u.name AS userName,
        r.name AS resourceName
      FROM bookings b
      JOIN users u
        ON b.userID = u.userID
      JOIN resources r
        ON b.resourceID = r.resourceID
      WHERE b.status = 'Pending'
      ORDER BY b.createdAt DESC
      `
    );

  },

  async approveBooking(id) {

    await db.update(
      'bookings',
      {
        status: 'Confirmed'
      },
      'bookingID',
      id
    );

  },

    async rejectBooking(id) {

    await db.update(
      'bookings',
      {
        status: 'Rejected'
      },
      'bookingID',
      id
    );

  },

};



module.exports = bookingService;