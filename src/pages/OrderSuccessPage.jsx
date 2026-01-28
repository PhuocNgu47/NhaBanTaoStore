import { Link, useLocation, useParams } from 'react-router-dom';
import { FiShoppingCart, FiCheck } from 'react-icons/fi';
import { formatPrice, formatDate } from '../utils/helpers';

import { useEffect, useState } from 'react';
import { orderService } from '../services/orderService';
import { useSettings } from '../contexts/SettingsContext';
import { toast } from 'react-toastify';

// Checkout steps component
const CheckoutSteps = ({ currentStep }) => {
  const steps = [
    { id: 1, name: 'Giỏ hàng', icon: FiShoppingCart },
    { id: 2, name: 'Thông tin đặt hàng', icon: FiShoppingCart },
    { id: 3, name: 'Hoàn tất', icon: FiCheck },
  ];

  return (
    <div className="flex items-center justify-center mb-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${step.id <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-400'
                }`}
            >
              <step.icon className="w-5 h-5" />
            </div>
            <span
              className={`font-medium ${step.id <= currentStep ? 'text-blue-600' : 'text-gray-400'
                }`}
            >
              {step.name}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-24 h-0.5 mx-4`}
              style={{
                borderStyle: 'dashed',
                borderWidth: '1px',
                borderColor: step.id < currentStep ? '#2563eb' : '#e5e7eb',
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};



const OrderSuccessPage = () => {
  const location = useLocation();
  const params = useParams();
  const [order, setOrder] = useState(location.state?.order || null);
  const { settings } = useSettings();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Nếu đã có order từ state (chuyển hướng sau khi đặt hàng), không cần gọi API
    if (order && order._id) {
      return;
    }

    // Ưu tiên lấy orderId từ params, nếu không có thì thử lấy từ query hoặc location.state
    let orderId = params.orderId || location.state?.orderId || location.state?.order?._id;
    if (!orderId) {
      // Thử lấy từ query string nếu có
      const searchParams = new URLSearchParams(location.search);
      orderId = searchParams.get('orderId');
    }

    // Nếu có order object từ state nhưng chưa có _id, thử lấy từ order object
    if (!orderId && location.state?.order?._id) {
      orderId = location.state.order._id;
    }

    if (!orderId) {
      setError('Không tìm thấy mã đơn hàng.');
      return;
    }

    setLoading(true);
    orderService.getOrderById(orderId)
      .then((response) => {
        if (response.success && response.order) {
          setOrder(response.order);
          setError('');
        } else {
          setError('Không tìm thấy thông tin đơn hàng.');
        }
      })
      .catch((err) => {
        console.error('Get order error:', err);
        setError('Không tìm thấy thông tin đơn hàng.');
      })
      .finally(() => setLoading(false));
  }, [location, params]);

  // Helper functions to format order data
  const getPaymentMethodLabel = (method) => {
    const methods = {
      cod: 'Thanh toán khi nhận hàng (COD)',
      bank_transfer: 'Chuyển khoản ngân hàng',
      momo: 'Ví MoMo',
      zalopay: 'ZaloPay',
      vnpay: 'VNPay',
      stripe: 'Thẻ quốc tế',
      qr_code: 'Quét mã VietQR',
    };
    return methods[method] || method;
  };

  const formatAddress = (address) => {
    if (!address) return '';
    if (typeof address === 'string') return address;
    const parts = [];
    if (address.addressLine1 || address.address) {
      parts.push(address.addressLine1 || address.address);
    }
    if (address.ward) parts.push(address.ward);
    if (address.district) parts.push(address.district);
    if (address.city) parts.push(address.city);
    return parts.join(', ');
  };

  // Transform API order to display format
  const getDisplayOrder = () => {
    if (!order) return null;

    // If order is already in display format (from old checkout flow)
    if (order.orderId && order.customerName) {
      return order;
    }

    // Transform API order format to display format
    return {
      orderId: order.orderNumber || order._id,
      customerName: order.shippingAddress?.name || 'N/A',
      phone: order.shippingAddress?.phone || 'N/A',
      email: order.guestEmail || order.userId?.email || 'N/A',
      orderDate: formatDate(order.createdAt),
      address: formatAddress(order.shippingAddress),
      paymentMethod: getPaymentMethodLabel(order.paymentMethod),
      shippingMethod: order.trackingNumber ? 'Đang giao hàng' : 'Chưa giao hàng',
      items: order.items?.map(item => ({
        id: item._id || item.productId?._id || item.productId,
        name: item.productName || item.productId?.name,
        price: item.price,
        quantity: item.quantity,
        variant: item.variantName || '',
        image: item.productId?.image || '/placeholder-product.jpg',
      })) || [],
      subtotal: order.subtotal || 0,
      shippingFee: order.shippingFee || 0,
      total: order.totalAmount || 0,
    };
  };

  const displayOrder = getDisplayOrder();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg text-gray-600">Đang tải thông tin đơn hàng...</div>
      </div>
    );
  }
  if (error || !displayOrder) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-lg text-red-500 mb-4">{error || 'Không tìm thấy đơn hàng'}</div>
          <Link
            to="/tra-cuu-don-hang"
            className="text-blue-600 hover:underline"
          >
            Tra cứu đơn hàng
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 bg-gray-50 min-h-screen">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-gray-600">
          <span className="hover:text-blue-600 cursor-pointer">🏠 Trang chủ</span>
          <span className="mx-2">›</span>
          <span className="font-semibold text-gray-900">Hoàn tất đơn hàng</span>
        </div>

        {/* Checkout Steps */}
        <CheckoutSteps currentStep={3} />

        {/* Thank You Message */}
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 text-center mb-8 uppercase">
          Cảm ơn bạn đã mua hàng tại Nhà Bán Táo Store
        </h1>

        {/* VietQR Pay Now Section */}
        {(order?.paymentMethod === 'bank_transfer' || order?.paymentMethod === 'qr_code') &&
          order?.paymentStatus === 'unpaid' && settings?.banks?.length > 0 && (() => {
            const bank = settings.banks.find(b => b.isDefault) || settings.banks[0];
            const transferContent = `THANHTOAN ${order.orderNumber || order._id}`;
            const qrUrl = `https://img.vietqr.io/image/${bank.bin || bank.shortName}-${bank.bankNumber}-compact2.png?amount=${order.totalAmount}&addInfo=${encodeURIComponent(transferContent)}&accountName=${encodeURIComponent(bank.bankHolder || '')}`;

            return (
              <div className="bg-white rounded-xl shadow-sm overflow-hidden max-w-4xl mx-auto mb-8 border-2 border-green-500">
                <div className="bg-green-500 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">THANH TOÁN NGAY QUA VIETQR</span>
                    <span className="bg-white text-green-600 text-xs px-2 py-0.5 rounded-full font-bold uppercase">Nhanh & Chính xác</span>
                  </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="flex flex-col items-center">
                    <div className="bg-white p-2 rounded-xl border-2 border-gray-100 shadow-sm">
                      <img
                        src={qrUrl}
                        alt="VietQR"
                        className="w-64 h-64 object-contain"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-4 text-center">
                      Mở App Ngân hàng → Quét mã QR <br />
                      <span className="text-xs font-medium text-blue-600">(Mã QR tự động điền số tiền & nội dung)</span>
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span className="text-gray-500 text-sm">Ngân hàng</span>
                        <span className="font-bold text-gray-800">{bank.bankName || bank.shortName}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span className="text-gray-500 text-sm">Số tài khoản</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-blue-700">{bank.bankNumber}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(bank.bankNumber);
                              toast.success('Đã copy số tài khoản!');
                            }}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span className="text-gray-500 text-sm">Chủ tài khoản</span>
                        <span className="font-bold text-gray-800 uppercase">{bank.bankHolder}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-gray-100 pb-2">
                        <span className="text-gray-500 text-sm">Số tiền</span>
                        <span className="font-bold text-red-600 text-xl">{formatPrice(order.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 text-sm">Nội dung CK</span>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800">{transferContent}</span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(transferContent);
                              toast.success('Đã copy nội dung!');
                            }}
                            className="text-xs text-blue-600 hover:underline"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 text-sm text-gray-600 italic">
                      <FiCheck className="mt-1 text-green-500 shrink-0" />
                      <p>Hệ thống sẽ cập nhật trạng thái "Đã thanh toán" sau khi Admin xác nhận (thường từ 2-5 phút).</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

        {/* Order Details Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden max-w-4xl mx-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-bold text-blue-900 uppercase italic">
              Thông tin đơn hàng
            </h2>
          </div>

          {/* Product List */}
          <div className="p-6 border-b border-gray-200">
            <p className="font-semibold text-gray-800 mb-4">Danh sách sản phẩm</p>

            <div className="space-y-4">
              {displayOrder.items.map((item) => (
                <div
                  key={`${item.id}-${item.variant}`}
                  className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                >
                  <div className="relative w-20 h-20 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                    <img
                      src={item.image || '/placeholder-product.jpg'}
                      alt={item.name}
                      className="w-full h-full object-contain p-2"
                    />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-red-600 font-bold mt-1">{formatPrice(item.price)}</p>
                    {item.variant && (
                      <div className="flex gap-2 mt-2">
                        {item.variant.split(' - ').map((v, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded border border-gray-200"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Mã đơn hàng</span>
                <span className="text-blue-700 font-bold">#{displayOrder.orderId}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Tên người nhận</span>
                <span className="text-blue-700 font-medium">{displayOrder.customerName}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Số điện thoại</span>
                <span className="text-blue-700 font-medium">{displayOrder.phone}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Ngày đặt hàng</span>
                <span className="text-blue-700 font-medium">{displayOrder.orderDate}</span>
              </div>
              <div className="flex justify-between items-start py-2">
                <span className="text-gray-600">Địa chỉ</span>
                <span className="text-blue-700 font-medium text-right max-w-xs">
                  {displayOrder.address}
                </span>
              </div>
            </div>
          </div>

          {/* Payment & Shipping */}
          <div className="p-6 border-b border-gray-200">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Hình thức thanh toán</span>
                <span className="text-blue-700 font-medium">{displayOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Phương thức vận chuyển</span>
                <span className="text-blue-700 font-medium">{displayOrder.shippingMethod}</span>
              </div>
            </div>
          </div>

          {/* Totals */}
          <div className="p-6 border-b border-gray-200">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Tổng tiền hàng</span>
                <span className="text-red-600 font-bold">{formatPrice(displayOrder.subtotal)}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Giảm giá</span>
                  <span className="text-green-600 font-bold">-{formatPrice(order.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="text-blue-700 font-medium">
                  {displayOrder.shippingFee > 0 ? formatPrice(displayOrder.shippingFee) : 'Miễn phí'}
                </span>
              </div>
            </div>
          </div>

          {/* Grand Total */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900 uppercase">Tổng thanh toán</span>
              <span className="text-2xl font-bold text-red-600">{formatPrice(displayOrder.total)}</span>
            </div>
            <div className="mt-4 text-sm text-gray-500 space-y-1">
              <p>
                * Chúng tôi đã gửi thông tin đơn hàng về địa chỉ email {displayOrder.email}
              </p>
              <p>
                * Vui lòng kiểm tra hộp thư (bao gồm mục Spam/Quảng cáo nếu không thấy trong inbox).
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="p-6">
            <Link
              to="/tra-cuu-don-hang"
              className="block w-full bg-blue-900 hover:bg-blue-950 text-white text-center py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl"
            >
              Tra cứu đơn hàng
            </Link>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="max-w-4xl mx-auto mt-6 text-center">
          <Link
            to="/san-pham"
            className="inline-block text-blue-600 hover:text-blue-700 font-medium hover:underline"
          >
            ← Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
