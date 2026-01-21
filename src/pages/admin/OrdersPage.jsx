import { useState } from 'react';
import { FiSearch, FiEye, FiEdit2 } from 'react-icons/fi';
import { formatPrice } from '../../utils/helpers';

// Mock orders data
const mockOrders = [
  {
    id: 'DH123460',
    customer: 'Nguyễn Văn A',
    phone: '0912345678',
    total: 23990000,
    status: 'pending',
    date: '21/01/2026 10:30',
    items: 1,
  },
  {
    id: 'DH123459',
    customer: 'Trần Thị B',
    phone: '0923456789',
    total: 5990000,
    status: 'shipping',
    date: '21/01/2026 09:15',
    items: 1,
  },
  {
    id: 'DH123458',
    customer: 'Lê Văn C',
    phone: '0934567890',
    total: 29990000,
    status: 'delivered',
    date: '20/01/2026 14:20',
    items: 2,
  },
  {
    id: 'DH123457',
    customer: 'Phạm Thị D',
    phone: '0945678901',
    total: 15990000,
    status: 'confirmed',
    date: '20/01/2026 11:45',
    items: 1,
  },
  {
    id: 'DH123456',
    customer: 'Hoàng Văn E',
    phone: '0956789012',
    total: 9990000,
    status: 'cancelled',
    date: '19/01/2026 16:30',
    items: 1,
  },
];

const statusOptions = [
  { value: 'pending', label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-600' },
  { value: 'confirmed', label: 'Đã xác nhận', color: 'bg-blue-100 text-blue-600' },
  { value: 'shipping', label: 'Đang giao', color: 'bg-purple-100 text-purple-600' },
  { value: 'delivered', label: 'Đã giao', color: 'bg-green-100 text-green-600' },
  { value: 'cancelled', label: 'Đã hủy', color: 'bg-red-100 text-red-600' },
];

const AdminOrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = mockOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusInfo = (status) => {
    return statusOptions.find((s) => s.value === status) || statusOptions[0];
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý đơn hàng</h1>

      {/* Status Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {statusOptions.map((status) => {
          const count = mockOrders.filter((o) => o.status === status.value).length;
          return (
            <button
              key={status.value}
              onClick={() => setStatusFilter(statusFilter === status.value ? '' : status.value)}
              className={`p-4 rounded-xl text-center transition-all ${
                statusFilter === status.value
                  ? 'ring-2 ring-blue-500 bg-blue-50'
                  : 'bg-white shadow-sm hover:shadow'
              }`}
            >
              <p className="text-2xl font-bold text-gray-800">{count}</p>
              <p className="text-sm text-gray-500">{status.label}</p>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn, tên khách hàng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-sm text-gray-500">
                <th className="p-4">Mã đơn</th>
                <th className="p-4">Khách hàng</th>
                <th className="p-4">Số điện thoại</th>
                <th className="p-4">Tổng tiền</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4">Ngày đặt</th>
                <th className="p-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                return (
                  <tr key={order.id} className="border-t hover:bg-gray-50">
                    <td className="p-4 font-medium">{order.id}</td>
                    <td className="p-4">{order.customer}</td>
                    <td className="p-4 text-gray-600">{order.phone}</td>
                    <td className="p-4 font-medium">{formatPrice(order.total)}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{order.date}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <FiEye size={18} />
                        </button>
                        <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded">
                          <FiEdit2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Hiển thị 1-{filteredOrders.length} của {mockOrders.length} đơn hàng
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded hover:bg-gray-50">Trước</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
            <button className="px-3 py-1 border rounded hover:bg-gray-50">Sau</button>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Chi tiết đơn hàng {selectedOrder.id}</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Customer Info */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Thông tin khách hàng</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <p><span className="text-gray-500">Tên:</span> {selectedOrder.customer}</p>
                  <p><span className="text-gray-500">SĐT:</span> {selectedOrder.phone}</p>
                  <p><span className="text-gray-500">Địa chỉ:</span> 123 Đường ABC, Quận XYZ, TP.HCM</p>
                </div>
              </div>

              {/* Update Status */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Cập nhật trạng thái</h3>
                <select className="input-field">
                  {statusOptions.map((status) => (
                    <option
                      key={status.value}
                      value={status.value}
                      selected={status.value === selectedOrder.status}
                    >
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Order Summary */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Tóm tắt đơn hàng</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Số sản phẩm:</span>
                    <span>{selectedOrder.items}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-500">Phí vận chuyển:</span>
                    <span className="text-green-600">Miễn phí</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold">
                    <span>Tổng cộng:</span>
                    <span className="text-blue-600">{formatPrice(selectedOrder.total)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-4">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Đóng
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Cập nhật
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
