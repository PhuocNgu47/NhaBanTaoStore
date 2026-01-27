import express from 'express';
import * as activityLogController from '../controllers/activityLogController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/activity-logs
 * Xem lịch sử hoạt động (Admin only)
 */
router.get('/', protect, admin, activityLogController.getActivityLogs);

export default router;
