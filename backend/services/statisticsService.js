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
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const lastMonth = new Date(today);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  const [
    totalProducts,
    totalUsers,
    totalOrders,
    totalRevenue,
    pendingOrders,
    lowStockProducts,
    todayOrders,
    todayRevenue,
    yesterdayRevenue,
    newUsersThisMonth,
    processingOrders,
    shippedOrders,
    deliveredOrders
  ] = await Promise.all([
    Product.countDocuments({ isActive: true }),
    User.countDocuments({ role: 'user' }),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { status: { $in: ['delivered', 'shipped', 'processing', 'confirmed'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]),
    Order.countDocuments({ status: 'pending' }),
    Product.countDocuments({ stock: { $lt: 10 }, isActive: true }),
    // Today's orders
    Order.countDocuments({ createdAt: { $gte: today } }),
    // Today's revenue  
    Order.aggregate([
      { $match: { createdAt: { $gte: today }, status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]),
    // Yesterday's revenue
    Order.aggregate([
      { $match: { createdAt: { $gte: yesterday, $lt: today }, status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]),
    // New users this month
    User.countDocuments({ role: 'user', createdAt: { $gte: lastMonth } }),
    // Processing orders
    Order.countDocuments({ status: 'processing' }),
    // Shipped orders
    Order.countDocuments({ status: 'shipped' }),
    // Delivered orders
    Order.countDocuments({ status: 'delivered' })
  ]);

  const revenue = totalRevenue[0]?.total || 0;
  const todayRev = todayRevenue[0]?.total || 0;
  const yesterdayRev = yesterdayRevenue[0]?.total || 0;
  
  // Calculate growth percentage
  const revenueGrowth = yesterdayRev > 0 
    ? Math.round(((todayRev - yesterdayRev) / yesterdayRev) * 100) 
    : todayRev > 0 ? 100 : 0;

  return {
    totalProducts,
    totalUsers,
    totalOrders,
    totalRevenue: revenue,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,
    lowStockProducts,
    todayOrders,
    todayRevenue: todayRev,
    revenueGrowth,
    newUsersThisMonth
  };
};

/**
 * Lấy thống kê doanh thu theo thời gian
 */
export const getRevenueStats = async (period = '30days') => {
  let startDate = new Date();
  let groupFormat = '%Y-%m-%d';
  
  if (period === '7days') {
    startDate.setDate(startDate.getDate() - 7);
  } else if (period === '30days') {
    startDate.setDate(startDate.getDate() - 30);
  } else if (period === '90days') {
    startDate.setDate(startDate.getDate() - 90);
    groupFormat = '%Y-%m-%d'; // Still daily for 90 days
  } else if (period === 'year') {
    startDate.setFullYear(startDate.getFullYear() - 1);
    groupFormat = '%Y-%m'; // Monthly for year
  }

  const revenueData = await Order.aggregate([
    {
      $match: {
        status: { $nin: ['cancelled', 'refunded'] },
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: groupFormat, date: '$createdAt' }
        },
        revenue: { $sum: '$totalAmount' },
        orders: { $sum: 1 }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);

  // Calculate totals
  const totals = revenueData.reduce((acc, item) => ({
    totalRevenue: acc.totalRevenue + item.revenue,
    totalOrders: acc.totalOrders + item.orders
  }), { totalRevenue: 0, totalOrders: 0 });

  return {
    data: revenueData,
    totals,
    period
  };
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
    'pending': 'Chờ xác nhận',
    'confirmed': 'Đã xác nhận',
    'processing': 'Đang xử lý',
    'shipped': 'Đang giao',
    'delivered': 'Đã giao',
    'cancelled': 'Đã hủy',
    'returned': 'Hoàn trả',
    'refunded': 'Đã hoàn tiền'
  };

  const statusColors = {
    'pending': '#f59e0b',
    'confirmed': '#3b82f6',
    'processing': '#6366f1',
    'shipped': '#8b5cf6',
    'delivered': '#10b981',
    'cancelled': '#ef4444',
    'returned': '#f97316',
    'refunded': '#6b7280'
  };

  return orderStats.map(stat => ({
    status: stat._id,
    label: statusLabels[stat._id] || stat._id,
    color: statusColors[stat._id] || '#6b7280',
    count: stat.count,
    totalAmount: stat.totalAmount
  }));
};

/**
 * Lấy thống kê sản phẩm theo category và top sellers
 */
export const getProductStats = async () => {
  const [categoryStats, topProducts, lowStockProducts] = await Promise.all([
    // Thống kê theo category
    Product.aggregate([
      { $match: { isActive: true } },
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
      { $match: { status: { $nin: ['cancelled', 'refunded'] } } },
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
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          productId: '$_id',
          productName: { $ifNull: ['$product.name', 'Sản phẩm đã xóa'] },
          productImage: '$product.image',
          productPrice: '$product.price',
          totalSold: 1,
          totalRevenue: 1
        }
      }
    ]),
    // Sản phẩm sắp hết hàng
    Product.find({ stock: { $lt: 10 }, isActive: true })
      .select('name image stock price category')
      .sort({ stock: 1 })
      .limit(10)
      .lean()
  ]);

  return {
    categories: categoryStats,
    topProducts,
    lowStockProducts
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

