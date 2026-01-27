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
import trackingRoutes from '../routes/tracking.js';
import leadsRoutes from '../routes/leads.js';
import shipmentRoutes from '../routes/shipments.js';
import reportsRoutes from '../routes/reports.js';

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
router.use('/track', trackingRoutes);
router.use('/admin/leads', leadsRoutes);
router.use('/shipments', shipmentRoutes);
router.use('/reports', reportsRoutes);

export default router;

