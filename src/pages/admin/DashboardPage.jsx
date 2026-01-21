import { FiShoppingBag, FiBox, FiUsers, FiDollarSign, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { formatPrice } from '../../utils/helpers';

// Mock stats data
const stats = [
  {
    title: 'Doanh thu hôm nay',
    value: 45680000,
    change: '+12%',
    isPositive: true,
    icon: FiDollarSign,
    color: 'bg-green-500',
  },
  {
    title: 'Đơn hàng mới',
    value: 25,
    change: '+8%',
    isPositive: true,
    icon: FiShoppingBag,
    color: 'bg-blue-500',
  },
  {
    title: 'Sản phẩm',
    value: 156,
    change: '+3',
    isPositive: true,
    icon: FiBox,
    color: 'bg-purple-500',
  },
  {
    title: 'Khách hàng',
    value: 1234,
    change: '+45',
    isPositive: true,
    icon: FiUsers,
    color: 'bg-orange-500',
  },
];

// Mock recent orders
const recentOrders = [
  { id: 'DH123460', customer: 'Nguyễn Văn A', total: 23990000, status: 'pending', date: '5 phút trước' },
  { id: 'DH123459', customer: 'Trần Thị B', total: 5990000, status: 'shipping', date: '1 giờ trước' },
  { id: 'DH123458', customer: 'Lê Văn C', total: 29990000, status: 'delivered', date: '2 giờ trước' },
  { id: 'DH123457', customer: 'Phạm Thị D', total: 15990000, status: 'confirmed', date: '3 giờ trước' },
  { id: 'DH123456', customer: 'Hoàng Văn E', total: 9990000, status: 'delivered', date: '5 giờ trước' },
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-600',
  confirmed: 'bg-blue-100 text-blue-600',
  shipping: 'bg-purple-100 text-purple-600',
  delivered: 'bg-green-100 text-green-600',
  cancelled: 'bg-red-100 text-red-600',
};

const statusLabels = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  shipping: 'Đang giao',
  delivered: 'Đã giao',
  cancelled: 'Đã hủy',
};

const DashboardPage = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">
                  {typeof stat.value === 'number' && stat.title.includes('Doanh thu')
                    ? formatPrice(stat.value)
                    : stat.value.toLocaleString('vi-VN')}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {stat.isPositive ? (
                    <FiTrendingUp className="text-green-500" size={14} />
                  ) : (
                    <FiTrendingDown className="text-red-500" size={14} />
                  )}
                  <span
                    className={`text-sm ${
                      stat.isPositive ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`${stat.color} p-4 rounded-xl`}>
                <stat.icon className="text-white" size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-bold text-gray-800">Đơn hàng gần đây</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500">
                    <th className="pb-3">Mã đơn</th>
                    <th className="pb-3">Khách hàng</th>
                    <th className="pb-3">Tổng tiền</th>
                    <th className="pb-3">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-t">
                      <td className="py-3 font-medium">{order.id}</td>
                      <td className="py-3 text-gray-600">{order.customer}</td>
                      <td className="py-3">{formatPrice(order.total)}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            statusColors[order.status]
                          }`}
                        >
                          {statusLabels[order.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b">
            <h2 className="text-lg font-bold text-gray-800">Sản phẩm bán chạy</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {[
                { name: 'iPad Pro 11 inch M4', sold: 45, revenue: 1079550000 },
                { name: 'AirPods Pro 2', sold: 38, revenue: 227620000 },
                { name: 'MacBook Air M3', sold: 22, revenue: 549780000 },
                { name: 'Apple Pencil Pro', sold: 56, revenue: 195440000 },
                { name: 'Magic Keyboard', sold: 18, revenue: 161820000 },
              ].map((product, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-500">Đã bán: {product.sold}</p>
                  </div>
                  <p className="font-semibold text-blue-600">
                    {formatPrice(product.revenue)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
