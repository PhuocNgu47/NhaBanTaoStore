import { useState } from 'react';
import { FiSearch, FiEdit2, FiTrash2, FiUserCheck, FiUserX } from 'react-icons/fi';

// Mock users data
const mockUsers = [
  { id: 1, name: 'Nguyễn Văn A', email: 'nguyenvana@email.com', phone: '0912345678', role: 'user', status: 'active', orders: 5, joined: '01/12/2025' },
  { id: 2, name: 'Trần Thị B', email: 'tranthib@email.com', phone: '0923456789', role: 'user', status: 'active', orders: 12, joined: '15/11/2025' },
  { id: 3, name: 'Admin', email: 'admin@anhphibantao.com', phone: '0934567890', role: 'admin', status: 'active', orders: 0, joined: '01/01/2025' },
  { id: 4, name: 'Lê Văn C', email: 'levanc@email.com', phone: '0945678901', role: 'user', status: 'blocked', orders: 2, joined: '20/12/2025' },
  { id: 5, name: 'Phạm Thị D', email: 'phamthid@email.com', phone: '0956789012', role: 'user', status: 'active', orders: 8, joined: '05/01/2026' },
];

const AdminUsersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Quản lý người dùng</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-gray-800">{mockUsers.length}</p>
          <p className="text-sm text-gray-500">Tổng người dùng</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-green-600">
            {mockUsers.filter((u) => u.status === 'active').length}
          </p>
          <p className="text-sm text-gray-500">Đang hoạt động</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-blue-600">
            {mockUsers.filter((u) => u.role === 'admin').length}
          </p>
          <p className="text-sm text-gray-500">Quản trị viên</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <p className="text-2xl font-bold text-red-600">
            {mockUsers.filter((u) => u.status === 'blocked').length}
          </p>
          <p className="text-sm text-gray-500">Đã khóa</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả vai trò</option>
            <option value="admin">Quản trị viên</option>
            <option value="user">Người dùng</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-sm text-gray-500">
                <th className="p-4">ID</th>
                <th className="p-4">Tên</th>
                <th className="p-4">Email</th>
                <th className="p-4">SĐT</th>
                <th className="p-4">Vai trò</th>
                <th className="p-4">Đơn hàng</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t hover:bg-gray-50">
                  <td className="p-4 font-medium">#{user.id}</td>
                  <td className="p-4">{user.name}</td>
                  <td className="p-4 text-gray-600">{user.email}</td>
                  <td className="p-4 text-gray-600">{user.phone}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin'
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {user.role === 'admin' ? 'Admin' : 'User'}
                    </span>
                  </td>
                  <td className="p-4">{user.orders}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {user.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded">
                        <FiEdit2 size={18} />
                      </button>
                      {user.status === 'active' ? (
                        <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded">
                          <FiUserX size={18} />
                        </button>
                      ) : (
                        <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded">
                          <FiUserCheck size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsersPage;
