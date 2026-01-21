/**
 * Authentication Routes
 * Chỉ định nghĩa URL và gọi Controller tương ứng
 */

import express from 'express';
import { protect } from '../middleware/auth.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

/**
 * POST /api/auth/register
 * Đăng ký tài khoản mới
 */
router.post('/register', authController.register);

/**
 * POST /api/auth/login
 * Đăng nhập với email và password
 */
router.post('/login', authController.login);

/**
 * POST /api/auth/verify
 * Xác thực token JWT
 */
router.post('/verify', authController.verify);

/**
 * GET /api/auth/me
 * Lấy thông tin user hiện tại (cần đăng nhập)
 */
router.get('/me', protect, authController.me);

/**
 * POST /api/auth/logout
 * Logout (stateless JWT)
 */
router.post('/logout', protect, authController.logout);

/**
 * PUT /api/auth/profile
 * Update profile (cần đăng nhập)
 */
router.put('/profile', protect, authController.updateProfile);

/**
 * PUT /api/auth/change-password
 * Change password (cần đăng nhập)
 */
router.put('/change-password', protect, authController.changePassword);

/**
 * POST /api/auth/forgot-password
 * Dev stub (chưa gửi email)
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * POST /api/auth/reset-password
 * Dev stub (chưa gửi email)
 */
router.post('/reset-password', authController.resetPassword);

export default router;
