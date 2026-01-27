import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiSearch, FiHome, FiChevronRight, FiPhone, FiLoader } from 'react-icons/fi';
import { Header, Footer } from '../components/common';
import { orderService } from '../services/orderService';
import { formatPrice, formatDate } from '../utils/helpers';
import { toast } from 'react-toastify';

const TrackOrderPage = () => {
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('code') || '');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [isSearched, setIsSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // Payment method labels
  const getPaymentMethodLabel = (method) => {
    const methods = {
      cod: 'Thanh toán khi nhận hàng (COD)',
      bank_transfer: 'Chuyển khoản ngân hàng',
      momo: 'Ví MoMo',
      zalopay: 'ZaloPay',
      vnpay: 'VNPay',
      stripe: 'Thẻ quốc tế',
    };
    return methods[method] || method;
  };

  // Status labels
  const getStatusLabel = (status) => {
    const statuses = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      shipping_ready: 'Chờ lên đơn',
      shipping_created: 'Đã lên đơn',
      delivering: 'Đang giao hàng',
      completed: 'Đã giao',
      cancelled: 'Đã hủy',
      returned: 'Hoàn trả',
      // Backward compatibility
      processing: 'Đang xử lý',
      shipped: 'Đang giao hàng',
      delivered: 'Đã giao',
      refunded: 'Đã hoàn tiền',
    };
    return statuses[status] || status;
  };

  // Mask phone number
  const maskPhone = (phone) => {
    if (!phone) return '';
    if (phone.length <= 5) return phone;
    return phone.slice(0, 5) + '*****';
  };

  // Mask email
  const maskEmail = (email) => {
    if (!email) return '';
    const [local, domain] = email.split('@');
    if (!domain) return email;
    if (local.length <= 5) return email;
    return local.slice(0, 5) + '***********@' + domain;
  };

  // Format address
  const formatAddress = (address) => {
    if (!address) return '';
    const parts = [];
    if (address.addressLine1 || address.address) {
      parts.push(address.addressLine1 || address.address);
    }
    if (address.ward) parts.push(address.ward);
    if (address.district) parts.push(address.district);
    if (address.city) parts.push(address.city);
    return parts.join(', ');
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchValue.trim()) {
      setError('Vui lòng nhập mã đơn hàng hoặc mã đơn hàng và email');
      setOrder(null);
      setIsSearched(true);
      return;
    }

    setLoading(true);
    setError('');
    setIsSearched(true);

    try {
      const searchTerm = searchValue.trim();
      
      // Try to parse: format "orderNumber email" or just "orderNumber"
      const parts = searchTerm.split(/\s+/);
      let orderNumber = '';
      let email = '';
      
      if (parts.length >= 2) {
        // Assume format: orderNumber email
        orderNumber = parts[0];
        email = parts.slice(1).join(' ').trim();
      } else {
        // Just order number, try to find email in the string
        // Check if it contains @ (email)
        if (searchTerm.includes('@')) {
          // Extract email and order number
          const emailMatch = searchTerm.match(/([^\s]+@[^\s]+)/);
          if (emailMatch) {
            email = emailMatch[1];
            orderNumber = searchTerm.replace(email, '').trim();
          } else {
            orderNumber = searchTerm;
          }
        } else {
          orderNumber = searchTerm;
        }
      }

      // If we have both orderNumber and email, try guest order API first
      if (orderNumber && email && email.includes('@')) {
        try {
          console.log('Trying guest order search:', { email, orderNumber });
          const response = await orderService.getGuestOrder(email, orderNumber);
          console.log('Guest order response:', response);
          if (response.success && response.order) {
            setOrder(response.order);
            setError('');
            setLoading(false);
            return;
          } else if (response.order) {
            // Some APIs might return order directly
            setOrder(response.order);
            setError('');
            setLoading(false);
            return;
          }
        } catch (guestError) {
          console.error('Guest order search error:', guestError);
          // If guest order fails, continue to try authenticated search
          if (guestError.response?.status === 404) {
            // Order not found with this email/orderNumber combination
            setOrder(null);
            setError('Không tìm thấy đơn hàng với mã đơn hàng và email này. Vui lòng kiểm tra lại.');
            setLoading(false);
            return;
          }
          console.log('Guest order search failed, trying authenticated search...');
        }
      }

      // Try authenticated search (for logged-in users)
      try {
        console.log('Trying authenticated search:', searchTerm);
        const response = await orderService.getAllOrders({ 
          search: searchTerm,
          limit: 10 
        });
        console.log('Authenticated search response:', response);
        
        if (response.success && response.orders && response.orders.length > 0) {
          // If multiple orders found, try to match by orderNumber first
          let foundOrder = null;
          if (orderNumber) {
            foundOrder = response.orders.find(o => 
              o.orderNumber === orderNumber || 
              String(o.orderNumber) === String(orderNumber)
            );
          }
          // If not found by orderNumber, use the most recent one
          if (!foundOrder) {
            foundOrder = response.orders[0];
          }
          
          setOrder(foundOrder);
          setError('');
          setLoading(false);
          return;
        } else {
          setOrder(null);
          if (orderNumber && email) {
            setError('Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn hàng và email.');
          } else if (orderNumber) {
            setError('Không tìm thấy đơn hàng với mã này. Vui lòng nhập cả mã đơn hàng và email (VD: 1234567890 email@example.com) hoặc đăng nhập để tra cứu.');
          } else {
            setError('Không tìm thấy đơn hàng. Vui lòng nhập mã đơn hàng và email (VD: 1234567890 email@example.com) hoặc đăng nhập để tra cứu.');
          }
        }
      } catch (authError) {
        console.error('Authenticated search error:', authError);
        // If not authenticated (401), guide user to use email + orderNumber
        if (authError.response?.status === 401) {
          setOrder(null);
          if (orderNumber && !email) {
            setError('Vui lòng nhập cả mã đơn hàng và email để tra cứu (VD: 1234567890 email@example.com), hoặc đăng nhập để tra cứu.');
          } else if (!orderNumber && !email) {
            setError('Vui lòng nhập mã đơn hàng và email (VD: 1234567890 email@example.com) hoặc đăng nhập để tra cứu.');
          } else {
            setError('Vui lòng đăng nhập để tra cứu đơn hàng, hoặc sử dụng mã đơn hàng và email đã nhận trong email xác nhận đơn hàng.');
          }
        } else {
          // Other errors
          console.error('Unexpected error:', authError);
          setOrder(null);
          setError('Có lỗi xảy ra khi tìm kiếm đơn hàng. Vui lòng thử lại sau.');
        }
      }
    } catch (error) {
      console.error('Search order error:', error);
      setOrder(null);
      if (error.response?.status === 401) {
        setError('Vui lòng đăng nhập để tra cứu đơn hàng, hoặc nhập mã đơn hàng và email (VD: 1234567890 email@example.com).');
      } else if (error.response?.status === 403) {
        setError('Bạn không có quyền truy cập.');
      } else if (error.response?.status === 404) {
        setError('Không tìm thấy đơn hàng. Vui lòng kiểm tra lại mã đơn hàng và email.');
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra khi tìm kiếm đơn hàng. Vui lòng thử lại sau.';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    
      
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-3">
          <nav className="flex items-center gap-2 text-sm">
            <Link to="/" className="flex items-center gap-1 text-gray-500 hover:text-blue-800 transition-colors">
              <FiHome className="w-4 h-4" />
              <span>Trang chủ</span>
            </Link>
            <FiChevronRight className="w-4 h-4 text-gray-400" />
            <span className="text-gray-800 font-medium">Tra cứu đơn hàng</span>
          </nav>
        </div>
      </div>

      <div className="bg-gray-50 min-h-[calc(100vh-300px)] py-10">
        <div className="container-custom max-w-5xl">
          {/* Title */}
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800 text-center mb-8 uppercase tracking-wide">
            Tra cứu đơn hàng
          </h1>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mb-10 max-w-2xl mx-auto">
            <div className="bg-white rounded-xl p-4 shadow-sm mb-4">
              <p className="text-sm text-gray-700 mb-2 font-medium">
                💡 Hướng dẫn tra cứu:
              </p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Nhập <strong>mã đơn hàng và email</strong> (VD: <code className="bg-gray-100 px-2 py-0.5 rounded text-xs">1234567890 email@example.com</code>)</li>
                <li>• Hoặc chỉ nhập <strong>mã đơn hàng</strong> nếu đã đăng nhập</li>
                <li>• Thông tin này được gửi trong email xác nhận đơn hàng</li>
              </ul>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Nhập mã đơn hàng và email (VD: 1234567890 email@example.com)"
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-4 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <FiLoader className="animate-spin" />
                    Đang tìm...
                  </>
                ) : (
                  'Tra cứu'
                )}
              </button>
            </div>
            {error && (
              <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-center text-sm">{error}</p>
              </div>
            )}
          </form>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-12">
              <FiLoader className="w-8 h-8 animate-spin text-blue-500" />
              <span className="ml-3 text-gray-600">Đang tìm kiếm đơn hàng...</span>
            </div>
          )}

          {/* Order Details */}
          {!loading && order && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Order Info */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="bg-blue-800 text-white px-6 py-4">
                  <h2 className="font-bold uppercase tracking-wide">Thông tin đơn hàng</h2>
                </div>

                {/* Product List */}
                <div className="p-6 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-500 mb-4">Danh sách sản phẩm</h3>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <div key={item._id || index} className="flex gap-4 py-3">
                        <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                          <img
                            src={item.productId?.image || '/placeholder-product.jpg'}
                            alt={item.productName || item.productId?.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/64x64?text=Product';
                            }}
                          />
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-800 mb-1">
                            {item.productName || item.productId?.name}
                          </h4>
                          <p className="text-blue-800 font-semibold text-sm">{formatPrice(item.price)}</p>
                          {item.variantName && (
                            <div className="flex gap-2 mt-1">
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                {item.variantName}
                              </span>
                            </div>
                          )}
                          {item.sku && (
                            <p className="text-xs text-gray-400 mt-1">SKU: {item.sku}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            {formatPrice(item.price)} x {item.quantity} = {formatPrice(item.subtotal || item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">Không có sản phẩm</p>
                  )}
                </div>

                {/* Order Details Table */}
                <div className="p-6 space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Mã đơn hàng</span>
                    <span className="font-semibold text-blue-800">#{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Tên người nhận</span>
                    <span className="font-medium text-blue-800">
                      {order.shippingAddress?.name || 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Số điện thoại</span>
                    <span className="font-medium text-blue-800">
                      {maskPhone(order.shippingAddress?.phone || '')}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Ngày đặt hàng</span>
                    <span className="font-medium text-blue-800">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Địa chỉ</span>
                    <span className="font-medium text-blue-800 text-right max-w-xs">
                      {formatAddress(order.shippingAddress)}
                    </span>
                  </div>
                </div>

                {/* Payment & Shipping */}
                <div className="p-6 border-t border-gray-100 space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Hình thức thanh toán</span>
                    <span className="font-medium text-blue-800">
                      {getPaymentMethodLabel(order.paymentMethod)}
                    </span>
                  </div>
                  {order.trackingNumber && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Mã vận đơn</span>
                      <span className="font-medium text-blue-800">{order.trackingNumber}</span>
                    </div>
                  )}
                </div>

                {/* Totals */}
                <div className="p-6 border-t border-gray-100 space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Tổng tiền hàng</span>
                    <span className="font-medium">{formatPrice(order.subtotal || 0)}</span>
                  </div>
                  {order.discountAmount > 0 && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">Giảm giá</span>
                      <span className="font-medium text-green-600">-{formatPrice(order.discountAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Phí vận chuyển</span>
                    <span className="font-medium text-blue-800">
                      {order.shippingFee > 0 ? formatPrice(order.shippingFee) : 'Miễn phí'}
                    </span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="font-bold text-gray-800">TỔNG THANH TOÁN</span>
                    <span className="font-bold text-blue-800 text-lg">
                      {formatPrice(order.totalAmount || 0)}
                    </span>
                  </div>
                </div>

                {/* Email Notice */}
                <div className="px-6 pb-6 text-xs text-gray-500">
                  <p>
                    * Chúng tôi đã gửi thông tin đơn hàng về địa chỉ email{' '}
                    {maskEmail(order.guestEmail || order.userId?.email || '')}
                  </p>
                  <p>* Vui lòng kiểm tra hộp thư (bao gồm mục Spam/Quảng cáo nếu không thấy trong Inbox).</p>
                </div>
              </div>

              {/* Right: Order Status */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-fit">
                {/* Header */}
                <div className="bg-blue-800 text-white px-6 py-4">
                  <h2 className="font-bold uppercase tracking-wide">Tình trạng đơn hàng</h2>
                </div>

                <div className="p-6 space-y-4 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Mã đơn hàng</span>
                    <span className="font-semibold text-blue-800">#{order.orderNumber}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Trạng thái</span>
                    <span className="font-medium text-gray-800">{getStatusLabel(order.status)}</span>
                  </div>
                  {order.statusHistory && order.statusHistory.length > 0 && (
                    <div className="pt-2">
                      <p className="text-gray-500 mb-2">Lịch sử cập nhật:</p>
                      <div className="space-y-2">
                        {order.statusHistory.slice().reverse().slice(0, 5).map((history, idx) => (
                          <div key={idx} className="text-xs text-gray-600 border-l-2 border-blue-200 pl-2">
                            <p className="font-medium">{getStatusLabel(history.status)}</p>
                            <p className="text-gray-500">{formatDate(history.updatedAt)}</p>
                            {history.note && !history.note.startsWith('[Internal]') && (
                              <p className="text-gray-400 mt-1 italic">{history.note}</p>
                            )}
                            {history.trackingNumber && (
                              <p className="text-purple-600 mt-1">Mã vận đơn: {history.trackingNumber}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {order.shippingCompany && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-gray-500 text-xs mb-1">Đơn vị vận chuyển:</p>
                      <p className="font-medium text-sm">{order.shippingCompany}</p>
                    </div>
                  )}
                  {order.paymentStatus && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-gray-500 text-xs mb-1">Trạng thái thanh toán:</p>
                      <p className={`font-medium text-sm ${
                        order.paymentStatus === 'paid' ? 'text-green-600' :
                        order.paymentStatus === 'failed' ? 'text-red-600' :
                        'text-yellow-600'
                      }`}>
                        {order.paymentStatus === 'paid' ? 'Đã thanh toán' :
                         order.paymentStatus === 'failed' ? 'Thanh toán lỗi' :
                         'Chưa thanh toán'}
                      </p>
                      {order.paidAt && (
                        <p className="text-gray-400 text-xs mt-1">Thanh toán lúc: {formatDate(order.paidAt)}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Support Notice */}
          {isSearched && (
            <div className="mt-10 text-center bg-gray-100 rounded-xl p-6">
              <p className="text-gray-700">
                Quý khách vui lòng kiểm tra lại mã vận đơn hoặc gọi điện đến số{' '}
                <a href="tel:0815242433" className="font-bold text-blue-800 hover:underline">
                  0815242433
                </a>{' '}
                để được hỗ trợ
              </p>
              <p className="text-gray-600 mt-1">
                Nhân viên Nhà Bán Táo Store sẽ hỗ trợ với quý khách trong thời gian sớm nhất.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default TrackOrderPage;
