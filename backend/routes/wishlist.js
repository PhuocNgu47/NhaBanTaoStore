/**
 * Wishlist Routes
 * Chỉ định nghĩa URL và gọi Controller tương ứng
 */

import express from 'express';
import * as wishlistController from '../controllers/wishlistController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/wishlist
 * Lấy wishlist (User only)
 */
router.get('/', protect, wishlistController.getWishlist);

/**
 * POST /api/wishlist/:productId
 * Thêm vào wishlist (User only)
 */
router.post('/:productId', protect, wishlistController.addToWishlist);

/**
 * DELETE /api/wishlist/:productId
 * Xóa khỏi wishlist (User only)
 */
router.delete('/:productId', protect, wishlistController.removeFromWishlist);

/**
 * GET /api/wishlist/check/:productId
 * Kiểm tra sản phẩm có trong wishlist không
 */
router.get('/check/:productId', protect, wishlistController.checkWishlist);

export default router;

