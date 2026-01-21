/**
 * Review Controller
 * Nhận request từ Routes và gọi Review Service
 */

import * as reviewService from '../services/reviewService.js';

/**
 * Lấy danh sách reviews của sản phẩm
 */
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page, limit, sort, status } = req.query;
    const isAdmin = req.user?.role === 'admin';

    // Admin có thể xem tất cả status, user chỉ xem approved
    const reviewStatus = isAdmin && status ? status : 'approved';

    const result = await reviewService.getProductReviews(productId, {
      page,
      limit,
      sort,
      status: reviewStatus
    });

    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy đánh giá'
    });
  }
};

/**
 * Tạo review mới
 */
export const createReview = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập để đánh giá'
      });
    }

    const { productId } = req.params;
    const reviewData = req.body;

    const review = await reviewService.createReview(userId, productId, reviewData);

    res.status(201).json({
      success: true,
      message: 'Đánh giá đã được gửi và đang chờ duyệt',
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    
    const statusCode = error.message.includes('Không tìm thấy') ? 404 :
                      error.message.includes('đã đánh giá') ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi tạo đánh giá'
    });
  }
};

/**
 * Cập nhật review
 */
export const updateReview = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { reviewId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập'
      });
    }

    const review = await reviewService.updateReview(reviewId, userId, req.body);

    res.json({
      success: true,
      message: 'Đã cập nhật đánh giá. Đang chờ duyệt lại.',
      review
    });
  } catch (error) {
    console.error('Update review error:', error);
    
    const statusCode = error.message.includes('Không tìm thấy') ? 404 :
                      error.message.includes('quyền') ? 403 :
                      error.message.includes('từ chối') ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật đánh giá'
    });
  }
};

/**
 * Xóa review
 */
export const deleteReview = async (req, res) => {
  try {
    const userId = req.user?.id;
    const isAdmin = req.user?.role === 'admin';
    const { reviewId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập'
      });
    }

    await reviewService.deleteReview(reviewId, userId, isAdmin);

    res.json({
      success: true,
      message: 'Đã xóa đánh giá'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    
    const statusCode = error.message.includes('Không tìm thấy') ? 404 :
                      error.message.includes('quyền') ? 403 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi xóa đánh giá'
    });
  }
};

/**
 * Admin: Approve/Reject review
 */
export const moderateReview = async (req, res) => {
  try {
    const adminId = req.user?.id;
    const { reviewId } = req.params;
    const { action, reason } = req.body;

    if (!adminId || req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Chỉ admin mới có quyền này'
      });
    }

    if (!action || !['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action phải là approve hoặc reject'
      });
    }

    const review = await reviewService.moderateReview(reviewId, adminId, action, reason);

    res.json({
      success: true,
      message: `Đã ${action === 'approve' ? 'duyệt' : 'từ chối'} đánh giá`,
      review
    });
  } catch (error) {
    console.error('Moderate review error:', error);
    
    const statusCode = error.message.includes('Không tìm thấy') ? 404 :
                      error.message.includes('hợp lệ') ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi duyệt đánh giá'
    });
  }
};

/**
 * Mark review as helpful
 */
export const markHelpful = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { reviewId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Vui lòng đăng nhập'
      });
    }

    const result = await reviewService.markHelpful(reviewId, userId);

    res.json({
      success: true,
      message: result.hasVoted ? 'Đã đánh dấu hữu ích' : 'Đã bỏ đánh dấu hữu ích',
      ...result
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    
    const statusCode = error.message.includes('Không tìm thấy') ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi đánh dấu hữu ích'
    });
  }
};

