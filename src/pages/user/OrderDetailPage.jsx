import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiLoader,
  FiPackage,
  FiMapPin,
  FiPhone,
  FiCreditCard,
  FiTruck,
  FiClock,
  FiCheck,
  FiX,
  FiCopy,
  FiAlertCircle,
  FiHelpCircle,
} from 'react-icons/fi';
import { orderService } from '../../services/orderService';
import { formatPrice, formatDate } from '../../utils/helpers';
import { toast } from 'react-toastify';

const STATUS_CONFIG = {
  pending: { 
    label: 'Chờ xác nhận', 
    color: 'bg-yellow-100 text-yellow-700 border-yellow-300', 
    icon: FiClock,
    description: 'Đơn hàng đang chờ xác nhận từ cửa hàng'
  },
  confirmed: { 
    label: 'Đã xác nhận', 
    color: 'bg-blue-100 text-blue-700 border-blue-300', 
    icon: FiCheck,
    description: 'Đơn hàng đã được xác nhận, đang chuẩn bị hàng'
  },
  shipping_ready: { 
    label: 'Chờ lên đơn', 
    color: 'bg-indigo-100 text-indigo-700 border-indigo-300', 
    icon: FiPackage,
    description: 'Đơn hàng đã được xác nhận, chờ tạo vận đơn'
  },
  shipping_created: { 
    label: 'Đã lên đơn', 
    color: 'bg-purple-100 text-purple-700 border-purple-300', 
    icon: FiTruck,
    description: 'Vận đơn đã được tạo, đang chờ vận chuyển'
  },
  delivering: { 
    label: 'Đang giao', 
    color: 'bg-purple-100 text-purple-700 border-purple-300', 
    icon: FiTruck,
    description: 'Đơn hàng đang được vận chuyển đến bạn'
  },
  completed: { 
    label: 'Đã giao', 
    color: 'bg-green-100 text-green-700 border-green-300', 
    icon: FiCheck,
    description: 'Đơn hàng đã được giao thành công'
  },
  cancelled: { 
    label: 'Đã hủy', 
    color: 'bg-red-100 text-red-700 border-red-300', 
    icon: FiX,
    description: 'Đơn hàng đã bị hủy'
  },
  returned: { 
    label: 'Hoàn trả', 
    color: 'bg-orange-100 text-orange-700 border-orange-300', 
    icon: FiPackage,
    description: 'Đơn hàng đang được hoàn trả'
  },
  // Backward compatibility for old statuses
  processing: { 
    label: 'Đang xử lý', 
    color: 'bg-indigo-100 text-indigo-700 border-indigo-300', 
    icon: FiPackage,
    description: 'Đơn hàng đang được đóng gói'
  },
  shipped: { 
    label: 'Đang giao', 
    color: 'bg-purple-100 text-purple-700 border-purple-300', 
    icon: FiTruck,
    description: 'Đơn hàng đang được vận chuyển đến bạn'
  },
  delivered: { 
    label: 'Đã giao', 
    color: 'bg-green-100 text-green-700 border-green-300', 
    icon: FiCheck,
    description: 'Đơn hàng đã được giao thành công'
  },
  refunded: { 
    label: 'Đã hoàn tiền', 
    color: 'bg-gray-100 text-gray-700 border-gray-300', 
    icon: FiCreditCard,
    description: 'Đã hoàn tiền cho đơn hàng'
  },
};

const PAYMENT_METHODS = {
  cod: 'Thanh toán khi nhận hàng (COD)',
  bank_transfer: 'Chuyển khoản ngân hàng',
  momo: 'Ví MoMo',
  zalopay: 'ZaloPay',
  vnpay: 'VNPay',
  stripe: 'Thẻ quốc tế',
};

// Status order for progress bar (new statuses)
const STATUS_ORDER = ['pending', 'confirmed', 'shipping_ready', 'shipping_created', 'delivering', 'completed'];

// Map old statuses to new ones for backward compatibility
const STATUS_MAP = {
  processing: 'shipping_ready',
  shipped: 'delivering',
  delivered: 'completed'
};

const UserOrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Cancel order
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  const fetchOrder = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderService.getOrderById(id);
      if (response.success) {
        setOrder(response.order);
      } else {
        setError(response.message || 'Không thể tải thông tin đơn hàng');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError(error.response?.data?.message || 'Không thể tải thông tin đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // Handle cancel order
  const handleCancelOrder = async () => {
    if (!cancelReason.trim()) {
      toast.error('Vui lòng nhập lý do hủy đơn');
      return;
    }

    try {
      setCancelling(true);
      await orderService.cancelOrder(id, cancelReason);
      toast.success('Đã hủy đơn hàng');
      setShowCancelModal(false);
      fetchOrder();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi hủy đơn hàng');
    } finally {
      setCancelling(false);
    }
  };

  // Copy tracking number
  const copyTrackingNumber = () => {
    if (order?.trackingNumber) {
      navigator.clipboard.writeText(order.trackingNumber);
      toast.success('Đã sao chép mã vận đơn');
    }
  };

  // Get current status index for progress bar (with backward compatibility)
  const getStatusIndex = (status) => {
    // Map old statuses to new ones
    const mappedStatus = STATUS_MAP[status] || status;
    const index = STATUS_ORDER.indexOf(mappedStatus);
    return index >= 0 ? index : 0;
  };

  // Render status badge
  const renderStatus = (status) => {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${config.color}`}>
        <Icon className="w-5 h-5" />
        <span className="font-medium">{config.label}</span>
      </span>
    );
  };

  // Render progress bar
  const renderProgressBar = () => {
    if (['cancelled', 'returned', 'refunded'].includes(order.status)) {
      return null;
    }

    const currentIndex = getStatusIndex(order.status);

    return (
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="font-bold text-gray-800 mb-6">Tiến độ đơn hàng</h2>
        <div className="flex items-center justify-between relative">
          {/* Progress line */}
          <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 mx-8">
            <div 
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${(currentIndex / (STATUS_ORDER.length - 1)) * 100}%` }}
            />
          </div>
          
          {/* Status points */}
          {STATUS_ORDER.map((status, index) => {
            const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
            const Icon = config.icon;
            const isActive = index <= currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <div key={status} className="flex flex-col items-center relative z-10">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isActive 
                      ? isCurrent 
                        ? 'bg-blue-500 text-white ring-4 ring-blue-100' 
                        : 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-xs mt-2 text-center ${isActive ? 'text-blue-600 font-medium' : 'text-gray-400'}`}>
                  {config.label}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Current status description */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center">
          <p className="text-blue-700">
            {STATUS_CONFIG[order.status]?.description}
          </p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FiLoader className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="text-center py-12">
        <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-800 mb-2">Không tìm thấy đơn hàng</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Link
          to="/don-hang"
          className="inline-flex items-center gap-2 text-blue-600 hover:underline"
        >
          <FiArrowLeft /> Quay lại danh sách
        </Link>
      </div>
    );
  }

  const canCancel = ['pending', 'confirmed'].includes(order.status);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/don-hang"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Đơn hàng #{order.orderNumber}
            </h1>
            <p className="text-gray-500 text-sm">
              Đặt lúc {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {renderStatus(order.status)}
        </div>
      </div>

      {/* Progress Bar */}
      {renderProgressBar()}

      {/* Tracking Number */}
      {order.trackingNumber && (
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <FiTruck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-white/80">Mã vận đơn</p>
                <p className="text-2xl font-bold font-mono">{order.trackingNumber}</p>
              </div>
            </div>
            <button
              onClick={copyTrackingNumber}
              className="p-3 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              title="Sao chép"
            >
              <FiCopy className="w-5 h-5" />
            </button>
          </div>
          {order.shippingCompany && (
            <p className="mt-2 text-white/80">
              Đơn vị vận chuyển: {order.shippingCompany}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <FiPackage className="w-5 h-5" />
                Sản phẩm ({order.items?.length || 0})
              </h2>
            </div>
            <div className="divide-y">
              {order.items?.map((item, index) => (
                <div key={index} className="p-4 flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.productId?.image ? (
                      <img
                        src={item.productId.image}
                        alt={item.productName}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <FiPackage className="w-full h-full p-4 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/san-pham/${item.productId?.slug || item.productId?._id || item.productId}`}
                      className="font-medium text-gray-800 hover:text-blue-600 line-clamp-2"
                    >
                      {item.productName || item.productId?.name}
                    </Link>
                    {item.variantName && (
                      <p className="text-sm text-gray-500">{item.variantName}</p>
                    )}
                    <p className="text-sm text-gray-500">
                      {formatPrice(item.price)} x {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-blue-600">
                      {formatPrice(item.subtotal || item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t bg-gray-50">
              <div className="space-y-2 max-w-xs ml-auto">
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính:</span>
                  <span>{formatPrice(order.subtotal)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Giảm giá:</span>
                    <span>-{formatPrice(order.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span>{order.shippingFee > 0 ? formatPrice(order.shippingFee) : 'Miễn phí'}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t pt-2">
                  <span>Tổng cộng:</span>
                  <span className="text-blue-600">{formatPrice(order.totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 border-b">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <FiMapPin className="w-5 h-5" />
                Địa chỉ giao hàng
              </h2>
            </div>
            <div className="p-4">
              <p className="font-medium text-gray-800">{order.shippingAddress?.name}</p>
              <p className="text-gray-600 mt-1">
                {order.shippingAddress?.addressLine1 || order.shippingAddress?.address}
              </p>
              <p className="text-gray-600">
                {[
                  order.shippingAddress?.ward,
                  order.shippingAddress?.district,
                  order.shippingAddress?.city
                ].filter(Boolean).join(', ')}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <FiPhone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">{order.shippingAddress?.phone}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 border-b">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <FiCreditCard className="w-5 h-5" />
                Thanh toán
              </h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Phương thức:</span>
                <span className="font-medium text-sm">
                  {PAYMENT_METHODS[order.paymentMethod] || order.paymentMethod}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Trạng thái:</span>
                <span className={`px-2 py-1 rounded text-sm font-medium ${
                  order.paymentStatus === 'paid' 
                    ? 'bg-green-100 text-green-700'
                    : order.paymentStatus === 'failed'
                    ? 'bg-red-100 text-red-700'
                    : order.paymentStatus === 'refunded'
                    ? 'bg-gray-100 text-gray-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {order.paymentStatus === 'paid' ? 'Đã thanh toán' : 
                   order.paymentStatus === 'failed' ? 'Thanh toán lỗi' :
                   order.paymentStatus === 'refunded' ? 'Đã hoàn tiền' :
                   'Chưa thanh toán'}
                </span>
              </div>
              {order.paidAt && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Thanh toán lúc:</span>
                  <span className="text-sm text-gray-500">{formatDate(order.paidAt)}</span>
                </div>
              )}
              {order.paymentDetails?.transactionId && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Mã giao dịch:</span>
                  <span className="font-mono text-xs text-gray-500">
                    {order.paymentDetails.transactionId}
                  </span>
                </div>
              )}
              {order.couponCode && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Mã giảm giá:</span>
                  <span className="font-mono bg-green-100 text-green-700 px-2 py-1 rounded text-sm">
                    {order.couponCode}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Info */}
          {order.trackingNumber && (
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                  <FiTruck className="w-5 h-5" />
                  Vận chuyển
                </h2>
              </div>
              <div className="p-4 space-y-3">
                {order.shippingCompany && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Đơn vị:</span>
                    <span className="font-medium">{order.shippingCompany}</span>
                  </div>
                )}
                {order.shippedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Gửi hàng lúc:</span>
                    <span className="text-sm text-gray-500">{formatDate(order.shippedAt)}</span>
                  </div>
                )}
                {order.deliveredAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Giao hàng lúc:</span>
                    <span className="text-sm text-gray-500">{formatDate(order.deliveredAt)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cancellation Info */}
          {order.status === 'cancelled' && order.cancellationReason && (
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                  <FiX className="w-5 h-5" />
                  Lý do hủy đơn
                </h2>
              </div>
              <div className="p-4">
                <p className="text-gray-700">{order.cancellationReason}</p>
                {order.cancelledAt && (
                  <p className="text-sm text-gray-500 mt-2">
                    Hủy lúc: {formatDate(order.cancelledAt)}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            {canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="w-full px-4 py-3 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
              >
                <FiX className="w-5 h-5" />
                Hủy đơn hàng
              </button>
            )}
            <Link
              to="/lien-he"
              className="w-full px-4 py-3 border rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              <FiHelpCircle className="w-5 h-5" />
              Cần hỗ trợ?
            </Link>
          </div>
        </div>
      </div>

      {/* Status History */}
      {order.statusHistory && order.statusHistory.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-4 border-b">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
              <FiClock className="w-5 h-5" />
              Lịch sử đơn hàng
            </h2>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {order.statusHistory
                .slice()
                .reverse()
                .map((history, index) => {
                  const config = STATUS_CONFIG[history.status] || STATUS_CONFIG.pending;
                  const Icon = config.icon;
                  return (
                    <div key={index} className="flex gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${config.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="font-medium text-gray-800">{config.label}</p>
                        <p className="text-sm text-gray-500">{formatDate(history.updatedAt)}</p>
                        {history.note && !history.note.startsWith('[Internal]') && (
                          <p className="text-sm text-gray-600 mt-1">{history.note}</p>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Hủy đơn hàng
              </h2>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Bạn có chắc chắn muốn hủy đơn hàng <strong>#{order.orderNumber}</strong>?
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lý do hủy đơn <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="Vui lòng cho chúng tôi biết lý do bạn muốn hủy đơn hàng..."
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
                Không
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={cancelling || !cancelReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
              >
                {cancelling && <FiLoader className="animate-spin" />}
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserOrderDetailPage;
