const bcrypt = require('bcryptjs');
const db = require('../db');
const bookingService = require('./bookingService');

const SYSTEM_ADMIN_EMAIL = 'admin@mmu.edu.my';

function isSystemAdmin(user) {
  return user && user.email === SYSTEM_ADMIN_EMAIL;
}

const userService = {
  async getProfile(userId) {
    const user = await db.queryOne(
      'SELECT userID, name, email, role, department, campusId, isActive, createdAt, updatedAt FROM users WHERE userID = ?',
      [userId]
    );

    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    return user;
  },

  async updateProfile(userId, updates) {
    const user = await db.queryOne('SELECT userID, email FROM users WHERE userID = ?', [userId]);

    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    const allowedFields = ['name', 'email', 'department', 'campusId'];
    const filtered = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filtered[field] = field === 'email' ? updates[field].toLowerCase() : updates[field];
      }
    }

    if (filtered.email && filtered.email !== user.email) {
      const existing = await db.queryOne('SELECT userID FROM users WHERE email = ?', [filtered.email]);
      if (existing) {
        const error = new Error('Email already in use.');
        error.statusCode = 409;
        throw error;
      }
    }

    if (Object.keys(filtered).length > 0) {
      await db.update('users', filtered, 'userID', userId);
    }

    return this.getProfile(userId);
  },

  async listUsers() {
    return db.queryAll(
      'SELECT userID, name, email, role, department, campusId, isActive, createdAt, updatedAt FROM users WHERE email != ? ORDER BY createdAt DESC',
      [SYSTEM_ADMIN_EMAIL]
    );
  },

  async getUserById(userId) {
    const user = await db.queryOne(
      'SELECT userID, name, email, role, department, campusId, isActive, createdAt, updatedAt FROM users WHERE userID = ?',
      [userId]
    );

    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    if (isSystemAdmin(user)) {
      const error = new Error('Cannot access the system administrator account.');
      error.statusCode = 403;
      throw error;
    }

    return user;
  },

  async updateUser(userId, updates) {
    const user = await db.queryOne('SELECT userID, email FROM users WHERE userID = ?', [userId]);

    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    if (isSystemAdmin(user)) {
      const error = new Error('Cannot modify the system administrator account.');
      error.statusCode = 403;
      throw error;
    }

    const allowedFields = ['name', 'email', 'role', 'department', 'campusId', 'isActive'];
    const filtered = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filtered[field] = field === 'email' ? updates[field].toLowerCase() : updates[field];
      }
    }

    if (filtered.email && filtered.email !== user.email) {
      const existing = await db.queryOne('SELECT userID FROM users WHERE email = ?', [filtered.email]);
      if (existing) {
        const error = new Error('Email already in use.');
        error.statusCode = 409;
        throw error;
      }
    }

    if (Object.keys(filtered).length > 0) {
      await db.update('users', filtered, 'userID', userId);
    }

    return this.getUserById(userId);
  },

  async softDeleteUser(userId) {
    const user = await db.queryOne('SELECT userID, name, email FROM users WHERE userID = ?', [userId]);

    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    if (isSystemAdmin(user)) {
      const error = new Error('Cannot delete the system administrator account.');
      error.statusCode = 403;
      throw error;
    }

    const activeBookings = await bookingService.getActiveBookingsByUser(userId);

    if (activeBookings.length > 0) {
      const error = new Error(`Cannot delete user. They have ${activeBookings.length} active booking(s) that must be resolved first.`);
      error.statusCode = 409;
      throw error;
    }

    await db.transaction(async (conn) => {
      await conn.execute(
        `INSERT INTO archived_bookings (originalBookingID, userID, userName, userEmail, resourceName, startDateTime, endDateTime, originalStatus, archivedAt)
         SELECT b.bookingID, u.userID, u.name, u.email, r.name, b.startDateTime, b.endDateTime, b.status, NOW()
         FROM bookings b
         JOIN users u ON b.userID = u.userID
         JOIN resources r ON b.resourceID = r.resourceID
         WHERE b.userID = ?`,
        [userId]
      );

      await conn.execute('DELETE FROM users WHERE userID = ?', [userId]);
    });

    return { message: 'User deleted successfully. Booking history archived.' };
  },

  async createUser(data) {
    const existing = await db.queryOne('SELECT userID FROM users WHERE email = ?', [data.email.toLowerCase()]);

    if (existing) {
      const error = new Error('Email already registered.');
      error.statusCode = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(data.password, 12);

    const userID = await db.insert('users', {
      name: data.name,
      email: data.email.toLowerCase(),
      passwordHash,
      role: data.role || 'Student',
      department: data.department || null,
      campusId: data.campusId || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
    });

    return {
      userID,
      name: data.name,
      email: data.email.toLowerCase(),
      role: data.role || 'Student',
      department: data.department || null,
      campusId: data.campusId || null,
      isActive: data.isActive !== undefined ? data.isActive : true,
    };
  },
};

module.exports = userService;
