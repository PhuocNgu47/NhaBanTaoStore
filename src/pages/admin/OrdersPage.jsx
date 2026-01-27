import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiSearch,
  FiEye,
  FiEdit2,
  FiLoader,
  FiRefreshCw,
  FiPackage,
  FiTruck,
  FiCheck,
  FiX,
  FiClock,
  FiDollarSign,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';
import { orderService } from '../../services/orderService';
import { formatPrice, formatDate } from '../../utils/helpers';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal';

const STATUS_CONFIG = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700', icon: FiClock },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700', icon: FiCheck },
  shipping_ready: { label: 'Chờ lên đơn', color: 'bg-indigo-100 text-indigo-700', icon: FiPackage },
  shipping_created: { label: 'Đã lên đơn', color: 'bg-purple-100 text-purple-700', icon: FiTruck },
  delivering: { label: 'Đang giao', color: 'bg-purple-100 text-purple-700', icon: FiTruck },
  completed: { label: 'Đã giao', color: 'bg-green-100 text-green-700', icon: FiCheck },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700', icon: FiX },
  returned: { label: 'Hoàn trả', color: 'bg-orange-100 text-orange-700', icon: FiRefreshCw },
  // Backward compatibility for old statuses
  processing: { label: 'Đang xử lý', color: 'bg-indigo-100 text-indigo-700', icon: FiPackage },
  shipped: { label: 'Đang giao', color: 'bg-purple-100 text-purple-700', icon: FiTruck },
  delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-700', icon: FiCheck },
  refunded: { label: 'Đã hoàn tiền', color: 'bg-gray-100 text-gray-700', icon: FiDollarSign },
};

const PAYMENT_STATUS_CONFIG = {
  unpaid: { label: 'Chưa thanh toán', color: 'bg-yellow-100 text-yellow-700' },
  paid: { label: 'Đã thanh toán', color: 'bg-green-100 text-green-700' },
  cod: { label: 'Thanh toán khi nhận hàng', color: 'bg-blue-100 text-blue-700' },
  failed: { label: 'Thanh toán lỗi', color: 'bg-red-100 text-red-700' },
  refunded: { label: 'Đã hoàn tiền', color: 'bg-gray-100 text-gray-700' },
  // Backward compatibility for old payment statuses
  pending: { label: 'Chưa thanh toán', color: 'bg-yellow-100 text-yellow-700' },
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState(null);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    paymentStatus: 'all',
    page: 1,
    limit: 20,
  });

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [statusForm, setStatusForm] = useState({
    status: '',
    note: '',
    trackingNumber: '',
  });

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page: filters.page,
        limit: filters.limit,
        sortBy: '-createdAt',
      };

      if (filters.search) params.search = filters.search;
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.paymentStatus !== 'all') params.paymentStatus = filters.paymentStatus;

      const response = await orderService.getAllOrders(params);

      if (response.success) {
        setOrders(response.orders || []);
        setPagination(response.pagination || {
          page: 1,
          limit: 20,
          total: 0,
          pages: 1,
          hasNext: false,
          hasPrev: false,
        });
      } else {
        toast.error(response.message || 'Lỗi khi tải danh sách đơn hàng');
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Lỗi khi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await orderService.getOrderStats();
      if (response.success && response.stats) {
        // Transform stats to match expected format
        const statsData = response.stats;
        setStats({
          total: statsData.byStatus ? Object.values(statsData.byStatus).reduce((a, b) => a + b, 0) : 0,
          pending: statsData.byStatus?.pending || 0,
          processing: statsData.byStatus?.processing || 0,
          shipped: statsData.byStatus?.shipped || 0,
          delivered: statsData.byStatus?.delivered || 0,
          cancelled: statsData.byStatus?.cancelled || 0,
          revenue: statsData.revenue || {},
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Don't show error toast for stats, just log it
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [filters.page, filters.status, filters.paymentStatus]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (filters.page === 1) {
        fetchOrders();
      } else {
        setFilters(f => ({ ...f, page: 1 }));
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedOrder || !statusForm.status) return;

    try {
      setUpdating(true);
      await orderService.updateOrderStatus(
        selectedOrder._id,
        statusForm.status,
        statusForm.note,
        statusForm.trackingNumber
      );

      toast.success('Cập nhật trạng thái thành công');
      setShowStatusModal(false);
      setSelectedOrder(null);
      setStatusForm({ status: '', note: '', trackingNumber: '' });
      fetchOrders();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái');
    } finally {
      setUpdating(false);
    }
  };

  // Open status modal
  const openStatusModal = (order) => {
    setSelectedOrder(order);
    setStatusForm({
      status: order.status,
      note: '',
      trackingNumber: order.trackingNumber || '',
    });
    setShowStatusModal(true);
  };

  // Render status badge
  const renderStatus = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  // Render payment status
  const renderPaymentStatus = (status) => {
    const config = PAYMENT_STATUS_CONFIG[status] || PAYMENT_STATUS_CONFIG.unpaid;
    return (
      <span className={`inline-flex items-center text-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h1>
        <button
          onClick={() => { fetchOrders(); fetchStats(); }}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border rounded-lg hover:bg-gray-50"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          Làm mới
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
            <p className="text-sm text-gray-500">Tổng đơn</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-yellow-500">
            <p className="text-sm text-gray-500">Chờ xác nhận</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-indigo-500">
            <p className="text-sm text-gray-500">Chờ lên đơn</p>
            <p className="text-2xl font-bold text-indigo-600">{stats.shipping_ready || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500">
            <p className="text-sm text-gray-500">Đang giao</p>
            <p className="text-2xl font-bold text-purple-600">{(stats.delivering || 0) + (stats.shipping_created || 0)}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
            <p className="text-sm text-gray-500">Đã giao</p>
            <p className="text-2xl font-bold text-green-600">{stats.completed || 0}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-500">
            <p className="text-sm text-gray-500">Đã hủy</p>
            <p className="text-2xl font-bold text-red-600">{stats.cancelled || 0}</p>
          </div>
        </div>
      )}

      {/* Revenue Summary */}
      {stats?.revenue && (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-blue-100">Tổng doanh thu</p>
              <p className="text-3xl font-bold">{formatPrice(stats.revenue.totalRevenue || 0)}</p>
            </div>
            <div>
              <p className="text-blue-100">Đơn hàng thành công</p>
              <p className="text-3xl font-bold">{stats.revenue.totalOrders || 0}</p>
            </div>
            <div>
              <p className="text-blue-100">Giá trị trung bình</p>
              <p className="text-3xl font-bold">{formatPrice(stats.revenue.avgOrderValue || 0)}</p>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn, tên, SĐT, email..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value, page: 1 })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả trạng thái</option>
            {Object.entries(STATUS_CONFIG).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>

          {/* Payment Status Filter */}
          <select
            value={filters.paymentStatus}
            onChange={(e) => setFilters({ ...filters, paymentStatus: e.target.value, page: 1 })}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Tất cả thanh toán</option>
            {Object.entries(PAYMENT_STATUS_CONFIG).map(([key, val]) => (
              <option key={key} value={key}>{val.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FiLoader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <FiPackage className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Không có đơn hàng nào</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-left text-sm text-gray-500 border-b">
                    <th className="p-4 font-medium">Mã đơn</th>
                    <th className="p-4 font-medium">Khách hàng</th>
                    <th className="p-4 font-medium">Sản phẩm</th>
                    <th className="p-4 font-medium">Tổng tiền</th>
                    <th className="p-4 font-medium">Thanh toán</th>
                    <th className="p-4 font-medium">Trạng thái</th>
                    <th className="p-4 font-medium">Ngày đặt</th>
                    <th className="p-4 font-medium">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <span className="font-mono font-medium text-blue-600">
                          #{order.orderNumber}
                        </span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-800">
                            {order.shippingAddress?.name || order.userId?.name || 'N/A'}
                          </p>
                          <p className="text-sm text-gray-500">
                            {order.shippingAddress?.phone || 'N/A'}
                          </p>
                          {order.guestEmail && (
                            <p className="text-xs text-gray-400">{order.guestEmail}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {order.items?.slice(0, 2).map((item, idx) => (
                            <div
                              key={idx}
                              className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden shrink-0"
                            >
                              {item.productId?.image ? (
                                <img
                                  src={item.productId.image}
                                  alt={item.productName}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <FiPackage className="w-full h-full p-2 text-gray-400" />
                              )}
                            </div>
                          ))}
                          {order.items?.length > 2 && (
                            <span className="text-sm text-gray-500">
                              +{order.items.length - 2}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {order.items?.length || 0} sản phẩm
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-gray-800">
                            {formatPrice(order.totalAmount)}
                          </span>
                          {order.discountAmount > 0 && (
                            <span className="text-xs text-green-600">
                              -{formatPrice(order.discountAmount)}
                            </span>
                          )}
                          {order.shippingFee > 0 && (
                            <span className="text-xs text-gray-500">
                              Ship: {formatPrice(order.shippingFee)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        {renderPaymentStatus(order.paymentStatus)}
                        <p className="text-xs text-gray-500 mt-1">
                          {order.paymentMethod === 'bank_transfer' ? 'Chuyển khoản' :
                            order.paymentMethod === 'cod' ? 'COD' :
                              order.paymentMethod?.toUpperCase() || 'COD'}
                        </p>
                        {order.paidAt && (
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(order.paidAt, { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </td>
                      <td className="p-4">
                        {renderStatus(order.status)}
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-gray-600">
                          {formatDate(order.createdAt)}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <Link
                            to={`/admin/don-hang/${order._id}`}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <FiEye className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => openStatusModal(order)}
                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Cập nhật trạng thái"
                          >
                            <FiEdit2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-500">
                  Hiển thị {(pagination.page - 1) * pagination.limit + 1} -{' '}
                  {Math.min(pagination.page * pagination.limit, pagination.total)} của{' '}
                  {pagination.total} đơn hàng
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                    disabled={!pagination.hasPrev}
                    className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>

                  {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                    let pageNum;
                    if (pagination.pages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.page <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.page >= pagination.pages - 2) {
                      pageNum = pagination.pages - 4 + i;
                    } else {
                      pageNum = pagination.page - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setFilters({ ...filters, page: pageNum })}
                        className={`px-3 py-1 rounded-lg ${pageNum === pagination.page
                          ? 'bg-blue-600 text-white'
                          : 'border hover:bg-gray-50'
                          }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                    disabled={!pagination.hasNext}
                    className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Status Update Modal */}
      <Modal
        open={showStatusModal && !!selectedOrder}
        onClose={() => setShowStatusModal(false)}
        title={selectedOrder ? `Cập nhật trạng thái đơn #${selectedOrder.orderNumber}` : ''}
        subtitle="Thay đổi trạng thái xử lý đơn hàng"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowStatusModal(false)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium"
            >
              Hủy
            </button>
            <button
              onClick={handleStatusUpdate}
              disabled={updating || (selectedOrder && statusForm.status === selectedOrder.status)}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 font-medium"
            >
              {updating && <FiLoader className="animate-spin" />}
              Cập nhật
            </button>
          </div>
        }
      >
        {selectedOrder && (
          <div className="space-y-4">
            {/* Current Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái hiện tại
              </label>
              <div className="flex items-center gap-2">
                {renderStatus(selectedOrder.status)}
              </div>
            </div>

            {/* New Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Trạng thái mới <span className="text-red-500">*</span>
              </label>
              <select
                value={statusForm.status}
                onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
              >
                {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>

            {/* Tracking Number (for shipped status) */}
            {(statusForm.status === 'shipped' || statusForm.status === 'shipping_created' || statusForm.status === 'delivering') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mã vận đơn
                </label>
                <input
                  type="text"
                  value={statusForm.trackingNumber}
                  onChange={(e) => setStatusForm({ ...statusForm, trackingNumber: e.target.value })}
                  placeholder="Nhập mã vận đơn..."
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
              </div>
            )}

            {/* Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ghi chú
              </label>
              <textarea
                value={statusForm.note}
                onChange={(e) => setStatusForm({ ...statusForm, note: e.target.value })}
                placeholder="Ghi chú về việc cập nhật trạng thái..."
                rows={3}
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none"
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminOrdersPage;
