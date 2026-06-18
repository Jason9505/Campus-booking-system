const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
        data: null,
        errors: ['Missing or invalid Authorization header'],
      });
    }

    const token = authHeader.split(' ')[1];

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const blacklisted = await db.queryOne('SELECT id FROM blacklisted_tokens WHERE tokenHash = ?', [tokenHash]);

    if (blacklisted) {
      return res.status(401).json({
        success: false,
        message: 'Token has been revoked.',
        data: null,
        errors: ['Token is blacklisted'],
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired.',
        data: null,
        errors: ['Token expired'],
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token.',
        data: null,
        errors: ['Token verification failed'],
      });
    }

    next(error);
  }
};

module.exports = authMiddleware;
