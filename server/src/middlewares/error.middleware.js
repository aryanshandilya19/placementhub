import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = err.errors || [];

  // Mongoose duplicate key (e.g. unique email constraint violated at DB level)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern || {})[0] || 'field';
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    errors = [];
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
    message = 'Validation failed';
  }

  // Mongoose bad ObjectId (e.g. /users/not-a-valid-id)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token — please log in again';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired — please log in again';
  }

  // Log server errors (5xx) with full stack
  // Log client errors (4xx) as warnings — no stack needed
  if (statusCode >= 500) {
    logger.error({
      message,
      method: req.method,
      url: req.originalUrl,
      statusCode,
      stack: err.stack,
      userId: req.user?._id,
    });
  } else {
    logger.warn({
      message,
      method: req.method,
      url: req.originalUrl,
      statusCode,
      userId: req.user?._id,
    });
  }

  const response = {
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    // Only expose stack trace in development
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  };

  return res.status(statusCode).json(response);
};