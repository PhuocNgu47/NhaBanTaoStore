/**
 * Coupon Service
 * API calls cho mã giảm giá
 */

import api from './api';

export const couponService = {
  /**
   * Validate và tính discount của coupon
   * @param {string} code - Mã giảm giá
   * @param {number} subtotal - Tổng tiền
   */
  validateCoupon: async (code, subtotal) => {
    const response = await api.post('/coupons/validate', { code, subtotal });
    return response.data;
  },

  /**
   * Lấy danh sách coupons (Admin)
   */
  getCoupons: async () => {
    const response = await api.get('/coupons');
    return response.data;
  },

  /**
   * Tạo coupon mới (Admin)
   */
  createCoupon: async (couponData) => {
    const response = await api.post('/coupons', couponData);
    return response.data;
  },

  /**
   * Cập nhật coupon (Admin)
   */
  updateCoupon: async (id, couponData) => {
    const response = await api.put(`/coupons/${id}`, couponData);
    return response.data;
  },

  /**
   * Xóa coupon (Admin)
   */
  deleteCoupon: async (id) => {
    const response = await api.delete(`/coupons/${id}`);
    return response.data;
  }
};

export default couponService;
