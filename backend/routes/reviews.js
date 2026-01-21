/**
 * Review Routes
 * Chỉ định nghĩa URL và gọi Controller tương ứng
 */

import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/reviews/product/:productId
 * Lấy danh sách reviews của sản phẩm
 */
router.get('/product/:productId', reviewController.getProductReviews);

/**
 * POST /api/reviews/product/:productId
 * Tạo review mới (User only)
 */
router.post('/product/:productId', protect, reviewController.createReview);

/**
 * PUT /api/reviews/:reviewId
 * Cập nhật review (User only - owner)
 */
router.put('/:reviewId', protect, reviewController.updateReview);

/**
 * DELETE /api/reviews/:reviewId
 * Xóa review (User only - owner hoặc Admin)
 */
router.delete('/:reviewId', protect, reviewController.deleteReview);

/**
 * PATCH /api/reviews/:reviewId/status
 * Approve/Reject review (Admin only)
 */
router.patch('/:reviewId/status', protect, admin, reviewController.moderateReview);

/**
 * POST /api/reviews/:reviewId/helpful
 * Mark review as helpful (User only)
 */
router.post('/:reviewId/helpful', protect, reviewController.markHelpful);

export default router;

