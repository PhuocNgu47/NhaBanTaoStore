/**
 * Coupon Controller
 * Nhận request từ Routes và gọi Coupon Service
 */

import * as couponService from '../services/couponService.js';

/**
 * Validate coupon
 */
export const validateCoupon = async (req, res) => {
  try {
    const { code, subtotal } = req.body;
    const result = await couponService.validateCoupon(code, subtotal);
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    
    const statusCode = error.message.includes('Vui lòng') ||
                      error.message.includes('không hợp lệ') ||
                      error.message.includes('không tồn tại') ? 400 :
                      error.message.includes('hết hạn') ||
                      error.message.includes('hết lượt') ||
                      error.message.includes('vô hiệu') ||
                      error.message.includes('chưa có hiệu lực') ||
                      error.message.includes('tối thiểu') ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi kiểm tra mã giảm giá'
    });
  }
};

/**
 * Lấy danh sách coupons (Admin only)
 */
export const getCoupons = async (req, res) => {
  try {
    const coupons = await couponService.getCoupons();
    res.json({
      success: true,
      coupons
    });
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách mã giảm giá'
    });
  }
};

/**
 * Tạo coupon mới (Admin only)
 */
export const createCoupon = async (req, res) => {
  try {
    const coupon = await couponService.createCoupon(req.body);
    res.status(201).json({
      success: true,
      message: 'Tạo mã giảm giá thành công',
      coupon
    });
  } catch (error) {
    console.error('Create coupon error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Mã giảm giá đã tồn tại'
      });
    }
    
    const statusCode = error.message.includes('Vui lòng') ||
                      error.message.includes('phải') ? 400 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi tạo mã giảm giá'
    });
  }
};

/**
 * Cập nhật coupon (Admin only)
 */
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await couponService.updateCoupon(req.params.id, req.body);
    res.json({
      success: true,
      message: 'Cập nhật mã giảm giá thành công',
      coupon
    });
  } catch (error) {
    console.error('Update coupon error:', error);
    
    const statusCode = error.message.includes('Không tìm thấy') ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi cập nhật mã giảm giá'
    });
  }
};

/**
 * Xóa coupon (Admin only)
 */
export const deleteCoupon = async (req, res) => {
  try {
    await couponService.deleteCoupon(req.params.id);
    res.json({
      success: true,
      message: 'Xóa mã giảm giá thành công'
    });
  } catch (error) {
    console.error('Delete coupon error:', error);
    
    const statusCode = error.message.includes('Không tìm thấy') ? 404 : 500;
    
    res.status(statusCode).json({
      success: false,
      message: error.message || 'Lỗi khi xóa mã giảm giá'
    });
  }
};

