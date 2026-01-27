/**
 * Shipment Routes
 */

import express from 'express';
import * as shipmentController from '../controllers/shipmentController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

/**
 * POST /api/shipments/create
 * Tạo vận đơn mới (Admin only)
 */
router.post('/create', protect, admin, shipmentController.createShipment);

/**
 * GET /api/shipments
 * Lấy danh sách vận đơn (Admin only)
 */
router.get('/', protect, admin, shipmentController.getShipments);

/**
 * GET /api/shipments/order/:orderId
 * Lấy vận đơn theo orderId
 */
router.get('/order/:orderId', protect, shipmentController.getShipmentByOrderId);

/**
 * GET /api/shipments/track/:trackingCode
 * Lấy vận đơn theo tracking code (public for tracking)
 */
router.get('/track/:trackingCode', shipmentController.getShipmentByTrackingCode);

/**
 * GET /api/shipments/:id
 * Lấy chi tiết vận đơn
 */
router.get('/:id', protect, shipmentController.getShipmentById);

/**
 * PUT /api/shipments/:id/track
 * Cập nhật tracking (Admin only)
 */
router.put('/:id/track', protect, admin, shipmentController.updateTracking);

/**
 * POST /api/shipments/:id/cancel
 * Hủy vận đơn (Admin only)
 */
router.post('/:id/cancel', protect, admin, shipmentController.cancelShipment);

export default router;
