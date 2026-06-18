const { validationResult } = require('express-validator');

const validationMiddleware = (validations) => {
  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) break;
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const formattedErrors = errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed.',
        data: null,
        errors: formattedErrors,
      });
    }

    next();
  };
};

module.exports = validationMiddleware;
