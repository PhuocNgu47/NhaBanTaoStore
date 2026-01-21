import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/helpers';
import { ORDER_STATUS } from '../../constants';

// Mock orders data
const mockOrders = [
  {
    id: 1,
    code: 'DH123456',
    date: '15/01/2026',
    status: 'delivered',
    total: 23990000,
    items: [
      { name: 'iPad Pro 11 inch M4', quantity: 1, image: '/products/ipad-pro.jpg' },
    ],
  },
  {
    id: 2,
    code: 'DH123457',
    date: '18/01/2026',
    status: 'shipping',
    total: 5990000,
    items: [
      { name: 'AirPods Pro 2', quantity: 1, image: '/products/airpods-pro.jpg' },
    ],
  },
  {
    id: 3,
    code: 'DH123458',
    date: '20/01/2026',
    status: 'pending',
    total: 29990000,
    items: [
      { name: 'MacBook Air M3', quantity: 1, image: '/products/macbook-air.jpg' },
    ],
  },
];

const statusLabels = {
  pending: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-600' },
  confirmed: { label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-600' },
  shipping: { label: 'Đang giao', color: 'bg-purple-100 text-purple-600' },
  delivered: { label: 'Đã giao', color: 'bg-green-100 text-green-600' },
  cancelled: { label: 'Đã hủy', color: 'bg-red-100 text-red-600' },
};

const OrdersPage = () => {
  return (
    <div className="py-8">
      <div className="container-custom">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Đơn hàng của tôi</h1>

        {mockOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Chưa có đơn hàng</h2>
            <p className="text-gray-600 mb-6">Bạn chưa có đơn hàng nào</p>
            <Link
              to="/san-pham"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {mockOrders.map((order) => {
              const status = statusLabels[order.status];
              return (
                <div key={order.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Header */}
                  <div className="p-4 border-b flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="font-semibold text-gray-800">#{order.code}</span>
                      <span className="text-gray-500 text-sm ml-4">{order.date}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="p-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.image || '/placeholder-product.jpg'}
                            alt={item.name}
                            className="w-full h-full object-contain p-2"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{item.name}</p>
                          <p className="text-sm text-gray-500">x{item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="p-4 bg-gray-50 flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="text-gray-600">Tổng tiền: </span>
                      <span className="font-bold text-blue-600">{formatPrice(order.total)}</span>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/tra-cuu-don-hang?code=${order.code}`}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-100 text-sm"
                      >
                        Xem chi tiết
                      </Link>
                      {order.status === 'pending' && (
                        <button className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 text-sm">
                          Hủy đơn
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
