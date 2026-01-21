/**
 * Logger Provider
 * Cung cấp logging service thống nhất
 */

import { logger } from '../utils/logger.js';

/**
 * Log levels
 */
export const LogLevel = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  DEBUG: 'debug'
};

/**
 * Log error
 */
export const logError = (message, error = null, context = {}) => {
  logger.error(message, {
    ...context,
    error: error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : null
  });
};

/**
 * Log warning
 */
export const logWarn = (message, context = {}) => {
  logger.warn(message, context);
};

/**
 * Log info
 */
export const logInfo = (message, context = {}) => {
  logger.info(message, context);
};

/**
 * Log debug
 */
export const logDebug = (message, context = {}) => {
  logger.debug(message, context);
};

/**
 * Log HTTP request
 */
export const logRequest = (req, res, responseTime) => {
  logger.info('HTTP Request', {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    responseTime: `${responseTime}ms`,
    ip: req.ip,
    userAgent: req.get('user-agent')
  });
};

/**
 * Log database query
 */
export const logQuery = (collection, operation, query, duration) => {
  logger.debug('Database Query', {
    collection,
    operation,
    query: JSON.stringify(query),
    duration: `${duration}ms`
  });
};

