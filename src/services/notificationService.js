const db = require("../db");
const emailService = require("./emailService");

const notificationService = {
  async notify(bookingId, type) {
    const booking = await db.queryOne(
      `
      SELECT
        b.*,
        u.name AS userName,
        u.email AS userEmail,
        r.name AS resourceName,
        r.location
      FROM bookings b
      JOIN users u ON b.userID = u.userID
      JOIN resources r ON b.resourceID = r.resourceID
      WHERE b.bookingID = ?
      `,
      [bookingId]
    );

    if (!booking) {
      console.error(`[Notification] Booking ${bookingId} not found`);
      return;
    }

    const templateName =
      type === "reminder"
        ? "reminder"
        : type === "conflict"
        ? "conflict"
        : "confirmation";

    const start = new Date(booking.startDateTime);
    const end = new Date(booking.endDateTime);

    const ctx = {
      userName: booking.userName,
      resourceName: booking.resourceName,
      location: booking.location || "TBD",
      date: start.toLocaleDateString(),
      startTime: start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      endTime: end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    if (type === "conflict") {
      ctx.originalDate = start.toLocaleDateString();
      ctx.originalStart = ctx.startTime;
      ctx.originalEnd = ctx.endTime;
      ctx.newDate = start.toLocaleDateString();
      ctx.newStart = ctx.startTime;
      ctx.newEnd = ctx.endTime;
    }

    const subjectMap = {
      confirmation: "Booking Confirmed — Campus Resource Booking System",
      reminder: "Reminder: Upcoming Booking in 24 Hours",
      conflict: "Booking Update — Schedule Conflict",
    };

    const html = await emailService.renderTemplate(templateName, ctx);

    await emailService.sendMail({
      to: booking.userEmail,
      subject: subjectMap[type] || "Campus Booking Notification",
      html,
    });
  },

  async scheduleReminder(bookingId) {
    console.log(
      `[Notification] Reminder scheduled for booking ${bookingId}`
    );
  },

  async sendMaintenanceAlert(resourceId, message) {
    const resource = await db.queryOne(
      "SELECT * FROM resources WHERE resourceID = ?",
      [resourceId]
    );

    if (!resource) {
      console.error(`[Notification] Resource ${resourceId} not found`);
      return;
    }

    const staff = await db.queryAll(
      `SELECT email, name FROM users
       WHERE (role = 'ResourceManager' OR role = 'Admin')
       AND isActive = 1`
    );

    const html = `
      <h2>Maintenance Alert</h2>
      <p><strong>Resource:</strong> ${resource.name} (${resource.location || "N/A"})</p>
      <p><strong>Message:</strong> ${message}</p>
    `;

    for (const user of staff) {
      await emailService.sendMail({
        to: user.email,
        subject: `Maintenance Alert: ${resource.name}`,
        html,
      });
    }
  },
};

module.exports = notificationService;
