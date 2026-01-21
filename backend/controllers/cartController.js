/**
 * Cart Controller
 * Nhận request từ Routes và gọi Cart Service
 */

import * as cartService from '../services/cartService.js';

/**
 * Lấy giỏ hàng
 */
export const getCart = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const sessionId = req.headers['x-session-id'] || null;
    
    const cart = await cartService.getCart(userId, sessionId);
    
    res.json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy giỏ hàng'
    });
  }
};

/**
 * Thêm sản phẩm vào giỏ hàng
 */
export const addToCart = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const sessionId = req.headers['x-session-id'] || null;
    const { productId, variantId, quantity } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn sản phẩm'
      });
    }

    const cart = await cartService.addToCart(
      userId,
      sessionId,
      productId,
      variantId,
      quantity || 1
    );

    res.json({
      success: true,
      message: 'Đã thêm vào giỏ hàng',
      cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    
    const statusCode = error.message.includes('Không tìm thấy') ? 404 :
                      error.message.includes('tồn kho') ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi thêm vào giỏ hàng'
    });
  }
};

/**
 * Cập nhật số lượng item
 */
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const sessionId = req.headers['x-session-id'] || null;
    const { itemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Số lượng phải lớn hơn 0'
      });
    }

    const cart = await cartService.updateCartItem(userId, sessionId, itemId, quantity);

    res.json({
      success: true,
      message: 'Đã cập nhật giỏ hàng',
      cart
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    
    const statusCode = error.message.includes('Không tìm thấy') ? 404 :
                      error.message.includes('tối đa') ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật giỏ hàng'
    });
  }
};

/**
 * Xóa item khỏi cart
 */
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const sessionId = req.headers['x-session-id'] || null;
    const { itemId } = req.params;

    const cart = await cartService.removeFromCart(userId, sessionId, itemId);

    res.json({
      success: true,
      message: 'Đã xóa sản phẩm khỏi giỏ hàng',
      cart
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    
    const statusCode = error.message.includes('Không tìm thấy') ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi xóa sản phẩm'
    });
  }
};

/**
 * Xóa toàn bộ cart
 */
export const clearCart = async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const sessionId = req.headers['x-session-id'] || null;

    await cartService.clearCart(userId, sessionId);

    res.json({
      success: true,
      message: 'Đã xóa toàn bộ giỏ hàng'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi xóa giỏ hàng'
    });
  }
};

/**
 * Merge guest cart vào user cart (khi login)
 */
export const mergeCarts = async (req, res) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'] || null;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập'
      });
    }

    const cart = await cartService.mergeCarts(userId, sessionId);

    res.json({
      success: true,
      message: 'Đã hợp nhất giỏ hàng',
      cart
    });
  } catch (error) {
    console.error('Merge carts error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi hợp nhất giỏ hàng'
    });
  }
};

