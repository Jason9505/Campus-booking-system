const cron = require("node-cron");
const db = require("../db");
const notificationService = require("../services/notificationService");

const taskScheduler = {
  start() {
    this._markCompletedJob();
    this._reminderJob();
    console.log("[TaskScheduler] Cron jobs registered.");
  },

  _markCompletedJob() {
    cron.schedule("0 0 * * *", async () => {
      console.log("[TaskScheduler] Running midnight job: mark past Confirmed bookings as Completed");
      try {
        const [result] = await db.query(
          `UPDATE bookings
           SET status = 'Completed'
           WHERE status = 'Confirmed'
           AND endDateTime < NOW()`
        );
        console.log(`[TaskScheduler] Marked ${result.affectedRows} bookings as Completed`);
      } catch (err) {
        console.error("[TaskScheduler] Error marking completed bookings:", err.message);
      }
    });
  },

  _reminderJob() {
    cron.schedule("0 * * * *", async () => {
      console.log("[TaskScheduler] Running hourly job: send 24h reminder emails");
      try {
        const bookings = await db.queryAll(
          `SELECT bookingID
           FROM bookings
           WHERE status = 'Confirmed'
           AND startDateTime BETWEEN NOW() + INTERVAL 23 HOUR AND NOW() + INTERVAL 25 HOUR`
        );

        for (const b of bookings) {
          await notificationService.notify(b.bookingID, "reminder");
        }

        if (bookings.length > 0) {
          console.log(`[TaskScheduler] Sent ${bookings.length} reminder(s)`);
        }
      } catch (err) {
        console.error("[TaskScheduler] Error sending reminders:", err.message);
      }
    });
  },
};

module.exports = taskScheduler;
