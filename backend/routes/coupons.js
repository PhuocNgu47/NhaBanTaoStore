/**
 * Coupon Routes
 * Chỉ định nghĩa URL và gọi Controller tương ứng
 */

import express from 'express';
import * as couponController from '../controllers/couponController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/coupons/validate
 * Validate và tính discount của coupon
 * Public endpoint - không cần đăng nhập
 */
router.post('/validate', couponController.validateCoupon);

/**
 * GET /api/coupons
 * Lấy danh sách coupon (Admin only)
 */
router.get('/', protect, admin, couponController.getCoupons);

/**
 * POST /api/coupons
 * Tạo coupon mới (Admin only)
 */
router.post('/', protect, admin, couponController.createCoupon);

/**
 * PUT /api/coupons/:id
 * Cập nhật coupon (Admin only)
 */
router.put('/:id', protect, admin, couponController.updateCoupon);

/**
 * DELETE /api/coupons/:id
 * Xóa coupon (Admin only)
 */
router.delete('/:id', protect, admin, couponController.deleteCoupon);

export default router;
