/**
 * Reports Routes
 */

import express from 'express';
import * as statisticsController from '../controllers/statisticsController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/reports/cod
 * Báo cáo COD chưa về
 */
router.get('/cod', protect, admin, statisticsController.getCODReport);

/**
 * GET /api/reports/revenue
 * Báo cáo doanh thu
 */
router.get('/revenue', protect, admin, statisticsController.getRevenueReport);

export default router;
