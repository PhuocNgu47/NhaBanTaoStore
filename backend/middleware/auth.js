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

  // Kiểm tra quyền admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Bạn không có quyền truy cập. Chỉ admin mới có thể thực hiện hành động này.'
    });
  }

  // Cho phép tiếp tục
  next();
};
