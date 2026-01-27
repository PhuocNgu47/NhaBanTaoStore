/**
 * Tracking Routes
 * Routes for customer behavior tracking and lead generation
 */

import express from 'express';
import * as trackingController from '../controllers/trackingController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/track/view
 * Track product view (public - no auth required)
 */
router.post('/view', trackingController.trackView);

/**
 * POST /api/track/identify
 * Identify lead with contact information (public - no auth required)
 */
router.post('/identify', trackingController.identifyLead);

export default router;
