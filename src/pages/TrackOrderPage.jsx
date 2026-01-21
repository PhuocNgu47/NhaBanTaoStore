import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiSearch, FiHome, FiChevronRight, FiPhone } from 'react-icons/fi';
import { Header, Footer } from '../components/common';

// Mock order data for demonstration
const mockOrders = [
  {
    code: '000735',
    customerName: 'Phuoc Nguyen',
    phone: '0935771670',
    phoneDisplay: '09357*****',
    email: 'phuoc@gmail.com',
    emailDisplay: 'phuoc***********',
    orderDate: '21-01-2026 20:04:45',
    address: '1 Hai ** ******* ******* ***\n****** ******* *** ** ***',
    paymentMethod: 'Chuyển khoản ngân hàng',
    shippingMethod: 'Giao hàng Tiêu chuẩn',
    status: 'Chờ xử lý',
    note: '',
    items: [
      {
        id: 1,
        name: 'iPad Pro M2 11 inch Nguyên Seal CPO Bản Wifi | Chính Hãng Apple',
        price: 18100000,
        quantity: 1,
        variant: '128GB',
        color: 'Xám',
        image: '/products/ipad-pro.jpg',
      },
    ],
    subtotal: 18100000,
    shippingFee: 'Nhân viên gọi trao đổi',
    total: 18100000,
  },
  {
    code: 'DH123456',
    customerName: 'Nguyễn Văn A',
    phone: '0912345678',
    phoneDisplay: '09123*****',
    email: 'nguyenvana@gmail.com',
    emailDisplay: 'nguyen***********',
    orderDate: '20-01-2026 15:30:00',
    address: '123 Đường ABC, Quận 1\nTP. Hồ Chí Minh',
    paymentMethod: 'COD - Thanh toán khi nhận hàng',
    shippingMethod: 'Giao hàng Nhanh',
    status: 'Đang giao hàng',
    note: 'Gọi trước khi giao',
    items: [
      {
        id: 1,
        name: 'MacBook Air M4 13.6 inch 16GB/256GB',
        price: 23300000,
        quantity: 1,
        variant: '256GB',
        color: 'Silver',
        image: '/products/macbook-air.jpg',
      },
    ],
    subtotal: 23300000,
    shippingFee: 'Miễn phí',
    total: 23300000,
  },
];

const TrackOrderPage = () => {
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState(searchParams.get('code') || '');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [isSearched, setIsSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchValue.trim()) {
      setError('Vui lòng nhập mã đơn hàng, số điện thoại hoặc email');
      setOrder(null);
      return;
    }

    const searchTerm = searchValue.trim().toLowerCase();
    
    // Search by order code, phone, or email
    const foundOrder = mockOrders.find((o) => 
      o.code.toLowerCase() === searchTerm ||
      o.phone === searchTerm ||
      o.email.toLowerCase() === searchTerm
    );
    
    if (foundOrder) {
      // Return order with masked info for display
      setOrder({
        ...foundOrder,
        phone: foundOrder.phoneDisplay,
        email: foundOrder.emailDisplay,
      });
      setError('');
    } else {
      setOrder(null);
      setError('Không tìm thấy đơn hàng với thông tin này');
    }
    setIsSearched(true);
  };

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' đ';
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
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Nhập mã đơn hàng hoặc số điện thoại"
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700"
                />
              </div>
              <button
                type="submit"
                className="px-8 py-4 bg-blue-800 text-white font-semibold rounded-lg hover:bg-blue-900 transition-colors uppercase tracking-wide"
              >
                Tra cứu
              </button>
            </div>
            {error && <p className="text-red-500 text-center mt-3">{error}</p>}
          </form>

          {/* Order Details */}
          {order && (
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
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 py-3">
                      <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/64x64?text=iPad';
                          }}
                        />
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-800 mb-1">{item.name}</h4>
                        <p className="text-blue-800 font-semibold text-sm">{formatPrice(item.price)}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{item.variant}</span>
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{item.color}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Details Table */}
                <div className="p-6 space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Mã đơn hàng</span>
                    <span className="font-semibold text-blue-800">{order.code}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Tên người nhận</span>
                    <span className="font-medium text-blue-800">{order.customerName}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Số điện thoại</span>
                    <span className="font-medium text-blue-800">{order.phone}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Ngày đặt hàng</span>
                    <span className="font-medium text-blue-800">{order.orderDate}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Địa chỉ</span>
                    <span className="font-medium text-blue-800 text-right whitespace-pre-line">{order.address}</span>
                  </div>
                </div>

                {/* Payment & Shipping */}
                <div className="p-6 border-t border-gray-100 space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Hình thức thanh toán</span>
                    <span className="font-medium text-blue-800">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Phương thức vận chuyển</span>
                    <span className="font-medium text-blue-800">{order.shippingMethod}</span>
                  </div>
                </div>

                {/* Totals */}
                <div className="p-6 border-t border-gray-100 space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Tổng tiền hàng</span>
                    <span className="font-medium">{formatPrice(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Phí vận chuyển</span>
                    <span className="font-medium text-blue-800">{order.shippingFee}</span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span className="font-bold text-gray-800">TỔNG THANH TOÁN</span>
                    <span className="font-bold text-blue-800 text-lg">{formatPrice(order.total)}</span>
                  </div>
                </div>

                {/* Email Notice */}
                <div className="px-6 pb-6 text-xs text-gray-500">
                  <p>* Chúng tôi đã gửi thông tin đơn hàng về địa chỉ email {order.email}</p>
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
                    <span className="font-semibold text-blue-800">{order.code}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Trạng thái</span>
                    <span className="font-medium text-gray-800">{order.status}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Ghi chú</span>
                    <span className="font-medium text-gray-800">{order.note || '-'}</span>
                  </div>
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
