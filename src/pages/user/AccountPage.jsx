import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks';
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit2,
  FiLoader,
  FiX,
  FiPlus,
  FiTrash2,
  FiCheck,
  FiCamera,
  FiShoppingBag,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiClock,
  FiAward,
  FiStar,
  FiLock,
  FiCalendar,
  FiHeart,
  FiSettings,
  FiChevronRight,
  FiGift
} from 'react-icons/fi';
import { userService } from '../../services/userService';
import { addressService } from '../../services/addressService';
import { orderService } from '../../services/orderService';
import { toast } from 'react-toastify';

const AccountPage = () => {
  const { user: authUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const abortControllerRef = useRef(null);
  const fileInputRef = useRef(null);

  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [orderStats, setOrderStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipping: 0,
    delivered: 0
  });
  const [loadingStats, setLoadingStats] = useState(true);

  // Modal states
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  // Form states
  const [profileForm, setProfileForm] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    ward: '',
    district: '',
    city: '',
    isDefault: false
  });

  // Default form values
  const defaultProfileForm = {
    name: '',
    email: '',
    phone: ''
  };

  const defaultAddressForm = {
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    ward: '',
    district: '',
    city: '',
    isDefault: false
  };

  // Fetch user profile
  const fetchProfile = async (signal) => {
    try {
      setLoading(true);
      const response = await userService.getProfile();

      // Check if request was aborted
      if (signal?.aborted) return;

      if (response.success) {
        setUser(response.user);
        setProfileForm({
          name: response.user.name || '',
          email: response.user.email || '',
          phone: response.user.phone || ''
        });
      }
    } catch (error) {
      // Don't show error if request was aborted
      if (signal?.aborted) return;

      console.error('Error fetching profile:', error);
      toast.error('Lỗi khi tải thông tin tài khoản');
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  // Fetch addresses
  const fetchAddresses = async (signal) => {
    try {
      const response = await addressService.getAddresses();

      // Check if request was aborted
      if (signal?.aborted) return;

      if (response.success) {
        setAddresses(response.addresses || []);
      }
    } catch (error) {
      // Don't show error if request was aborted
      if (signal?.aborted) return;

      console.error('Error fetching addresses:', error);
      toast.error('Lỗi khi tải danh sách địa chỉ');
    }
  };

  // Fetch order statistics
  const fetchOrderStats = async (signal) => {
    try {
      setLoadingStats(true);
      const response = await orderService.getMyOrders({ limit: 100 });

      if (signal?.aborted) return;

      if (response.success && response.orders) {
        const orders = response.orders;
        const stats = {
          total: orders.length,
          pending: orders.filter(o => o.status === 'pending').length,
          processing: orders.filter(o => o.status === 'processing' || o.status === 'confirmed').length,
          shipping: orders.filter(o => o.status === 'shipping').length,
          delivered: orders.filter(o => o.status === 'delivered').length
        };
        setOrderStats(stats);
      }
    } catch (error) {
      if (signal?.aborted) return;
      console.error('Error fetching order stats:', error);
    } finally {
      if (!signal?.aborted) {
        setLoadingStats(false);
      }
    }
  };

  // Main useEffect with authUser dependency and cleanup
  useEffect(() => {
    // Create abort controller for this effect
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    // CRITICAL: Immediate reset if user logs out
    if (!authUser) {
      setUser(null);
      setAddresses([]);
      setProfileForm(defaultProfileForm);
      setAddressForm(defaultAddressForm);
      setEditingAddress(null);
      setShowEditProfile(false);
      setShowChangePassword(false);
      setShowAddressModal(false);
      setLoading(false);

      // Redirect to login if not authenticated and not loading
      if (!isAuthenticated) {
        navigate('/login', { replace: true });
      }
      return;
    }

    // Only fetch data if user is authenticated
    if (authUser && isAuthenticated) {
      fetchProfile(signal);
      fetchAddresses(signal);
      fetchOrderStats(signal);
    }

    // Cleanup function: Cancel pending requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [authUser, isAuthenticated, navigate]);

  // Upload avatar
  const handleUploadAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước ảnh không được vượt quá 5MB');
      return;
    }

    try {
      setUploadingAvatar(true);
      const response = await userService.uploadAvatar(file);
      if (response.success) {
        toast.success('Cập nhật ảnh đại diện thành công');
        fetchProfile(abortControllerRef.current?.signal);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi upload ảnh');
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  };

  // Update profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const response = await userService.updateProfile(profileForm);
      if (response.success) {
        toast.success('Cập nhật thông tin thành công');
        setShowEditProfile(false);
        fetchProfile(abortControllerRef.current?.signal);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi cập nhật thông tin');
    }
  };

  // Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Mật khẩu mới không khớp');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    try {
      const response = await userService.changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      if (response.success) {
        toast.success('Đổi mật khẩu thành công');
        setShowChangePassword(false);
        setPasswordForm({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi đổi mật khẩu');
    }
  };

  // Open address modal for editing
  const openEditAddress = (address) => {
    if (!address) return;
    setEditingAddress(address);
    setAddressForm({
      name: address.name || '',
      phone: address.phone || '',
      addressLine1: address.addressLine1 || address.address || '',
      addressLine2: address.addressLine2 || '',
      ward: address.ward || '',
      district: address.district || '',
      city: address.city || '',
      isDefault: address.isDefault || false
    });
    setShowAddressModal(true);
  };

  // Reset address form when modal closes
  const handleCloseAddressModal = () => {
    setShowAddressModal(false);
    // Small delay to ensure form resets after modal closes
    setTimeout(() => {
      setEditingAddress(null);
      setAddressForm(defaultAddressForm);
    }, 100);
  };

  // Open address modal for creating - Ensure complete reset
  const openCreateAddress = () => {
    setEditingAddress(null);
    setAddressForm(defaultAddressForm);
    setShowAddressModal(true);
  };

  // Save address (create or update)
  const handleSaveAddress = async (e) => {
    e.preventDefault();

    if (!addressForm.name || !addressForm.phone || !addressForm.addressLine1 || !addressForm.city) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      if (editingAddress) {
        const response = await addressService.updateAddress(editingAddress._id, addressForm);
        if (response.success) {
          toast.success('Cập nhật địa chỉ thành công');
          handleCloseAddressModal();
          fetchAddresses(abortControllerRef.current?.signal);
        }
      } else {
        const response = await addressService.createAddress(addressForm);
        if (response.success) {
          toast.success('Thêm địa chỉ thành công');
          handleCloseAddressModal();
          fetchAddresses(abortControllerRef.current?.signal);
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi lưu địa chỉ');
    }
  };

  // Delete address
  const handleDeleteAddress = async (id) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa địa chỉ này?')) {
      return;
    }

    try {
      const response = await addressService.deleteAddress(id);
      if (response.success) {
        toast.success('Xóa địa chỉ thành công');
        fetchAddresses(abortControllerRef.current?.signal);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi xóa địa chỉ');
    }
  };

  // Set default address
  const handleSetDefaultAddress = async (id) => {
    try {
      const response = await addressService.setDefaultAddress(id);
      if (response.success) {
        toast.success('Đã đặt làm địa chỉ mặc định');
        fetchAddresses(abortControllerRef.current?.signal);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Lỗi khi đặt địa chỉ mặc định');
    }
  };

  // Get member tier info
  const getMemberTierInfo = () => {
    const tier = user?.tier || 'bronze';
    const tiers = {
      bronze: {
        name: 'Bronze',
        color: 'from-amber-600 to-amber-800',
        bgColor: 'bg-gradient-to-r from-amber-100 to-amber-200',
        textColor: 'text-amber-800',
        icon: '🥉',
        nextTier: 'Silver',
        pointsNeeded: 1000
      },
      silver: {
        name: 'Silver',
        color: 'from-gray-400 to-gray-600',
        bgColor: 'bg-gradient-to-r from-gray-100 to-gray-200',
        textColor: 'text-gray-700',
        icon: '🥈',
        nextTier: 'Gold',
        pointsNeeded: 5000
      },
      gold: {
        name: 'Gold',
        color: 'from-yellow-400 to-yellow-600',
        bgColor: 'bg-gradient-to-r from-yellow-100 to-yellow-200',
        textColor: 'text-yellow-700',
        icon: '🥇',
        nextTier: 'Diamond',
        pointsNeeded: 20000
      },
      diamond: {
        name: 'Diamond',
        color: 'from-cyan-400 to-blue-500',
        bgColor: 'bg-gradient-to-r from-cyan-100 to-blue-100',
        textColor: 'text-blue-700',
        icon: '💎',
        nextTier: null,
        pointsNeeded: null
      }
    };
    return tiers[tier] || tiers.bronze;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Protected route: Redirect if not authenticated
  if (!isAuthenticated && !loading) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container-custom max-w-6xl py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <FiLoader className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-500">Đang tải thông tin tài khoản...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const tierInfo = getMemberTierInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container-custom max-w-6xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tài khoản của tôi
          </h1>
          <p className="text-gray-500 mt-1">Quản lý thông tin cá nhân và đơn hàng</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card with Avatar */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Header Gradient */}
              <div className={`h-24 bg-gradient-to-r ${tierInfo.color} relative`}>
                <div className="absolute inset-0 bg-black/10"></div>
              </div>

              {/* Avatar Section */}
              <div className="px-6 pb-6 -mt-12 relative">
                <div className="relative inline-block">
                  <div
                    className="w-24 h-24 rounded-full border-4 border-white bg-blue-100 flex items-center justify-center overflow-hidden shadow-lg cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl text-blue-600 font-bold">
                        {user?.name?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    )}

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
                      {uploadingAvatar ? (
                        <FiLoader className="w-6 h-6 animate-spin text-white" />
                      ) : (
                        <FiCamera className="w-6 h-6 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Camera Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
                  >
                    {uploadingAvatar ? (
                      <FiLoader className="w-4 h-4 text-white animate-spin" />
                    ) : (
                      <FiCamera className="w-4 h-4 text-white" />
                    )}
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleUploadAvatar}
                    className="hidden"
                    disabled={uploadingAvatar}
                  />
                </div>

                <div className="mt-4">
                  <h2 className="text-xl font-bold text-gray-800">{user?.name || 'Người dùng'}</h2>
                  <p className="text-gray-500 text-sm">{user?.email || 'email@example.com'}</p>

                  {/* Member Tier Badge */}
                  <div className={`inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full ${tierInfo.bgColor}`}>
                    <span className="text-lg">{tierInfo.icon}</span>
                    <span className={`font-semibold ${tierInfo.textColor}`}>
                      Thành viên {tierInfo.name}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Member Stats Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <FiAward className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Điểm thưởng</h3>
                  <p className="text-xs text-gray-500">Tích lũy từ đơn hàng</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-bold text-purple-600">
                    {(user?.loyaltyPoints || 0).toLocaleString('vi-VN')}
                  </span>
                  <span className="text-gray-500 mb-1">điểm</span>
                </div>

                {tierInfo.nextTier && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Tiến độ lên {tierInfo.nextTier}</span>
                      <span>{Math.min(100, Math.round(((user?.loyaltyPoints || 0) / tierInfo.pointsNeeded) * 100))}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, ((user?.loyaltyPoints || 0) / tierInfo.pointsNeeded) * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Còn {Math.max(0, tierInfo.pointsNeeded - (user?.loyaltyPoints || 0)).toLocaleString('vi-VN')} điểm để lên hạng
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
                <FiCalendar className="w-4 h-4" />
                <span>Thành viên từ: {formatDate(user?.createdAt)}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4">Truy cập nhanh</h3>
              <div className="space-y-2">
                <Link
                  to="/orders"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-blue-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                      <FiShoppingBag className="w-5 h-5 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-700">Đơn hàng của tôi</span>
                  </div>
                  <FiChevronRight className="w-5 h-5 text-gray-400" />
                </Link>

                <Link
                  to="/wishlist"
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-pink-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center group-hover:bg-pink-200 transition-colors">
                      <FiHeart className="w-5 h-5 text-pink-600" />
                    </div>
                    <span className="font-medium text-gray-700">Yêu thích</span>
                  </div>
                  <FiChevronRight className="w-5 h-5 text-gray-400" />
                </Link>

                <button
                  onClick={() => setShowChangePassword(true)}
                  className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                      <FiLock className="w-5 h-5 text-gray-600" />
                    </div>
                    <span className="font-medium text-gray-700">Đổi mật khẩu</span>
                  </div>
                  <FiChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Info Cards */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800 text-lg">Tổng quan đơn hàng</h3>
                <Link to="/orders" className="text-blue-600 text-sm font-medium hover:text-blue-700">
                  Xem tất cả
                </Link>
              </div>

              {loadingStats ? (
                <div className="flex justify-center py-8">
                  <FiLoader className="w-8 h-8 animate-spin text-blue-500" />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FiShoppingBag className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{orderStats.total}</p>
                    <p className="text-xs text-gray-500 mt-1">Tổng đơn</p>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 text-center">
                    <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FiClock className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-yellow-600">{orderStats.pending}</p>
                    <p className="text-xs text-gray-500 mt-1">Chờ xác nhận</p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-4 text-center">
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FiPackage className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-orange-600">{orderStats.processing}</p>
                    <p className="text-xs text-gray-500 mt-1">Đang xử lý</p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 text-center">
                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FiTruck className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-purple-600">{orderStats.shipping}</p>
                    <p className="text-xs text-gray-500 mt-1">Đang giao</p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 text-center">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <FiCheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <p className="text-2xl font-bold text-green-600">{orderStats.delivered}</p>
                    <p className="text-xs text-gray-500 mt-1">Hoàn thành</p>
                  </div>
                </div>
              )}
            </div>

            {/* Personal Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <FiUser className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">Thông tin cá nhân</h3>
                </div>
                <button
                  onClick={() => setShowEditProfile(true)}
                  className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <FiEdit2 size={14} />
                  Chỉnh sửa
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <FiUser className="text-gray-500 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Họ và tên</p>
                    <p className="font-semibold text-gray-800">{user?.name || 'Chưa cập nhật'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <FiMail className="text-gray-500 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-semibold text-gray-800">{user?.email || 'Chưa cập nhật'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <FiPhone className="text-gray-500 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-semibold text-gray-800">{user?.phone || 'Chưa cập nhật'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <FiCalendar className="text-gray-500 w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Ngày tham gia</p>
                    <p className="font-semibold text-gray-800">{formatDate(user?.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                    <FiMapPin className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg">Địa chỉ giao hàng</h3>
                </div>
                <button
                  onClick={openCreateAddress}
                  className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <FiPlus size={14} />
                  Thêm mới
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FiMapPin className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500 mb-4">Chưa có địa chỉ nào được lưu</p>
                  <button
                    onClick={openCreateAddress}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl"
                  >
                    <FiPlus />
                    Thêm địa chỉ đầu tiên
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      className={`flex items-start gap-4 p-5 border-2 rounded-xl transition-all ${address.isDefault
                          ? 'border-blue-300 bg-blue-50/50'
                          : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
                        }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${address.isDefault ? 'bg-blue-500' : 'bg-gray-200'
                        }`}>
                        <FiMapPin className={address.isDefault ? 'text-white' : 'text-gray-500'} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <p className="font-semibold text-gray-800">{address.name}</p>
                          <span className="text-gray-400">|</span>
                          <p className="text-gray-600">{address.phone}</p>
                          {address.isDefault && (
                            <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {[
                            address.addressLine1 || address.address,
                            address.addressLine2,
                            address.ward,
                            address.district,
                            address.city
                          ].filter(Boolean).join(', ')}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefaultAddress(address._id)}
                            className="p-2.5 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Đặt làm mặc định"
                          >
                            <FiCheck className="w-5 h-5" />
                          </button>
                        )}
                        <button
                          onClick={() => openEditAddress(address)}
                          className="p-2.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <FiEdit2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address._id)}
                          className="p-2.5 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Security */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                  <FiLock className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg">Bảo mật tài khoản</h3>
              </div>

              <button
                onClick={() => setShowChangePassword(true)}
                className="w-full text-left p-5 border-2 border-gray-100 rounded-xl hover:bg-gray-50 hover:border-blue-200 flex justify-between items-center transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <FiLock className="w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">Đổi mật khẩu</p>
                    <p className="text-sm text-gray-500">Cập nhật mật khẩu thường xuyên để bảo vệ tài khoản</p>
                  </div>
                </div>
                <FiChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-blue-600 to-cyan-600 rounded-t-2xl">
              <h2 className="text-xl font-bold text-white">Chỉnh sửa thông tin</h2>
              <button
                onClick={() => setShowEditProfile(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-red-500 to-pink-500 rounded-t-2xl">
              <h2 className="text-xl font-bold text-white">Đổi mật khẩu</h2>
              <button
                onClick={() => setShowChangePassword(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  required
                  minLength={6}
                />
                <p className="text-xs text-gray-500 mt-1">Tối thiểu 6 ký tự</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                  required
                  minLength={6}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  Đổi mật khẩu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-gradient-to-r from-green-500 to-emerald-500 rounded-t-2xl sticky top-0">
              <h2 className="text-xl font-bold text-white">
                {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
              </h2>
              <button
                onClick={handleCloseAddressModal}
                className="text-white/80 hover:text-white transition-colors"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addressForm.name}
                    onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addressForm.addressLine1}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                  placeholder="Số nhà, tên đường"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Địa chỉ phụ (tùy chọn)
                </label>
                <input
                  type="text"
                  value={addressForm.addressLine2}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                  placeholder="Tầng, căn hộ, tòa nhà..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phường/Xã
                  </label>
                  <input
                    type="text"
                    value={addressForm.ward}
                    onChange={(e) => setAddressForm({ ...addressForm, ward: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quận/Huyện
                  </label>
                  <input
                    type="text"
                    value={addressForm.district}
                    onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tỉnh/Thành phố <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                />
                <label htmlFor="isDefault" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Đặt làm địa chỉ giao hàng mặc định
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseAddressModal}
                  className="px-6 py-3 border-2 border-gray-200 rounded-xl hover:bg-gray-50 font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl hover:from-green-600 hover:to-emerald-600 font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  {editingAddress ? 'Cập nhật' : 'Thêm địa chỉ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
