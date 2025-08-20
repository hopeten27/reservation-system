const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, code: 'INVALID_ID' };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, code: 'DUPLICATE_FIELD' };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message: message.join(', '), code: 'VALIDATION_ERROR' };
  }

  res.status(err.statusCode || 500).json({
    success: false,
    error: {
      message: error.message || 'Server Error',
      code: error.code,
      details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    }
  });
};

export default errorHandler;