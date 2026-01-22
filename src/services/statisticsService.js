/**
 * Statistics Service
 * API calls cho thống kê và dashboard
 */

import api from './api';

export const statisticsService = {
  /**
   * Lấy thống kê tổng quan
   */
  getOverview: async () => {
    const response = await api.get('/statistics/overview');
    return response.data;
  },

  /**
   * Lấy thống kê doanh thu
   * @param {string} period - '7days' | '30days' | '90days' | 'year'
   */
  getRevenue: async (period = '30days') => {
    const response = await api.get('/statistics/revenue', {
      params: { period }
    });
    return response.data;
  },

  /**
   * Lấy thống kê đơn hàng theo trạng thái
   */
  getOrderStats: async () => {
    const response = await api.get('/statistics/orders');
    return response.data;
  },

  /**
   * Lấy thống kê sản phẩm
   */
  getProductStats: async () => {
    const response = await api.get('/statistics/products');
    return response.data;
  },

  /**
   * Lấy đơn hàng gần đây
   * @param {number} limit - Số lượng đơn hàng
   */
  getRecentOrders: async (limit = 10) => {
    const response = await api.get('/statistics/recent-orders', {
      params: { limit }
    });
    return response.data;
  }
};

export default statisticsService;
