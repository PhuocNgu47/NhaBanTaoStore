/**
 * Router Helper
 * Các hàm tiện ích để làm việc với routes
 */

/**
 * Tạo route handler với error handling tự động
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Tạo route với validation
 */
export const createRoute = (handler, validators = []) => {
  return async (req, res, next) => {
    try {
      // Run validators
      for (const validator of validators) {
        await validator(req, res);
      }
      
      // Run handler
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Tạo pagination middleware
 */
export const paginationMiddleware = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  req.pagination = {
    page,
    limit,
    skip
  };
  
  next();
};

/**
 * Tạo sort middleware
 */
export const sortMiddleware = (allowedFields = []) => {
  return (req, res, next) => {
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    if (allowedFields.length > 0 && !allowedFields.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message: `Sort field must be one of: ${allowedFields.join(', ')}`
      });
    }
    
    req.sort = {
      [sortBy]: sortOrder
    };
    
    next();
  };
};

/**
 * Tạo filter middleware
 */
export const filterMiddleware = (allowedFilters = []) => {
  return (req, res, next) => {
    const filters = {};
    
    allowedFilters.forEach(filter => {
      if (req.query[filter] !== undefined) {
        filters[filter] = req.query[filter];
      }
    });
    
    req.filters = filters;
    next();
  };
};

