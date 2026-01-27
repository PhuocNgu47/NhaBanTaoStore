import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FiSave, FiLoader, FiGlobe, FiTruck, FiCreditCard, FiDollarSign, FiShare2 } from 'react-icons/fi';
import settingsService from '../../services/settingsService';

const AdminSettingsPage = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');

  // State cho các cài đặt
  const [settings, setSettings] = useState({
    // Cài đặt chung
    siteName: '',
    siteDescription: '',
    email: '',
    phone: '',
    hotline: '',
    address: '',
    maintenanceMode: false,

    // Social media
    facebook: '',
    instagram: '',
    youtube: '',
    tiktok: '',
    zalo: '',

    // Vận chuyển
    freeShipThreshold: 300000,
    defaultShippingFee: 30000,

    // Thanh toán
    paymentMethods: {
      cod: true,
      bankTransfer: true,
      installment: true,
      momo: false,
      vnpay: false,
    },

    // Ngân hàng
    bankInfo: {
      bankName: '',
      accountNumber: '',
      accountHolder: '',
      branch: '',
    },
  });

  // Load settings khi mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await settingsService.getAdminSettings();
      if (response.success) {
        setSettings(prev => ({
          ...prev,
          ...response.settings,
        }));
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Không thể tải cài đặt');
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle nested object change (bankInfo, paymentMethods)
  const handleNestedChange = (parent, field, value) => {
    setSettings(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }));
  };

  // Lưu cài đặt
  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await settingsService.updateSettings(settings);
      if (response.success) {
        toast.success('Đã lưu cài đặt thành công!');
      } else {
        toast.error(response.message || 'Lỗi khi lưu cài đặt');
      }
    } catch (error) {
      console.group('Settings Save Error');
      console.error('Error saving settings:', error);
      console.error('URL:', error.config?.url);
      console.error('Method:', error.config?.method);
      console.error('Response data:', error.response?.data);
      console.error('Status:', error.response?.status);
      console.groupEnd();

      const errorMessage = error.response?.data?.message || error.message || 'Không thể lưu cài đặt';
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Lưu từng section
  const handleSaveSection = async (section) => {
    try {
      setSaving(true);

      let data = {};
      switch (section) {
        case 'general':
          data = {
            siteName: settings.siteName,
            siteDescription: settings.siteDescription,
            maintenanceMode: settings.maintenanceMode,
          };
          break;
        case 'contact':
          data = {
            email: settings.email,
            phone: settings.phone,
            hotline: settings.hotline,
            address: settings.address,
          };
          break;
        case 'social':
          data = {
            facebook: settings.facebook,
            instagram: settings.instagram,
            youtube: settings.youtube,
            tiktok: settings.tiktok,
            zalo: settings.zalo,
          };
          break;
        case 'shipping':
          data = {
            freeShipThreshold: settings.freeShipThreshold,
            defaultShippingFee: settings.defaultShippingFee,
          };
          break;
        case 'payment':
          data = {
            paymentMethods: settings.paymentMethods,
          };
          break;
        case 'bank':
          data = {
            bankInfo: settings.bankInfo,
          };
          break;
        default:
          data = settings;
      }

      const response = await settingsService.updateSection(section, data);
      if (response.success) {
        toast.success(response.message || 'Đã lưu thành công!');
      }
    } catch (error) {
      console.error('Error saving section:', error);
      toast.error('Không thể lưu cài đặt');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'general', label: 'Cài đặt chung', icon: FiGlobe },
    { id: 'social', label: 'Mạng xã hội', icon: FiShare2 },
    { id: 'shipping', label: 'Vận chuyển', icon: FiTruck },
    { id: 'payment', label: 'Thanh toán', icon: FiCreditCard },
    { id: 'bank', label: 'Ngân hàng', icon: FiDollarSign },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <FiLoader className="animate-spin text-4xl text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Cài đặt</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <FiLoader className="animate-spin" />
          ) : (
            <FiSave />
          )}
          Lưu tất cả
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium whitespace-nowrap transition-all ${activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl shadow-sm">
        {/* Cài đặt chung */}
        {activeTab === 'general' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">Cài đặt chung</h2>
              <button
                onClick={() => handleSaveSection('general')}
                disabled={saving}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? <FiLoader className="animate-spin" size={14} /> : <FiSave size={14} />}
                Lưu phần này
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên website
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={settings.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  placeholder="Nhà Bán Táo Store"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email liên hệ
                </label>
                <input
                  type="email"
                  className="input-field"
                  value={settings.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="info@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={settings.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="0123 456 789"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hotline
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={settings.hotline}
                  onChange={(e) => handleChange('hotline', e.target.value)}
                  placeholder="1800 1234"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mô tả website
                </label>
                <textarea
                  className="input-field"
                  rows={2}
                  value={settings.siteDescription}
                  onChange={(e) => handleChange('siteDescription', e.target.value)}
                  placeholder="Mô tả ngắn về website"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ
                </label>
                <textarea
                  className="input-field"
                  rows={2}
                  value={settings.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="Địa chỉ cửa hàng"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <div>
                    <span className="font-medium text-gray-800">Chế độ bảo trì</span>
                    <p className="text-sm text-gray-500">
                      Khi bật, website sẽ hiển thị thông báo bảo trì cho khách
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Mạng xã hội */}
        {activeTab === 'social' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">Liên kết mạng xã hội</h2>
              <button
                onClick={() => handleSaveSection('social')}
                disabled={saving}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? <FiLoader className="animate-spin" size={14} /> : <FiSave size={14} />}
                Lưu phần này
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Facebook
                </label>
                <input
                  type="url"
                  className="input-field"
                  value={settings.facebook}
                  onChange={(e) => handleChange('facebook', e.target.value)}
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instagram
                </label>
                <input
                  type="url"
                  className="input-field"
                  value={settings.instagram}
                  onChange={(e) => handleChange('instagram', e.target.value)}
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube
                </label>
                <input
                  type="url"
                  className="input-field"
                  value={settings.youtube}
                  onChange={(e) => handleChange('youtube', e.target.value)}
                  placeholder="https://youtube.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TikTok
                </label>
                <input
                  type="url"
                  className="input-field"
                  value={settings.tiktok}
                  onChange={(e) => handleChange('tiktok', e.target.value)}
                  placeholder="https://tiktok.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Zalo
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={settings.zalo}
                  onChange={(e) => handleChange('zalo', e.target.value)}
                  placeholder="Số điện thoại Zalo"
                />
              </div>
            </div>
          </div>
        )}

        {/* Vận chuyển */}
        {activeTab === 'shipping' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">Cài đặt vận chuyển</h2>
              <button
                onClick={() => handleSaveSection('shipping')}
                disabled={saving}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? <FiLoader className="animate-spin" size={14} /> : <FiSave size={14} />}
                Lưu phần này
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Miễn phí vận chuyển từ (VNĐ)
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={settings.freeShipThreshold}
                  onChange={(e) => handleChange('freeShipThreshold', parseInt(e.target.value) || 0)}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Đơn hàng từ {settings.freeShipThreshold?.toLocaleString('vi-VN')}đ sẽ được miễn phí vận chuyển
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phí vận chuyển mặc định (VNĐ)
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={settings.defaultShippingFee}
                  onChange={(e) => handleChange('defaultShippingFee', parseInt(e.target.value) || 0)}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Áp dụng cho đơn hàng chưa đạt điều kiện miễn phí
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Thanh toán */}
        {activeTab === 'payment' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">Phương thức thanh toán</h2>
              <button
                onClick={() => handleSaveSection('payment')}
                disabled={saving}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? <FiLoader className="animate-spin" size={14} /> : <FiSave size={14} />}
                Lưu phần này
              </button>
            </div>

            <div className="space-y-4">
              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={settings.paymentMethods?.cod}
                  onChange={(e) => handleNestedChange('paymentMethods', 'cod', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600"
                />
                <div>
                  <span className="font-medium text-gray-800">Thanh toán khi nhận hàng (COD)</span>
                  <p className="text-sm text-gray-500">Khách hàng trả tiền khi nhận được hàng</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={settings.paymentMethods?.bankTransfer}
                  onChange={(e) => handleNestedChange('paymentMethods', 'bankTransfer', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600"
                />
                <div>
                  <span className="font-medium text-gray-800">Chuyển khoản ngân hàng</span>
                  <p className="text-sm text-gray-500">Khách chuyển khoản trước khi giao hàng</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={settings.paymentMethods?.installment}
                  onChange={(e) => handleNestedChange('paymentMethods', 'installment', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600"
                />
                <div>
                  <span className="font-medium text-gray-800">Trả góp</span>
                  <p className="text-sm text-gray-500">Hỗ trợ trả góp qua thẻ tín dụng hoặc công ty tài chính</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={settings.paymentMethods?.momo}
                  onChange={(e) => handleNestedChange('paymentMethods', 'momo', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600"
                />
                <div>
                  <span className="font-medium text-gray-800">Ví MoMo</span>
                  <p className="text-sm text-gray-500">Thanh toán qua ví điện tử MoMo</p>
                </div>
              </label>

              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                <input
                  type="checkbox"
                  checked={settings.paymentMethods?.vnpay}
                  onChange={(e) => handleNestedChange('paymentMethods', 'vnpay', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600"
                />
                <div>
                  <span className="font-medium text-gray-800">VNPay</span>
                  <p className="text-sm text-gray-500">Thanh toán qua cổng VNPay</p>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Ngân hàng */}
        {activeTab === 'bank' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">Thông tin ngân hàng</h2>
              <button
                onClick={() => handleSaveSection('bank')}
                disabled={saving}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {saving ? <FiLoader className="animate-spin" size={14} /> : <FiSave size={14} />}
                Lưu phần này
              </button>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">
                💡 Thông tin này sẽ hiển thị khi khách hàng chọn phương thức chuyển khoản ngân hàng
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên ngân hàng
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={settings.bankInfo?.bankName || ''}
                  onChange={(e) => handleNestedChange('bankInfo', 'bankName', e.target.value)}
                  placeholder="VD: Vietcombank"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chi nhánh
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={settings.bankInfo?.branch || ''}
                  onChange={(e) => handleNestedChange('bankInfo', 'branch', e.target.value)}
                  placeholder="VD: Chi nhánh Hồ Chí Minh"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số tài khoản
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={settings.bankInfo?.accountNumber || ''}
                  onChange={(e) => handleNestedChange('bankInfo', 'accountNumber', e.target.value)}
                  placeholder="VD: 1234567890"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chủ tài khoản
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={settings.bankInfo?.accountHolder || ''}
                  onChange={(e) => handleNestedChange('bankInfo', 'accountHolder', e.target.value)}
                  placeholder="VD: NGUYEN VAN A"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSettingsPage;
