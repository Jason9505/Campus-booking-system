const errorHandler = (err, req, res, _next) => {
  console.error('Unhandled error:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
    errors: err.errors || [message],
  });
};

module.exports = errorHandler;
