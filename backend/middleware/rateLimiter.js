/**
 * Rate Limiting Middleware
 * 
 * Bảo vệ API khỏi abuse và DDoS attacks
 * 
 * Usage:
 * import { apiLimiter, authLimiter } from './middleware/rateLimiter.js';
 * 
 * app.use('/api', apiLimiter);
 * app.use('/api/auth/login', authLimiter);
 */

import rateLimit from 'express-rate-limit';

// General API rate limiter
// Giới hạn: 100 requests / 15 phút / IP
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Skip successful requests (chỉ đếm failed requests)
  skipSuccessfulRequests: false,
  // Skip failed requests
  skipFailedRequests: false,
  // Key generator - có thể customize để rate limit theo user ID
  keyGenerator: (req) => {
    // Nếu có user, rate limit theo user ID
    if (req.user && req.user.id) {
      return req.user.id;
    }
    // Nếu không, rate limit theo IP
    return req.ip || req.connection.remoteAddress;
  }
});

// Auth rate limiter (stricter)
// Giới hạn: 5 login attempts / 15 phút / IP
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Only 5 login attempts per 15 minutes
  message: {
    success: false,
    message: 'Too many login attempts, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Không đếm successful logins
  skipFailedRequests: false, // Đếm failed logins
  keyGenerator: (req) => {
    // Rate limit theo email nếu có
    if (req.body && req.body.email) {
      return req.body.email;
    }
    return req.ip || req.connection.remoteAddress;
  }
});

// Registration rate limiter
// Giới hạn: 3 registrations / 1 giờ / IP
export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Only 3 registrations per hour
  message: {
    success: false,
    message: 'Too many registration attempts, please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    return req.ip || req.connection.remoteAddress;
  }
});

// Password reset rate limiter
// Giới hạn: 3 requests / 1 giờ / IP
export const passwordResetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // Only 3 password reset requests per hour
  message: {
    success: false,
    message: 'Too many password reset requests, please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    // Rate limit theo email nếu có
    if (req.body && req.body.email) {
      return req.body.email;
    }
    return req.ip || req.connection.remoteAddress;
  }
});

// Order creation rate limiter
// Giới hạn: 10 orders / 1 giờ / user
export const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Only 10 orders per hour
  message: {
    success: false,
    message: 'Too many orders, please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Rate limit theo user ID nếu đã login
    if (req.user && req.user.id) {
      return `order:${req.user.id}`;
    }
    return req.ip || req.connection.remoteAddress;
  }
});

// Review creation rate limiter
// Giới hạn: 5 reviews / 1 giờ / user
export const reviewLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Only 5 reviews per hour
  message: {
    success: false,
    message: 'Too many reviews, please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    if (req.user && req.user.id) {
      return `review:${req.user.id}`;
    }
    return req.ip || req.connection.remoteAddress;
  }
});

// Export all limiters
export default {
  apiLimiter,
  authLimiter,
  registerLimiter,
  passwordResetLimiter,
  orderLimiter,
  reviewLimiter
};

