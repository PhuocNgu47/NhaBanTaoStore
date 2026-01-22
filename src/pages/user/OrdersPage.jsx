import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiPackage,
  FiLoader,
  FiChevronRight,
  FiClock,
  FiCheck,
  FiTruck,
  FiX,
  FiRefreshCw,
  FiShoppingBag,
  FiAlertCircle,
} from 'react-icons/fi';
import { orderService } from '../../services/orderService';
import { formatPrice, formatDate } from '../../utils/helpers';
import { toast } from 'react-toastify';

const STATUS_CONFIG = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700', icon: FiClock },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700', icon: FiCheck },
  processing: { label: 'Đang xử lý', color: 'bg-indigo-100 text-indigo-700', icon: FiPackage },
  shipped: { label: 'Đang giao', color: 'bg-purple-100 text-purple-700', icon: FiTruck },
  delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-700', icon: FiCheck },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700', icon: FiX },
  returned: { label: 'Hoàn trả', color: 'bg-orange-100 text-orange-700', icon: FiRefreshCw },
  refunded: { label: 'Đã hoàn tiền', color: 'bg-gray-100 text-gray-700', icon: FiRefreshCw },
};

const UserOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 10,
        sortBy: '-createdAt',
      };
      
      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      const response = await orderService.getMyOrders(params);
      
      if (response.success) {
        setOrders(response.orders || []);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Lỗi khi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter]);

  // Handle cancel order
  const handleCancelOrder = async () => {
    if (!selectedOrderId) return;

    try {
      setCancellingId(selectedOrderId);
      await orderService.cancelOrder(selectedOrderId, cancelReason);
      toast.success('Đã hủy đơn hàng thành công');
      setShowCancelModal(false);
      setCancelReason('');
      setSelectedOrderId(null);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Không thể hủy đơn hàng');
    } finally {
      setCancellingId(null);
    }
  };

  // Open cancel modal
  const openCancelModal = (orderId) => {
    setSelectedOrderId(orderId);
    setCancelReason('');
    setShowCancelModal(true);
  };

  // Render status badge
  const renderStatus = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  // Can cancel order
  const canCancel = (status) => {
    return ['pending', 'confirmed'].includes(status);
  };

  if (loading && orders.length === 0) {
    return (
      <div className="py-8">
        <div className="container-custom">
          <div className="flex items-center justify-center min-h-[400px]">
            <FiLoader className="w-12 h-12 animate-spin text-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Đơn hàng của tôi</h1>
          
          {/* Status Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setStatusFilter('all'); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              Tất cả
            </button>
            {Object.entries(STATUS_CONFIG).slice(0, 5).map(([key, config]) => (
              <button
                key={key}
                onClick={() => { setStatusFilter(key); setPage(1); }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  statusFilter === key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {config.label}
              </button>
            ))}
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <FiShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Chưa có đơn hàng</h2>
            <p className="text-gray-600 mb-6">
              {statusFilter !== 'all' 
                ? `Không có đơn hàng nào ở trạng thái "${STATUS_CONFIG[statusFilter]?.label}"`
                : 'Bạn chưa có đơn hàng nào'
              }
            </p>
            <Link
              to="/san-pham"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b bg-gray-50 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="font-mono font-semibold text-gray-800">
                      #{order.orderNumber}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  {renderStatus(order.status)}
                </div>

                {/* Items */}
                <div className="p-4">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 py-2">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        {item.productId?.image ? (
                          <img
                            src={item.productId.image}
                            alt={item.productName}
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          <FiPackage className="w-full h-full p-4 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Link 
                          to={`/san-pham/${item.productId?.slug || item.productId}`}
                          className="font-medium text-gray-800 hover:text-blue-600 line-clamp-1"
                        >
                          {item.productName || item.productId?.name}
                        </Link>
                        {item.variantName && (
                          <p className="text-sm text-gray-500">{item.variantName}</p>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">x{item.quantity}</span>
                          <span className="text-blue-600 font-medium">
                            {formatPrice(item.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Tracking Number */}
                {order.trackingNumber && (
                  <div className="px-4 py-2 bg-purple-50 border-t border-b border-purple-100">
                    <div className="flex items-center gap-2 text-sm">
                      <FiTruck className="text-purple-600" />
                      <span className="text-gray-600">Mã vận đơn:</span>
                      <span className="font-mono font-medium text-purple-700">
                        {order.trackingNumber}
                      </span>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="p-4 bg-gray-50 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-gray-600">Tổng tiền: </span>
                      <span className="font-bold text-blue-600 text-lg">
                        {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                    {order.paymentStatus === 'paid' && (
                      <span className="text-green-600 text-sm flex items-center gap-1">
                        <FiCheck /> Đã thanh toán
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link
                      to={`/don-hang/${order._id}`}
                      className="flex items-center gap-1 px-4 py-2 border rounded-lg hover:bg-gray-100 text-sm font-medium"
                    >
                      Xem chi tiết
                      <FiChevronRight className="w-4 h-4" />
                    </Link>
                    {canCancel(order.status) && (
                      <button
                        onClick={() => openCancelModal(order._id)}
                        disabled={cancellingId === order._id}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm font-medium disabled:opacity-50 flex items-center gap-1"
                      >
                        {cancellingId === order._id ? (
                          <FiLoader className="animate-spin" />
                        ) : (
                          <FiX className="w-4 h-4" />
                        )}
                        Hủy đơn
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center gap-2 pt-4">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={!pagination.hasPrev}
                  className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Trước
                </button>
                
                <span className="px-4 py-2 text-gray-600">
                  Trang {pagination.page} / {pagination.pages}
                </span>
                
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={!pagination.hasNext}
                  className="px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <FiAlertCircle className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">
                  Xác nhận hủy đơn hàng
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-600">
                Bạn có chắc chắn muốn hủy đơn hàng này? Hành động này không thể hoàn tác.
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do hủy đơn (không bắt buộc)
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Nhập lý do hủy đơn hàng..."
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Không hủy
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancellingId}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {cancellingId && <FiLoader className="animate-spin" />}
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrdersPage;
