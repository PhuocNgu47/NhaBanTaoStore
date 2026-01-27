import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  FiCheck
} from 'react-icons/fi';
import { userService } from '../../services/userService';
import { addressService } from '../../services/addressService';
import { toast } from 'react-toastify';

const AccountPage = () => {
  const { user: authUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const abortControllerRef = useRef(null);
  
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

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

  // Get default address
  const defaultAddress = addresses.find(addr => addr.isDefault) || addresses[0];

  // Protected route: Redirect if not authenticated
  if (!isAuthenticated && !loading) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <div className="py-8">
        <div className="container-custom max-w-4xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <FiLoader className="w-12 h-12 animate-spin text-blue-500" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container-custom max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Tài khoản của tôi</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="relative w-24 h-24 bg-blue-100 rounded-full mx-auto flex items-center justify-center mb-4 overflow-hidden shrink-0">
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
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <FiLoader className="w-6 h-6 animate-spin text-white" />
                  </div>
                )}
              </div>
              <h2 className="font-bold text-gray-800">{user?.name || 'Người dùng'}</h2>
              <p className="text-gray-500 text-sm">{user?.email || 'email@example.com'}</p>
              <label className="mt-4 text-blue-600 text-sm font-medium flex items-center gap-1 mx-auto cursor-pointer hover:text-blue-700">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleUploadAvatar}
                  className="hidden"
                  disabled={uploadingAvatar}
                />
                <FiEdit2 size={14} />
                {uploadingAvatar ? 'Đang tải...' : 'Chỉnh sửa ảnh'}
              </label>
            </div>
          </div>

          {/* Info Cards */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal Info */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Thông tin cá nhân</h3>
                <button 
                  onClick={() => setShowEditProfile(true)}
                  className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700"
                >
                  <FiEdit2 size={14} />
                  Chỉnh sửa
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <FiUser className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Họ và tên</p>
                    <p className="font-medium">{user?.name || 'Chưa cập nhật'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <FiMail className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user?.email || 'Chưa cập nhật'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <FiPhone className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số điện thoại</p>
                    <p className="font-medium">{user?.phone || 'Chưa cập nhật'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800">Địa chỉ giao hàng</h3>
                <button 
                  onClick={openCreateAddress}
                  className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:text-blue-700"
                >
                  <FiPlus size={14} />
                  Thêm địa chỉ
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FiMapPin className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Chưa có địa chỉ nào</p>
                  <button
                    onClick={openCreateAddress}
                    className="mt-4 text-blue-600 hover:underline"
                  >
                    Thêm địa chỉ đầu tiên
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div 
                      key={address._id}
                      className="flex items-start gap-3 p-4 border rounded-lg hover:border-blue-300 transition-colors"
                    >
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                        <FiMapPin className="text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{address.name}</p>
                          {address.isDefault && (
                            <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded">
                              Mặc định
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm">{address.phone}</p>
                        <p className="text-gray-600 text-sm">
                          {[
                            address.addressLine1 || address.address,
                            address.addressLine2,
                            address.ward,
                            address.district,
                            address.city
                          ].filter(Boolean).join(', ')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefaultAddress(address._id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="Đặt làm mặc định"
                          >
                            <FiCheck />
                          </button>
                        )}
                        <button
                          onClick={() => openEditAddress(address)}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded"
                          title="Chỉnh sửa"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDeleteAddress(address._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Xóa"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Security */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4">Bảo mật</h3>
              
              <button 
                onClick={() => setShowChangePassword(true)}
                className="w-full text-left p-4 border rounded-lg hover:bg-gray-50 flex justify-between items-center"
              >
                <span>Đổi mật khẩu</span>
                <span className="text-gray-400">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Chỉnh sửa thông tin</h2>
              <button
                onClick={() => setShowEditProfile(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điện thoại
                </label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditProfile(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Đổi mật khẩu</h2>
              <button
                onClick={() => setShowChangePassword(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu hiện tại
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  minLength={6}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowChangePassword(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-800">
                {editingAddress ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
              </h2>
              <button
                onClick={handleCloseAddressModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addressForm.name}
                    onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={addressForm.addressLine1}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
                  placeholder="Số nhà, tên đường"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ phụ (tùy chọn)
                </label>
                <input
                  type="text"
                  value={addressForm.addressLine2}
                  onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
                  placeholder="Tầng, căn hộ, tòa nhà..."
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phường/Xã
                  </label>
                  <input
                    type="text"
                    value={addressForm.ward}
                    onChange={(e) => setAddressForm({ ...addressForm, ward: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quận/Huyện
                  </label>
                  <input
                    type="text"
                    value={addressForm.district}
                    onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tỉnh/Thành phố <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isDefault"
                  checked={addressForm.isDefault}
                  onChange={(e) => setAddressForm({ ...addressForm, isDefault: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="isDefault" className="text-sm text-gray-700">
                  Đặt làm địa chỉ mặc định
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseAddressModal}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
