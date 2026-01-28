/**
 * Order Controller
 * Nhận request từ Routes và gọi Order Service
 */

import * as orderService from '../services/orderService.js';
import * as cartService from '../services/cartService.js';

/**
 * Lấy danh sách orders với filter và phân trang
 */
export const getOrders = async (req, res) => {
  try {
    const isAdmin = ['admin', 'owner', 'staff'].includes(req.user.role);
    const options = {
      page: req.query.page || 1,
      limit: req.query.limit || 20,
      status: req.query.status,
      paymentStatus: req.query.paymentStatus,
      search: req.query.search,
      sortBy: req.query.sortBy || '-createdAt',
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };

    const result = await orderService.getOrders(req.user.id, isAdmin, options);

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách đơn hàng'
    });
  }
};

/**
 * Lấy thống kê đơn hàng (Admin)
 */
export const getOrderStats = async (req, res) => {
  try {
    const options = {
      startDate: req.query.startDate,
      endDate: req.query.endDate
    };

    const stats = await orderService.getOrderStats(options);

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy thống kê đơn hàng'
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
    // Lấy userId từ token nếu có (đã xử lý bởi optionalProtect middleware)
    let userId = null;

    // Nếu có req.user từ middleware, ưu tiên dùng
    if (req.user?.id) {
      userId = req.user.id;
      console.log('✅ Got userId from req.user:', userId);
    } else {
      console.log('⚠️ No authenticated user found, proceeding as guest');
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
    console.error('Error stack:', error.stack);
    console.error('Request body:', {
      items: req.body.items?.length,
      paymentMethod: req.body.paymentMethod,
      guestEmail: req.body.guestEmail ? 'provided' : 'missing',
      shippingAddress: req.body.shippingAddress ? 'provided' : 'missing'
    });

    const statusCode = error.message.includes('Vui lòng') ||
      error.message.includes('không hợp lệ') ||
      error.message.includes('Email') ||
      error.message.includes('Giỏ hàng') ? 400 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi tạo đơn hàng. Vui lòng thử lại.',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
    console.error('Error stack:', error.stack);
    console.error('Request body:', req.body);
    console.error('Order ID:', req.params.id);

    const statusCode = error.message.includes('Không tìm thấy') ? 404 :
      error.message.includes('không hợp lệ') ? 400 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật trạng thái đơn hàng',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined
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
    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get guest order error:', error);
    res.status(404).json({
      success: false,
      message: error.message || 'Không tìm thấy đơn hàng'
    });
  }
};

/**
 * Xác nhận đơn hàng (Admin only)
 * PUT /api/orders/:id/confirm
 */
export const confirmOrder = async (req, res) => {
  try {
    const { note } = req.body;
    const order = await orderService.confirmOrder(req.params.id, req.user.id, note);

    res.json({
      success: true,
      message: 'Xác nhận đơn hàng thành công',
      order
    });
  } catch (error) {
    console.error('Confirm order error:', error);

    const statusCode = error.message.includes('Không tìm thấy') ? 404 :
      error.message.includes('không thể') ||
        error.message.includes('phải đã') ? 400 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi xác nhận đơn hàng'
    });
  }
};

/**
 * Cập nhật trạng thái thanh toán (Admin only)
 * PUT /api/orders/:id/payment
 */
export const updatePayment = async (req, res) => {
  try {
    const { paymentStatus, note, paymentDetails } = req.body;

    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái thanh toán là bắt buộc'
      });
    }

    const order = await orderService.updatePayment(
      req.params.id,
      paymentStatus,
      req.user.id,
      note,
      paymentDetails
    );

    res.json({
      success: true,
      message: 'Cập nhật trạng thái thanh toán thành công',
      order
    });
  } catch (error) {
    console.error('Update payment error:', error);

    const statusCode = error.message.includes('Không tìm thấy') ? 404 :
      error.message.includes('không hợp lệ') ? 400 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật trạng thái thanh toán'
    });
  }
};

/**
 * Tạo đơn hàng từ giỏ hàng
 * Tự động lấy items từ cart và tạo order
 * Hỗ trợ cả authenticated users và guest users
 */
export const createOrderFromCart = async (req, res) => {
  try {
    // Lấy userId từ token nếu có (đã xử lý bởi optionalProtect middleware)
    let userId = null;

    // Nếu có req.user từ middleware, ưu tiên dùng
    if (req.user?.id) {
      userId = req.user.id;
      console.log('✅ Got userId from req.user:', userId);
    } else {
      console.log('⚠️ No authenticated user found, proceeding as guest');
    }

    const sessionId = req.headers['x-session-id'] || null;

    // Validate: Phải có userId hoặc sessionId
    if (!userId && !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Không thể xác định giỏ hàng. Vui lòng đăng nhập hoặc thử lại.'
      });
    }

    // Lấy cart
    let cart;
    let items = [];

    try {
      cart = await cartService.getCart(userId, sessionId);

      if (!cart || !cart.items || cart.items.length === 0) {
        // Nếu cart trống, kiểm tra xem có items trong request body không (fallback)
        if (req.body.items && req.body.items.length > 0) {
          console.log('Cart is empty, using items from request body');
          items = req.body.items;
        } else {
          return res.status(400).json({
            success: false,
            message: 'Giỏ hàng trống. Vui lòng thêm sản phẩm vào giỏ hàng.'
          });
        }
      } else {
        // Chuyển đổi cart items thành order items format
        items = cart.items.map(item => {
          // Handle both populated and non-populated productId
          const productId = item.productId?._id || item.productId;
          const variantId = item.variantId?._id || item.variantId || null;

          if (!productId) {
            throw new Error('Sản phẩm trong giỏ hàng không hợp lệ');
          }

          return {
            productId,
            variantId,
            quantity: item.quantity || 1
          };
        });
      }
    } catch (cartError) {
      console.error('Get cart error:', cartError);

      // Fallback: Nếu không lấy được cart nhưng có items trong request body, dùng items đó
      if (req.body.items && req.body.items.length > 0) {
        console.log('Cannot get cart, using items from request body as fallback');
        items = req.body.items;
      } else {
        return res.status(400).json({
          success: false,
          message: cartError.message || 'Không thể lấy giỏ hàng. Vui lòng thử lại.'
        });
      }
    }

    // Validate items
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có sản phẩm để tạo đơn hàng. Vui lòng thêm sản phẩm vào giỏ hàng.'
      });
    }

    // Lấy thông tin từ request body (shipping address, payment method, coupon)
    const {
      shippingAddress,
      paymentMethod,
      guestEmail,
      couponCode,
      discountAmount,
      shippingFee,
      note
    } = req.body;

    // Validate shipping address
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập địa chỉ giao hàng'
      });
    }

    // Tạo order với items từ cart
    const order = await orderService.createOrder({
      items,
      shippingAddress,
      paymentMethod,
      guestEmail,
      couponCode,
      discountAmount,
      shippingFee,
      note
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
    console.error('Error stack:', error.stack);

    const statusCode = error.message.includes('Vui lòng') ||
      error.message.includes('không hợp lệ') ||
      error.message.includes('Email') ||
      error.message.includes('Giỏ hàng') ||
      error.message.includes('tồn kho') ||
      error.message.includes('Sản phẩm') ? 400 : 500;

    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi tạo đơn hàng từ giỏ hàng. Vui lòng thử lại.'
    });
  }
};

