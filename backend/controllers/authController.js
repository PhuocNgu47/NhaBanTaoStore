/**
 * Auth Controller
 * Nhận request từ Routes và gọi Auth Service
 */

import * as authService from '../services/authService.js';

/**
 * Đăng ký user mới
 */
export const register = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      ...result
    });
  } catch (error) {
    console.error('Register error:', error);
    
    // Xử lý lỗi duplicate email từ MongoDB
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Email này đã được sử dụng'
      });
    }

    // Xử lý lỗi validation
    const statusCode = error.message.includes('Vui lòng') || error.message.includes('phải') ? 400 : 500;
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi máy chủ. Vui lòng thử lại sau.'
    });
  }
};

/**
 * Đăng nhập user
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    
    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      ...result
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Lỗi máy chủ. Vui lòng thử lại sau.'
    });
  }
};

/**
 * Verify JWT token
 */
export const verify = (req, res) => {
  try {
    // Lấy token từ header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        valid: false,
        message: 'Không có token xác thực'
      });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        valid: false,
        message: 'Token không hợp lệ'
      });
    }

    const result = authService.verifyToken(token);
    
    if (result.valid) {
      res.json({
        success: true,
        valid: true,
        user: result.user
      });
    } else {
      res.status(401).json({
        success: false,
        valid: false,
        message: result.error
      });
    }
  } catch (error) {
    res.status(401).json({
      success: false,
      valid: false,
      message: 'Token không hợp lệ'
    });
  }
};

export const me = async (req, res) => {
  try {
    const result = await authService.getCurrentUser(req.user?.id);
    return res.json({
      success: true,
      user: result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Không thể lấy thông tin người dùng'
    });
  }
};

export const logout = async (req, res) => {
  // Stateless JWT: client chỉ cần xoá token
  return res.json({
    success: true,
    message: 'Đăng xuất thành công'
  });
};

export const updateProfile = async (req, res) => {
  try {
    const updated = await authService.updateProfile(req.user?.id, req.body);
    return res.json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      user: updated
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Cập nhật thông tin thất bại'
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await authService.changePassword(req.user?.id, currentPassword, newPassword);
    return res.json({
      success: true,
      message: 'Đổi mật khẩu thành công',
      ...result
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message || 'Đổi mật khẩu thất bại'
    });
  }
};

export const forgotPassword = async (req, res) => {
  // Dev stub: chưa gửi email
  return res.status(501).json({
    success: false,
    message: 'Chức năng forgot-password chưa được triển khai'
  });
};

export const resetPassword = async (req, res) => {
  // Dev stub: chưa gửi email
  return res.status(501).json({
    success: false,
    message: 'Chức năng reset-password chưa được triển khai'
  });
};

