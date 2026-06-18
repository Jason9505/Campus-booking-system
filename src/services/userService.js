const db = require('../db');

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
      'SELECT userID, name, email, role, department, campusId, isActive, createdAt, updatedAt FROM users ORDER BY createdAt DESC'
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

    return user;
  },

  async updateUser(userId, updates) {
    const user = await db.queryOne('SELECT userID, email FROM users WHERE userID = ?', [userId]);

    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
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
    const user = await db.queryOne('SELECT userID FROM users WHERE userID = ?', [userId]);

    if (!user) {
      const error = new Error('User not found.');
      error.statusCode = 404;
      throw error;
    }

    await db.update('users', { isActive: false }, 'userID', userId);

    return { message: 'User account disabled successfully.' };
  },
};

module.exports = userService;
