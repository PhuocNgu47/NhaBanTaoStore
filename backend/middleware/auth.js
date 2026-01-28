/**
 * Authentication Middleware
 * Các middleware để bảo vệ routes và kiểm tra quyền truy cập
 */

import jwt from 'jsonwebtoken';

/**
 * Middleware xác thực người dùng
 * Kiểm tra JWT token trong header Authorization
 * 
 * Cách sử dụng:
 * router.get('/protected-route', protect, handlerFunction)
 * 
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const protect = (req, res, next) => {
  try {
    // Lấy token từ header Authorization
    // Format: "Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: 'Thiếu token xác thực. Vui lòng đăng nhập lại.'
      });
    }

    // Tách token từ chuỗi "Bearer <token>"
    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ. Vui lòng đăng nhập lại.'
      });
    }

    // Verify và decode token
    // JWT_SECRET được lưu trong biến môi trường
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Lưu thông tin user vào request để sử dụng trong các route tiếp theo
    // decoded chứa: { id, email, role }
    req.user = decoded;

    // Chuyển sang middleware/route tiếp theo
    next();
  } catch (error) {
    // Xử lý các lỗi khi verify token
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token đã hết hạn. Vui lòng đăng nhập lại.'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token không hợp lệ. Vui lòng đăng nhập lại.'
      });
    }

    // Lỗi khác
    return res.status(401).json({
      success: false,
      message: 'Xác thực thất bại. Vui lòng thử lại.'
    });
  }
};

/**
 * Middleware kiểm tra quyền admin
 * Phải đặt sau middleware protect()
 * 
 * Cách sử dụng:
 * router.get('/admin-route', protect, admin, handlerFunction)
 * 
 * @param {Object} req - Request object (có chứa req.user từ protect middleware)
 * @param {Object} res - Response object
 * @param {Function} next - Next middleware function
 */
export const admin = (req, res, next) => {
  // Kiểm tra xem đã có req.user chưa (từ protect middleware)
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Vui lòng đăng nhập trước.'
    });
  }

  // Kiểm tra quyền admin hoặc owner
  const allowedRoles = ['admin', 'owner'];
  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền truy cập. Chỉ Admin hoặc Chủ shop mới có thể thực hiện hành động này.'
    });
  }

  // Cho phép tiếp tục
  next();
};

/**
 * Middleware phân quyền chuyên sâu
 * Cho phép các roles cụ thể truy cập
 * 
 * Cách sử dụng:
 * router.get('/staff-route', protect, authorize('admin', 'owner', 'staff'), handlerFunction)
 * 
 * @param {...String} roles - Danh sách các roles được phép
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập trước.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Bạn không có quyền truy cập. Cần quyền: ${roles.join(', ')}`
      });
    }

    next();
  };
};

/**
 * Middleware xác thực không bắt buộc (Optional Auth)
 * Nếu có token hợp lệ -> gán req.user
 * Nếu không có token hoặc lỗi -> không gán req.user, nhưng vẫn cho qua
 */
export const optionalProtect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      if (token && token !== 'null' && token !== 'undefined') {
        try {
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          req.user = decoded;
        } catch (err) {
          // Token lỗi -> bỏ qua, coi như guest
          console.log('Optional auth token error:', err.message);
        }
      }
    }
  } catch (error) {
    console.error('Optional auth middleware error:', error);
  }

  // Luôn cho qua
  next();
};
