/**
 * User Routes
 * Chỉ định nghĩa URL và gọi Controller tương ứng
 */

import express from 'express';
import * as userController from '../controllers/userController.js';
import { protect, admin, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/users/profile
 * Lấy thông tin profile của user hiện tại
 */
router.get('/profile', protect, userController.getProfile);

/**
 * GET /api/users
 * Lấy danh sách tất cả users (Admin only)
 */
router.get('/', protect, authorize('admin', 'owner'), userController.getAllUsers);

/**
 * PUT /api/users/profile
 * Cập nhật profile của user hiện tại
 */
router.put('/profile', protect, userController.updateProfile);

/**
 * POST /api/users/profile/avatar
 * Upload avatar cho user
 */
import { uploadAvatar } from '../middleware/upload.js';
router.post('/profile/avatar', protect, uploadAvatar.single('avatar'), userController.uploadAvatar);

/**
 * PUT /api/users/profile/password
 * Đổi mật khẩu
 */
router.put('/profile/password', protect, userController.changePassword);

/**
 * PUT /api/users/:id/role
 * Cập nhật role của user (Admin only)
 */
router.put('/:id/role', protect, authorize('admin'), userController.updateUserRole);

/**
 * DELETE /api/users/:id
 * Xóa user (Admin only)
 */
router.delete('/:id', protect, authorize('admin', 'owner'), userController.deleteUser);

/**
 * GET /api/users/stats
 * Lấy thống kê khách hàng (Admin only)
 */
router.get('/stats', protect, authorize('admin', 'owner'), userController.getCustomerStats);

/**
 * PUT /api/users/:id/loyalty
 * Cập nhật điểm loyalty (Admin only)
 */
router.put('/:id/loyalty', protect, authorize('admin', 'owner', 'staff'), userController.updateLoyaltyPoints);

/**
 * PUT /api/users/:id/tier
 * Cập nhật tier khách hàng (Admin only)
 */
router.put('/:id/tier', protect, authorize('admin', 'owner', 'staff'), userController.updateCustomerTier);

export default router;
