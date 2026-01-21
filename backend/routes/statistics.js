/**
 * Statistics Routes
 * Chỉ định nghĩa URL và gọi Controller tương ứng
 */

import express from 'express';
import * as statisticsController from '../controllers/statisticsController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/statistics/overview
 * Lấy thống kê tổng quan
 */
router.get('/overview', protect, admin, statisticsController.getOverview);

/**
 * GET /api/statistics/revenue
 * Thống kê doanh thu theo thời gian
 */
router.get('/revenue', protect, admin, statisticsController.getRevenue);

/**
 * GET /api/statistics/orders
 * Thống kê đơn hàng theo trạng thái
 */
router.get('/orders', protect, admin, statisticsController.getOrders);

/**
 * GET /api/statistics/products
 * Thống kê sản phẩm theo category và top sellers
 */
router.get('/products', protect, admin, statisticsController.getProducts);

/**
 * GET /api/statistics/recent-orders
 * Lấy đơn hàng gần đây
 */
router.get('/recent-orders', protect, admin, statisticsController.getRecentOrders);

export default router;
