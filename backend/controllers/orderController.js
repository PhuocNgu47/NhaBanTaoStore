/**
 * Order Controller
 * Nhận request từ Routes và gọi Order Service
 */

import * as orderService from '../services/orderService.js';
import * as cartService from '../services/cartService.js';

/**
 * Lấy danh sách orders
 */
export const getOrders = async (req, res) => {
  try {
    const orders = await orderService.getOrders(req.user.id, req.user.role === 'admin');
    res.json({ orders });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách đơn hàng'
    });
  }
};

/**
 * Lấy order theo ID
 */
export const getOrderById = async (req, res) => {
  try {
    const order = await orderService.getOrderById(
      req.params.id,
      req.user.id,
      req.user.role === 'admin'
    );
    
    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    
    const statusCode = error.message.includes('Không tìm thấy') ? 404 :
                      error.message.includes('Không có quyền') ? 403 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi lấy đơn hàng'
    });
  }
};

/**
 * Tạo order mới
 * Hỗ trợ cả authenticated users và guest checkout
 */
export const createOrder = async (req, res) => {
  try {
    // Lấy userId từ token nếu có
    let userId = null;
    
    // Kiểm tra token trong header
    if (req.headers.authorization) {
      try {
        const authHeader = req.headers.authorization;
        const token = authHeader.replace('Bearer ', '').trim();
        
        if (token && token !== 'null' && token !== 'undefined' && token.length > 10) {
          const jwt = await import('jsonwebtoken');
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          userId = decoded.id;
          console.log('✅ Verified token, userId:', userId);
        } else {
          console.log('⚠️ Token invalid format:', token?.substring(0, 20));
        }
      } catch (err) {
        // Token không hợp lệ hoặc hết hạn, tiếp tục như guest
        console.log('⚠️ Token invalid or expired, proceeding as guest:', err.message);
      }
    }
    
    // Nếu có req.user từ middleware (nếu route có protect), ưu tiên dùng
    if (req.user?.id) {
      userId = req.user.id;
      console.log('✅ Got userId from req.user:', userId);
    }
    
    console.log('📦 Creating order - userId:', userId, 'guestEmail:', req.body.guestEmail, 'hasAuthHeader:', !!req.headers.authorization);
    
    const order = await orderService.createOrder(req.body, userId);
    
    res.status(201).json({
      success: true,
      message: 'Đơn hàng đã được tạo thành công! Email xác nhận đã được gửi.',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    
    const statusCode = error.message.includes('Vui lòng') || 
                      error.message.includes('không hợp lệ') ||
                      error.message.includes('Email') ||
                      error.message.includes('Giỏ hàng') ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi tạo đơn hàng. Vui lòng thử lại.'
    });
  }
};

/**
 * Cập nhật order status (Admin only)
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, note, trackingNumber } = req.body;
    const order = await orderService.updateOrderStatus(
      req.params.id,
      status,
      note,
      req.user.id,
      trackingNumber
    );
    
    res.json({
      success: true,
      message: 'Cập nhật trạng thái đơn hàng thành công',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    
    const statusCode = error.message.includes('Không tìm thấy') ? 404 :
                      error.message.includes('không hợp lệ') ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật trạng thái đơn hàng'
    });
  }
};

/**
 * Hủy đơn hàng
 */
export const cancelOrder = async (req, res) => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';
    const { id } = req.params;
    const { reason } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập'
      });
    }

    const order = await orderService.cancelOrder(id, userId, reason, isAdmin);
    
    res.json({
      success: true,
      message: 'Đã hủy đơn hàng',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    
    const statusCode = error.message.includes('Không tìm thấy') ? 404 :
                      error.message.includes('quyền') ? 403 :
                      error.message.includes('Không thể hủy') ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi hủy đơn hàng'
    });
  }
};

/**
 * Cập nhật order (Admin)
 */
export const updateOrder = async (req, res) => {
  try {
    const order = await orderService.updateOrder(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Order updated',
      order
    });
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật đơn hàng'
    });
  }
};

/**
 * Cập nhật items (quantity) của order (Admin)
 */
export const updateOrderItems = async (req, res) => {
  try {
    const { items } = req.body;

    const order = await orderService.updateOrderItems(req.params.id, items, req.user.id);

    res.json({
      success: true,
      message: 'Cập nhật số lượng sản phẩm trong đơn hàng thành công',
      order
    });
  } catch (error) {
    console.error('Update order items error:', error);

    const statusCode = error.message.includes('Không tìm thấy') ? 404 :
                      error.message.includes('không hợp lệ') ? 400 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật sản phẩm trong đơn hàng'
    });
  }
};

/**
 * Lấy guest order
 */
export const getGuestOrder = async (req, res) => {
  try {
    const order = await orderService.getGuestOrder(req.params.email, req.params.orderNumber);
    res.json(order);
  } catch (error) {
    console.error('Get guest order error:', error);
    res.status(404).json({
      success: false,
      message: error.message || 'Order not found'
    });
  }
};

/**
 * Tạo đơn hàng từ giỏ hàng
 * Tự động lấy items từ cart và tạo order
 */
export const createOrderFromCart = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const sessionId = req.headers['x-session-id'] || null;
    
    // Lấy cart
    const cart = await cartService.getCart(userId, sessionId);
    
    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Giỏ hàng trống. Vui lòng thêm sản phẩm vào giỏ hàng.'
      });
    }

    // Chuyển đổi cart items thành order items format
    const items = cart.items.map(item => ({
      productId: item.productId._id || item.productId,
      variantId: item.variantId?._id || item.variantId || null,
      quantity: item.quantity
    }));

    // Lấy thông tin từ request body (shipping address, payment method, coupon)
    const {
      shippingAddress,
      paymentMethod,
      guestEmail,
      couponCode
    } = req.body;

    // Tạo order với items từ cart
    const order = await orderService.createOrder({
      items,
      shippingAddress,
      paymentMethod,
      guestEmail,
      couponCode
    }, userId);

    // Xóa cart sau khi tạo order thành công
    try {
      await cartService.clearCart(userId, sessionId);
    } catch (clearError) {
      console.error('Clear cart error (non-critical):', clearError);
      // Không throw error vì order đã được tạo thành công
    }

    res.status(201).json({
      success: true,
      message: 'Đơn hàng đã được tạo thành công từ giỏ hàng! Email xác nhận đã được gửi.',
      order
    });
  } catch (error) {
    console.error('Create order from cart error:', error);
    
    const statusCode = error.message.includes('Vui lòng') || 
                      error.message.includes('không hợp lệ') ||
                      error.message.includes('Email') ||
                      error.message.includes('Giỏ hàng') ||
                      error.message.includes('tồn kho') ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi tạo đơn hàng từ giỏ hàng. Vui lòng thử lại.'
    });
  }
};

