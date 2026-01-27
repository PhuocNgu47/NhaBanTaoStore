/**
 * Shipment Service
 * Logic nghiệp vụ cho quản lý vận đơn
 */

import Shipment from '../models/Shipment.js';
import Order from '../models/Order.js';

/**
 * Tạo vận đơn mới
 * Chỉ cho phép khi order_status = shipping_ready và payment_status = paid hoặc cod
 */
export const createShipment = async (orderId, shipmentData, adminId) => {
  const { trackingCode, shippingProvider, shippingFee, estimatedDeliveryDate, note } = shipmentData;

  // Validate order exists
  const order = await Order.findById(orderId);
  if (!order) {
    throw new Error('Không tìm thấy đơn hàng');
  }

  // Validate order status: chỉ cho phép khi shipping_ready
  if (order.status !== 'shipping_ready') {
    throw new Error(`Không thể tạo vận đơn. Đơn hàng phải ở trạng thái "Chờ lên đơn" (shipping_ready). Trạng thái hiện tại: ${order.status}`);
  }

  // Validate payment status: phải là paid hoặc cod
  if (order.paymentStatus !== 'paid' && order.paymentStatus !== 'cod') {
    throw new Error(`Không thể tạo vận đơn. Thanh toán phải là "Đã thanh toán" (paid) hoặc "COD" (cod). Trạng thái hiện tại: ${order.paymentStatus}`);
  }

  // Check if shipment already exists
  const existingShipment = await Shipment.findOne({ orderId });
  if (existingShipment) {
    throw new Error('Đơn hàng này đã có vận đơn');
  }

  // Validate required fields
  if (!trackingCode || !trackingCode.trim()) {
    throw new Error('Mã vận đơn là bắt buộc');
  }

  if (!shippingProvider) {
    throw new Error('Hãng vận chuyển là bắt buộc');
  }

  // Create shipment
  const shipment = new Shipment({
    orderId,
    trackingCode: trackingCode.trim(),
    shippingProvider,
    shippingFee: shippingFee || 0,
    estimatedDeliveryDate: estimatedDeliveryDate ? new Date(estimatedDeliveryDate) : null,
    recipientName: order.shippingAddress.name,
    recipientPhone: order.shippingAddress.phone,
    recipientAddress: {
      addressLine1: order.shippingAddress.addressLine1,
      ward: order.shippingAddress.ward,
      district: order.shippingAddress.district,
      city: order.shippingAddress.city,
      country: order.shippingAddress.country || 'Vietnam'
    },
    note: note || null,
    trackingHistory: [{
      status: 'pending',
      location: 'Đã tạo vận đơn',
      timestamp: new Date(),
      note: 'Vận đơn đã được tạo'
    }]
  });

  await shipment.save();

  // Update order status to shipping_created
  order.status = 'shipping_created';
  order.trackingNumber = trackingCode;
  order.shippingCompany = shippingProvider;
  order.shippedAt = new Date();

  // Add to status history
  if (!order.statusHistory) {
    order.statusHistory = [];
  }
  order.statusHistory.push({
    status: 'shipping_created',
    updatedAt: new Date(),
    updatedBy: adminId,
    note: `Đã tạo vận đơn: ${trackingCode} - ${shippingProvider}`,
    trackingNumber: trackingCode
  });

  await order.save();

  return shipment;
};

/**
 * Lấy chi tiết vận đơn
 */
export const getShipmentById = async (shipmentId) => {
  const shipment = await Shipment.findById(shipmentId)
    .populate('orderId', 'orderNumber totalAmount paymentStatus status')
    .populate('cancelledBy', 'name email');

  if (!shipment) {
    throw new Error('Không tìm thấy vận đơn');
  }

  return shipment;
};

/**
 * Lấy vận đơn theo orderId
 */
export const getShipmentByOrderId = async (orderId) => {
  const shipment = await Shipment.findOne({ orderId })
    .populate('orderId', 'orderNumber totalAmount paymentStatus status')
    .populate('cancelledBy', 'name email');

  return shipment;
};

/**
 * Lấy vận đơn theo tracking code
 */
export const getShipmentByTrackingCode = async (trackingCode) => {
  const shipment = await Shipment.findOne({ trackingCode })
    .populate('orderId', 'orderNumber totalAmount paymentStatus status shippingAddress')
    .populate('cancelledBy', 'name email');

  if (!shipment) {
    throw new Error('Không tìm thấy vận đơn với mã này');
  }

  return shipment;
};

/**
 * Cập nhật trạng thái tracking
 */
export const updateTracking = async (shipmentId, trackingData, adminId) => {
  const { status, location, note } = trackingData;

  const shipment = await Shipment.findById(shipmentId);
  if (!shipment) {
    throw new Error('Không tìm thấy vận đơn');
  }

  // Update shipping status
  if (status) {
    const validStatuses = ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'failed', 'returned', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error('Trạng thái không hợp lệ');
    }
    shipment.shippingStatus = status;
  }

  // Add to tracking history
  shipment.trackingHistory.push({
    status: status || shipment.shippingStatus,
    location: location || '',
    timestamp: new Date(),
    note: note || ''
  });

  // Update order status based on shipment status
  const order = await Order.findById(shipment.orderId);
  if (order) {
    if (status === 'delivered') {
      order.status = 'completed';
      order.deliveredAt = new Date();
      shipment.actualDeliveryDate = new Date();
    } else if (status === 'in_transit' || status === 'out_for_delivery') {
      if (order.status === 'shipping_created') {
        order.status = 'delivering';
      }
    } else if (status === 'returned') {
      order.status = 'returned';
    }

    // Add to order status history
    if (!order.statusHistory) {
      order.statusHistory = [];
    }
    order.statusHistory.push({
      status: order.status,
      updatedAt: new Date(),
      updatedBy: adminId,
      note: note || `Cập nhật tracking: ${status}`,
      trackingNumber: shipment.trackingCode
    });

    await order.save();
  }

  await shipment.save();

  return shipment;
};

/**
 * Hủy vận đơn
 */
export const cancelShipment = async (shipmentId, reason, adminId) => {
  const shipment = await Shipment.findById(shipmentId);
  if (!shipment) {
    throw new Error('Không tìm thấy vận đơn');
  }

  // Check if already cancelled or delivered
  if (shipment.shippingStatus === 'cancelled') {
    throw new Error('Vận đơn đã bị hủy');
  }

  if (shipment.shippingStatus === 'delivered') {
    throw new Error('Không thể hủy vận đơn đã giao hàng');
  }

  // Update shipment
  shipment.shippingStatus = 'cancelled';
  shipment.cancelledAt = new Date();
  shipment.cancelledBy = adminId;
  shipment.trackingHistory.push({
    status: 'cancelled',
    location: '',
    timestamp: new Date(),
    note: reason || 'Hủy vận đơn'
  });

  await shipment.save();

  // Update order status back to shipping_ready
  const order = await Order.findById(shipment.orderId);
  if (order) {
    order.status = 'shipping_ready';
    order.trackingNumber = null;
    order.shippingCompany = null;

    if (!order.statusHistory) {
      order.statusHistory = [];
    }
    order.statusHistory.push({
      status: 'shipping_ready',
      updatedAt: new Date(),
      updatedBy: adminId,
      note: `Hủy vận đơn: ${reason || ''}`
    });

    await order.save();
  }

  return shipment;
};

/**
 * Lấy danh sách vận đơn với filter
 */
export const getShipments = async (options = {}) => {
  const {
    page = 1,
    limit = 20,
    status,
    shippingProvider,
    search,
    sortBy = '-createdAt'
  } = options;

  let query = {};

  if (status && status !== 'all') {
    query.shippingStatus = status;
  }

  if (shippingProvider && shippingProvider !== 'all') {
    query.shippingProvider = shippingProvider;
  }

  if (search) {
    query.$or = [
      { trackingCode: { $regex: search, $options: 'i' } },
      { recipientName: { $regex: search, $options: 'i' } },
      { recipientPhone: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (page - 1) * limit;

  const [shipments, total] = await Promise.all([
    Shipment.find(query)
      .populate('orderId', 'orderNumber totalAmount paymentStatus status')
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean(),
    Shipment.countDocuments(query)
  ]);

  return {
    shipments,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    }
  };
};
