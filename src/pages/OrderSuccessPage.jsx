import { Link, useLocation, useParams } from 'react-router-dom';
import { FiShoppingCart, FiCheck } from 'react-icons/fi';
import { formatPrice } from '../utils/helpers';

import { useEffect, useState } from 'react';
import { orderService } from '../services/orderService';

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
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step.id <= currentStep
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-400'
              }`}
            >
              <step.icon className="w-5 h-5" />
            </div>
            <span
              className={`font-medium ${
                step.id <= currentStep ? 'text-blue-600' : 'text-gray-400'
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Nếu đã có order từ state (chuyển hướng sau khi đặt hàng), không cần gọi API
    if (order) return;
    // Ưu tiên lấy orderId từ params, nếu không có thì thử lấy từ query hoặc location.state
    let orderId = params.orderId || location.state?.orderId;
    if (!orderId) {
      // Thử lấy từ query string nếu có
      const searchParams = new URLSearchParams(location.search);
      orderId = searchParams.get('orderId');
    }
    if (!orderId) {
      setError('Không tìm thấy mã đơn hàng.');
      return;
    }
    setLoading(true);
    orderService.getOrderById(orderId)
      .then((data) => {
        setOrder(data);
        setError('');
      })
      .catch(() => {
        setError('Không tìm thấy thông tin đơn hàng.');
      })
      .finally(() => setLoading(false));
  }, [location, params, order]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg text-gray-600">Đang tải thông tin đơn hàng...</div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-lg text-red-500">{error}</div>
      </div>
    );
  }
  if (!order) return null;

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
              {order.items.map((item) => (
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
                <span className="text-blue-700 font-bold">{order.orderId}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Tên người nhận</span>
                <span className="text-blue-700 font-medium">{order.customerName}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Số điện thoại</span>
                <span className="text-blue-700 font-medium">{order.phone}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Ngày đặt hàng</span>
                <span className="text-blue-700 font-medium">{order.orderDate}</span>
              </div>
              <div className="flex justify-between items-start py-2">
                <span className="text-gray-600">Địa chỉ</span>
                <span className="text-blue-700 font-medium text-right max-w-xs">
                  {order.address}
                </span>
              </div>
            </div>
          </div>

          {/* Payment & Shipping */}
          <div className="p-6 border-b border-gray-200">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Hình thức thanh toán</span>
                <span className="text-blue-700 font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Phương thức vận chuyển</span>
                <span className="text-blue-700 font-medium">{order.shippingMethod}</span>
              </div>
            </div>
          </div>

          {/* Totals */}
          <div className="p-6 border-b border-gray-200">
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Tổng tiền hàng</span>
                <span className="text-red-600 font-bold">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="text-blue-700 font-medium">
                  {order.shippingFee ? formatPrice(order.shippingFee) : 'Nhân viên gọi trao đổi'}
                </span>
              </div>
            </div>
          </div>

          {/* Grand Total */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-gray-900 uppercase">Tổng thanh toán</span>
              <span className="text-2xl font-bold text-red-600">{formatPrice(order.total)}</span>
            </div>
            <div className="mt-4 text-sm text-gray-500 space-y-1">
              <p>
                * Chúng tôi đã gửi thông tin đơn hàng về địa chỉ email {order.email}
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
