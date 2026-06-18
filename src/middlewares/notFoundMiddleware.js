const notFoundMiddleware = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    data: null,
    errors: ['The requested resource does not exist.'],
  });
};

module.exports = notFoundMiddleware;
