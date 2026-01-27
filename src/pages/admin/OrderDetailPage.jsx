import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft,
  FiLoader,
  FiPackage,
  FiMapPin,
  FiPhone,
  FiMail,
  FiCreditCard,
  FiTruck,
  FiClock,
  FiCheck,
  FiX,
  FiEdit2,
  FiPrinter,
  FiAlertCircle,
} from 'react-icons/fi';
import { orderService } from '../../services/orderService';
import { formatPrice, formatDate } from '../../utils/helpers';
import { toast } from 'react-toastify';
import Modal from '../../components/Modal';

const STATUS_CONFIG = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700 border-yellow-300', icon: FiClock },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-700 border-blue-300', icon: FiCheck },
  shipping_ready: { label: 'Chờ lên đơn', color: 'bg-indigo-100 text-indigo-700 border-indigo-300', icon: FiPackage },
  shipping_created: { label: 'Đã lên đơn', color: 'bg-purple-100 text-purple-700 border-purple-300', icon: FiTruck },
  delivering: { label: 'Đang giao', color: 'bg-purple-100 text-purple-700 border-purple-300', icon: FiTruck },
  completed: { label: 'Đã giao', color: 'bg-green-100 text-green-700 border-green-300', icon: FiCheck },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-700 border-red-300', icon: FiX },
  returned: { label: 'Hoàn trả', color: 'bg-orange-100 text-orange-700 border-orange-300', icon: FiPackage },
  // Backward compatibility for old statuses
  processing: { label: 'Đang xử lý', color: 'bg-indigo-100 text-indigo-700 border-indigo-300', icon: FiPackage },
  shipped: { label: 'Đang giao', color: 'bg-purple-100 text-purple-700 border-purple-300', icon: FiTruck },
  delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-700 border-green-300', icon: FiCheck },
  refunded: { label: 'Đã hoàn tiền', color: 'bg-gray-100 text-gray-700 border-gray-300', icon: FiCreditCard },
};

const PAYMENT_METHODS = {
  cod: 'Thanh toán khi nhận hàng (COD)',
  bank_transfer: 'Chuyển khoản ngân hàng',
  momo: 'Ví MoMo',
  zalopay: 'ZaloPay',
  vnpay: 'VNPay',
  stripe: 'Thẻ quốc tế',
};

const AdminOrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Status update
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [statusForm, setStatusForm] = useState({
    status: '',
    note: '',
    trackingNumber: '',
  });

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await orderService.getOrderById(id);
      if (response.success) {
        setOrder(response.order);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Không thể tải thông tin đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  // Handle status update
  const handleStatusUpdate = async () => {
    if (!statusForm.status) return;

    try {
      setUpdating(true);
      await orderService.updateOrderStatus(
        id,
        statusForm.status,
        statusForm.note,
        statusForm.trackingNumber
      );

      toast.success('Cập nhật trạng thái thành công');
      setShowStatusModal(false);
      fetchOrder();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi cập nhật');
    } finally {
      setUpdating(false);
    }
  };

  // Open status modal
  const openStatusModal = () => {
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
      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${config.color}`}>
        <Icon className="w-5 h-5" />
        <span className="font-medium">{config.label}</span>
      </span>
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
          to="/admin/don-hang"
          className="inline-flex items-center gap-2 text-blue-600 hover:underline"
        >
          <FiArrowLeft /> Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/don-hang"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Đơn hàng #{order.orderNumber}
            </h1>
            <p className="text-gray-500 text-sm">
              Đặt lúc {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {renderStatus(order.status)}
          <button
            onClick={openStatusModal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiEdit2 className="w-4 h-4" />
            Cập nhật
          </button>
          <button
            onClick={() => window.print()}
            className="p-2 border rounded-lg hover:bg-gray-50"
            title="In đơn hàng"
          >
            <FiPrinter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 border-b">
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
                      to={`/admin/san-pham/${item.productId?._id || item.productId}`}
                      className="font-medium text-gray-800 hover:text-blue-600"
                    >
                      {item.productName || item.productId?.name}
                    </Link>
                    {item.variantName && (
                      <p className="text-sm text-gray-500">{item.variantName}</p>
                    )}
                    {item.sku && (
                      <p className="text-xs text-gray-400">SKU: {item.sku}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800">{formatPrice(item.price)}</p>
                    <p className="text-sm text-gray-500">x{item.quantity}</p>
                  </div>
                  <div className="text-right min-w-[120px]">
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

          {/* Status History */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                  <FiClock className="w-5 h-5" />
                  Lịch sử trạng thái
                </h2>
              </div>
              <div className="p-4">
                <div className="relative">
                  {order.statusHistory.map((history, index) => {
                    const config = STATUS_CONFIG[history.status] || STATUS_CONFIG.pending;
                    const Icon = config.icon;
                    return (
                      <div key={index} className="flex gap-4 pb-4 last:pb-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${config.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{config.label}</p>
                          <p className="text-sm text-gray-500">{formatDate(history.updatedAt)}</p>
                          {history.note && (
                            <p className="text-sm text-gray-600 mt-1">{history.note}</p>
                          )}
                          {history.trackingNumber && (
                            <p className="text-sm text-purple-600 mt-1">
                              Mã vận đơn: {history.trackingNumber}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 border-b">
              <h2 className="font-bold text-gray-800">Thông tin khách hàng</h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-800">
                    {order.shippingAddress?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress?.addressLine1 || order.shippingAddress?.address}
                  </p>
                  <p className="text-sm text-gray-600">
                    {[
                      order.shippingAddress?.ward,
                      order.shippingAddress?.district,
                      order.shippingAddress?.city
                    ].filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <FiPhone className="w-5 h-5 text-gray-400" />
                <a
                  href={`tel:${order.shippingAddress?.phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {order.shippingAddress?.phone}
                </a>
              </div>
              {(order.guestEmail || order.userId?.email) && (
                <div className="flex items-center gap-3">
                  <FiMail className="w-5 h-5 text-gray-400" />
                  <a
                    href={`mailto:${order.guestEmail || order.userId?.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {order.guestEmail || order.userId?.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 border-b">
              <h2 className="font-bold text-gray-800">Thanh toán</h2>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Phương thức:</span>
                <span className="font-medium">
                  {PAYMENT_METHODS[order.paymentMethod] || order.paymentMethod}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Trạng thái:</span>
                <span className={`px-2 py-1 rounded text-sm font-medium ${order.paymentStatus === 'paid'
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
                  <span className="text-sm">{formatDate(order.paidAt)}</span>
                </div>
              )}
              {order.paymentDetails && (
                <>
                  {order.paymentDetails.transactionId && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Mã giao dịch:</span>
                      <span className="font-mono text-xs text-gray-500">
                        {order.paymentDetails.transactionId}
                      </span>
                    </div>
                  )}
                  {order.paymentDetails.referenceCode && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Mã tham chiếu:</span>
                      <span className="font-mono text-xs text-gray-500">
                        {order.paymentDetails.referenceCode}
                      </span>
                    </div>
                  )}
                  {order.paymentDetails.gateway && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Cổng thanh toán:</span>
                      <span className="text-sm">{order.paymentDetails.gateway}</span>
                    </div>
                  )}
                </>
              )}
              {order.paymentNote && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500 mb-1">Ghi chú:</p>
                  <p className="text-sm text-gray-700">{order.paymentNote}</p>
                </div>
              )}
              {order.couponCode && (
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-gray-600">Mã giảm giá:</span>
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm">
                    {order.couponCode}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 border-b">
              <h2 className="font-bold text-gray-800">Vận chuyển</h2>
            </div>
            <div className="p-4 space-y-3">
              {order.shippingCompany ? (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Đơn vị:</span>
                  <span className="font-medium">{order.shippingCompany}</span>
                </div>
              ) : (
                <div className="text-sm text-gray-500">Chưa có đơn vị vận chuyển</div>
              )}
              {order.trackingNumber ? (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Mã vận đơn:</span>
                  <span className="font-mono bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    {order.trackingNumber}
                  </span>
                </div>
              ) : (
                <div className="text-sm text-gray-500">Chưa có mã vận đơn</div>
              )}
              {order.shippedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Gửi hàng lúc:</span>
                  <span className="text-sm">{formatDate(order.shippedAt)}</span>
                </div>
              )}
              {order.deliveredAt && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Giao hàng lúc:</span>
                  <span className="text-sm">{formatDate(order.deliveredAt)}</span>
                </div>
              )}
              {order.confirmedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Xác nhận lúc:</span>
                  <span className="text-sm">{formatDate(order.confirmedAt)}</span>
                </div>
              )}
              {order.processingAt && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Xử lý lúc:</span>
                  <span className="text-sm">{formatDate(order.processingAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Cancellation Info */}
          {order.status === 'cancelled' && (
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b">
                <h2 className="font-bold text-gray-800">Thông tin hủy đơn</h2>
              </div>
              <div className="p-4 space-y-3">
                {order.cancellationReason && (
                  <div>
                    <span className="text-gray-600 text-sm">Lý do:</span>
                    <p className="text-gray-800 mt-1">{order.cancellationReason}</p>
                  </div>
                )}
                {order.cancelledAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Hủy lúc:</span>
                    <span className="text-sm">{formatDate(order.cancelledAt)}</span>
                  </div>
                )}
                {order.cancelledBy && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Người hủy:</span>
                    <span className="text-sm">
                      {order.cancelledBy?.name || order.cancelledBy || 'Khách hàng'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Return/Refund Info */}
          {(order.status === 'returned' || order.status === 'refunded') && (
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b">
                <h2 className="font-bold text-gray-800">
                  {order.status === 'returned' ? 'Thông tin hoàn trả' : 'Thông tin hoàn tiền'}
                </h2>
              </div>
              <div className="p-4 space-y-3">
                {order.returnReason && (
                  <div>
                    <span className="text-gray-600 text-sm">Lý do:</span>
                    <p className="text-gray-800 mt-1">{order.returnReason}</p>
                  </div>
                )}
                {order.returnRequestedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Yêu cầu lúc:</span>
                    <span className="text-sm">{formatDate(order.returnRequestedAt)}</span>
                  </div>
                )}
                {order.refundAmount && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Số tiền hoàn:</span>
                    <span className="font-bold text-green-600">{formatPrice(order.refundAmount)}</span>
                  </div>
                )}
                {order.refundedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Hoàn tiền lúc:</span>
                    <span className="text-sm">{formatDate(order.refundedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Notes */}
          {order.notes && order.notes.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b">
                <h2 className="font-bold text-gray-800">Ghi chú</h2>
              </div>
              <div className="p-4 space-y-2">
                {order.notes.map((note, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{note.note}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(note.addedAt)}
                      {note.isInternal && (
                        <span className="ml-2 text-orange-500">(Nội bộ)</span>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Update Modal */}
      <Modal
        open={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Cập nhật trạng thái đơn hàng"
        subtitle={`Đơn hàng #${order.orderNumber}`}
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
              disabled={updating}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 font-medium"
            >
              {updating && <FiLoader className="animate-spin" />}
              Cập nhật
            </button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái mới
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ghi chú
            </label>
            <textarea
              value={statusForm.note}
              onChange={(e) => setStatusForm({ ...statusForm, note: e.target.value })}
              placeholder="Ghi chú về việc cập nhật..."
              rows={3}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 resize-none"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminOrderDetailPage;
