const roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required.',
        data: null,
        errors: ['No user found in request'],
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions.',
        data: null,
        errors: [`Requires one of roles: ${allowedRoles.join(', ')}`],
      });
    }

    next();
  };
};

module.exports = roleMiddleware;
