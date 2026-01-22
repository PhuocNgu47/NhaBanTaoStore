import { useState, useEffect, useMemo } from 'react';
import {
  FiUsers,
  FiStar,
  FiDollarSign,
  FiSearch,
  FiFilter,
  FiEdit2,
  FiLoader,
  FiAward,
  FiTrendingUp,
  FiPlus,
  FiMinus,
  FiX,
  FiGift,
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiShoppingBag,
  FiEye,
} from 'react-icons/fi';
import { userService } from '../../services/userService';
import { formatPrice, formatDate } from '../../utils/helpers';
import { toast } from 'react-toastify';

// Tier colors and names
const TIERS = {
  bronze: { name: 'Bronze', color: 'bg-amber-100 text-amber-700', icon: '🥉', min: 0 },
  silver: { name: 'Silver', color: 'bg-gray-200 text-gray-700', icon: '🥈', min: 10000000 },
  gold: { name: 'Gold', color: 'bg-yellow-100 text-yellow-700', icon: '🥇', min: 20000000 },
  platinum: { name: 'Platinum', color: 'bg-blue-100 text-blue-700', icon: '💎', min: 50000000 },
  diamond: { name: 'Diamond', color: 'bg-purple-100 text-purple-700', icon: '👑', min: 100000000 },
};

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState('all');
  const [sortBy, setSortBy] = useState('totalSpent');
  
  // Modal states
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [pointsAction, setPointsAction] = useState({ amount: '', type: 'earn', description: '' });
  const [submitting, setSubmitting] = useState(false);

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const [usersRes, statsRes] = await Promise.all([
        userService.getAllUsers(),
        userService.getCustomerStats()
      ]);
      
      // Filter to only customers (role = user)
      const customersList = (usersRes.data || usersRes).filter(u => u.role === 'user');
      setCustomers(customersList);
      
      if (statsRes.success) {
        setStats(statsRes.stats);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast.error('Lỗi khi tải danh sách khách hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Filter and sort customers
  const filteredCustomers = useMemo(() => {
    let result = customers.filter(customer => {
      const matchesSearch = 
        customer.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone?.includes(searchQuery);
      
      const matchesTier = tierFilter === 'all' || (customer.tier || 'bronze') === tierFilter;
      
      return matchesSearch && matchesTier;
    });

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'totalSpent') return (b.totalSpent || 0) - (a.totalSpent || 0);
      if (sortBy === 'loyaltyPoints') return (b.loyaltyPoints || 0) - (a.loyaltyPoints || 0);
      if (sortBy === 'orderCount') return (b.orderCount || 0) - (a.orderCount || 0);
      if (sortBy === 'createdAt') return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

    return result;
  }, [customers, searchQuery, tierFilter, sortBy]);

  // Open points modal
  const openPointsModal = (customer) => {
    setSelectedCustomer(customer);
    setPointsAction({ amount: '', type: 'earn', description: '' });
    setShowPointsModal(true);
  };

  // Open detail modal
  const openDetailModal = (customer) => {
    setSelectedCustomer(customer);
    setShowDetailModal(true);
  };

  // Handle points update
  const handleUpdatePoints = async () => {
    if (!pointsAction.amount || pointsAction.amount <= 0) {
      toast.error('Vui lòng nhập số điểm hợp lệ');
      return;
    }

    try {
      setSubmitting(true);
      await userService.updateLoyaltyPoints(selectedCustomer._id, {
        amount: parseInt(pointsAction.amount),
        type: pointsAction.type,
        description: pointsAction.description || (pointsAction.type === 'earn' ? 'Cộng điểm thủ công' : 'Trừ điểm thủ công')
      });
      
      toast.success(pointsAction.type === 'earn' ? 'Đã cộng điểm thành công' : 'Đã trừ điểm thành công');
      setShowPointsModal(false);
      fetchCustomers();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi cập nhật điểm');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle tier update
  const handleUpdateTier = async (customerId, newTier) => {
    try {
      await userService.updateCustomerTier(customerId, { tier: newTier });
      toast.success('Đã cập nhật hạng thành viên');
      fetchCustomers();
    } catch (error) {
      toast.error('Lỗi khi cập nhật hạng thành viên');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Quản lý khách hàng</h1>
          <p className="text-gray-500 text-sm">Loyalty & Customer Management</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiUsers className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800">{stats?.totalCustomers || 0}</p>
              <p className="text-sm text-gray-500">Tổng KH</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <FiDollarSign className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xl font-bold text-green-600">{formatPrice(stats?.totalSpent || 0)}</p>
              <p className="text-sm text-gray-500">Tổng chi tiêu</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiStar className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-yellow-600">{(stats?.totalPoints || 0).toLocaleString()}</p>
              <p className="text-sm text-gray-500">Tổng điểm</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiAward className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{stats?.tierDistribution?.gold + stats?.tierDistribution?.platinum + stats?.tierDistribution?.diamond || 0}</p>
              <p className="text-sm text-gray-500">VIP</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-pink-100 rounded-lg">
              <FiTrendingUp className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-pink-600">{stats?.activeCustomers || 0}</p>
              <p className="text-sm text-gray-500">Hoạt động</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tier Distribution */}
      {stats?.tierDistribution && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h3 className="font-bold text-gray-800 mb-4">Phân bổ hạng thành viên</h3>
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(TIERS).map(([key, tier]) => (
              <div key={key} className={`p-4 rounded-lg ${tier.color}`}>
                <div className="text-center">
                  <span className="text-3xl">{tier.icon}</span>
                  <p className="font-bold text-xl mt-2">{stats.tierDistribution[key] || 0}</p>
                  <p className="text-sm">{tier.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm flex flex-wrap gap-4">
        <div className="flex-1 min-w-64">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        <select
          value={tierFilter}
          onChange={(e) => setTierFilter(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả hạng</option>
          {Object.entries(TIERS).map(([key, tier]) => (
            <option key={key} value={key}>{tier.icon} {tier.name}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="totalSpent">Sắp xếp: Chi tiêu</option>
          <option value="loyaltyPoints">Sắp xếp: Điểm</option>
          <option value="orderCount">Sắp xếp: Đơn hàng</option>
          <option value="createdAt">Sắp xếp: Mới nhất</option>
        </select>
      </div>

      {/* Customers List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <FiLoader className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : filteredCustomers.length === 0 ? (
          <div className="text-center py-12">
            <FiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Không tìm thấy khách hàng</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left text-sm text-gray-500 border-b">
                  <th className="p-4 font-medium">Khách hàng</th>
                  <th className="p-4 font-medium">Liên hệ</th>
                  <th className="p-4 font-medium text-center">Hạng</th>
                  <th className="p-4 font-medium text-right">Điểm</th>
                  <th className="p-4 font-medium text-right">Chi tiêu</th>
                  <th className="p-4 font-medium text-center">Đơn hàng</th>
                  <th className="p-4 font-medium">Ngày tham gia</th>
                  <th className="p-4 font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => {
                  const tierInfo = TIERS[customer.tier || 'bronze'];
                  
                  return (
                    <tr key={customer._id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {customer.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{customer.name}</p>
                            <p className="text-xs text-gray-500">ID: {customer._id.slice(-6)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm text-gray-600">{customer.email}</p>
                        {customer.phone && (
                          <p className="text-xs text-gray-500">{customer.phone}</p>
                        )}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${tierInfo.color}`}>
                          <span>{tierInfo.icon}</span>
                          {tierInfo.name}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-bold text-yellow-600">
                          {(customer.loyaltyPoints || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <span className="font-medium text-green-600">
                          {formatPrice(customer.totalSpent || 0)}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <span className="font-medium">{customer.orderCount || 0}</span>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-500">
                          {formatDate(customer.createdAt, { hour: undefined, minute: undefined })}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => openDetailModal(customer)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Xem chi tiết"
                          >
                            <FiEye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openPointsModal(customer)}
                            className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg"
                            title="Quản lý điểm"
                          >
                            <FiGift className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Points Modal */}
      {showPointsModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Quản lý điểm</h2>
                <button
                  onClick={() => setShowPointsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Khách hàng: <strong>{selectedCustomer.name}</strong>
              </p>
              <p className="text-sm text-gray-500">
                Điểm hiện tại: <strong className="text-yellow-600">{(selectedCustomer.loyaltyPoints || 0).toLocaleString()}</strong>
              </p>
            </div>

            <div className="p-6 space-y-4">
              {/* Action Type */}
              <div className="flex gap-2">
                <button
                  onClick={() => setPointsAction({ ...pointsAction, type: 'earn' })}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 ${
                    pointsAction.type === 'earn' 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <FiPlus className="w-5 h-5" />
                  Cộng điểm
                </button>
                <button
                  onClick={() => setPointsAction({ ...pointsAction, type: 'redeem' })}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 ${
                    pointsAction.type === 'redeem' 
                      ? 'border-red-500 bg-red-50 text-red-700' 
                      : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <FiMinus className="w-5 h-5" />
                  Trừ điểm
                </button>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điểm
                </label>
                <input
                  type="number"
                  value={pointsAction.amount}
                  onChange={(e) => setPointsAction({ ...pointsAction, amount: e.target.value })}
                  placeholder="Nhập số điểm..."
                  min="1"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ghi chú
                </label>
                <input
                  type="text"
                  value={pointsAction.description}
                  onChange={(e) => setPointsAction({ ...pointsAction, description: e.target.value })}
                  placeholder="VD: Thưởng sinh nhật, Đổi quà..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Preview */}
              {pointsAction.amount && (
                <div className={`p-4 rounded-lg ${pointsAction.type === 'earn' ? 'bg-green-50' : 'bg-red-50'}`}>
                  <p className="text-sm">
                    Điểm sau khi {pointsAction.type === 'earn' ? 'cộng' : 'trừ'}:{' '}
                    <strong className={pointsAction.type === 'earn' ? 'text-green-600' : 'text-red-600'}>
                      {(
                        (selectedCustomer.loyaltyPoints || 0) + 
                        (pointsAction.type === 'earn' ? 1 : -1) * parseInt(pointsAction.amount || 0)
                      ).toLocaleString()}
                    </strong>
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowPointsModal(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdatePoints}
                  disabled={submitting || !pointsAction.amount}
                  className={`px-6 py-2 text-white rounded-lg flex items-center gap-2 disabled:opacity-50 ${
                    pointsAction.type === 'earn' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {submitting && <FiLoader className="animate-spin" />}
                  {pointsAction.type === 'earn' ? 'Cộng điểm' : 'Trừ điểm'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {showDetailModal && selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Chi tiết khách hàng</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                  {selectedCustomer.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-800">{selectedCustomer.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${TIERS[selectedCustomer.tier || 'bronze'].color}`}>
                      {TIERS[selectedCustomer.tier || 'bronze'].icon} {TIERS[selectedCustomer.tier || 'bronze'].name}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${selectedCustomer.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {selectedCustomer.isActive ? 'Hoạt động' : 'Vô hiệu'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-yellow-600">
                    {(selectedCustomer.loyaltyPoints || 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">điểm tích lũy</p>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiMail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-medium text-gray-800">{selectedCustomer.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiPhone className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Điện thoại</p>
                    <p className="font-medium text-gray-800">{selectedCustomer.phone || 'Chưa cập nhật'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiCalendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Ngày tham gia</p>
                    <p className="font-medium text-gray-800">{formatDate(selectedCustomer.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FiCalendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-xs text-gray-500">Đăng nhập cuối</p>
                    <p className="font-medium text-gray-800">
                      {selectedCustomer.lastLogin ? formatDate(selectedCustomer.lastLogin) : 'Chưa có'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Purchase Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <FiDollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <p className="text-xl font-bold text-green-600">{formatPrice(selectedCustomer.totalSpent || 0)}</p>
                  <p className="text-sm text-green-700">Tổng chi tiêu</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <FiShoppingBag className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-xl font-bold text-blue-600">{selectedCustomer.orderCount || 0}</p>
                  <p className="text-sm text-blue-700">Đơn hàng</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg text-center">
                  <FiStar className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <p className="text-xl font-bold text-yellow-600">
                    {selectedCustomer.orderCount > 0 
                      ? formatPrice(Math.round((selectedCustomer.totalSpent || 0) / selectedCustomer.orderCount))
                      : '0₫'
                    }
                  </p>
                  <p className="text-sm text-yellow-700">TB/đơn</p>
                </div>
              </div>

              {/* Tier Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cập nhật hạng thành viên
                </label>
                <div className="flex gap-2 flex-wrap">
                  {Object.entries(TIERS).map(([key, tier]) => (
                    <button
                      key={key}
                      onClick={() => handleUpdateTier(selectedCustomer._id, key)}
                      className={`px-4 py-2 rounded-lg border-2 ${
                        (selectedCustomer.tier || 'bronze') === key 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <span className="mr-1">{tier.icon}</span>
                      {tier.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Points History */}
              {selectedCustomer.pointsHistory && selectedCustomer.pointsHistory.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Lịch sử điểm</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedCustomer.pointsHistory.slice().reverse().slice(0, 10).map((history, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            history.type === 'earn' || history.type === 'bonus' 
                              ? 'bg-green-100 text-green-600' 
                              : 'bg-red-100 text-red-600'
                          }`}>
                            {history.type === 'earn' || history.type === 'bonus' ? <FiPlus /> : <FiMinus />}
                          </span>
                          <div>
                            <p className="font-medium text-gray-800">{history.description}</p>
                            <p className="text-xs text-gray-500">{formatDate(history.createdAt)}</p>
                          </div>
                        </div>
                        <span className={`font-bold ${
                          history.type === 'earn' || history.type === 'bonus' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {history.type === 'earn' || history.type === 'bonus' ? '+' : '-'}{history.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersPage;
