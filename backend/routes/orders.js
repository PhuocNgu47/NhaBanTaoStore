/**
 * Order Routes
 * Chỉ định nghĩa URL và gọi Controller tương ứng
 */

import express from 'express';
import * as orderController from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/orders
 * Lấy danh sách đơn hàng với filter và phân trang
 * Query: page, limit, status, paymentStatus, search, sortBy, startDate, endDate
 */
router.get('/', protect, orderController.getOrders);

/**
 * GET /api/orders/stats
 * Lấy thống kê đơn hàng (Admin only)
 */
router.get('/stats', protect, admin, orderController.getOrderStats);

/**
 * POST /api/orders
 * Tạo đơn hàng mới (authenticated or guest)
 */
router.post('/', orderController.createOrder);

/**
 * POST /api/orders/from-cart
 * Tạo đơn hàng từ giỏ hàng (tự động lấy items từ cart)
 * Phải đặt TRƯỚC route /:id để tránh conflict
 */
router.post('/from-cart', orderController.createOrderFromCart);

/**
 * GET /api/orders/guest/:email/:orderNumber
 * Lấy đơn hàng của guest
 * Phải đặt TRƯỚC route /:id để tránh conflict
 */
router.get('/guest/:email/:orderNumber', orderController.getGuestOrder);

/**
 * GET /api/orders/:id
 * Lấy chi tiết đơn hàng
 */
router.get('/:id', protect, orderController.getOrderById);

/**
 * PUT /api/orders/:id/confirm
 * Xác nhận đơn hàng (Admin only)
 */
router.put('/:id/confirm', protect, admin, orderController.confirmOrder);

/**
 * PUT /api/orders/:id/payment
 * Cập nhật trạng thái thanh toán (Admin only)
 */
router.put('/:id/payment', protect, admin, orderController.updatePayment);

/**
 * PATCH /api/orders/:id/status
 * Cập nhật trạng thái đơn hàng (Admin only)
 */
router.patch('/:id/status', protect, admin, orderController.updateOrderStatus);

/**
 * PATCH /api/orders/:id/items
 * Cập nhật danh sách items (quantity) của đơn hàng (Admin only)
 */
router.patch('/:id/items', protect, admin, orderController.updateOrderItems);

/**
 * PUT /api/orders/:id
 * Cập nhật đơn hàng (Admin)
 */
router.put('/:id', protect, admin, orderController.updateOrder);

/**
 * PATCH /api/orders/:id/cancel
 * Hủy đơn hàng (User hoặc Admin)
 */
router.patch('/:id/cancel', protect, orderController.cancelOrder);

export default router;
