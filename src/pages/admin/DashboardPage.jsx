import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  FiShoppingBag,
  FiBox,
  FiUsers,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiPackage,
  FiTruck,
  FiCheck,
  FiClock,
  FiAlertTriangle,
  FiLoader,
  FiRefreshCw,
  FiEye,
  FiBarChart2,
  FiArrowRight,
} from 'react-icons/fi';
import { statisticsService } from '../../services/statisticsService';
import { formatPrice, formatDate } from '../../utils/helpers';
import { toast } from 'react-toastify';

// Status configs
const STATUS_CONFIG = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700', icon: FiClock },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700', icon: FiCheck },
  processing: { label: 'Đang xử lý', color: 'bg-indigo-100 text-indigo-700', icon: FiPackage },
  shipped: { label: 'Đang giao', color: 'bg-purple-100 text-purple-700', icon: FiTruck },
  delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-700', icon: FiCheck },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700', icon: FiAlertTriangle },
};

// Simple Bar Chart Component
const SimpleBarChart = ({ data, height = 200 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-gray-400">
        Chưa có dữ liệu
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.revenue));
  
  return (
    <div className="flex items-end justify-between gap-1" style={{ height }}>
      {data.slice(-14).map((item, index) => {
        const barHeight = maxValue > 0 ? (item.revenue / maxValue) * 100 : 0;
        const date = new Date(item._id);
        const dayLabel = date.getDate();
        
        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-1">
            <div 
              className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-sm hover:from-blue-600 hover:to-blue-500 transition-all cursor-pointer group relative"
              style={{ height: `${Math.max(barHeight, 2)}%` }}
              title={`${item._id}: ${formatPrice(item.revenue)}`}
            >
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 pointer-events-none">
                {formatPrice(item.revenue)}
              </div>
            </div>
            <span className="text-xs text-gray-400">{dayLabel}</span>
          </div>
        );
      })}
    </div>
  );
};

// Donut Chart Component  
const SimpleDonutChart = ({ data, size = 160 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center" style={{ width: size, height: size }}>
        <span className="text-gray-400 text-sm">Không có dữ liệu</span>
      </div>
    );
  }

  const total = data.reduce((sum, item) => sum + item.count, 0);
  let currentAngle = 0;

  const segments = data.map(item => {
    const angle = (item.count / total) * 360;
    const segment = {
      ...item,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      percentage: ((item.count / total) * 100).toFixed(1)
    };
    currentAngle += angle;
    return segment;
  });

  const radius = size / 2;
  const innerRadius = radius * 0.6;
  const center = size / 2;

  const polarToCartesian = (angle) => {
    const angleRad = (angle - 90) * Math.PI / 180;
    return {
      x: center + radius * Math.cos(angleRad),
      y: center + radius * Math.sin(angleRad)
    };
  };

  const polarToCartesianInner = (angle) => {
    const angleRad = (angle - 90) * Math.PI / 180;
    return {
      x: center + innerRadius * Math.cos(angleRad),
      y: center + innerRadius * Math.sin(angleRad)
    };
  };

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} className="flex-shrink-0">
        {segments.map((segment, index) => {
          const startOuter = polarToCartesian(segment.startAngle);
          const endOuter = polarToCartesian(segment.endAngle);
          const startInner = polarToCartesianInner(segment.startAngle);
          const endInner = polarToCartesianInner(segment.endAngle);
          const largeArc = segment.endAngle - segment.startAngle > 180 ? 1 : 0;

          const d = [
            `M ${startOuter.x} ${startOuter.y}`,
            `A ${radius} ${radius} 0 ${largeArc} 1 ${endOuter.x} ${endOuter.y}`,
            `L ${endInner.x} ${endInner.y}`,
            `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${startInner.x} ${startInner.y}`,
            'Z'
          ].join(' ');

          return (
            <path
              key={index}
              d={d}
              fill={segment.color}
              className="hover:opacity-80 transition-opacity cursor-pointer"
            >
              <title>{segment.label}: {segment.count} ({segment.percentage}%)</title>
            </path>
          );
        })}
        <text x={center} y={center} textAnchor="middle" className="text-2xl font-bold fill-gray-800">
          {total}
        </text>
        <text x={center} y={center + 16} textAnchor="middle" className="text-xs fill-gray-500">
          đơn hàng
        </text>
      </svg>
      <div className="flex-1 space-y-2">
        {segments.slice(0, 5).map((segment, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0" 
              style={{ backgroundColor: segment.color }}
            />
            <span className="flex-1 truncate text-gray-600">{segment.label}</span>
            <span className="font-medium text-gray-800">{segment.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [overview, setOverview] = useState(null);
  const [revenueData, setRevenueData] = useState(null);
  const [orderStats, setOrderStats] = useState([]);
  const [productStats, setProductStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [revenuePeriod, setRevenuePeriod] = useState('30days');

  // Fetch all dashboard data
  const fetchDashboardData = async (showRefreshToast = false) => {
    try {
      if (showRefreshToast) setRefreshing(true);
      else setLoading(true);

      const [overviewRes, revenueRes, ordersRes, productsRes, recentRes] = await Promise.all([
        statisticsService.getOverview(),
        statisticsService.getRevenue(revenuePeriod),
        statisticsService.getOrderStats(),
        statisticsService.getProductStats(),
        statisticsService.getRecentOrders(5)
      ]);

      if (overviewRes.success) setOverview(overviewRes.stats);
      if (revenueRes.success) setRevenueData(revenueRes.data);
      if (ordersRes.success) setOrderStats(ordersRes.data);
      if (productsRes.success) setProductStats(productsRes.data);
      if (recentRes.success) setRecentOrders(recentRes.orders);

      if (showRefreshToast) toast.success('Đã cập nhật dữ liệu');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Lỗi khi tải dữ liệu dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Fetch revenue when period changes
  const fetchRevenue = async () => {
    try {
      const response = await statisticsService.getRevenue(revenuePeriod);
      if (response.success) setRevenueData(response.data);
    } catch (error) {
      console.error('Error fetching revenue:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (!loading) {
      fetchRevenue();
    }
  }, [revenuePeriod]);

  // Stats cards data
  const statsCards = useMemo(() => {
    if (!overview) return [];
    
    return [
      {
        title: 'Doanh thu hôm nay',
        value: overview.todayRevenue,
        change: `${overview.revenueGrowth >= 0 ? '+' : ''}${overview.revenueGrowth}%`,
        isPositive: overview.revenueGrowth >= 0,
        icon: FiDollarSign,
        color: 'from-green-500 to-emerald-600',
        format: 'price'
      },
      {
        title: 'Đơn hàng hôm nay',
        value: overview.todayOrders,
        subtext: `${overview.pendingOrders} chờ xử lý`,
        icon: FiShoppingBag,
        color: 'from-blue-500 to-indigo-600',
        link: '/admin/don-hang'
      },
      {
        title: 'Tổng sản phẩm',
        value: overview.totalProducts,
        subtext: `${overview.lowStockProducts} sắp hết hàng`,
        icon: FiBox,
        color: 'from-purple-500 to-violet-600',
        link: '/admin/san-pham'
      },
      {
        title: 'Khách hàng',
        value: overview.totalUsers,
        subtext: `+${overview.newUsersThisMonth} tháng này`,
        icon: FiUsers,
        color: 'from-orange-500 to-red-500',
        link: '/admin/nguoi-dung'
      }
    ];
  }, [overview]);

  // Quick stats
  const quickStats = useMemo(() => {
    if (!overview) return [];
    
    return [
      { label: 'Chờ xác nhận', value: overview.pendingOrders, color: 'text-yellow-600', bg: 'bg-yellow-50' },
      { label: 'Đang xử lý', value: overview.processingOrders, color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { label: 'Đang giao', value: overview.shippedOrders, color: 'text-purple-600', bg: 'bg-purple-50' },
      { label: 'Đã giao', value: overview.deliveredOrders, color: 'text-green-600', bg: 'bg-green-50' },
    ];
  }, [overview]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FiLoader className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 text-sm">Tổng quan hoạt động kinh doanh</p>
        </div>
        <button
          onClick={() => fetchDashboardData(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          Làm mới
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stat.format === 'price' 
                      ? formatPrice(stat.value || 0)
                      : (stat.value || 0).toLocaleString('vi-VN')
                    }
                  </p>
                  {stat.change && (
                    <div className="flex items-center gap-1 mt-1">
                      {stat.isPositive ? (
                        <FiTrendingUp className="text-green-500" size={14} />
                      ) : (
                        <FiTrendingDown className="text-red-500" size={14} />
                      )}
                      <span className={`text-sm ${stat.isPositive ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.change} so với hôm qua
                      </span>
                    </div>
                  )}
                  {stat.subtext && (
                    <p className="text-sm text-gray-500 mt-1">{stat.subtext}</p>
                  )}
                </div>
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="text-white" size={24} />
                </div>
              </div>
            </div>
            {stat.link && (
              <Link 
                to={stat.link}
                className="block px-6 py-3 bg-gray-50 text-sm text-blue-600 hover:bg-gray-100 border-t flex items-center justify-between"
              >
                Xem chi tiết
                <FiArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Quick Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <div key={index} className={`${stat.bg} rounded-xl p-4 flex items-center justify-between`}>
            <span className="text-gray-600">{stat.label}</span>
            <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <FiBarChart2 className="w-5 h-5" />
                Doanh thu
              </h2>
              {revenueData?.totals && (
                <p className="text-sm text-gray-500 mt-1">
                  Tổng: <span className="font-semibold text-blue-600">{formatPrice(revenueData.totals.totalRevenue)}</span>
                  {' '}| {revenueData.totals.totalOrders} đơn hàng
                </p>
              )}
            </div>
            <select
              value={revenuePeriod}
              onChange={(e) => setRevenuePeriod(e.target.value)}
              className="px-3 py-1.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="7days">7 ngày</option>
              <option value="30days">30 ngày</option>
              <option value="90days">90 ngày</option>
              <option value="year">1 năm</option>
            </select>
          </div>
          <div className="p-6">
            <SimpleBarChart data={revenueData?.data || []} height={200} />
          </div>
        </div>

        {/* Order Status Chart */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-bold text-gray-800">Đơn hàng theo trạng thái</h2>
          </div>
          <div className="p-6">
            <SimpleDonutChart data={orderStats} size={140} />
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Đơn hàng gần đây</h2>
            <Link 
              to="/admin/don-hang" 
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              Xem tất cả <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y">
            {recentOrders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Chưa có đơn hàng nào
              </div>
            ) : (
              recentOrders.map((order) => {
                const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                return (
                  <div key={order._id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FiShoppingBag className="w-5 h-5 text-gray-400" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">#{order.orderNumber}</p>
                        <p className="text-sm text-gray-500">
                          {order.shippingAddress?.name || order.userId?.name || 'Khách vãng lai'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">{formatPrice(order.totalAmount)}</p>
                      <span className={`text-xs px-2 py-1 rounded ${statusConfig.color}`}>
                        {statusConfig.label}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Top Products & Low Stock */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">Sản phẩm bán chạy</h2>
            <Link 
              to="/admin/san-pham" 
              className="text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
              Xem tất cả <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y">
            {productStats?.topProducts?.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                Chưa có dữ liệu
              </div>
            ) : (
              productStats?.topProducts?.slice(0, 5).map((product, index) => (
                <div key={product.productId || index} className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {product.productImage ? (
                      <img 
                        src={product.productImage} 
                        alt={product.productName}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <FiBox className="w-full h-full p-2 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{product.productName}</p>
                    <p className="text-sm text-gray-500">Đã bán: {product.totalSold}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{formatPrice(product.totalRevenue)}</p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Low Stock Warning */}
          {productStats?.lowStockProducts?.length > 0 && (
            <>
              <div className="p-4 border-t bg-orange-50">
                <h3 className="font-medium text-orange-700 flex items-center gap-2">
                  <FiAlertTriangle className="w-4 h-4" />
                  Sản phẩm sắp hết hàng ({productStats.lowStockProducts.length})
                </h3>
              </div>
              <div className="divide-y border-t">
                {productStats.lowStockProducts.slice(0, 3).map((product) => (
                  <div key={product._id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded overflow-hidden">
                        {product.image ? (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <FiBox className="w-full h-full p-1 text-gray-400" />
                        )}
                      </div>
                      <span className="text-sm text-gray-800 truncate max-w-[200px]">
                        {product.name}
                      </span>
                    </div>
                    <span className={`text-sm font-medium ${
                      product.stock === 0 ? 'text-red-600' : 'text-orange-600'
                    }`}>
                      {product.stock === 0 ? 'Hết hàng' : `Còn ${product.stock}`}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold opacity-90">Tổng doanh thu</h3>
          <p className="text-3xl font-bold mt-2">{formatPrice(overview?.totalRevenue || 0)}</p>
          <p className="text-sm opacity-80 mt-1">Từ {overview?.totalOrders || 0} đơn hàng</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold opacity-90">Trung bình/đơn</h3>
          <p className="text-3xl font-bold mt-2">
            {formatPrice(overview?.totalOrders > 0 
              ? Math.round(overview.totalRevenue / overview.totalOrders) 
              : 0
            )}
          </p>
          <p className="text-sm opacity-80 mt-1">Giá trị đơn hàng trung bình</p>
        </div>
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold opacity-90">Sản phẩm cần nhập</h3>
          <p className="text-3xl font-bold mt-2">{overview?.lowStockProducts || 0}</p>
          <p className="text-sm opacity-80 mt-1">Sản phẩm có tồn kho &lt; 10</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
