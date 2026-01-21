/**
 * Validation Provider
 * Cung cấp các hàm validation chung
 */

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number (Vietnamese format)
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^(0|\+84)[1-9][0-9]{8,9}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate password strength
 */
export const isValidPassword = (password, minLength = 6) => {
  return password && password.length >= minLength;
};

/**
 * Validate MongoDB ObjectId
 */
export const isValidObjectId = (id) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

/**
 * Validate URL
 */
export const isValidURL = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Sanitize string (remove dangerous characters)
 */
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.trim().replace(/[<>]/g, '');
};

/**
 * Validate pagination params
 */
export const validatePagination = (page, limit, maxLimit = 100) => {
  const pageNum = parseInt(page) || 1;
  const limitNum = Math.min(parseInt(limit) || 10, maxLimit);
  
  return {
    page: Math.max(1, pageNum),
    limit: Math.max(1, limitNum),
    skip: (Math.max(1, pageNum) - 1) * Math.max(1, limitNum)
  };
};

/**
 * Validate price range
 */
export const validatePriceRange = (minPrice, maxPrice) => {
  const min = minPrice ? parseFloat(minPrice) : null;
  const max = maxPrice ? parseFloat(maxPrice) : null;
  
  if (min !== null && min < 0) return { valid: false, error: 'Min price must be >= 0' };
  if (max !== null && max < 0) return { valid: false, error: 'Max price must be >= 0' };
  if (min !== null && max !== null && min > max) {
    return { valid: false, error: 'Min price must be <= max price' };
  }
  
  return { valid: true, min, max };
};

