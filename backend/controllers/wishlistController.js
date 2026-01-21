/**
 * Wishlist Controller
 * Nhận request từ Routes và gọi Wishlist Service
 */

import * as wishlistService from '../services/wishlistService.js';

/**
 * Lấy wishlist
 */
export const getWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập để xem danh sách yêu thích'
      });
    }

    const wishlist = await wishlistService.getWishlist(userId);
    
    res.json({
      success: true,
      wishlist,
      count: wishlist.length
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách yêu thích'
    });
  }
};

/**
 * Thêm vào wishlist
 */
export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập'
      });
    }

    const { productId, variantId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng chọn sản phẩm'
      });
    }

    const wishlistItem = await wishlistService.addToWishlist(userId, productId, variantId);

    res.json({
      success: true,
      message: 'Đã thêm vào danh sách yêu thích',
      item: wishlistItem
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    
    const statusCode = error.message.includes('Không tìm thấy') ? 404 :
                      error.message.includes('đã có') ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi thêm vào danh sách yêu thích'
    });
  }
};

/**
 * Xóa khỏi wishlist
 */
export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập'
      });
    }

    const { productId } = req.params;
    const { variantId } = req.query;

    await wishlistService.removeFromWishlist(userId, productId, variantId);

    res.json({
      success: true,
      message: 'Đã xóa khỏi danh sách yêu thích'
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    
    const statusCode = error.message.includes('Không tìm thấy') ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi xóa khỏi danh sách yêu thích'
    });
  }
};

/**
 * Kiểm tra sản phẩm có trong wishlist không
 */
export const checkWishlist = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { productId } = req.params;
    const { variantId } = req.query;

    if (!userId) {
      return res.json({
        success: true,
        isInWishlist: false
      });
    }

    const isInWishlist = await wishlistService.isInWishlist(userId, productId, variantId);

    res.json({
      success: true,
      isInWishlist
    });
  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi kiểm tra'
    });
  }
};

