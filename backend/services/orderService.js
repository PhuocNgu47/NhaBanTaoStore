/**
 * Order Service
 * Chứa logic nghiệp vụ cho orders: tạo order, tính tổng tiền, validate, cập nhật status
 */

import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { sendOrderConfirmationEmail, sendOrderStatusUpdateEmail } from './emailService.js';
import * as couponService from './couponService.js';

/**
 * Lấy danh sách orders với phân trang và filter (Admin hoặc User)
 */
export const getOrders = async (userId, isAdmin = false, options = {}) => {
  const { 
    page = 1, 
    limit = 20, 
    status, 
    paymentStatus,
    search,
    sortBy = '-createdAt',
    startDate,
    endDate
  } = options;

  let query = {};
  
  if (!isAdmin) {
    query.userId = userId;
  }

  // Filter by status
  if (status && status !== 'all') {
    query.status = status;
  }

  // Filter by payment status
  if (paymentStatus && paymentStatus !== 'all') {
    query.paymentStatus = paymentStatus;
  }

  // Search by orderNumber, customer name, phone, email
  if (search) {
    const searchTerm = search.trim();
    query.$or = [
      { orderNumber: { $regex: searchTerm, $options: 'i' } },
      { 'shippingAddress.name': { $regex: searchTerm, $options: 'i' } },
      { 'shippingAddress.phone': { $regex: searchTerm, $options: 'i' } },
      { guestEmail: { $regex: searchTerm, $options: 'i' } },
      { guestPhone: { $regex: searchTerm, $options: 'i' } }
    ];
  }

  // Filter by date range
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('userId', 'name email')
      .populate('items.productId', 'name price image slug')
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(query)
  ]);

  return {
    orders,
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

/**
 * Lấy thống kê đơn hàng (Admin)
 */
export const getOrderStats = async (options = {}) => {
  const { startDate, endDate } = options;
  
  let dateFilter = {};
  if (startDate || endDate) {
    dateFilter.createdAt = {};
    if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
    if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
  }

  // Count by status
  const statusCounts = await Order.aggregate([
    { $match: dateFilter },
    { $group: { _id: '$status', count: { $sum: 1 } } }
  ]);

  // Count by payment status
  const paymentCounts = await Order.aggregate([
    { $match: dateFilter },
    { $group: { _id: '$paymentStatus', count: { $sum: 1 } } }
  ]);

  // Revenue stats
  const revenueStats = await Order.aggregate([
    { $match: { ...dateFilter, status: { $nin: ['cancelled', 'refunded'] } } },
    { 
      $group: { 
        _id: null, 
        totalRevenue: { $sum: '$totalAmount' },
        totalOrders: { $sum: 1 },
        avgOrderValue: { $avg: '$totalAmount' }
      } 
    }
  ]);

  // Daily orders (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const dailyOrders = await Order.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        count: { $sum: 1 },
        revenue: { $sum: '$totalAmount' }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Format results
  const stats = {
    byStatus: {},
    byPaymentStatus: {},
    revenue: revenueStats[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 },
    daily: dailyOrders
  };

  statusCounts.forEach(s => {
    stats.byStatus[s._id] = s.count;
  });

  paymentCounts.forEach(p => {
    stats.byPaymentStatus[p._id] = p.count;
  });

  // Totals
  stats.total = Object.values(stats.byStatus).reduce((a, b) => a + b, 0);
  stats.pending = stats.byStatus.pending || 0;
  stats.processing = (stats.byStatus.confirmed || 0) + (stats.byStatus.processing || 0);
  stats.shipped = stats.byStatus.shipped || 0;
  stats.delivered = stats.byStatus.delivered || 0;
  stats.cancelled = stats.byStatus.cancelled || 0;

  return stats;
};

/**
 * Lấy order theo ID
 */
export const getOrderById = async (orderId, userId, isAdmin = false) => {
  const order = await Order.findById(orderId)
    .populate('userId', 'name email')
    .populate('items.productId', 'name price image')
    .populate('statusHistory.updatedBy', 'name email');

  if (!order) {
    throw new Error('Không tìm thấy đơn hàng');
  }

  // Check if user owns this order or is admin
  if (order.userId && order.userId._id.toString() !== userId && !isAdmin) {
    throw new Error('Không có quyền truy cập');
  }

  return order;
};

/**
 * Tạo order mới
 */
export const createOrder = async (orderData, userId = null) => {
  const {
    items,
    shippingAddress,
    paymentMethod,
    guestEmail,
    couponCode,
    discountAmount
  } = orderData;

  // Validation: Items required
  if (!items || items.length === 0) {
    throw new Error('Giỏ hàng trống. Vui lòng thêm sản phẩm vào giỏ hàng.');
  }

  // Validation: Shipping address required
  if (!shippingAddress) {
    throw new Error('Vui lòng nhập địa chỉ giao hàng');
  }

  // Validate shipping address fields
  // Chấp nhận cả 'address' và 'addressLine1' (backward compatible)
  const addressValue = shippingAddress.address?.trim() || shippingAddress.addressLine1?.trim();
  if (!addressValue) {
    throw new Error('Vui lòng nhập địa chỉ giao hàng');
  }

  // Validate required fields - Business logic: Accept either dropdown selection (with codes) OR manual input (text only)
  const missingFields = [];
  
  if (!shippingAddress.name?.trim()) {
    missingFields.push('Họ tên');
  }
  
  if (!shippingAddress.phone?.trim()) {
    missingFields.push('Số điện thoại');
  }
  
  // City/Province: Accept either provinceCode (dropdown) OR city (manual input)
  if (!shippingAddress.provinceCode && !shippingAddress.city?.trim()) {
    missingFields.push('Thành phố/Tỉnh (chọn từ danh sách hoặc nhập thủ công)');
  }
  
  // District: Accept either districtCode (dropdown) OR district (manual input)
  if (!shippingAddress.districtCode && !shippingAddress.district?.trim()) {
    missingFields.push('Quận/Huyện (chọn từ danh sách hoặc nhập thủ công)');
  }
  
  // Ward: Accept either wardCode (dropdown) OR ward (manual input)
  if (!shippingAddress.wardCode && !shippingAddress.ward?.trim()) {
    missingFields.push('Phường/Xã (chọn từ danh sách hoặc nhập thủ công)');
  }

  if (missingFields.length > 0) {
    throw new Error(`Vui lòng điền đầy đủ thông tin: ${missingFields.join(', ')}`);
  }

  // Validate phone number (Vietnamese format)
  const phoneRegex = /^(0|\+84)[1-9][0-9]{8,9}$/;
  const cleanPhone = shippingAddress.phone.replace(/\s/g, '');
  if (!phoneRegex.test(cleanPhone)) {
    throw new Error('Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam (VD: 0912345678)');
  }

  // Determine contact email:
  // - If user is authenticated, get email from User model
  // - If guest, use guestEmail (required)
  let contactEmail = null;
  
  console.log('📧 Email check - userId:', userId, 'guestEmail:', guestEmail);
  
  if (userId) {
    // User is authenticated - get email from User model
    try {
      const User = (await import('../models/User.js')).default;
      const user = await User.findById(userId).select('email name');
      if (user && user.email) {
        contactEmail = user.email;
        console.log('✅ Got email from user:', contactEmail);
      } else {
        console.log('⚠️ User found but no email in DB');
      }
    } catch (err) {
      console.error('❌ Error fetching user email:', err);
    }
  }
  
  // If user is authenticated but no email in DB, use guestEmail if provided
  if (userId && !contactEmail && guestEmail) {
    contactEmail = guestEmail.trim();
    console.log('✅ Using guestEmail for authenticated user:', contactEmail);
  }
  
  // If still no email, use guestEmail
  if (!contactEmail && guestEmail) {
    contactEmail = guestEmail.trim();
    console.log('✅ Using guestEmail:', contactEmail);
  }
  
  // Final validation: Must have email
  // Guest checkout: Email is REQUIRED
  if (!contactEmail) {
    if (!userId && !guestEmail) {
      throw new Error('Email là bắt buộc để nhận thông tin đơn hàng. Vui lòng đăng nhập hoặc nhập email.');
    } else if (userId && !contactEmail) {
      // User đã đăng nhập nhưng không có email trong DB
      // Nếu có guestEmail, dùng nó
      if (guestEmail) {
        contactEmail = guestEmail.trim();
        console.log('✅ Using guestEmail as fallback for authenticated user:', contactEmail);
      } else {
        // Không có email nào cả - yêu cầu user cập nhật
        throw new Error('Không tìm thấy email trong tài khoản. Vui lòng cập nhật email trong hồ sơ hoặc nhập email để nhận thông tin đơn hàng.');
      }
    }
  }
  
  // Final check - must have email
  if (!contactEmail) {
    throw new Error('Email là bắt buộc để nhận thông tin đơn hàng. Vui lòng đăng nhập hoặc nhập email.');
  }

  // Validate email format if provided
  if (guestEmail) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestEmail.trim())) {
      throw new Error('Email không hợp lệ. Vui lòng kiểm tra lại.');
    }
  }

  // Validate và reserve stock cho từng item
  const orderItems = [];
  let subtotal = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      throw new Error(`Không tìm thấy sản phẩm: ${item.productId}`);
    }

    let variant = null;
    let itemPrice = product.price;
    let itemStock = product.stock || 0;
    let itemSku = product.sku;
    let itemName = product.name;
    let variantName = '';

    // Nếu có variant, validate variant
    if (item.variantId) {
      variant = product.variants.id(item.variantId);
      if (!variant) {
        throw new Error(`Không tìm thấy biến thể: ${item.variantId}`);
      }
      if (!variant.isActive) {
        throw new Error('Biến thể sản phẩm không còn hoạt động');
      }
      itemPrice = variant.price;
      itemStock = variant.stock - variant.reserved;
      itemSku = variant.sku;
      variantName = variant.name || `${product.name} - ${Object.values(variant.attributes || {}).join(' ')}`;
    }

    const quantity = Number(item.quantity) || 1;

    // Check stock availability
    if (itemStock < quantity) {
      throw new Error(`Sản phẩm "${itemName}" ${variantName ? `(${variantName})` : ''} không đủ tồn kho. Còn lại: ${itemStock}`);
    }

    // Reserve stock (chỉ reserve, chưa trừ stock thật)
    // Stock thật sẽ được trừ khi order chuyển sang confirmed/processing
    if (variant) {
      variant.reserved = (variant.reserved || 0) + quantity;
      // Validate: reserved không được vượt quá stock
      if (variant.reserved > variant.stock) {
        throw new Error(`Không đủ tồn kho cho sản phẩm "${itemName}" ${variantName ? `(${variantName})` : ''}`);
      }
    } else {
      // Nếu không có variant, sử dụng product stock
      // Note: Product model không có reserved field, nên chỉ validate
      // Stock thật sẽ được trừ khi order confirmed
      if (product.stock < quantity) {
        throw new Error(`Không đủ tồn kho cho sản phẩm "${itemName}"`);
      }
    }

    await product.save();

    // Tính subtotal
    const itemSubtotal = itemPrice * quantity;
    subtotal += itemSubtotal;

    // Tạo order item
    orderItems.push({
      productId: product._id,
      variantId: variant ? variant._id : null,
      productName: itemName,
      variantName: variantName || null,
      sku: itemSku,
      quantity,
      price: itemPrice,
      subtotal: itemSubtotal
    });
  }

  // Validate và apply coupon discount nếu có
  let finalDiscount = 0;
  let couponId = null;
  
  if (couponCode) {
    try {
      // Validate coupon với subtotal
      const couponResult = await couponService.validateCoupon(couponCode, subtotal);
      finalDiscount = couponResult.discount;
      // Tìm coupon để lấy ID
      const Coupon = (await import('../models/Coupon.js')).default;
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase().trim() });
      if (coupon) {
        couponId = coupon._id;
        // Tăng usedCount (nếu có usageLimit)
        if (coupon.usageLimit) {
          coupon.usedCount = (coupon.usedCount || 0) + 1;
          await coupon.save();
        }
      }
    } catch (couponError) {
      throw new Error(`Mã giảm giá không hợp lệ: ${couponError.message}`);
    }
  } else if (discountAmount) {
    // Nếu frontend đã validate và gửi discountAmount, vẫn validate lại để đảm bảo
    finalDiscount = Number(discountAmount);
    if (finalDiscount < 0 || finalDiscount > subtotal) {
      throw new Error('Số tiền giảm giá không hợp lệ');
    }
  }

  const shippingFee = shippingAddress.shippingFee || 0;
  const finalAmount = subtotal - finalDiscount + shippingFee;

  if (finalAmount <= 0) {
    throw new Error('Tổng tiền đơn hàng không hợp lệ');
  }

  // Create order
  const order = new Order({
    userId: userId || null,
    guestEmail: guestEmail ? guestEmail.trim() : null,
    guestPhone: shippingAddress.phone ? cleanPhone : null,
    items: orderItems,
    subtotal,
    discountAmount: finalDiscount,
    shippingFee,
    totalAmount: finalAmount,
    couponCode: couponCode || null,
    couponId: couponId || null,
    shippingAddress: {
      name: shippingAddress.name.trim(),
      phone: cleanPhone,
      addressLine1: shippingAddress.address?.trim() || shippingAddress.addressLine1?.trim() || '',
      // Ward: Use code if available (from dropdown), otherwise use manual input
      ward: shippingAddress.ward?.trim() || '',
      wardCode: shippingAddress.wardCode || null,
      // District: Use code if available (from dropdown), otherwise use manual input
      district: shippingAddress.district?.trim() || '',
      districtCode: shippingAddress.districtCode || null,
      // City/Province: Use code if available (from dropdown), otherwise use manual input
      city: shippingAddress.city?.trim() || '',
      provinceCode: shippingAddress.provinceCode || null,
      cityCode: shippingAddress.cityCode || shippingAddress.provinceCode || null,
      country: shippingAddress.country?.trim() || 'Vietnam',
      zipCode: shippingAddress.zipCode?.trim() || '',
      coordinates: shippingAddress.coordinates || null
    },
    paymentMethod: paymentMethod || 'cod',
    status: 'pending',
    // Set paymentStatus based on paymentMethod: cod orders are 'cod', others are 'unpaid'
    paymentStatus: (paymentMethod === 'cod' ? 'cod' : 'unpaid')
  });

  try {
    await order.save();
  } catch (saveError) {
    console.error('Error saving order:', saveError);
    console.error('Order validation errors:', saveError.errors);
    console.error('Order paymentStatus:', order.paymentStatus);
    console.error('Order paymentMethod:', order.paymentMethod);
    throw new Error(`Lỗi khi lưu đơn hàng: ${saveError.message}`);
  }

  // Send confirmation email asynchronously
  const customerName = shippingAddress.name.trim() || 'Khách hàng';
  const emailAddress = contactEmail;
  if (emailAddress) {
    sendOrderConfirmationEmail(emailAddress, order, customerName).catch(err => {
      console.error('Email send error:', err);
    });
  }

  return order;
};

/**
 * Cập nhật order status (Admin only)
 */
export const updateOrderStatus = async (orderId, status, note, adminId, trackingNumber = null) => {
  const validStatuses = [
    'pending', 'confirmed', 'shipping_ready', 'shipping_created', 'delivering', 'completed', 'cancelled', 'returned',
    // Backward compatibility
    'processing', 'shipped', 'delivered', 'refunded'
  ];

  if (!validStatuses.includes(status)) {
    throw new Error(`Trạng thái không hợp lệ: ${status}`);
  }

  const order = await Order.findById(orderId).populate('userId', 'email name');

  if (!order) {
    throw new Error('Không tìm thấy đơn hàng');
  }

  const oldStatus = order.status;

  // Inventory management based on status change
  if (oldStatus !== status) {
    // Nếu chuyển từ pending sang confirmed: Trừ stock thật
    if (oldStatus === 'pending' && status === 'confirmed') {
      await deductStock(order);
    }

    // Nếu hủy order: Restore stock
    if (status === 'cancelled' && oldStatus !== 'cancelled') {
      await restoreStock(order);
      order.cancelledBy = adminId;
    }

    // Nếu return: Có thể restore stock (tùy business logic)
    if (status === 'returned') {
      // Có thể restore stock nếu muốn
      // await restoreStock(order);
    }
  }

  // Update status
  order.status = status;
  
  // Add to status history
  if (!order.statusHistory) {
    order.statusHistory = [];
  }
  order.statusHistory.push({
    status,
    updatedAt: new Date(),
    updatedBy: adminId,
    note: note || null,
    trackingNumber: trackingNumber || null
  });
  
  // Mark statusHistory as modified so Mongoose knows it changed
  order.markModified('statusHistory');

  // Update tracking number if provided
  if (trackingNumber) {
    order.trackingNumber = trackingNumber;
  }

  try {
    await order.save();
  } catch (saveError) {
    console.error('Error saving order:', saveError);
    console.error('Order status:', order.status);
    console.error('Order validation errors:', saveError.errors);
    throw new Error(`Lỗi khi lưu đơn hàng: ${saveError.message}`);
  }

  // Send email notification if status changed
  if (oldStatus !== status) {
    const recipientEmail = order.userId?.email || order.guestEmail;
    if (recipientEmail) {
      sendOrderStatusUpdateEmail(recipientEmail, order, oldStatus, status)
        .catch(err => console.error('Email send error:', err));
    }
  }

  return order;
};

/**
 * Hủy đơn hàng (User hoặc Admin)
 */
export const cancelOrder = async (orderId, userId, reason, isAdmin = false) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new Error('Không tìm thấy đơn hàng');
  }

  // Check permission
  if (!isAdmin && order.userId?.toString() !== userId.toString()) {
    throw new Error('Bạn không có quyền hủy đơn hàng này');
  }

  // Chỉ cho phép hủy nếu status là pending hoặc confirmed
  if (!['pending', 'confirmed'].includes(order.status)) {
    throw new Error(`Không thể hủy đơn hàng ở trạng thái: ${order.status}`);
  }

  // Restore stock
  await restoreStock(order);

  // Update order
  order.status = 'cancelled';
  order.cancellationReason = reason || 'Khách hàng yêu cầu hủy';
  order.cancelledBy = userId;
  order.cancelledAt = new Date();

  if (!order.statusHistory) {
    order.statusHistory = [];
  }
  order.statusHistory.push({
    status: 'cancelled',
    updatedAt: new Date(),
    updatedBy: userId,
    note: reason || null
  });

  await order.save();

  return order;
};

/**
 * Trừ stock thật (khi order confirmed/processing)
 */
const deductStock = async (order) => {
  for (const item of order.items) {
    const product = await Product.findById(item.productId);
    if (!product) continue;

    if (item.variantId) {
      const variant = product.variants.id(item.variantId);
      if (variant) {
        // Trừ stock thật và giảm reserved
        variant.stock = Math.max(0, variant.stock - item.quantity);
        variant.reserved = Math.max(0, (variant.reserved || 0) - item.quantity);
      }
    } else {
      // Backward compatible: trừ ở product level
      product.stock = Math.max(0, (product.stock || 0) - item.quantity);
    }

    await product.save();
  }
};

/**
 * Restore stock (khi order cancelled)
 */
const restoreStock = async (order) => {
  for (const item of order.items) {
    const product = await Product.findById(item.productId);
    if (!product) continue;

    if (item.variantId) {
      const variant = product.variants.id(item.variantId);
      if (variant) {
        // Restore stock và giảm reserved
        variant.stock = (variant.stock || 0) + item.quantity;
        variant.reserved = Math.max(0, (variant.reserved || 0) - item.quantity);
      }
    } else {
      // Backward compatible: restore ở product level
      product.stock = (product.stock || 0) + item.quantity;
    }

    await product.save();
  }
};

/**
 * Cập nhật order (Admin)
 */
export const updateOrder = async (orderId, updateData) => {
  const { status, paymentStatus } = updateData;
  const order = await Order.findByIdAndUpdate(
    orderId,
    { status, paymentStatus, updatedAt: Date.now() },
    { new: true }
  );

  if (!order) {
    throw new Error('Không tìm thấy đơn hàng');
  }

  return order;
};

/**
 * Cập nhật items (quantity) của đơn hàng (Admin)
 * items input: [{ itemId?, productId?, variantId?, quantity }]
 */
export const updateOrderItems = async (orderId, items, adminId) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Dữ liệu items không hợp lệ');
  }

  const order = await Order.findById(orderId)
    .populate('userId', 'name email')
    .populate('items.productId', 'name price image');

  if (!order) {
    throw new Error('Không tìm thấy đơn hàng');
  }

  // Chỉ cho phép sửa khi đơn chưa ở trạng thái cuối hoặc đã trừ kho (để tránh lệch tồn kho)
  const blockedStatuses = ['shipped', 'delivered', 'cancelled', 'returned', 'refunded'];
  if (blockedStatuses.includes(order.status)) {
    throw new Error(`Không thể sửa số lượng khi đơn ở trạng thái: ${order.status}`);
  }

  // Update quantities
  for (const patch of items) {
    const qty = Number(patch.quantity);
    if (!Number.isFinite(qty) || qty < 1) {
      throw new Error('Số lượng không hợp lệ');
    }

    let targetIndex = -1;

    if (patch.itemId) {
      targetIndex = order.items.findIndex(i => i._id.toString() === String(patch.itemId));
    } else {
      const productId = patch.productId ? String(patch.productId) : null;
      const variantId = patch.variantId ? String(patch.variantId) : null;
      targetIndex = order.items.findIndex(i => {
        const sameProduct = productId && i.productId && String(i.productId._id || i.productId) === productId;
        const sameVariant = variantId
          ? (i.variantId && String(i.variantId) === variantId)
          : (!i.variantId);
        return sameProduct && sameVariant;
      });
    }

    if (targetIndex === -1) {
      throw new Error('Item không tồn tại trong đơn hàng');
    }

    const orderItem = order.items[targetIndex];

    // Cập nhật quantity + subtotal (giữ nguyên price snapshot)
    orderItem.quantity = qty;
    orderItem.subtotal = (Number(orderItem.price) || 0) * qty;
  }

  // Recalculate subtotal/total (giữ nguyên discount/shipping)
  order.subtotal = order.items.reduce((sum, i) => sum + (Number(i.subtotal) || (Number(i.price) || 0) * (Number(i.quantity) || 0)), 0);
  const discount = Number(order.discountAmount) || 0;
  const shippingFee = Number(order.shippingFee) || 0;
  order.totalAmount = Math.max(0, order.subtotal - discount + shippingFee);

  // Log internal note (optional)
  if (!order.notes) order.notes = [];
  order.notes.push({
    note: `Admin cập nhật số lượng sản phẩm trong đơn hàng`,
    addedBy: adminId,
    isInternal: true,
  });

  await order.save();
  return order;
};

/**
 * Lấy guest order theo email và orderNumber
 * Trả về đầy đủ thông tin để tra cứu
 * Hỗ trợ tìm kiếm không phân biệt hoa thường và trim whitespace
 */
export const getGuestOrder = async (email, orderNumber) => {
  // Normalize email: lowercase và trim
  const normalizedEmail = email ? email.trim().toLowerCase() : '';
  const normalizedOrderNumber = orderNumber ? String(orderNumber).trim() : '';
  
  if (!normalizedEmail || !normalizedOrderNumber) {
    throw new Error('Vui lòng nhập đầy đủ mã đơn hàng và email.');
  }

  // Tìm order: so sánh email không phân biệt hoa thường
  const order = await Order.findOne({
    $or: [
      // Exact match với email đã normalize
      { 
        guestEmail: { $regex: new RegExp(`^${normalizedEmail.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') },
        orderNumber: normalizedOrderNumber
      },
      // Fallback: tìm với orderNumber và kiểm tra email sau
      {
        orderNumber: normalizedOrderNumber
      }
    ]
  })
    .populate('items.productId', 'name price image slug')
    .populate('items.variantId', 'name price sku')
    .populate('statusHistory.updatedBy', 'name email')
    .lean();

  if (!order) {
    throw new Error('Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn hàng và email.');
  }

  // Verify email matches (case-insensitive)
  const orderEmail = order.guestEmail ? order.guestEmail.trim().toLowerCase() : '';
  if (orderEmail && orderEmail !== normalizedEmail) {
    throw new Error('Email không khớp với đơn hàng. Vui lòng kiểm tra lại email.');
  }

  return order;
};

/**
 * Xác nhận đơn hàng (Admin only)
 * Logic: Chuyển khoản: chỉ xác nhận khi đã nhận tiền (paid)
 *        COD: có thể xác nhận ngay
 */
export const confirmOrder = async (orderId, adminId, note) => {
  const order = await Order.findById(orderId).populate('userId', 'email name');

  if (!order) {
    throw new Error('Không tìm thấy đơn hàng');
  }

  // Check current status
  if (order.status !== 'pending') {
    throw new Error(`Không thể xác nhận đơn hàng ở trạng thái: ${order.status}`);
  }

  // Validate payment: Chuyển khoản phải đã thanh toán, COD có thể xác nhận ngay
  if (order.paymentMethod === 'bank_transfer' && order.paymentStatus !== 'paid') {
    throw new Error('Đơn hàng chuyển khoản phải đã thanh toán trước khi xác nhận');
  }

  // Update status to confirmed
  order.status = 'confirmed';
  order.confirmedAt = new Date();

  // Trừ stock khi xác nhận
  await deductStock(order);

  // Add to status history
  if (!order.statusHistory) {
    order.statusHistory = [];
  }
  order.statusHistory.push({
    status: 'confirmed',
    updatedAt: new Date(),
    updatedBy: adminId,
    note: note || 'Admin xác nhận đơn hàng'
  });

  await order.save();

  // Send email notification
  const recipientEmail = order.userId?.email || order.guestEmail;
  if (recipientEmail) {
    sendOrderStatusUpdateEmail(recipientEmail, order, 'pending', 'confirmed')
      .catch(err => console.error('Email send error:', err));
  }

  return order;
};

/**
 * Cập nhật trạng thái thanh toán (Admin only)
 */
export const updatePayment = async (orderId, paymentStatus, adminId, note, paymentDetails = {}) => {
  const validPaymentStatuses = ['unpaid', 'paid', 'cod', 'failed', 'refunded'];

  if (!validPaymentStatuses.includes(paymentStatus)) {
    throw new Error('Trạng thái thanh toán không hợp lệ');
  }

  const order = await Order.findById(orderId).populate('userId', 'email name');

  if (!order) {
    throw new Error('Không tìm thấy đơn hàng');
  }

  const oldPaymentStatus = order.paymentStatus;

  // Update payment status
  order.paymentStatus = paymentStatus;

  // If paid, set paidAt
  if (paymentStatus === 'paid' && !order.paidAt) {
    order.paidAt = new Date();
  }

  // Update payment details if provided
  if (paymentDetails && Object.keys(paymentDetails).length > 0) {
    order.paymentDetails = {
      ...order.paymentDetails,
      ...paymentDetails
    };
  }

  // Update payment note
  if (note) {
    order.paymentNote = note;
  }

  // If payment is confirmed and order is confirmed, move to shipping_ready
  if (paymentStatus === 'paid' && order.status === 'confirmed') {
    order.status = 'shipping_ready';

    if (!order.statusHistory) {
      order.statusHistory = [];
    }
    order.statusHistory.push({
      status: 'shipping_ready',
      updatedAt: new Date(),
      updatedBy: adminId,
      note: 'Đã xác nhận thanh toán, sẵn sàng lên đơn'
    });
  }

  // If COD, move to shipping_ready after confirmation
  if (paymentStatus === 'cod' && order.status === 'confirmed') {
    order.status = 'shipping_ready';

    if (!order.statusHistory) {
      order.statusHistory = [];
    }
    order.statusHistory.push({
      status: 'shipping_ready',
      updatedAt: new Date(),
      updatedBy: adminId,
      note: 'COD - Sẵn sàng lên đơn'
    });
  }

  await order.save();

  return order;
};


