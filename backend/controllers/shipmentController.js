/**
 * Shipment Controller
 * Xử lý request cho quản lý vận đơn
 */

import * as shipmentService from '../services/shipmentService.js';

/**
 * Tạo vận đơn mới
 * POST /api/shipments/create
 */
export const createShipment = async (req, res) => {
  try {
    const { orderId, trackingCode, shippingProvider, shippingFee, estimatedDeliveryDate, note } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID là bắt buộc'
      });
    }

    const shipment = await shipmentService.createShipment(
      orderId,
      {
        trackingCode,
        shippingProvider,
        shippingFee,
        estimatedDeliveryDate,
        note
      },
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: 'Tạo vận đơn thành công',
      shipment
    });
  } catch (error) {
    console.error('Create shipment error:', error);
    const statusCode = error.message.includes('Không tìm thấy') ? 404 :
                      error.message.includes('không hợp lệ') || 
                      error.message.includes('bắt buộc') ? 400 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi tạo vận đơn'
    });
  }
};

/**
 * Lấy chi tiết vận đơn
 * GET /api/shipments/:id
 */
export const getShipmentById = async (req, res) => {
  try {
    const shipment = await shipmentService.getShipmentById(req.params.id);

    res.json({
      success: true,
      shipment
    });
  } catch (error) {
    console.error('Get shipment error:', error);
    res.status(404).json({
      success: false,
      message: error.message || 'Không tìm thấy vận đơn'
    });
  }
};

/**
 * Lấy vận đơn theo orderId
 * GET /api/shipments/order/:orderId
 */
export const getShipmentByOrderId = async (req, res) => {
  try {
    const shipment = await shipmentService.getShipmentByOrderId(req.params.orderId);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy vận đơn cho đơn hàng này'
      });
    }

    res.json({
      success: true,
      shipment
    });
  } catch (error) {
    console.error('Get shipment by order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy vận đơn'
    });
  }
};

/**
 * Lấy vận đơn theo tracking code
 * GET /api/shipments/track/:trackingCode
 */
export const getShipmentByTrackingCode = async (req, res) => {
  try {
    const shipment = await shipmentService.getShipmentByTrackingCode(req.params.trackingCode);

    res.json({
      success: true,
      shipment
    });
  } catch (error) {
    console.error('Get shipment by tracking code error:', error);
    res.status(404).json({
      success: false,
      message: error.message || 'Không tìm thấy vận đơn'
    });
  }
};

/**
 * Cập nhật tracking
 * PUT /api/shipments/:id/track
 */
export const updateTracking = async (req, res) => {
  try {
    const { status, location, note } = req.body;

    const shipment = await shipmentService.updateTracking(
      req.params.id,
      { status, location, note },
      req.user.id
    );

    res.json({
      success: true,
      message: 'Cập nhật tracking thành công',
      shipment
    });
  } catch (error) {
    console.error('Update tracking error:', error);
    const statusCode = error.message.includes('Không tìm thấy') ? 404 :
                      error.message.includes('không hợp lệ') ? 400 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật tracking'
    });
  }
};

/**
 * Hủy vận đơn
 * POST /api/shipments/:id/cancel
 */
export const cancelShipment = async (req, res) => {
  try {
    const { reason } = req.body;

    const shipment = await shipmentService.cancelShipment(
      req.params.id,
      reason,
      req.user.id
    );

    res.json({
      success: true,
      message: 'Hủy vận đơn thành công',
      shipment
    });
  } catch (error) {
    console.error('Cancel shipment error:', error);
    const statusCode = error.message.includes('Không tìm thấy') ? 404 :
                      error.message.includes('Không thể hủy') ? 400 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi hủy vận đơn'
    });
  }
};

/**
 * Lấy danh sách vận đơn
 * GET /api/shipments
 */
export const getShipments = async (req, res) => {
  try {
    const options = {
      page: req.query.page || 1,
      limit: req.query.limit || 20,
      status: req.query.status,
      shippingProvider: req.query.shippingProvider,
      search: req.query.search,
      sortBy: req.query.sortBy || '-createdAt'
    };

    const result = await shipmentService.getShipments(options);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get shipments error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách vận đơn'
    });
  }
};
