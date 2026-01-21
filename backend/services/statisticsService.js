/**
 * Statistics Service
 * Chứa logic nghiệp vụ cho statistics: overview, revenue, orders
 */

import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

/**
 * Lấy thống kê tổng quan
 */
export const getOverviewStats = async () => {
  const [
    totalProducts,
    totalUsers,
    totalOrders,
    totalRevenue,
    pendingOrders,
    lowStockProducts
  ] = await Promise.all([
    Product.countDocuments(),
    User.countDocuments({ role: 'user' }),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]),
    Order.countDocuments({ status: 'pending' }),
    Product.countDocuments({ stock: { $lt: 10 } })
  ]);

  const revenue = totalRevenue[0]?.total || 0;

  return {
    totalProducts,
    totalUsers,
    totalOrders,
    totalRevenue: revenue,
    pendingOrders,
    lowStockProducts
  };
};

/**
 * Lấy thống kê doanh thu theo thời gian
 */
export const getRevenueStats = async (period = '30days') => {
  let startDate = new Date();
  if (period === '7days') {
    startDate.setDate(startDate.getDate() - 7);
  } else if (period === '30days') {
    startDate.setDate(startDate.getDate() - 30);
  } else if (period === '90days') {
    startDate.setDate(startDate.getDate() - 90);
  } else if (period === 'year') {
    startDate.setFullYear(startDate.getFullYear() - 1);
  }

  const revenueData = await Order.aggregate([
    {
      $match: {
        paymentStatus: 'completed',
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
        },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  return revenueData;
};

/**
 * Lấy thống kê đơn hàng theo trạng thái
 */
export const getOrderStats = async () => {
  const orderStats = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' }
      }
    }
  ]);

  const statusLabels = {
    'pending': 'Đang Chờ',
    'confirmed': 'Đã Xác Nhận',
    'shipped': 'Đã Gửi',
    'delivered': 'Đã Giao',
    'cancelled': 'Đã Hủy'
  };

  return orderStats.map(stat => ({
    status: stat._id,
    label: statusLabels[stat._id] || stat._id,
    count: stat.count,
    totalAmount: stat.totalAmount
  }));
};

/**
 * Lấy thống kê sản phẩm theo category và top sellers
 */
export const getProductStats = async () => {
  const [categoryStats, topProducts] = await Promise.all([
    // Thống kê theo category
    Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalStock: { $sum: '$stock' }
        }
      },
      { $sort: { count: -1 } }
    ]),
    // Top sản phẩm bán chạy
    Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.productId',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          productId: '$_id',
          productName: '$product.name',
          productImage: '$product.image',
          totalSold: 1,
          totalRevenue: 1
        }
      }
    ])
  ]);

  return {
    categories: categoryStats,
    topProducts
  };
};

/**
 * Lấy đơn hàng gần đây
 */
export const getRecentOrders = async (limit = 10) => {
  const recentOrders = await Order.find()
    .populate('userId', 'name email')
    .populate('items.productId', 'name image')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  return recentOrders;
};

