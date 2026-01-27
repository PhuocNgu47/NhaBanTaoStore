/**
 * Statistics Controller
 * Nhận request từ Routes và gọi Statistics Service
 */

import * as statisticsService from '../services/statisticsService.js';

/**
 * Lấy thống kê tổng quan
 */
export const getOverview = async (req, res) => {
  try {
    const stats = await statisticsService.getOverviewStats();
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Get overview stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy thống kê'
    });
  }
};

/**
 * Lấy thống kê doanh thu
 */
export const getRevenue = async (req, res) => {
  try {
    const { period = '30days' } = req.query;
    const data = await statisticsService.getRevenueStats(period);
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Get revenue stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy thống kê doanh thu'
    });
  }
};

/**
 * Lấy thống kê đơn hàng
 */
export const getOrders = async (req, res) => {
  try {
    const data = await statisticsService.getOrderStats();
    res.json({
      success: true,
      data
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
 * Lấy thống kê sản phẩm
 */
export const getProducts = async (req, res) => {
  try {
    const data = await statisticsService.getProductStats();
    res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Get product stats error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy thống kê sản phẩm'
    });
  }
};

/**
 * Lấy đơn hàng gần đây
 */
export const getRecentOrders = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const orders = await statisticsService.getRecentOrders(limit);
    res.json({
      success: true,
      orders
    });
  } catch (error) {
    console.error('Get recent orders error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy đơn hàng gần đây'
    });
  }
};

/**
 * Báo cáo COD chưa về
 * GET /api/reports/cod
 */
export const getCODReport = async (req, res) => {
  try {
    const { startDate, endDate, page = 1, limit = 50 } = req.query;
    const result = await statisticsService.getCODReport({ startDate, endDate, page, limit });
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get COD report error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy báo cáo COD'
    });
  }
};

/**
 * Báo cáo doanh thu
 * GET /api/reports/revenue
 */
export const getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate, groupBy = 'day' } = req.query;
    const result = await statisticsService.getRevenueReport({ startDate, endDate, groupBy });
    
    res.json({
      success: true,
      ...result
    });
  } catch (error) {
    console.error('Get revenue report error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Lỗi khi lấy báo cáo doanh thu'
    });
  }
};
