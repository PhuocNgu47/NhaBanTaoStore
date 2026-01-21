/**
 * Cart Routes
 * Chỉ định nghĩa URL và gọi Controller tương ứng
 */

import express from 'express';
import * as cartController from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/cart
 * Lấy giỏ hàng (User hoặc Guest)
 */
router.get('/', cartController.getCart);

/**
 * POST /api/cart/items
 * Thêm sản phẩm vào giỏ hàng
 */
router.post('/items', cartController.addToCart);

/**
 * PUT /api/cart/items/:itemId
 * Cập nhật số lượng item
 */
router.put('/items/:itemId', cartController.updateCartItem);

/**
 * DELETE /api/cart/items/:itemId
 * Xóa item khỏi cart
 */
router.delete('/items/:itemId', cartController.removeFromCart);

/**
 * DELETE /api/cart
 * Xóa toàn bộ cart
 */
router.delete('/', cartController.clearCart);

/**
 * POST /api/cart/merge
 * Merge guest cart vào user cart (khi login)
 */
router.post('/merge', protect, cartController.mergeCarts);

export default router;

