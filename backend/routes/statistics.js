/**
 * Statistics Routes
 * Chỉ định nghĩa URL và gọi Controller tương ứng
 */

import express from 'express';
import * as statisticsController from '../controllers/statisticsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/statistics/overview
 * Lấy thống kê tổng quan
 */
router.get('/overview', protect, authorize('admin', 'owner'), statisticsController.getOverview);

/**
 * GET /api/statistics/revenue
 * Thống kê doanh thu theo thời gian
 */
router.get('/revenue', protect, authorize('admin', 'owner'), statisticsController.getRevenue);

/**
 * GET /api/statistics/orders
 * Thống kê đơn hàng theo trạng thái
 */
router.get('/orders', protect, authorize('admin', 'owner', 'staff'), statisticsController.getOrders);

/**
 * GET /api/statistics/products
 * Thống kê sản phẩm theo category và top sellers
 */
router.get('/products', protect, authorize('admin', 'owner', 'staff'), statisticsController.getProducts);

/**
 * GET /api/statistics/recent-orders
 * Lấy đơn hàng gần đây
 */
router.get('/recent-orders', protect, authorize('admin', 'owner', 'staff'), statisticsController.getRecentOrders);

export default router;
