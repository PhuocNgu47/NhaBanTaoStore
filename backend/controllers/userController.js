/**
 * User Controller
 * Nhận request từ Routes và gọi User Service
 */

import * as userService from '../services/userService.js';

/**
 * Lấy user profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = await userService.getUserProfile(req.user.id);
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy thông tin người dùng'
    });
  }
};

/**
 * Lấy danh sách tất cả users (Admin only)
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách người dùng'
    });
  }
};

/**
 * Cập nhật user profile
 */
export const updateProfile = async (req, res) => {
  try {
    const user = await userService.updateUserProfile(req.user.id, req.body);
    res.json({
      success: true,
      message: 'Cập nhật thông tin thành công',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    
    const statusCode = error.message.includes('validation') ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật thông tin người dùng'
    });
  }
};

/**
 * Upload avatar
 */
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn file ảnh'
      });
    }

    const { getFileUrl } = await import('../middleware/upload.js');
    const avatarUrl = getFileUrl(req.file.filename, 'avatar');
    
    const user = await userService.uploadAvatar(req.user.id, avatarUrl);
    
    res.json({
      success: true,
      message: 'Upload avatar thành công',
      user,
      avatar: avatarUrl
    });
  } catch (error) {
    console.error('Upload avatar error:', error);
    
    // Xóa file nếu có lỗi
    if (req.file) {
      const { deleteFile } = await import('../middleware/upload.js');
      deleteFile(req.file.filename, 'avatar');
    }
    
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi upload avatar'
    });
  }
};

/**
 * Đổi mật khẩu
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập mật khẩu hiện tại và mật khẩu mới'
      });
    }

    await userService.changePassword(req.user.id, currentPassword, newPassword);
    
    res.json({
      success: true,
      message: 'Đổi mật khẩu thành công'
    });
  } catch (error) {
    console.error('Change password error:', error);
    
    const statusCode = error.message.includes('không đúng') || 
                      error.message.includes('ít nhất') ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi đổi mật khẩu'
    });
  }
};

/**
 * Cập nhật user role (Admin only)
 */
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await userService.updateUserRole(req.params.id, role);
    res.json({
      success: true,
      message: 'Role updated',
      user
    });
  } catch (error) {
    console.error('Update role error:', error);
    
    const statusCode = error.message.includes('Invalid') ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật quyền người dùng'
    });
  }
};

/**
 * Xóa user (Admin only)
 */
export const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({
      success: true,
      message: 'User deleted'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    
    const statusCode = error.message.includes('Không tìm thấy') ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi xóa người dùng'
    });
  }
};

