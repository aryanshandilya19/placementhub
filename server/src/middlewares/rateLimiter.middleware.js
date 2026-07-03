import rateLimit from 'express-rate-limit';
import { logger } from '../utils/logger.js';

const createLimiter = (windowMinutes, max, message) =>
  rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max,
    message: { success: false, message },
    standardHeaders: true,  // sends RateLimit-* headers
    legacyHeaders: false,
    handler: (req, res, next, options) => {
      logger.warn(`Rate limit exceeded: ${req.ip} → ${req.originalUrl}`);
      res.status(429).json(options.message);
    },
  });

// Auth endpoints — strictest limits
export const authLimiter = createLimiter(
  15,   // 15 minute window
  20,   // 20 attempts max (covers verify-email GET calls too)
  'Too many attempts. Please try again in 15 minutes.'
);

// Forgot password — extra strict, prevents email flooding
export const forgotPasswordLimiter = createLimiter(
  60,   // 1 hour window
  5,    // only 5 forgot-password requests per hour per IP
  'Too many password reset requests. Please try again in 1 hour.'
);

// General API — generous limit for normal usage
export const apiLimiter = createLimiter(
  15,
  200,
  'Too many requests. Please slow down.'
);

// File uploads — prevent upload flooding
export const uploadLimiter = createLimiter(
  60,
  20,
  'Too many upload requests. Please try again later.'
);