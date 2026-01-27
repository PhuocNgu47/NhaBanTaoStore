import { useState, useEffect } from 'react';
import { FiSearch, FiEdit2, FiTrash2, FiUserCheck, FiUserX, FiLoader, FiRefreshCw, FiUser } from 'react-icons/fi';
import { userService } from '../../services/userService';
import { formatDate } from '../../utils/helpers';
import { toast } from 'react-toastify';
import Modal, { ConfirmModal } from '../../components/Modal';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getAllUsers();

      // Backend returns array directly (not wrapped in success object)
      if (Array.isArray(response)) {
        setUsers(response);
      } else if (response.success !== false && response.data && Array.isArray(response.data)) {
        setUsers(response.data);
      } else if (response.users && Array.isArray(response.users)) {
        setUsers(response.users);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error(error.response?.data?.message || 'Lỗi khi tải danh sách người dùng');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await userService.getCustomerStats();
      // Backend returns { success: true, stats: {...} }
      if (response.success && response.stats) {
        setStats(response.stats);
      } else if (response.success !== false && response) {
        // Fallback if stats is at root level
        setStats(response);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Don't show error for stats, just use calculated stats
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchStats();
  }, []);

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !searchQuery ||
      (user.name && user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.phone && user.phone.includes(searchQuery));

    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter ||
      (statusFilter === 'active' && user.isActive) ||
      (statusFilter === 'blocked' && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Handle update role
  const handleUpdateRole = async (newRole) => {
    if (!selectedUser || !newRole) return;

    try {
      setActionLoading(true);
      await userService.updateUserRole(selectedUser._id, newRole);
      toast.success('Cập nhật vai trò thành công');
      setShowRoleModal(false);
      setSelectedUser(null);
      fetchUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi cập nhật vai trò');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setActionLoading(true);
      await userService.deleteUser(selectedUser._id);
      toast.success('Xóa người dùng thành công');
      setShowDeleteModal(false);
      setSelectedUser(null);
      fetchUsers();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi xóa người dùng');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle toggle active status
  const handleToggleActive = async (user) => {
    // Note: Backend might need an endpoint for this, for now we'll show a message
    toast.info('Tính năng khóa/mở khóa tài khoản đang được phát triển');
  };

  // Calculate stats from users
  const calculatedStats = {
    total: users.length,
    active: users.filter(u => u.isActive !== false).length,
    blocked: users.filter(u => u.isActive === false).length,
    admin: users.filter(u => u.role === 'admin').length,
    user: users.filter(u => u.role === 'user' || !u.role).length,
  };

  // Use API stats if available, otherwise use calculated stats
  const displayStats = stats ? {
    total: stats.totalCustomers || calculatedStats.total,
    active: stats.activeCustomers || calculatedStats.active,
    blocked: calculatedStats.blocked,
    admin: calculatedStats.admin,
    user: calculatedStats.user,
  } : calculatedStats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
        <button
          onClick={() => { fetchUsers(); fetchStats(); }}
          className="flex items-center gap-2 px-4 py-2 text-gray-600 bg-white border rounded-lg hover:bg-gray-50"
        >
          <FiRefreshCw className={loading ? 'animate-spin' : ''} />
          Làm mới
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
          <p className="text-sm text-gray-500">Tổng người dùng</p>
          <p className="text-2xl font-bold text-gray-800">{displayStats.total || 0}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
          <p className="text-sm text-gray-500">Đang hoạt động</p>
          <p className="text-2xl font-bold text-green-600">{displayStats.active || 0}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-500">
          <p className="text-sm text-gray-500">Đã khóa</p>
          <p className="text-2xl font-bold text-red-600">{displayStats.blocked || 0}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500">
          <p className="text-sm text-gray-500">Quản trị viên</p>
          <p className="text-2xl font-bold text-purple-600">{displayStats.admin || 0}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-gray-500">
          <p className="text-sm text-gray-500">Người dùng</p>
          <p className="text-2xl font-bold text-gray-600">{displayStats.user || 0}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, SĐT..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="blocked">Đã khóa</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FiLoader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <FiUser className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">
              {searchQuery || roleFilter || statusFilter
                ? 'Không tìm thấy người dùng phù hợp'
                : 'Chưa có người dùng nào'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-sm text-gray-500 border-b">
                  <th className="p-4 font-medium">Tên</th>
                  <th className="p-4 font-medium">Email</th>
                  <th className="p-4 font-medium">SĐT</th>
                  <th className="p-4 font-medium">Vai trò</th>
                  <th className="p-4 font-medium">Đơn hàng</th>
                  <th className="p-4 font-medium">Điểm tích lũy</th>
                  <th className="p-4 font-medium">Trạng thái</th>
                  <th className="p-4 font-medium">Ngày tạo</th>
                  <th className="p-4 font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/40?text=U';
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <FiUser className="w-5 h-5 text-blue-600" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800">{user.name || 'N/A'}</p>
                          {user.tier && (
                            <p className="text-xs text-gray-500 capitalize">{user.tier}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{user.email || 'N/A'}</td>
                    <td className="p-4 text-gray-600">{user.phone || '-'}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin'
                          ? 'bg-purple-100 text-purple-700'
                          : 'bg-gray-100 text-gray-700'
                          }`}
                      >
                        {user.role === 'admin' ? 'Admin' : 'User'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-600">{user.orderCount || 0}</span>
                    </td>
                    <td className="p-4">
                      <span className="text-gray-600">{user.loyaltyPoints || 0}</span>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 whitespace-nowrap rounded-full text-xs font-medium ${user.isActive !== false
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                          }`}
                      >
                        {user.isActive !== false ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-600">
                      {formatDate(user.createdAt, { day: '2-digit', month: '2-digit', year: 'numeric' })}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowRoleModal(true);
                          }}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Đổi vai trò"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        {user.isActive !== false ? (
                          <button
                            onClick={() => handleToggleActive(user)}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Khóa tài khoản"
                          >
                            <FiUserX size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleActive(user)}
                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Mở khóa tài khoản"
                          >
                            <FiUserCheck size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteModal(true);
                          }}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa người dùng"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Role Update Modal */}
      <Modal
        open={showRoleModal && !!selectedUser}
        onClose={() => { setShowRoleModal(false); setSelectedUser(null); }}
        title="Đổi vai trò người dùng"
        subtitle={selectedUser ? `Thay đổi quyền cho ${selectedUser.name}` : ''}
        size="sm"
        footer={
          <div className="flex justify-end gap-3">
            <button
              onClick={() => { setShowRoleModal(false); setSelectedUser(null); }}
              className="px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 font-medium"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                const newRole = selectedUser?.role === 'admin' ? 'user' : 'admin';
                handleUpdateRole(newRole);
              }}
              disabled={actionLoading}
              className="px-4 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 font-medium"
            >
              {actionLoading && <FiLoader className="animate-spin" />}
              Xác nhận
            </button>
          </div>
        }
      >
        {selectedUser && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="text-sm text-gray-500">Người dùng</p>
              <p className="font-medium text-gray-900">{selectedUser.name}</p>
              <p className="text-sm text-gray-500">{selectedUser.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Chọn vai trò mới:</p>
              <div className="space-y-2">
                <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedUser.role !== 'admin' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={selectedUser.role !== 'admin'}
                    onChange={() => { }}
                    className="w-4 h-4 text-blue-600"
                  />
                  <div>
                    <span className="font-medium">Người dùng</span>
                    <p className="text-sm text-gray-500">Quyền cơ bản, mua sắm và quản lý đơn hàng</p>
                  </div>
                </label>
                <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedUser.role === 'admin' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-gray-300'
                  }`}>
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={selectedUser.role === 'admin'}
                    onChange={() => { }}
                    className="w-4 h-4 text-purple-600"
                  />
                  <div>
                    <span className="font-medium">Quản trị viên</span>
                    <p className="text-sm text-gray-500">Toàn quyền quản lý hệ thống</p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        open={showDeleteModal && !!selectedUser}
        onClose={() => { setShowDeleteModal(false); setSelectedUser(null); }}
        onConfirm={handleDeleteUser}
        title="Xóa người dùng"
        message={
          selectedUser
            ? `Bạn có chắc chắn muốn xóa người dùng "${selectedUser.name}" (${selectedUser.email})? Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.`
            : ''
        }
        type="danger"
        confirmText="Xóa người dùng"
        cancelText="Hủy"
        loading={actionLoading}
      />
    </div>
  );
};

export default AdminUsersPage;
