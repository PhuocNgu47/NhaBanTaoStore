import express from 'express';
import * as activityLogController from '../controllers/activityLogController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

/**
 * GET /api/activity-logs
 * Xem lịch sử hoạt động (Admin only)
 */
router.get('/', protect, admin, activityLogController.getActivityLogs);

/**
 * GET /api/activity-logs/stats
 * Thống kê hoạt động (Admin only)
 */
router.get('/stats', protect, admin, activityLogController.getActivityStats);

/**
 * GET /api/activity-logs/:id
 * Xem chi tiết 1 log (Admin only)
 */
router.get('/:id', protect, admin, activityLogController.getActivityLogDetail);

/**
 * DELETE /api/activity-logs/cleanup
 * Dọn dẹp logs cũ (Admin only)
 */
router.delete('/cleanup', protect, admin, activityLogController.cleanupOldLogs);

export default router;
