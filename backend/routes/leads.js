/**
 * Leads Routes (Admin only)
 * Routes for viewing leads in admin dashboard
 */

import express from 'express';
import * as trackingController from '../controllers/trackingController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/admin/leads
 * Get leads for admin dashboard (admin only)
 */
router.get('/', protect, admin, trackingController.getLeads);

/**
 * GET /api/admin/leads/stats
 * Get lead statistics (admin only)
 */
router.get('/stats', protect, admin, trackingController.getLeadStats);

export default router;
