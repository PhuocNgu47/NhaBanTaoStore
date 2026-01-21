/**
 * API Router
 * Tổ chức và quản lý tất cả API routes
 */

import express from 'express';
import authRoutes from '../routes/auth.js';
import productRoutes from '../routes/products.js';
import orderRoutes from '../routes/orders.js';
import userRoutes from '../routes/users.js';
import paymentRoutes from '../routes/payment.js';
import statisticsRoutes from '../routes/statistics.js';
import addressRoutes from '../routes/addresses.js';
import couponRoutes from '../routes/coupons.js';

const router = express.Router();

/**
 * API Routes
 */
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/users', userRoutes);
router.use('/payment', paymentRoutes);
router.use('/statistics', statisticsRoutes);
router.use('/addresses', addressRoutes);
router.use('/coupons', couponRoutes);

export default router;

