const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db');

const BCRYPT_ROUNDS = 12;

const authService = {
  async register({ name, email, password, role, department, campusId }) {
    const existing = await db.queryOne('SELECT userID FROM users WHERE email = ?', [email.toLowerCase()]);

    if (existing) {
      const error = new Error('Email already registered.');
      error.statusCode = 409;
      throw error;
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    const userID = await db.insert('users', {
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role || 'Student',
      department: department || null,
      campusId: campusId || null,
    });

    const token = this.generateToken({ userID, email: email.toLowerCase(), role: role || 'Student' });

    return {
      user: { userID, name, email: email.toLowerCase(), role: role || 'Student', department: department || null, campusId: campusId || null },
      token,
    };
  },

  async login({ email, password }) {
    const user = await db.queryOne('SELECT * FROM users WHERE email = ?', [email.toLowerCase()]);

    if (!user) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    if (!user.isActive) {
      const error = new Error('Account has been disabled. Contact an administrator.');
      error.statusCode = 403;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      const error = new Error('Invalid email or password.');
      error.statusCode = 401;
      throw error;
    }

    const token = this.generateToken(user);

    return {
      user: {
        userID: user.userID,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        campusId: user.campusId,
      },
      token,
    };
  },

  async logout(token) {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) return;

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    await db.insert('blacklisted_tokens', {
      tokenHash,
      expiresAt: new Date(decoded.exp * 1000),
    });
  },

  generateToken(user) {
    return jwt.sign(
      { id: user.userID, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
  },
};

module.exports = authService;
